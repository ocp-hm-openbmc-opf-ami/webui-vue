import api from '@/store/api';
import i18n from '@/i18n';

const BootSettingsStore = {
  namespaced: true,
  state: {
    bootSourceOptions: [],
    bootSource: null,
    overrideEnabled: null,
    tpmEnabled: null,
  },
  getters: {
    bootSourceOptions: (state) => state.bootSourceOptions,
    bootSource: (state) => state.bootSource,
    overrideEnabled: (state) => state.overrideEnabled,
    tpmEnabled: (state) => state.tpmEnabled,
  },
  mutations: {
    setBootSourceOptions: (state, bootSourceOptions) =>
      (state.bootSourceOptions = bootSourceOptions),
    setBootSource: (state, bootSource) => (state.bootSource = bootSource),
    setOverrideEnabled: (state, overrideEnabled) => {
      if (overrideEnabled === 'Once') {
        state.overrideEnabled = true;
      } else {
        // 'Continuous' or 'Disabled'
        state.overrideEnabled = false;
      }
    },
    // setTpmPolicy: (state, tpmEnabled) => (state.tpmEnabled = tpmEnabled),
    setTpmPolicy: (state, TrustedModuleRequiredToBoot) => {
      if (TrustedModuleRequiredToBoot === 'Required') {
        state.tpmEnabled = true;
      } else {
        // 'Continuous' or 'Disabled'
        state.tpmEnabled = false;
      }
    },
  },
  actions: {
    async getBootSettings({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system')
        .then(({ data: { Boot } }) => {
          commit(
            'setBootSourceOptions',
            Boot['BootSourceOverrideTarget@Redfish.AllowableValues'],
          );
          commit('setOverrideEnabled', Boot.BootSourceOverrideEnabled);
          commit('setBootSource', Boot.BootSourceOverrideTarget);
          commit('setTpmPolicy', Boot.TrustedModuleRequiredToBoot);
        })
        .catch((error) => console.log(error));
    },
    saveBootSettings({ commit, dispatch }, { bootSource, overrideEnabled }) {
      const data = { Boot: {} };
      data.Boot.BootSourceOverrideTarget = bootSource;

      if (overrideEnabled) {
        data.Boot.BootSourceOverrideEnabled = 'Once';
      } else if (bootSource === 'None') {
        data.Boot.BootSourceOverrideEnabled = 'Disabled';
      } else {
        data.Boot.BootSourceOverrideEnabled = 'Continuous';
      }

      return api
        .patch('/redfish/v1/Systems/system', data)
        .then((response) => {
          // If request success, commit the values
          commit('setBootSource', data.Boot.BootSourceOverrideTarget);
          commit('setOverrideEnabled', data.Boot.BootSourceOverrideEnabled);
          return response;
        })
        .catch((error) => {
          console.log(error);
          // If request error, GET saved options
          dispatch('getBootSettings');
          return error;
        });
    },
    async getTpmPolicy({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system')
        .then(({ data: { Boot } }) => {
          commit(
            'setBootSourceOptions',
            Boot['BootSourceOverrideTarget@Redfish.AllowableValues'],
          );
          commit('setTpmPolicy', Boot.TrustedModuleRequiredToBoot);
        })
        .catch((error) => console.log(error));
    },
    saveTpmPolicy({ commit, dispatch }, tpmEnabled) {
      if (tpmEnabled) {
        var tpmStatus = { Boot: { TrustedModuleRequiredToBoot: 'Required' } };
      } else {
        tpmStatus = { Boot: { TrustedModuleRequiredToBoot: 'Disabled' } };
      }
      return api
        .patch('/redfish/v1/Systems/system', tpmStatus)
        .then(dispatch('getTpmPolicy'))
        .then((response) => {
          // If request success, commit the values
          commit('setTpmPolicy', tpmEnabled);
          return response;
        })
        .catch((error) => {
          console.log(error);
          // If request error, GET saved policy
          return error;
        });
    },
    async saveSettings(
      { dispatch },
      { bootSource, overrideEnabled, tpmEnabled },
    ) {
      const promises = [];

      if (bootSource !== null || overrideEnabled !== null) {
        promises.push(
          dispatch('saveBootSettings', { bootSource, overrideEnabled }),
        );
      }
      if (tpmEnabled !== null) {
        promises.push(dispatch('saveTpmPolicy', tpmEnabled));
      }

      return await api.all(promises).then(
        api.spread((...responses) => {
          let message = i18n.t(
            'pageServerPowerOperations.toast.successSaveSettings',
          );
          responses.forEach((response) => {
            if (response instanceof Error) {
              throw new Error(
                i18n.t('pageServerPowerOperations.toast.errorSaveSettings'),
              );
            }
          });
          return message;
        }),
      );
    },
  },
};

export default BootSettingsStore;
