import api from '@/store/api';
import i18n from '@/i18n';

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
        .get('/redfish/v1/Managers/bmc/Oem/Ami/ResetToDefaults')
        .then((response) => {
          const getConfigValues = response.data.PreserveConfiguration;
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
      return await api
        .post('/redfish/v1/Managers/bmc/Oem/Ami/ResetToDefaults')
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
