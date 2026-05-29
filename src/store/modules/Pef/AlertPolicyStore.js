import api from '@/store/api';
import i18n from '@/i18n';

const AlertPolicyStore = {
  namespaced: true,
  state: {
    channelMappings: [],
    policies: [],
    allPolicies: [],
    loading: false,
  },
  getters: {
    channelMappings: (state) => state.channelMappings,
    policies: (state) => state.policies,
    allPolicies: (state) => state.allPolicies,
    loading: (state) => state.loading,
    activePolicies: (state) =>
      state.policies.filter((policy) => policy.configured).length,
    totalPolicies: (state) => state.policies.length,
  },
  mutations: {
    setChannelMappings: (state, mappings) => {
      state.channelMappings = mappings;
    },
    setAllPolicies: (state, policies) => {
      state.allPolicies = policies;
    },
    setPolicies: (state, policies) => {
      state.policies = policies;
    },
    setLoading: (state, loading) => {
      state.loading = loading;
    },
  },
  actions: {
    async getAllPolicies({ commit }) {
      commit('setLoading', true);
      try {
        const response = await api.get(
          '/redfish/v1/Oem/Ami/PefService/AlertPolicyTable',
        );
        const members = response.data.Members || [];
        const channelMappings = response.data.ChannelMappings || [];

        commit('setAllPolicies', members);
        commit('setChannelMappings', channelMappings);

        const policies = await Promise.all(
          members.map(async (member, rowIndex) => {
            const uri = member['@odata.id'];
            const id = uri.split('/').pop();

            try {
              const detailResponse = await api.get(uri);
              const data = detailResponse.data;

              return {
                index: rowIndex + 1,
                configured: true,
                uri,
                id,
                status: 'Enabled',
                alertPolicyGroupNum:
                  data.AlertPolicyGroupNum ??
                  data.Oem?.Ami?.AlertPolicyGroupNum ??
                  1,
                channelNo: data.ChannelNo ?? data.Oem?.Ami?.ChannelNo ?? 1,
                destinationSel:
                  data.DestinationSel ?? data.Oem?.Ami?.DestinationSel ?? 1,
                enableAlert:
                  data.EnableAlert ?? data.Oem?.Ami?.EnableAlert ?? 1,
                policyAction:
                  data.PolicyAction ?? data.Oem?.Ami?.PolicyAction ?? 1,
              };
            } catch (error) {
              console.error(`Error fetching details for ${uri}:`, error);

              return {
                index: rowIndex + 1,
                configured: false,
                uri,
                id,
                status: 'Unavailable',
                alertPolicyGroupNum: 1,
                channelNo: 1,
                destinationSel: 1,
                enableAlert: 1,
                policyAction: 1,
              };
            }
          }),
        );

        commit('setPolicies', policies);
        return policies;
      } catch (error) {
        console.error('Error fetching alert policies:', error);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async updatePolicy({ dispatch }, { uri, data }) {
      try {
        const payload = {
          AlertPolicyGroupNum: data.alertPolicyGroupNum,
          ChannelNo: data.channelNo,
          DestinationSel: data.destinationSel,
          EnableAlert: data.enableAlert,
          PolicyAction: data.policyAction,
        };

        await api.patch(uri, payload);

        // Refresh the data
        await dispatch('getAllPolicies');

        return i18n.t('pageAlertPolicy.toast.successUpdatePolicy');
      } catch (error) {
        console.error('Error updating policy:', error);
        throw new Error(i18n.t('pageAlertPolicy.toast.errorUpdatePolicy'));
      }
    },

    async deletePolicy({ dispatch }, uri) {
      try {
        await api.delete(uri);

        // Refresh the data
        await dispatch('getAllPolicies');

        return i18n.t('pageAlertPolicy.toast.successDeletePolicy');
      } catch (error) {
        console.error('Error deleting policy:', error);
        throw new Error(i18n.t('pageAlertPolicy.toast.errorDeletePolicy'));
      }
    },
  },
};

export default AlertPolicyStore;
