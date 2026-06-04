import api from '@/store/api';
import i18n from '@/i18n';

const EventFilterStore = {
  namespaced: true,
  state: {
    filters: [],
    allFilters: [],
    loading: false,
    sensorTypes: {},
    list4Defaults: {
      EventSeverity: 'Critical',
      SensorType: '',
      SensorName: '',
    },
    retryValues: {
      alertLimits: '',
      retryEnableStatus: false,
      retryCount: '',
      timeInterval: '',
    },
  },
  getters: {
    filters: (state) => state.filters,
    allFilters: (state) => state.allFilters,
    loading: (state) => state.loading,
    sensorTypes: (state) => state.sensorTypes,
    list4Defaults: (state) => state.list4Defaults,
    getRetryValues: (state) => state.retryValues,
    sensorTypeOptions: (state) => {
      const options = [];
      Object.keys(state.sensorTypes).forEach((typeName) => {
        options.push({
          value: typeName,
          text: typeName,
        });
      });
      return options;
    },
    sensorNameOptionsByType: (state) => (typeName) => {
      const options = [];
      if (typeName && typeName !== 'All Sensor Types' && typeName !== 'ALL') {
        (state.sensorTypes[typeName] || []).forEach((sensor) => {
          options.push({
            value: sensor.SensorName,
            text: sensor.SensorName,
          });
        });
      }
      return options;
    },
    resolveSensorTypeByValue: (state) => (sensorType) => {
      if (
        sensorType === null ||
        sensorType === undefined ||
        sensorType === '' ||
        sensorType === 'ALL' ||
        sensorType === 'All Sensor Types' ||
        sensorType === 255 ||
        sensorType === '255'
      ) {
        return 'All Sensor Types';
      }

      if (typeof sensorType === 'string' && Number.isNaN(Number(sensorType))) {
        return sensorType;
      }

      const id = Number(sensorType);
      for (const [typeName, sensors] of Object.entries(state.sensorTypes)) {
        if (sensors.some((sensor) => Number(sensor.SensorId) === id)) {
          return typeName;
        }
      }
      return 'All Sensor Types';
    },
    resolveSensorNameByValue: (state) => (sensorType, sensorName) => {
      if (
        sensorName === null ||
        sensorName === undefined ||
        sensorName === '' ||
        sensorName === 'ALL' ||
        sensorName === 'All Sensors' ||
        sensorName === 255 ||
        sensorName === '255'
      ) {
        return '';
      }

      if (typeof sensorName === 'string' && Number.isNaN(Number(sensorName))) {
        return sensorName;
      }

      const resolvedType =
        typeof sensorType === 'string' && Number.isNaN(Number(sensorType))
          ? sensorType
          : null;
      const id = Number(sensorName);

      if (resolvedType && state.sensorTypes[resolvedType]) {
        const match = state.sensorTypes[resolvedType].find(
          (sensor) => Number(sensor.SensorId) === id,
        );
        if (match) return match.SensorName;
      }

      for (const sensors of Object.values(state.sensorTypes)) {
        const match = sensors.find((sensor) => Number(sensor.SensorId) === id);
        if (match) {
          return match.SensorName;
        }
      }

      return '';
    },
  },
  mutations: {
    setAllFilters: (state, filters) => {
      state.allFilters = filters;
    },
    setFilters: (state, filters) => {
      state.filters = filters;
    },
    setLoading: (state, loading) => {
      state.loading = loading;
    },
    setSensorTypes: (state, sensorTypes) => {
      state.sensorTypes = sensorTypes;
    },
    setList4Defaults: (state, defaults) => {
      state.list4Defaults = defaults;
    },
    setRetryValues: (state, retryValues) => {
      state.retryValues = retryValues;
    },
  },
  actions: {
    async fetchRetryValues({ commit }) {
      try {
        const response = await api.get('/redfish/v1/Oem/Ami/PefService');
        const data = response.data;
        const retryValues = {
          alertLimits: data.PendingAlertsLimit,
          retryEnableStatus: data.RetryEnable,
          retryCount: data.RetryCountLimit,
          timeInterval: data.RetryTimeInterval,
        };
        commit('setRetryValues', retryValues);
      } catch (error) {
        console.error('Error fetching retry values:', error);
      }
    },
    async setRetryValues(_, { retryEventStatusValue }) {
      const data = {
        RetryEnable: retryEventStatusValue.RetryEnable,
        RetryCountLimit: retryEventStatusValue.RetryCountLimit,
        RetryTimeInterval: retryEventStatusValue.RetryTimeInterval,
        PendingAlertsLimit: retryEventStatusValue.PendingAlertsLimit,
      };
      return await api
        .patch('/redfish/v1/Oem/Ami/PefService', data)
        .then(() => i18n.t('pageEventFilter.toast.successEventFilterMsg'))
        .catch(() => {
          throw new Error(i18n.t('pageEventFilter.toast.errorEventFilterMsg'));
        });
    },
    async getAllFilters({ commit }) {
      commit('setLoading', true);
      try {
        const response = await api.get(
          '/redfish/v1/Oem/Ami/PefService/EventFilterTable/',
        );
        const members = response.data.Members || [];
        const sensorTypes = response.data.SensorType || {};

        commit('setSensorTypes', sensorTypes);
        commit('setAllFilters', members);

        const list4Member =
          members.find((member) => member['@odata.id']?.endsWith('/List4_0')) ||
          members.find((member) => member['@odata.id']?.includes('/List4_')) ||
          members[0];

        let list4Defaults = {
          EventSeverity: 'Critical',
          SensorType: '',
          SensorName: '',
        };

        if (list4Member?.['@odata.id']) {
          try {
            const list4Response = await api.get(list4Member['@odata.id']);
            const list4Data = list4Response.data;
            list4Defaults = {
              EventSeverity:
                list4Data.EventSeverity ?? list4Defaults.EventSeverity,
              SensorType: list4Data.SensorType ?? list4Defaults.SensorType,
              SensorName: list4Data.SensorName ?? list4Defaults.SensorName,
            };
          } catch (error) {
            console.error('Error fetching List4 defaults:', error);
          }
        }

        commit('setList4Defaults', list4Defaults);

        const filters = await Promise.all(
          members.map(async (member, rowIndex) => {
            const uri = member['@odata.id'];
            const id = uri.split('/').pop();

            try {
              const detailResponse = await api.get(uri);
              const data = detailResponse.data;

              return {
                index: rowIndex + 1,
                uri,
                id,
                EventFilterTableEntry:
                  data.EventFilterTableEntry ?? rowIndex + 1,
                FilterConfig: data.FilterConfig ?? 0,
                EvtFilterAction: data.EvtFilterAction ?? 0,
                AlertPolicyNum: data.AlertPolicyNum ?? 0,
                EventSeverity:
                  data.EventSeverity ?? list4Defaults.EventSeverity,
                GenIDByte1: data.GenIDByte1 ?? 0,
                GenIDByte2: data.GenIDByte2 ?? 0,
                SensorType: data.SensorType ?? list4Defaults.SensorType,
                SensorName: data.SensorName ?? list4Defaults.SensorName,
                EventTrigger: data.EventTrigger ?? 0,
                EventData1OffsetMask: data.EventData1OffsetMask ?? 0,
                EventData1ANDMask: data.EventData1ANDMask ?? 0,
                EventData1Cmp1: data.EventData1Cmp1 ?? 0,
                EventData1Cmp2: data.EventData1Cmp2 ?? 0,
                EventData2ANDMask: data.EventData2ANDMask ?? 0,
                EventData2Cmp1: data.EventData2Cmp1 ?? 0,
                EventData2Cmp2: data.EventData2Cmp2 ?? 0,
                EventData3ANDMask: data.EventData3ANDMask ?? 0,
                EventData3Cmp1: data.EventData3Cmp1 ?? 0,
                EventData3Cmp2: data.EventData3Cmp2 ?? 0,
              };
            } catch (error) {
              console.error(`Error fetching details for ${uri}:`, error);
              return {
                index: rowIndex + 1,
                uri,
                id,
                EventFilterTableEntry: rowIndex + 1,
                FilterConfig: 0,
                EvtFilterAction: 0,
                AlertPolicyNum: 0,
                EventSeverity: list4Defaults.EventSeverity,
                GenIDByte1: 0,
                GenIDByte2: 0,
                SensorType: list4Defaults.SensorType,
                SensorName: list4Defaults.SensorName,
                EventTrigger: 0,
                EventData1OffsetMask: 0,
                EventData1ANDMask: 0,
                EventData1Cmp1: 0,
                EventData1Cmp2: 0,
                EventData2ANDMask: 0,
                EventData2Cmp1: 0,
                EventData2Cmp2: 0,
                EventData3ANDMask: 0,
                EventData3Cmp1: 0,
                EventData3Cmp2: 0,
              };
            }
          }),
        );

        commit('setFilters', filters);
        return filters;
      } catch (error) {
        console.error('Error fetching event filters:', error);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async updateFilter({ dispatch }, { uri, data }) {
      try {
        const payload = {
          AlertPolicyNum: data.AlertPolicyNum,
          EventData1ANDMask: data.EventData1ANDMask,
          EventData1Cmp1: data.EventData1Cmp1,
          EventData1Cmp2: data.EventData1Cmp2,
          EventData1OffsetMask: data.EventData1OffsetMask,
          EventData2ANDMask: data.EventData2ANDMask,
          EventData2Cmp1: data.EventData2Cmp1,
          EventData2Cmp2: data.EventData2Cmp2,
          EventData3ANDMask: data.EventData3ANDMask,
          EventData3Cmp1: data.EventData3Cmp1,
          EventData3Cmp2: data.EventData3Cmp2,
          EventFilterTableEntry: data.EventFilterTableEntry,
          EventSeverity: data.EventSeverity,
          EventTrigger: data.EventTrigger,
          EvtFilterAction: data.EvtFilterAction,
          FilterConfig: data.FilterConfig,
          GenIDByte1: data.GenIDByte1,
          GenIDByte2: data.GenIDByte2,
          SensorName: data.SensorName,
          SensorType: data.SensorType,
        };

        await api.patch(uri, payload);
        await dispatch('getAllFilters');

        return i18n.t('pageEventFilter.toast.successEventFilterMsg');
      } catch (error) {
        console.error('Error updating event filter:', error);
        throw new Error(i18n.t('pageEventFilter.toast.errorEventFilterMsg'));
      }
    },

    async deleteFilter({ dispatch }, uri) {
      try {
        await api.delete(uri);
        await dispatch('getAllFilters');

        return i18n.t('pageEventFilter.toast.successEventFilterMsg');
      } catch (error) {
        console.error('Error deleting event filter:', error);
        throw new Error(i18n.t('pageEventFilter.toast.errorEventFilterMsg'));
      }
    },
  },
};

export default EventFilterStore;
