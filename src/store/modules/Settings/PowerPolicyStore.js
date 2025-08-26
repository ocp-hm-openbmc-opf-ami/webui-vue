import api from '@/store/api';
import i18n from '@/i18n';

const PowerPolicyStore = {
  namespaced: true,
  state: {
    powerRestoreCurrentPolicy: null,
    powerRestorePolicies: [],
  },
  getters: {
    powerRestoreCurrentPolicy: (state) => state.powerRestoreCurrentPolicy,
    powerRestorePolicies: (state) => state.powerRestorePolicies,
  },
  mutations: {
    setPowerRestoreCurrentPolicy: (state, powerRestoreCurrentPolicy) =>
      (state.powerRestoreCurrentPolicy = powerRestoreCurrentPolicy),
    setPowerRestorePolicies: (state, powerRestorePolicies) =>
      (state.powerRestorePolicies = powerRestorePolicies),
  },
  actions: {
    async getPowerRestorePolicies({ commit }) {
      try {
        const { data } = await api.get(
          '/redfish/v1/JsonSchemas/ComputerSystem',
        );
        const schemaUri = data?.Location?.[0]?.Uri;
        if (!schemaUri) throw new Error('Schema URI not found');

        const { data: schema } = await api.get(schemaUri);
        const types = schema?.definitions?.PowerRestorePolicyTypes;
        const enums = types?.enum || [];
        const descriptions = types?.enumDescriptions || [];

        const powerPoliciesData = enums.map((state, idx) => ({
          state,
          desc: `${i18n.t(`pagePowerRestorePolicy.policies.${state}`)}${descriptions[idx] ? ' - ' + descriptions[idx] : ''}`,
        }));

        commit('setPowerRestorePolicies', powerPoliciesData);
      } catch (error) {
        console.error(error);
      }
    },
    async getPowerRestoreCurrentPolicy({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system')
        .then(({ data: { PowerRestorePolicy } }) => {
          commit('setPowerRestoreCurrentPolicy', PowerRestorePolicy);
        })
        .catch((error) => console.log(error));
    },
    async setPowerRestorePolicy({ dispatch }, powerPolicy) {
      const data = { PowerRestorePolicy: powerPolicy };

      return await api
        .patch('/redfish/v1/Systems/system', data)
        .then(() => {
          dispatch('getPowerRestoreCurrentPolicy');
          return i18n.t('pagePowerRestorePolicy.toast.successSaveSettings');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pagePowerRestorePolicy.toast.errorSaveSettings'),
          );
        });
    },
  },
};

export default PowerPolicyStore;
