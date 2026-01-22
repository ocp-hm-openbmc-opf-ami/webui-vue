import api from '@/store/api';
import i18n from '@/i18n';
import store from '@/store';

const FactoryDefaultStore = {
  namespaced: true,
  state: {
    resetDefaultValues: {},
  },
  getters: {
    getResetDefaultValues: (state) => state.resetDefaultValues,
  },
  mutations: {
    setResetDefaultValues: (state, resetDefaultValues) =>
      (state.resetDefaultValues = resetDefaultValues),
  },
  actions: {
    async getResetDefault({ commit }) {
      return await api
        .get('/redfish/v1/UpdateService')
        .then((response) => {
          const getConfigValues =
            response.data?.Oem?.Ami?.PreserveConfiguration;
          commit('setResetDefaultValues', getConfigValues);
        })
        .catch((error) => {
          console.log('Error in Restore Factory Defaults.', error);
          throw new Error(
            i18n.t('PageFactoryDefault.toast.restoreToDefaultsError'),
          );
        });
    },
    async saveResetDefault() {
      const data = { ResetType: 'ResetAll' };
      return await api
        .post(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/Actions/Manager.ResetToDefaults',
          data,
        )
        .then(() => i18n.t('PageFactoryDefault.toast.restoreToDefaultsSuccess'))
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('PageFactoryDefault.toast.restoreToDefaultsError'),
          );
        });
    },
  },
};

export default FactoryDefaultStore;
