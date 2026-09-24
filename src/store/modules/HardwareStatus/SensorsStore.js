import api from '@/store/api';
import { uniqBy } from 'lodash';
import i18n from '@/i18n';
import { isFeatureEnabled } from '@/components/Mixins/FeatureMixin';

// Fields a sensor poll can change; used to skip no-op commits
const polledFields = [
  'status',
  'state',
  'currentValue',
  'lowerCaution',
  'upperCaution',
  'lowerCritical',
  'upperCritical',
  'upperFatal',
  'lowerFatal',
  'units',
];

const mapSensorResponseToRow = (responseData, sensorUri = null) => ({
  id: responseData.Oem?.Ami?.['@odata.id'],
  sensorUri,
  name: responseData.Name,
  status: responseData.Status?.Health,
  state: responseData.Status?.State,
  currentValue: responseData.Reading,
  thresholdsId:
    (responseData?.Oem?.Ami?.SensorThreshold ?? '') === ''
      ? null
      : responseData?.Oem?.Ami?.SensorThreshold?.['@odata.id'],
  lowerCaution: responseData.Thresholds?.LowerCaution?.Reading,
  upperCaution: responseData.Thresholds?.UpperCaution?.Reading,
  lowerCritical: responseData.Thresholds?.LowerCritical?.Reading,
  upperCritical: responseData.Thresholds?.UpperCritical?.Reading,
  upperFatal: responseData.Thresholds?.UpperFatal?.Reading,
  lowerFatal: responseData.Thresholds?.LowerFatal?.Reading,
  units: responseData.ReadingUnits,
});

const SensorsStore = {
  namespaced: true,
  state: {
    sensors: [],
    sensorCollections: [],
    sensorCatalog: [],
    loadedSensorUris: [],
    totalSensors: 0,
    graphSensors: {},
    sensorGraphRefresh: true,
  },
  getters: {
    sensors: (state) => state.sensors,
    totalSensors: (state) => state.totalSensors,
    hasMoreSensors: (state) =>
      state.loadedSensorUris.length < state.totalSensors,
    graphSensors: (state) => state.graphSensors,
    sensorGraphRefreshGet: (state) => state.sensorGraphRefresh,
  },
  mutations: {
    setSensors: (state, sensors) => {
      state.sensors = uniqBy([...state.sensors, ...sensors], 'sensorUri');
    },
    resetSensors: (state) => {
      state.sensors = [];
      state.sensorCatalog = [];
      state.loadedSensorUris = [];
      state.totalSensors = 0;
    },
    setSensorCatalog: (state, sensorCatalog) => {
      state.sensorCatalog = sensorCatalog;
      state.totalSensors = sensorCatalog.length;
    },
    addLoadedSensorUris: (state, uris) => {
      state.loadedSensorUris = Array.from(
        new Set([...state.loadedSensorUris, ...uris]),
      );
    },
    setSensorCollections: (state, collections) => {
      state.sensorCollections = collections;
    },
    resetSensorDiscovery: (state) => {
      state.sensorCollections = [];
    },
    removeStaleSensors: (state, freshNames) => {
      state.sensors = state.sensors.filter((s) => freshNames.has(s.name));
    },
    setGraphSensors: (state, sensors) => {
      state.graphSensors = sensors;
    },
    setSensorGraph: (state, sensorGraphRefresh) => {
      state.sensorGraphRefresh = sensorGraphRefresh;
    },
    updateSensor: (state, updatedSensor) => {
      const index = state.sensors.findIndex(
        (sensor) =>
          (updatedSensor.sensorUri &&
            sensor.sensorUri === updatedSensor.sensorUri) ||
          sensor.name === updatedSensor.name,
      );
      if (index === -1) {
        state.sensors.push(updatedSensor);
      } else {
        state.sensors.splice(index, 1, {
          ...state.sensors[index],
          ...updatedSensor,
        });
      }
    },
  },
  actions: {
    async getAllSensors({ commit, dispatch }, { batchSize = 20 } = {}) {
      commit('resetSensors');
      const sensorCatalog = await dispatch('getSensorCatalog');
      commit('setSensorCatalog', sensorCatalog);

      if (!sensorCatalog.length) return [];
      return dispatch('fetchNextSensorsBatch', { count: batchSize });
    },
    async getSensorCatalog({ dispatch }) {
      const collection = await dispatch('getChassisCollection');
      if (!collection) return [];

      const sensorCollectionIds = [...collection];
      if (isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')) {
        sensorCollectionIds.push(
          '/redfish/v1/PowerEquipment/PowerShelves/PowerShelf',
        );
      }

      const sensorCollectionPromises = sensorCollectionIds.map((id) => {
        return api
          .get(`${id}/Sensors`)
          .then((response) => response.data.Members || [])
          .catch((error) => {
            console.log(error);
            return [];
          });
      });

      return await api.all(sensorCollectionPromises).then((responses) => {
        const sensorUris = responses
          .flat()
          .map((sensor) => sensor['@odata.id'])
          .filter(Boolean);
        return Array.from(new Set(sensorUris));
      });
    },
    async fetchNextSensorsBatch({ commit, state }, { count = 20 } = {}) {
      const loadedSet = new Set(state.loadedSensorUris);
      const remainingSensorUris = state.sensorCatalog.filter(
        (uri) => !loadedSet.has(uri),
      );
      const batchUris = remainingSensorUris.slice(0, count);
      if (!batchUris.length) return [];
      const results = await Promise.allSettled(
        batchUris.map((uri) => api.get(uri)),
      );

      const sensorData = [];
      const succeededUris = [];
      results.forEach((result, index) => {
        const uri = batchUris[index];
        if (result.status === 'fulfilled' && result.value?.data) {
          sensorData.push(mapSensorResponseToRow(result.value.data, uri));
          succeededUris.push(uri);
        } else {
          console.log(result.reason ?? 'Failed to fetch sensor', uri);
        }
      });

      commit('setSensors', sensorData);
      commit('addLoadedSensorUris', succeededUris);
      return sensorData;
    },
    async getChassisCollection() {
      return await api
        .get('/redfish/v1/Chassis')
        .then(({ data: { Members } }) =>
          Members.map((member) => member['@odata.id']),
        )
        .catch((error) => console.log(error));
    },
    async getTimeInterval({ commit, state }, val) {
      let id = val.id == undefined ? state.graphSensors.id : val.id;
      return await api
        .get(id)
        .then((response) => {
          if (response.data) {
            commit('setGraphSensors', response.data);
          }
        })
        .catch((error) => console.log(error));
    },
    async setTimeInterval(_, val) {
      return await api
        .patch(val.id, { Interval: val.Interval, TimeFrame: val.TimeFrame })
        .then(() => {})
        .catch((error) => console.log(error));
    },
    // Fetch all sensor readings with one expanded request per chassis.
    async pollSensorUpdates({ commit, state, dispatch }) {
      let sensorCollections = state.sensorCollections;
      if (!sensorCollections.length) {
        const collection = (await dispatch('getChassisCollection')) || [];
        const chassisCollection = [...collection];
        if (isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')) {
          chassisCollection.push(
            '/redfish/v1/PowerEquipment/PowerShelves/PowerShelf',
          );
        }
        const discoveredCollections = await api.all(
          chassisCollection.map((chassisUri) =>
            api
              .get(chassisUri)
              .then(({ data }) => data?.Sensors?.['@odata.id'])
              .catch(() => null),
          ),
        );
        sensorCollections = discoveredCollections.filter(Boolean);
        commit('setSensorCollections', sensorCollections);
      }
      if (!sensorCollections.length) return;

      let collectionRequestFailed = false;
      const sensors = (
        await api.all(
          sensorCollections.map((sensorsUri) =>
            api
              .get(`${sensorsUri}?$expand=.($levels=1)`)
              .then(({ data }) => data?.Members || [])
              .catch((error) => {
                collectionRequestFailed = true;
                if (error.response?.status === 404) {
                  commit('setSensorCollections', []);
                }
                console.log(error);
                return [];
              }),
          ),
        )
      )
        .flat()
        .filter((sensor) => Boolean(sensor?.Name));

      const cachedByName = new Map(state.sensors.map((s) => [s.name, s]));
      const freshNames = new Set();
      sensors.forEach((sensor) => {
        freshNames.add(sensor.Name);
        const fresh = {
          id: sensor.Oem?.Ami?.['@odata.id'] || sensor['@odata.id'],
          sensorUri: sensor['@odata.id'],
          name: sensor.Name,
          status: sensor.Status?.Health ?? 'OK',
          state: sensor.Status?.State,
          currentValue: sensor.Reading,
          thresholdsId:
            (sensor.Oem?.Ami?.SensorThreshold ?? '') === ''
              ? null
              : sensor.Oem?.Ami?.SensorThreshold?.['@odata.id'],
          lowerCaution: sensor.Thresholds?.LowerCaution?.Reading,
          upperCaution: sensor.Thresholds?.UpperCaution?.Reading,
          lowerCritical: sensor.Thresholds?.LowerCritical?.Reading,
          upperCritical: sensor.Thresholds?.UpperCritical?.Reading,
          upperFatal: sensor.Thresholds?.UpperFatal?.Reading,
          lowerFatal: sensor.Thresholds?.LowerFatal?.Reading,
          units: sensor.ReadingUnits,
        };
        const cached = cachedByName.get(fresh.name);
        if (!cached || polledFields.some((f) => cached[f] !== fresh[f])) {
          commit('updateSensor', fresh);
        }
      });
      if (!collectionRequestFailed) {
        commit('removeStaleSensors', freshNames);
      }
    },
    setSensorGraphRefresh({ commit }, val) {
      commit('setSensorGraph', val);
    },
    // Re-fetch a single sensor by its Redfish URI and update only that row.
    async refreshSingleSensor({ commit }, sensorUri) {
      if (!sensorUri) return;
      try {
        const response = await api.get(sensorUri);
        if (response?.data) {
          commit(
            'updateSensor',
            mapSensorResponseToRow(response.data, sensorUri),
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    async setSensorThresholdValue(_, { val, thresholdsUrlId }) {
      return await api
        .patch(thresholdsUrlId, { Thresholds: val })
        .then(() =>
          i18n.t('pageSensors.sensorThreshold.toast.successSaveThreshold'),
        )
        .catch(() => {
          throw new Error(
            i18n.t('pageSensors.sensorThreshold.toast.errorSaveThreshold'),
          );
        });
    },
  },
};

export default SensorsStore;
