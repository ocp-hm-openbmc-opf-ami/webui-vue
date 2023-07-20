import i18n from '@/i18n';
import api from '@/store/api';

const AsdStore = {
  namespaced: true,
  state: {
    asdServerEnabled: null,
  },
  getters: {
    asdServerEnabled: (state) => state.asdServerEnabled,
  },
  mutations: {
    setAsdServerEnabled: (state, asdServerEnabled) =>
      (state.asdServerEnabled = asdServerEnabled),
  },
  actions: {
    async getAsdServerStatus({ commit }) {
      return await api
        .get('/redfish/v1/Oem/Ami/AtScaleDebug')
        .then((response) => {
          commit('setAsdServerEnabled', response.data.Enabled);
        })
        .catch((error) => console.log(error));
    },
    async saveAsdServerStatus({ commit, dispatch }, asdServerEnabled) {
      commit('setAsdServerEnabled', asdServerEnabled);
      const asd = {
        Enabled: asdServerEnabled,
      };
      return await api
        .patch('/redfish/v1/Oem/Ami/AtScaleDebug', asd)
        .then(dispatch('getAsdServerStatus'))
        .then(() => {
          if (asdServerEnabled) {
            return i18n.t('pageAsd.toast.successAsdEnabled');
          } else {
            return i18n.t('pageAsd.toast.successAsdDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setAsdServerEnabled', !asdServerEnabled);
          if (asdServerEnabled) {
            throw new Error(i18n.t('pageAsd.toast.errorAsdEnabled'));
          } else {
            throw new Error(i18n.t('pageAsd.toast.errorAsdDisabled'));
          }
        });
    },
  },
};
export default AsdStore;
