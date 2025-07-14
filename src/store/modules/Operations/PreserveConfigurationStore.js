import api from '@/store/api';
import i18n from '@/i18n';

const PreserveConfigStore = {
  namespaced: true,
  state: {
    preserveConfigValues: {},
  },
  getters: {
    getPreserveConfigValues: (state) => state.preserveConfigValues,
  },
  mutations: {
    setPreserveConfigValues: (state, preserveConfigValues) =>
      (state.preserveConfigValues = preserveConfigValues),
  },
  actions: {
    async getPreserveConfig({ commit }) {
      return await api
        .get('/redfish/v1/UpdateService')
        .then((response) => {
          const getConfigValues = response.data.Oem.Ami?.PreserveConfiguration;
          commit('setPreserveConfigValues', getConfigValues);
        })
        .catch((error) => {
          console.log('Error in getting preserve configuration', error);
          throw new Error(
            i18n.t('pagePreserve.toast.errorGettingPreserveConfig'),
          );
        });
    },
    async savePreserveConfig({ dispatch }, saveConfigValues) {
      const Oem = {
        Oem: {
          Ami: {
            PreserveConfiguration: {
              AUTHENTICATION: saveConfigValues.authentication,
              Boot_Override: saveConfigValues.bootOverride,
              EXTLOG: saveConfigValues.extLog,
              FRU: saveConfigValues.fru,
              IPMI: saveConfigValues.ipmi,
              KVM: saveConfigValues.kvm,
              NETWORK: saveConfigValues.network,
              NTP: saveConfigValues.ntp,
              REDFISH: saveConfigValues.redfish,
              SDR: saveConfigValues.sdr,
              SEL: saveConfigValues.sel,
              SMTP: saveConfigValues.smtp,
              SNMP: saveConfigValues.snmp,
              SOL: saveConfigValues.sol,
              SYSLOG: saveConfigValues.sysLog,
              ServiceManager: saveConfigValues.serviceManager,
              U_BOOT_ENV: saveConfigValues.ubootEnv,
            },
          },
        },
      };
      return await api
        .patch('/redfish/v1/UpdateService', Oem)
        .then(() => dispatch('getPreserveConfig'))
        .then(() => {
          return i18n.t('pagePreserve.toast.successPreserveConfiguration');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pagePreserve.toast.errorPreserveConfiguration'),
          );
        });
    },
  },
};

export default PreserveConfigStore;
