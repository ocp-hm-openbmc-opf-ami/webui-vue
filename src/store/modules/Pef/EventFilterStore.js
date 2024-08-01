import api from '@/store/api';
import i18n from '@/i18n';

const EventFilterStore = {
  namespaced: true,
  state: {
    alertData: [
      {
        value: 1,
        eventName: 'pageEventFilter.temperatureSensorOutOfRange',
        isSupported: true,
        enableStatus: false,
      },
      {
        value: 2,
        eventName: 'pageEventFilter.fanFailure',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 3,
        eventName: 'pageEventFilter.powerSupplyFailure',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 4,
        eventName: 'pageEventFilter.biosPostErrorCode',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 5,
        eventName: 'pageEventFilter.nodeManagerException',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 6,
        eventName: 'pageEventFilter.systemRestart',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 7,
        eventName: 'pageEventFilter.powerUnitRedundancyFailure',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 8,
        eventName: 'pageEventFilter.fanRedundancyFailure',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 9,
        eventName: 'pageEventFilter.processorPresence',
        isSupported: true,
        enableStatus: false,
      },
      {
        value: 10,
        eventName: 'pageEventFilter.voltageSensorOutOfRange',
        isSupported: true,
        enableStatus: false,
      },
      {
        value: 11,
        eventName: 'pageEventFilter.chassisIntrusion',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 12,
        eventName: 'pageEventFilter.memoryError',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 13,
        eventName: 'pageEventFilter.frbFailure',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 14,
        eventName: 'pageEventFilter.watchdogTimer',
        isSupported: true,
        enableStatus: false,
      },
      {
        value: 15,
        eventName: 'pageEventFilter.hardDriveFailure',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 16,
        eventName: 'pageEventFilter.inletTemperatureOverheatShutdown',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 17,
        eventName: 'pageEventFilter.powerUnitStatus',
        isSupported: false,
        enableStatus: false,
      },
      {
        value: 18,
        eventName: 'pageEventFilter.processorDimmThermTrip',
        isSupported: false,
        enableStatus: false,
      },
    ],
    checkAll: null,
  },
  getters: {
    getAlertData: (state) => state.alertData,
    getCheckAll: (state) => state.checkAll,
  },
  mutations: {
    setAlertData: (state, eventFilterData) => {
      let EnabledFilters = eventFilterData.FilterEnable;
      state.checkAll = true;
      for (var i = 0; i < EnabledFilters.length; i++) {
        state.alertData[i].enableStatus = EnabledFilters[i] ? true : false;
        if (state.alertData[i].isSupported) {
          if (!state.alertData[i].enableStatus) {
            state.checkAll = false;
          }
        }
      }
    },
    setCheckAll: (state, newValue) => {
      state.checkAll = newValue;
    },
  },
  actions: {
    async getEventFilterData({ commit }) {
      return await api
        .get('/redfish/v1/PefService')
        .then((response) => {
          commit('setAlertData', response.data);
        })
        .catch((error) => console.log(error));
    },
    async setEventFilterData({ dispatch }, properties) {
      let filterArray = new Array(18);
      for (var i = 0; i < properties.length; i++) {
        if (properties[i].isSupported) {
          // If the event is supported, Check whether its enabled/disabled from WEBUI
          filterArray[i] = properties[i].enableStatus ? 1 : 0;
        } else {
          // If the event is not supported, directly send disable
          filterArray[i] = 0;
        }
      }
      const data = {
        FilterEnable: filterArray,
      };
      return await api
        .patch('/redfish/v1/PefService', data)
        .then(() => dispatch('getEventFilterData'))
        .then(() => i18n.t('pageEventFilter.toast.successEventFilterMsg'))
        .catch(() => {
          throw new Error(i18n.t('pageEventFilter.toast.errorEventFilterMsg'));
        });
    },
  },
};

export default EventFilterStore;
