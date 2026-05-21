import api from '@/store/api';
import i18n from '@/i18n';
//import store from '@/store';

const PowerControlStore = {
  namespaced: true,
  state: {
    powerCapValue: null,
    powerCapUri: '',
    powerConsumptionValue: null,
  },
  getters: {
    powerCapValue: (state) => state.powerCapValue,
    powerCapUri: (state) => state.powerCapUri,
    powerConsumptionValue: (state) => state.powerConsumptionValue,
  },
  mutations: {
    setPowerCapValue: (state, powerCapValue) =>
      (state.powerCapValue = powerCapValue),
    setPowerCapUri: (state, powerCapUri) => (state.powerCapUri = powerCapUri),
    setPowerConsumptionValue: (state, powerConsumptionValue) =>
      (state.powerConsumptionValue = powerConsumptionValue),
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
      const collection = (await dispatch('getChassisCollection')) || [];
      // Find chassis with Baseboard or EVB
      const targetChassis = collection.find((uri) => {
        const lastPart = uri.split('/').pop();
        return lastPart.includes('Baseboard') || lastPart.includes('EVB');
      });
      if (!targetChassis) return;
      return await api
        .get(targetChassis)
        .then((response) =>
          api.get(response.data.EnvironmentMetrics['@odata.id']),
        )
        .then((response) => {
          const powerCapUri = response.data['@odata.id'];
          const powerCap = response.data.PowerLimitWatts?.SetPoint;
          const powerConsumption = response.data.PowerConsumedWatts;
          commit('setPowerCapUri', powerCapUri);
          commit('setPowerCapValue', powerCap);
          commit('setPowerConsumptionValue', powerConsumption);
        })
        .catch((error) => console.log(error));
    },
    async setPowerControl({ state, commit }, powerCapValue) {
      const data = {
        PowerLimitWatts: {
          SetPoint: powerCapValue,
        },
      };
      return await api
        .patch(state.powerCapUri, data)
        .then(() => {
          commit('setPowerCapValue', powerCapValue);
          return i18n.t('pageServerPowerOperations.toast.successSaveSettings');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageServerPowerOperations.toast.errorSaveSettings'),
          );
        });
    },
  },
};

export default PowerControlStore;
