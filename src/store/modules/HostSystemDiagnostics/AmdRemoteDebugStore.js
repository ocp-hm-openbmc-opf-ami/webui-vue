import i18n from '@/i18n';
import api from '@/store/api';

const AmdRemoteDebugStore = {
  namespaced: true,
  state: {
    amdRemoteDebugServerEnabled: null,
  },
  getters: {
    amdRemoteDebugServerEnabled: (state) => state.amdRemoteDebugServerEnabled,
  },
  mutations: {
    setAmdRemoteDebugServerEnabled: (state, amdRemoteDebugServerEnabled) =>
      (state.amdRemoteDebugServerEnabled = amdRemoteDebugServerEnabled),
  },
  actions: {
    async getAmdRemoteDebugServerStatus({ commit }) {
      return await api
        .get('/redfish/v1/Oem/Ami/AmdReDebug')
        .then((response) => {
          const amdRemoteDebugState =
            (response?.data?.Status?.State ?? '') === ''
              ? null
              : response?.data?.Status?.State === 'Enable'
                ? true
                : false;
          commit('setAmdRemoteDebugServerEnabled', amdRemoteDebugState);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async saveAmdRemoteDebugServerStatus(
      { commit, dispatch },
      amdRemoteDebugServerEnabled,
    ) {
      let amdRemoteDebugServertatus = amdRemoteDebugServerEnabled
        ? 'Enable'
        : 'Disable';
      commit('setAmdRemoteDebugServerEnabled', amdRemoteDebugServerEnabled);
      const amdRemoteDebug = {
        Status: {
          State: amdRemoteDebugServertatus,
        },
      };
      return await api
        .patch('/redfish/v1/Oem/Ami/AmdReDebug', amdRemoteDebug)
        .then(dispatch('getAmdRemoteDebugServerStatus'))
        .then(() => {
          if (amdRemoteDebugServerEnabled) {
            return i18n.t(
              'pageAmdRemoteDebug.toast.successAmdRemoteDebugEnabled',
            );
          } else {
            return i18n.t(
              'pageAmdRemoteDebug.toast.successAmdRemoteDebugDisabled',
            );
          }
        })
        .catch((error) => {
          console.log(error);
          commit(
            'setAmdRemoteDebugServerEnabled',
            !amdRemoteDebugServerEnabled,
          );
          if (amdRemoteDebugServerEnabled) {
            throw new Error(
              i18n.t('pageAmdRemoteDebug.toast.errorAmdRemoteDebugEnabled'),
            );
          } else {
            throw new Error(
              i18n.t('pageAmdRemoteDebug.toast.errorAmdRemoteDebugDisabled'),
            );
          }
        });
    },
  },
};
export default AmdRemoteDebugStore;
