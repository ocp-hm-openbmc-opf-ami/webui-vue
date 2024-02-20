import api from '@/store/api';
import i18n from '@/i18n';

const SnmpStore = {
  namespaced: true,
  state: {
    allSubscriptions: [],
  },
  getters: {
    allSubscriptions: (state) => state.allSubscriptions,
  },
  mutations: {
    setAllSubscriptions: (state, allSubscriptions) =>
      (state.allSubscriptions = allSubscriptions),
  },
  actions: {
    async getSubscriptions({ commit }) {
      return await api
        .get('/redfish/v1/EventService/Subscriptions')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => {
            if (member['@odata.id'].includes('snmp'))
              return api.get(member['@odata.id']);
          })
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          console.log(response);
          const data = response.map(({ data }, index) => {
            let inputString = data.Destination;
            let ipPattern = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;

            let match = inputString.match(ipPattern);
            if (match) {
              var ipAddress = match[0];
            }
            return {
              destination: ipAddress,
              subscriptionType: data.SubscriptionType,
              protocol: data.Protocol,
              Sino: index + 1,
              Id: data.Id,
            };
          });
          commit('setAllSubscriptions', data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createSubscriptions({ dispatch }, snmpTrap) {
      const data = {
        Destination: `snmp://${snmpTrap.destination}`,
        SubscriptionType: snmpTrap.selectSubscriptionType,
        Protocol: snmpTrap.selectProtocol,
      };
      return await api
        .post('/redfish/v1/EventService/Subscriptions', data)
        .then(() => dispatch('getSubscriptions'))
        .then(() => i18n.t('pageSnmp.toast.successInAddSubscription'))
        .catch(() => {
          throw new Error(i18n.t('pageSnmp.toast.errorInAddSubscription'));
        });
    },
    async deleteSNMPTrap({ dispatch }, snmpTrap) {
      console.log(snmpTrap);
      return await api
        .delete(`/redfish/v1/EventService/Subscriptions/${snmpTrap}`)
        .then(() => dispatch('getSubscriptions'))
        .then(() => i18n.t('pageSnmp.toast.successInDeleteSubscription'))
        .catch(() => {
          throw new Error(i18n.t('pageSnmp.toast.errorInDeleteSubscription'));
        });
    },
  },
};

export default SnmpStore;
