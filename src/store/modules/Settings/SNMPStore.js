import api from '@/store/api';
import i18n from '@/i18n';

const SnmpStore = {
  namespaced: true,
  state: {
    allSubscriptions: [],
    authenticationProtocolValue: null,
    Bmcusers: [],
  },
  getters: {
    allSubscriptions: (state) => state.allSubscriptions,
    authenticationProtocolValue: (state) => state.authenticationProtocolValue,
    Bmcusers: (state) => state.Bmcusers,
  },
  mutations: {
    setAllSubscriptions: (state, allSubscriptions) =>
      (state.allSubscriptions = allSubscriptions),
    setAuthenticationProtocolValue(state, authenticationProtocolValue) {
      state.authenticationProtocolValue = authenticationProtocolValue;
    },
    setBmcUsers: (state, Bmcusers) => (state.Bmcusers = Bmcusers),
  },
  actions: {
    async getSubscriptions({ commit }) {
      return await api
        .get('/redfish/v1/EventService/Subscriptions')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => {
            if (member['@odata.id'].includes('snmp'))
              return api.get(member['@odata.id']);
          }),
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const data = response.map(({ data }, index) => {
            let inputString = data.Destination;
            let ipPattern =
              /\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){6}(:[0-9a-fA-F]{1,4}){1,2}\b|\b(?:[0-9a-fA-F]{1,4}:){5}(:[0-9a-fA-F]{1,4}){1,3}\b|\b(?:[0-9a-fA-F]{1,4}:){4}(:[0-9a-fA-F]{1,4}){1,4}\b|\b(?:[0-9a-fA-F]{1,4}:){3}(:[0-9a-fA-F]{1,4}){1,5}\b|\b(?:[0-9a-fA-F]{1,4}:){2}(:[0-9a-fA-F]{1,4}){1,6}\b|\b(?:[0-9a-fA-F]{1,4}:){1}(:[0-9a-fA-F]{1,4}){1,7}\b|\b(?:::)(:[0-9a-fA-F]{1,4}){0,7}\b|\b(?:[0-9a-fA-F]{1,4}:){1,7}:\b/;
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
                : 'NA',
              encryption:
                (data?.Encryption ?? '') === '' ? 'NA' : data?.Encryption,
              readOnlyPermission:
                (data?.Readonlypermission ?? '') === ''
                  ? 'NA'
                  : data?.Readonlypermission,
              bmcUser: (data?.User ?? '') === '' ? 'NA' : data?.User,
            };
          });
          commit('setAllSubscriptions', data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async createSubscriptions({ dispatch }, snmpTrap) {
      const ipv6Regex =
        /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
      let data;
      if (!ipv6Regex.test(snmpTrap.destination)) {
        if (snmpTrap.selectProtocol === 'SNMPv3') {
          data = {
            Destination: `snmp://${snmpTrap.destination}`,
            SubscriptionType: snmpTrap.selectSubscriptionType,
            Protocol: snmpTrap.selectProtocol,
            Password: snmpTrap.password,
            Encryption: snmpTrap.encryption,
            Algorithm: snmpTrap.algorithm,
            ReadOnlyPermission: snmpTrap.readOnlyPermission,
          };
        } else {
          data = {
            Destination: `snmp://${snmpTrap.destination}`,
            SubscriptionType: snmpTrap.selectSubscriptionType,
            Protocol: snmpTrap.selectProtocol,
          };
        }
      } else {
        if (snmpTrap.selectProtocol === 'SNMPv3') {
          var ipv6Address = snmpTrap.destination;
          var snmpv3IPV6 = ipv6Address.split('@');
          data = {
            Destination: `snmp://${snmpv3IPV6[0]}@[${snmpv3IPV6[1]}]`,
            SubscriptionType: snmpTrap.selectSubscriptionType,
            Protocol: snmpTrap.selectProtocol,
            Password: snmpTrap.password,
            Encryption: snmpTrap.encryption,
            Algorithm: snmpTrap.algorithm,
            ReadOnlyPermission: snmpTrap.readOnlyPermission,
          };
        } else {
          data = {
            Destination: `snmp://[${snmpTrap.destination}]`,
            SubscriptionType: snmpTrap.selectSubscriptionType,
            Protocol: snmpTrap.selectProtocol,
          };
        }
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
      return await api
        .delete(`/redfish/v1/EventService/Subscriptions/${snmpTrap}`)
        .then(() => dispatch('getSubscriptions'))
        .then(() => i18n.t('pageSnmp.toast.successInDeleteSubscription'))
        .catch(() => {
          throw new Error(i18n.t('pageSnmp.toast.errorInDeleteSubscription'));
        });
    },
    async saveSnmpv3Subscriptions({ dispatch }, snmpTrap) {
      const ipv6Regex =
        /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
      let data;
      if (!ipv6Regex.test(snmpTrap.destination)) {
        if (snmpTrap.selectProtocol === 'SNMPv3') {
          data = {
            Destination: `snmp://${snmpTrap.destination}`,
            Password: snmpTrap.password,
            Encryption: snmpTrap.encryption,
            Algorithm: snmpTrap.algorithm,
            ReadOnlyPermission: snmpTrap.readOnlyPermission,
          };
        }
      } else {
        if (snmpTrap.selectProtocol === 'SNMPv3') {
          var ipv6Address = snmpTrap.destination;
          var snmpv3IPV6 = ipv6Address.split('@');
          data = {
            Destination: `snmp://${snmpv3IPV6[0]}@[${snmpv3IPV6[1]}]`,
            Password: snmpTrap.password,
            Encryption: snmpTrap.encryption,
            Algorithm: snmpTrap.algorithm,
            ReadOnlyPermission: snmpTrap.readOnlyPermission,
          };
        }
      }
      return await api
        .patch(
          `/redfish/v1/EventService/Subscriptions/${snmpTrap.snmpId}`,
          data,
        )
        .then(() => dispatch('getSubscriptions'))
        .then(() => {
          return i18n.t('pageSnmp.toast.successInUpdatingSubscription');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageSnmp.toast.errorInUpdatingSubscription'));
        });
    },
    async sendTestTrap() {
      return await api
        .post('/redfish/v1/PefService/Actions/PefService.SendAlertSNMPTrap')
        .then(() => i18n.t('pageSnmp.toast.successMsgTestTrap'))
        .catch(() => {
          throw new Error(i18n.t('pageSnmp.toast.errorMsgAlert'));
        });
    },
    async getBmcUsers({ commit }) {
      return await api
        .get('/redfish/v1/AccountService/Accounts')
        .then((response) =>
          response.data.Members.map((user) => user['@odata.id']),
        )
        .then((userIds) => {
          const userRequests = userIds.map((user) => {
            return api.get(user).catch((error) => {
              console.log(`Failed to fetch user ${user}: ${error}`);
              return null;
            });
          });
          return Promise.all(userRequests);
        })
        .then((users) => {
          const userData = users
            .filter((user) => user !== null)
            .map((user) => user.data.UserName);
          commit('setBmcUsers', userData);
        })
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageUserManagement.toast.errorLoadUsers');
          throw new Error(message);
        });
    },
  },
};

export default SnmpStore;
