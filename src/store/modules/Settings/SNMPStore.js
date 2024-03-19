import api from '@/store/api';
import i18n from '@/i18n';

const SnmpStore = {
  namespaced: true,
  state: {
    allSubscriptions: [],
    authenticationProtocolValue: null,
  },
  getters: {
    allSubscriptions: (state) => state.allSubscriptions,
    authenticationProtocolValue: (state) => state.authenticationProtocolValue,
  },
  mutations: {
    setAllSubscriptions: (state, allSubscriptions) =>
      (state.allSubscriptions = allSubscriptions),
    setAuthenticationProtocolValue(state, authenticationProtocolValue) {
      state.authenticationProtocolValue = authenticationProtocolValue;
    },
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
          const data = response.map(({ data }, index) => {
            if (data.Protocol === 'SNMPv3') {
              let protocolValue = data?.SNMP?.AuthenticationProtocol;
              commit('setAuthenticationProtocolValue', protocolValue);
            }
            let inputString = data.Destination;
            let ipPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/;

            let match = inputString.match(ipPattern);
            let ipAddress = null;
            if (match) {
              ipAddress = match[0];
            }
            return {
              destination: ipAddress,
              subscriptionType: data.SubscriptionType,
              protocol: data.Protocol,
              Sino: index + 1,
              Id: data.Id,
              authenticationProtocol: data?.SNMP?.AuthenticationProtocol
                ? data?.SNMP?.AuthenticationProtocol
                : 'None',
            };
          });
          commit('setAllSubscriptions', data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createSubscriptions({ dispatch }, snmpTrap) {
      const ipv6Regex = /(?:^|(?<=\s))(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(?=\s|$)/;
      let data;
      if (!ipv6Regex.test(snmpTrap.destination)) {
        data = {
          Destination: `snmp://${snmpTrap.destination}`,
          SubscriptionType: snmpTrap.selectSubscriptionType,
          Protocol: snmpTrap.selectProtocol,
        };
      } else {
        data = {
          Destination: `snmp://[${snmpTrap.destination}]`,
          SubscriptionType: snmpTrap.selectSubscriptionType,
          Protocol: snmpTrap.selectProtocol,
        };
      }
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
    async saveSnmpAuthenticationProtocol(
      { dispatch },
      { authenticationProtocolValue, snmpId }
    ) {
      const snmpAuth = {
        SNMP: {
          AuthenticationProtocol: authenticationProtocolValue,
        },
      };
      return await api
        .patch(`/redfish/v1/EventService/Subscriptions/${snmpId}`, snmpAuth)
        .then(() => dispatch('getSubscriptions'))
        .then(() => {
          return i18n.t('pageSnmp.toast.successUpdateAuthenticationProtocal');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageSnmp.toast.errorUpdatingAuthenticationProtocal')
          );
        });
    },
  },
};

export default SnmpStore;
