import api from '@/store/api';
import i18n from '@/i18n';

const PowerShelfStore = {
  namespaced: true,
  state: {
    powerSupplyData: [],
    powerSupplyMetricsData: {},
  },
  getters: {
    getPowerSupplyData: (state) => state.powerSupplyData,
    getPowerSupplyMetricsData: (state) => state.powerSupplyMetricsData,
  },
  mutations: {
    setPowerSupplyData: (state, powerSupplyData) =>
      (state.powerSupplyData = powerSupplyData),
    setPowerSupplyMetricsData: (state, powerSupplyMetricsData) =>
      (state.powerSupplyMetricsData = powerSupplyMetricsData),
  },
  actions: {
    async getPowerSupplies({ commit }) {
      return await api
        .get('/redfish/v1/Chassis')
        .then(async (response) => {
          const chassisMembers = response.data.Members || [];
          const powerSupplies = [];

          for (const member of chassisMembers) {
            try {
              const chassisResponse = await api.get(member['@odata.id']);
              if (chassisResponse.data.PowerSubsystem) {
                const powerSubsystemUrl =
                  chassisResponse.data.PowerSubsystem['@odata.id'];
                const powerSubsystemResponse = await api.get(powerSubsystemUrl);

                if (powerSubsystemResponse.data.PowerSupplies) {
                  const powerSuppliesUrl =
                    powerSubsystemResponse.data.PowerSupplies['@odata.id'];
                  const powerSuppliesResponse = await api.get(powerSuppliesUrl);

                  if (powerSuppliesResponse?.data?.Members) {
                    for (const psMember of powerSuppliesResponse.data.Members) {
                      const psResponse = await api.get(psMember['@odata.id']);
                      powerSupplies.push(psResponse.data);
                    }
                  }
                }
              }
            } catch (error) {
              console.log('Error fetching power supply:', error);
            }
          }

          commit('setPowerSupplyData', powerSupplies);
          return powerSupplies;
        })
        .catch((error) => {
          console.log('Chassis fetch error', error);
          throw new Error(i18n.t('powerShelf.toast.errorLoadingPowerSupply'));
        });
    },
    async getPowerSupplyMetrics({ commit }, metricsUrl) {
      return await api
        .get(metricsUrl)
        .then((response) => {
          commit('setPowerSupplyMetricsData', response.data);
          return response.data;
        })
        .catch((error) => {
          console.log('Power supply metrics fetch error', error);
          throw new Error(i18n.t('powerShelf.toast.errorLoadingMetrics'));
        });
    },
  },
};

export default PowerShelfStore;
