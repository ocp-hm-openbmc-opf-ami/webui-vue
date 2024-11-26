import api from '@/store/api';
import i18n from '@/i18n';

const NMConfiguration = {
  namespaced: true,
  state: {
    nodeManagerPolicies: [],
    nodeManagerPowerStatistics: [],
    modeManagerCapabilities: [],
  },
  getters: {
    nodeManagerPolicies: (state) => state.nodeManagerPolicies,
    nodeManagerPowerStatistics: (state) => state.nodeManagerPowerStatistics,
    modeManagerCapabilities: (state) => state.modeManagerCapabilities,
  },
  mutations: {
    setNodeManagerPoliciesData: (state, nodeManagerPolicies) =>
      (state.nodeManagerPolicies = nodeManagerPolicies),
    setnodeManagerPowerStatistics: (state, nodeManagerPowerStatistics) =>
      (state.nodeManagerPowerStatistics = nodeManagerPowerStatistics),
    setnodeManagerCapabilities: (state, modeManagerCapabilities) =>
      (state.modeManagerCapabilities = modeManagerCapabilities),
  },
  actions: {
    async getPowerStatistics({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/Oem/Intel/NodeManager')
        .then((response) => {
          return api.get(response.data.Domains['@odata.id']);
        })
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => {
            return api.get(member['@odata.id']);
          }),
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          var typeStr = '#Power#Throttling#Frequency';
          const statisticsData = [];
          const capabilitiesData = [];
          response.map(({ data }) => {
            const domain = data.Name;
            const capMaximum =
              (data?.Capabilities?.Max ?? '') === ''
                ? 32767
                : data?.Capabilities?.Max;
            const capMinimum =
              (data?.Capabilities?.Min ?? '') === ''
                ? 0
                : data?.Capabilities?.Min;
            const capMaxCorrectTime =
              (data?.Capabilities?.Min ?? '') === ''
                ? 0
                : data?.Capabilities?.Min;
            const capMinCorrectTime =
              (data?.Capabilities?.Min ?? '') === ''
                ? 0
                : data?.Capabilities?.Min;
            const capMaxReportPeriod =
              (data?.Capabilities?.Min ?? '') === ''
                ? 0
                : data?.Capabilities?.Min;
            const capMinReportPeriod =
              (data?.Capabilities?.Min ?? '') === ''
                ? 0
                : data?.Capabilities?.Min;

            data.Statistics.map((statistic) => {
              if (typeStr.indexOf(statistic.Name) != -1) {
                var res = {
                  domain: domain,
                  type: (statistic?.Name ?? '') === '' ? 'NA' : statistic?.Name,
                  current:
                    (statistic?.Current ?? '') === ''
                      ? 'NA'
                      : statistic?.Current.toFixed(2),
                  average:
                    (statistic?.Average ?? '') === ''
                      ? 'NA'
                      : statistic?.Average.toFixed(2),
                  maximum:
                    (statistic?.Max ?? '') === ''
                      ? 'NA'
                      : statistic?.Max.toFixed(2),
                  minimum:
                    (statistic?.Min ?? '') === ''
                      ? 'NA'
                      : statistic?.Min.toFixed(2),
                };
              }
              if (typeof res !== 'undefined') {
                statisticsData.push(res);
              }
            });
            var capabilityRes = {
              domain: domain,
              capMaximum: capMaximum,
              capMinimum: capMinimum,
              capMaxCorrectTime: capMaxCorrectTime,
              capMinCorrectTime: capMinCorrectTime,
              capMaxReportPeriod: capMaxReportPeriod,
              capMinReportPeriod: capMinReportPeriod,
            };
            capabilitiesData.push(capabilityRes);
          });
          commit('setnodeManagerPowerStatistics', statisticsData);
          commit('setnodeManagerCapabilities', capabilitiesData);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNodeManager.toast.errorInPowerStatistics'),
          );
        });
    },
    async getNodeManagerPolicies({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/Oem/Intel/NodeManager')
        .then((response) => {
          return api.get(response.data.Policies['@odata.id']);
        })
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => {
            return api.get(member['@odata.id']);
          }),
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const data = response.map(({ data }) => {
            const commonValidation = (value, defaultValue = 'NA') =>
              value !== '' && value !== undefined ? value : defaultValue;
            const domainUrl = commonValidation(data?.Domain['@odata.id']);
            const domain = domainUrl.split('/').pop();
            const triggerTypeUrl = commonValidation(
              data?.Trigger.TriggerType['@odata.id'],
            );
            const triggerType = triggerTypeUrl.split('/').pop();
            return {
              policyId: commonValidation(data?.Id),
              domain: domain,
              triggerLimit: commonValidation(data?.Trigger.TriggerLimit),
              triggerType: triggerType,
              state: commonValidation(data?.Status?.State),
              policyLimit: commonValidation(data?.Limit),
              policyCorrectionTime:
                (data?.CorrectionInMs ?? '') === '' ? 0 : data?.CorrectionInMs,
              statisticsReportingPeriod: commonValidation(
                parseFloat(
                  data.StatisticsReportingPeriod.replace(/[^\d.]/g, ''),
                ) + data.StatisticsReportingPeriod.slice(-1),
              ),
              powerCorrectionType:
                (data?.PowerCorrectionType ?? '') === ''
                  ? null
                  : data?.PowerCorrectionType,
              policyStorage: commonValidation(data?.PolicyStorage),
              limitException:
                (data?.LimitException ?? '') === ''
                  ? null
                  : data?.LimitException,
              componentId: commonValidation(data?.ComponentId),
              defaultPolicy: commonValidation(data?.DefaultPolicy),
            };
          });
          commit('setNodeManagerPoliciesData', data);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNodeManager.toast.errorGettingNodeManager'),
          );
        });
    },
    async createNewPolicy({ dispatch }, newPolicyData) {
      const data = {
        Trigger: {
          TriggerLimit: newPolicyData.triggerLimit,
          TriggerType: newPolicyData.triggerType,
        },
        ComponentId: newPolicyData.componentId,
        Id: newPolicyData.policyId,
        LimitException: newPolicyData.limitException,
        CorrectionInMs: newPolicyData.policyCorrectionTime,
        Limit: newPolicyData.policyLimit,
        StatisticsReportingPeriod: `PT${newPolicyData.statisticsReportingPeriod}`,
        Domain: newPolicyData.domain,
        PolicyStorage: newPolicyData.policyStorage,
        PowerCorrectionType: newPolicyData.powerCorrectionType,
        Status: {
          State: newPolicyData.state,
        },
      };
      return await api
        .post('/redfish/v1/Managers/bmc/Oem/Intel/NodeManager/Policies', data)
        .then(() => dispatch('getNodeManagerPolicies'))
        .then(() => i18n.t('pageNodeManager.toast.successInAddNmConfiguration'))
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNodeManager.toast.errorInAddNmConfiguration'),
          );
        });
    },
    async updateDomainCapability({ dispatch }, domainCapabilityData) {
      const data = { Capabilities: {} };
      data.Capabilities.Min = domainCapabilityData.capMinimum;
      data.Capabilities.Max = domainCapabilityData.capMaximum;
      return await api
        .patch(
          `/redfish/v1/Managers/bmc/Oem/Intel/NodeManager/Domains/${domainCapabilityData.domain}`,
          data,
        )
        .then(() => dispatch('getPowerStatistics'))
        .then(() => i18n.t('pageNodeManager.toast.successUpdateCapability'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageNodeManager.toast.errorUpdatePolicy'));
        });
    },
    async updatePolicies({ dispatch }, newPolicyData) {
      const data = {
        Trigger: {
          TriggerLimit: newPolicyData.triggerLimit,
          TriggerType: newPolicyData.triggerType,
        },
        ComponentId: newPolicyData.componentId,
        LimitException: newPolicyData.limitException,
        CorrectionInMs: newPolicyData.policyCorrectionTime,
        Limit: newPolicyData.policyLimit,
        StatisticsReportingPeriod: `PT${newPolicyData.statisticsReportingPeriod}`,
        PolicyStorage: newPolicyData.policyStorage,
        PowerCorrectionType: newPolicyData.powerCorrectionType,
      };
      return await api
        .patch(
          `/redfish/v1/Managers/bmc/Oem/Intel/NodeManager/Policies/${newPolicyData.policyId}`,
          data,
        )
        .then(() => dispatch('getNodeManagerPolicies'))
        .then(() => i18n.t('pageNodeManager.toast.successUpdatePolicy'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageNodeManager.toast.errorUpdatePolicy'));
        });
    },
    async deletePolicy({ dispatch }, policyId) {
      return await api
        .delete(
          `/redfish/v1/Managers/bmc/Oem/Intel/NodeManager/Policies/${policyId}`,
        )
        .then(() => dispatch('getNodeManagerPolicies'))
        .then(() => i18n.t('pageNodeManager.toast.successDeletePolicy'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageNodeManager.toast.errorDeletePolicy'));
        });
    },
  },
};

export default NMConfiguration;
