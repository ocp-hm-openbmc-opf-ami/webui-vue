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

const SensorsStore = {
  namespaced: true,
  state: {
    sensors: [],
    sensorCollections: [],
    graphSensors: {},
    sensorGraphRefresh: true,
  },
  getters: {
    sensors: (state) => state.sensors,
    graphSensors: (state) => state.graphSensors,
    sensorGraphRefreshGet: (state) => state.sensorGraphRefresh,
  },
  mutations: {
    setSensors: (state, sensors) => {
      state.sensors = uniqBy([...sensors, ...state.sensors], 'name');
    },
    setSensorCollections: (state, collections) => {
      state.sensorCollections = collections;
    },
    resetSensorDiscovery: (state) => {
      state.sensorCollections = [];
    },
    updateSensor: (state, sensor) => {
      const index = state.sensors.findIndex((s) => s.name === sensor.name);
      if (index === -1) {
        state.sensors.push(sensor);
      } else {
        state.sensors.splice(index, 1, { ...state.sensors[index], ...sensor });
      }
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
  },
  actions: {
    async getAllSensors({ dispatch }) {
      const collection = await dispatch('getChassisCollection');
      if (!collection) return;
      const promises = collection.reduce((acc, id) => {
        acc.push(dispatch('getSensors', id));
        return acc;
      }, []);
      // Add API sensor ID to the collection
      if (isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')) {
        promises.push(
          dispatch(
            'getSensors',
            '/redfish/v1/PowerEquipment/PowerShelves/PowerShelf',
          ),
        );
      }
      return await api.all(promises);
    },
    async getChassisCollection() {
      return await api
        .get('/redfish/v1/Chassis')
        .then(({ data: { Members } }) =>
          Members.map((member) => member['@odata.id']),
        )
        .catch((error) => console.log(error));
    },
    async getSensors({ dispatch }, id) {
      await api
        .get('/redfish/v1/')
        .then(({ data }) => {
          if (data?.ProtocolFeaturesSupported?.ExpandQuery?.MaxLevels > 0) {
            return dispatch('getSensorsWithoutQueryParams', id);
          } else {
            return dispatch('getSensorsWithoutQueryParams', id);
          }
        })
        .catch((error) => console.log(error));
    },
    async getSensorsWithoutQueryParams({ commit }, id) {
      const sensors = await api
        .get(`${id}/Sensors`)
        .then((response) => response.data.Members)
        .catch((error) => console.log(error));
      if (!sensors) return;
      const promises = sensors.map((sensor) => {
        return api.get(sensor['@odata.id']).catch((error) => {
          console.log(error);
          return error;
        });
      });
      return await api.all(promises).then((responses) => {
        const sensorData = [];
        responses.forEach((response) => {
          if (response.data) {
            sensorData.push({
              id: response.data.Oem?.Ami['@odata.id'],
              name: response.data.Name,
              status: response.data.Status?.Health,
              state: response.data.Status?.State,
              currentValue: response.data.Reading,
              thresholdsId:
                (response.data?.Oem?.Ami?.SensorThreshold ?? '') === ''
                  ? null
                  : response.data?.Oem?.Ami?.SensorThreshold['@odata.id'],
              lowerCaution: response.data.Thresholds?.LowerCaution?.Reading,
              upperCaution: response.data.Thresholds?.UpperCaution?.Reading,
              lowerCritical: response.data.Thresholds?.LowerCritical?.Reading,
              upperCritical: response.data.Thresholds?.UpperCritical?.Reading,
              upperFatal: response.data.Thresholds?.UpperFatal?.Reading,
              lowerFatal: response.data.Thresholds?.LowerFatal?.Reading,
              units: response.data.ReadingUnits,
            });
          }
        });
        commit('setSensors', sensorData);
      });
    },
    async getSensorsUsingQueryParams({ commit }, id) {
      await api
        .get(`${id}/Sensors?$expand=.($levels=1)`)
        .then((response) => {
          let sensorData = [];
          response.data.Members.map((sensor) => {
            const oneSensordata = {
              name: sensor.Name,
              status: sensor.Status?.Health,
              currentValue: sensor.Reading,
              lowerCaution: sensor.Thresholds?.LowerCaution?.Reading,
              upperCaution: sensor.Thresholds?.UpperCaution?.Reading,
              lowerCritical: sensor.Thresholds?.LowerCritical?.Reading,
              upperCritical: sensor.Thresholds?.UpperCritical?.Reading,
              units: sensor.ReadingUnits,
            };
            sensorData.push(oneSensordata);
            commit('setSensors', sensorData);
          });
        })
        .then(() => {
          return;
        })
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
