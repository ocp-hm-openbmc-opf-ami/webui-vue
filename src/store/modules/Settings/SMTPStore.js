import api from '@/store/api';
import i18n from '@/i18n';

const SmtpStore = {
  namespaced: true,
  state: {
    smtpServiceEnabled: null,
    smtpServerIP: null,
    SMTPServerPort: null,
    SenderEmailAddress: null,
  },
  getters: {
    isSMTPEnabled: (state) => state.smtpServiceEnabled,
    getSmtpServerIP: (state) => state.smtpServerIP,
    getSmtpServerPort: (state) => state.SMTPServerPort,
    getSmtpSenderEmailAddress: (state) => state.SenderEmailAddress,
  },
  mutations: {
    setSmtpData: (state, smtpData) => {
      console.log('smtpData', smtpData);
      state.smtpServiceEnabled = smtpData.ServiceEnabled;
      state.smtpServerIP = smtpData.ServerAddress;
      state.SMTPServerPort = smtpData.Port;
      state.SenderEmailAddress = smtpData.FromAddress;
      console.log('state', state);
    },
  },
  actions: {
    async getSMTPdata({ commit }) {
      return await api
        .get('/redfish/v1/EventService')
        .then((response) => {
          console.log('data', response);
          console.log('smtp data', response.data);
          commit('setSmtpData', response.data.SMTP);
        })
        .catch((error) => console.log(error));
    },
    async setSMTPdata({ dispatch }, properties) {
      const data = {
        SMTP: properties,
      };
      console.log('patch data', data);
      return await api
        .patch('/redfish/v1/EventService', data)
        .then(() => dispatch('getSMTPdata'))
        .then(() => i18n.t('pageSmtp.toast.successSMTPConfiguration'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageSmtp.toast.errorSMTPConfiguration'));
        });
    },
  },
};

export default SmtpStore;
