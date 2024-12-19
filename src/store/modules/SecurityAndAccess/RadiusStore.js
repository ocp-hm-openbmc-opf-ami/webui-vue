import api from '@/store/api';
import i18n from '@/i18n';

const RadiusStore = {
  namespaced: true,
  state: {
    radiusValues: {},
    serviceEnabled: '',
  },
  getters: {
    getRadiusValues: (state) => state.radiusValues,
    getServiceEnabled: (state) => state.serviceEnabled,
  },
  mutations: {
    setRadiusValues: (state, radiusValues) =>
      (state.radiusValues = radiusValues),
    setServiceEnabled: (state, serviceEnabled) =>
      (state.serviceEnabled = serviceEnabled),
  },
  actions: {
    async radiusConfigValues({ commit }) {
      return await api
        .get('/redfish/v1/AccountService/ExternalAccountProviders/RADIUS')
        .then((response) => {
          commit('setRadiusValues', response.data?.Oem?.Ami?.RADIUS);
          commit('setServiceEnabled', response.data?.ServiceEnabled);
        })
        .catch((error) => {
          console.log('Error in getting Radius configuration.', error);
          throw new Error(i18n.t('pageRadius.toast.errorGettingRadiusConfig'));
        });
    },
    async saveRadiusConfig({ dispatch }, saveConfigValues) {
      const Oem = {
        Oem: {
          Ami: {
            RADIUS: {
              ServiceAddress: saveConfigValues.serverAddress,
              ServicePort: saveConfigValues.port,
              Secret: saveConfigValues.secret,
              GroupName1: saveConfigValues.GroupName1,
              GroupName2: saveConfigValues.GroupName2,
              GroupName3: saveConfigValues.GroupName3,
              Privilege1: saveConfigValues.Privilege1,
              Privilege2: saveConfigValues.Privilege2,
              Privilege3: saveConfigValues.Privilege3,
            },
          },
        },
        ServiceEnabled: saveConfigValues.authentication,
      };
      return await api
        .patch(
          '/redfish/v1/AccountService/ExternalAccountProviders/RADIUS',
          Oem,
        )
        .then(() => dispatch('radiusConfigValues'))
        .then(() => {
          return i18n.t('pageRadius.toast.successRadiusConfiguration');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageRadius.toast.errorRadiusConfiguration'));
        });
    },
  },
};

export default RadiusStore;
