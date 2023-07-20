import api from '@/store/api';
import i18n from '@/i18n';

const AlertDestinationStore = {
  namespaced: true,
  state: {
    emailAddress1: null,
    emailAddress2: null,
  },
  getters: {
    getEmailAddress1: (state) => state.emailAddress1,
    getEmailAddress2: (state) => state.emailAddress2,
  },
  mutations: {
    setAlertDestinationData: (state, alertDestinationData) => {
      state.emailAddress1 = alertDestinationData[0]
        ? alertDestinationData[0]
        : '';
      state.emailAddress2 = alertDestinationData[1]
        ? alertDestinationData[1]
        : '';
    },
  },
  actions: {
    async getAlertDestinationData({ commit }) {
      return await api
        .get('/redfish/v1/PefService')
        .then((response) => {
          commit('setAlertDestinationData', response.data.Recipient);
        })
        .catch((error) => console.log(error));
    },
    async setAlertDestinationData({ dispatch }, properties) {
      const data = {
        Recipient: properties,
      };
      return await api
        .patch('/redfish/v1/PefService', data)
        .then(() => dispatch('getAlertDestinationData'))
        .then(() => i18n.t('pageAlertDestination.toast.successMsg'))
        .catch(() => {
          throw new Error(i18n.t('pageAlertDestination.toast.errorMsg'));
        });
    },
    async sendTestAlert({ state }, properties) {
      console.log('send Test Alert state', state);
      return await api
        .post(
          '/redfish/v1/PefService/Actions/PefService.SendAlertMail',
          properties
        )
        .then(() => i18n.t('pageAlertDestination.toast.successMsgTestAlert'))
        .catch(() => {
          throw new Error(i18n.t('pageAlertDestination.toast.errorMsgAlert'));
        });
    },
  },
};

export default AlertDestinationStore;
