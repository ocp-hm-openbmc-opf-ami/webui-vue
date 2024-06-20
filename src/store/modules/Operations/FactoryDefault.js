import api from '@/store/api';
import i18n from '@/i18n';

const FactoryDefaultStore = {
  namespaced: true,
  actions: {
    async restoreToDefaults({ commit }, restoreOption) {
      return await api
        .post('/redfish/v1/Managers/bmc/Actions/Manager.ResetToDefaults', {
          ResetToDefaultsType: restoreOption,
        })
        .then(() => {
          if (restoreOption) {
            return i18n.t('PageFactoryDefault.toast.restoreToDefaultsSuccess');
          }
        })
        .catch((error) => {
          console.log('Factory Restore: ', error);
          commit('val', !restoreOption);
          if (restoreOption) {
            throw new Error(
              i18n.t('PageFactoryDefault.toast.restoreToDefaultsError'),
            );
          }
        });
    },
  },
};

export default FactoryDefaultStore;
