import api from '@/store/api';
import i18n from '@/i18n';

const PowerControlStore = {
  namespaced: true,
  state: {
    powerCapValue: null,
    powerCapUri: '',
    powerConsumptionValue: null,
    powerCapEnable: null,
  },
  getters: {
    powerCapValue: (state) => state.powerCapValue,
    powerCapUri: (state) => state.powerCapUri,
    powerConsumptionValue: (state) => state.powerConsumptionValue,
    powerCapEnable: (state) => state.powerCapEnable,
  },
  mutations: {
    setPowerCapValue: (state, powerCapValue) =>
      (state.powerCapValue = powerCapValue),
    setPowerCapUri: (state, powerCapUri) => (state.powerCapUri = powerCapUri),
    setPowerConsumptionValue: (state, powerConsumptionValue) =>
      (state.powerConsumptionValue = powerConsumptionValue),
    setPowerCapEnableValue: (state, powerCapEnable) =>
      (state.powerCapEnable = powerCapEnable),
  },
  actions: {
    setPowerCapUpdatedValue({ commit }, value) {
      commit('setPowerCapValue', value);
    },
    async getChassisCollection() {
      return await api
        .get('/redfish/v1/')
        .then((response) => api.get(response.data.Chassis['@odata.id']))
        .then(({ data: { Members } }) =>
          Members.map((member) => member['@odata.id']),
        )
        .catch((error) => console.log(error));
    },
    async getPowerControl({ dispatch, commit }) {
      const collection = await dispatch('getChassisCollection');
      if (!collection || collection.length === 0) return;
      return await api
        .get(`${collection[0]}`)
        .then((response) => api.get(response.data.Power['@odata.id']))
        .then((response) => {
          const powerControl = response.data.PowerControl;
          if (!powerControl || powerControl.length === 0) return;
          const powerCapUri = response.data['@odata.id'];
          const powerCap = powerControl[0].PowerLimit.LimitInWatts;
          const powerCapEnable = powerControl[0].Oem.OpenBmc.PowerCapEnable;
          // If system is powered off, power consumption does not exist in the PowerControl
          const powerConsumption = powerControl[0].PowerConsumedWatts || null;
          commit('setPowerCapUri', powerCapUri);
          commit('setPowerCapValue', powerCap);
          commit('setPowerConsumptionValue', powerConsumption);
          commit('setPowerCapEnableValue', powerCapEnable);
        })
        .catch((error) => {
          console.log('Power control', error);
        });
    },
    async setPowerControl({ state }, powerCapValue) {
      const data = {
        PowerControl: [{ PowerLimit: { LimitInWatts: powerCapValue } }],
      };
      return await api
        .patch(state.powerCapUri, data)
        .then(() =>
          i18n.t('pageServerPowerOperations.toast.successSaveSettings'),
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageServerPowerOperations.toast.errorSaveSettings'),
          );
        });
    },
    async setPowerCapEnable({ state, commit, dispatch }, powerCapEnable) {
      commit('setPowerCapEnableValue', powerCapEnable);
      const data = {
        PowerControl: [
          {
            Oem: {
              OpenBmc: {
                PowerCapEnable: powerCapEnable,
              },
            },
          },
        ],
      };
      return await api
        .patch(state.powerCapUri, data)
        .then(dispatch('getPowerControl'))
        .then(() => {
          if (powerCapEnable) {
            return i18n.t('pagePower.toast.successApplyPowerCapEnable');
          } else {
            return i18n.t('pagePower.toast.successApplyPowerCapDisable');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setPowerCapEnableValue', !powerCapEnable);
          if (powerCapEnable) {
            throw new Error(i18n.t('pagePower.toast.errorApplyPowerCapEnable'));
          } else {
            throw new Error(
              i18n.t('pagePower.toast.errorApplyPowerCapDisable'),
            );
          }
        });
    },
  },
};

export default PowerControlStore;
