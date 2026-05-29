import api from '@/store/api';
import i18n from '@/i18n';

const extractUsernameFromDestination = (destination = '') => {
  const match = destination.match(/^snmp:\/\/([^@]+)@/i);
  return match ? match[1] : '';
};

const LanDestinationsStore = {
  namespaced: true,
  state: {
    interfaces: [],
    selectedInterface: '',
    subscriptions: [],
    allSubscriptions: [],
    loading: false,
    interfaceIndexMap: {},
  },
  getters: {
    interfaces: (state) => state.interfaces,
    selectedInterface: (state) => state.selectedInterface,
    subscriptions: (state) => state.subscriptions,
    allSubscriptions: (state) => state.allSubscriptions,
    loading: (state) => state.loading,
    interfaceIndexMap: (state) => state.interfaceIndexMap,
    activeSlots: (state) =>
      state.subscriptions.filter((sub) => sub.configured).length,
    totalSlots: () => 15,
  },
  mutations: {
    setSelectedInterface: (state, interfaceName) => {
      state.selectedInterface = interfaceName;
    },
    setInterfaces: (state, interfaces) => {
      state.interfaces = interfaces;
    },
    setInterfaceIndexMap: (state, indexMap) => {
      state.interfaceIndexMap = indexMap;
    },
    setAllSubscriptions: (state, subscriptions) => {
      state.allSubscriptions = subscriptions;
    },
    setSubscriptions: (state, subscriptions) => {
      state.subscriptions = subscriptions;
    },
    setLoading: (state, loading) => {
      state.loading = loading;
    },
  },
  actions: {
    async getAllSubscriptions({ commit }) {
      commit('setLoading', true);
      try {
        const response = await api.get(
          '/redfish/v1/EventService/Subscriptions',
        );
        const members = response.data.Members || [];
        commit('setAllSubscriptions', members);

        // Parse interfaces from subscription URIs
        const interfaceData = new Map();

        members.forEach((member) => {
          const uri = member['@odata.id'];
          // Match pattern like /redfish/v1/EventService/Subscriptions/eth0_0
          const match = uri.match(/\/(eth\d+)_(\d+)$/);
          if (match) {
            const interfaceName = match[1]; // e.g., "eth0"
            const index = parseInt(match[2], 10); // e.g., 0

            if (!interfaceData.has(interfaceName)) {
              interfaceData.set(interfaceName, {
                minIndex: index,
                maxIndex: index,
              });
            } else {
              const data = interfaceData.get(interfaceName);
              data.minIndex = Math.min(data.minIndex, index);
              data.maxIndex = Math.max(data.maxIndex, index);
            }
          }
        });

        // Build interfaces array and index map
        const interfaces = Array.from(interfaceData.keys()).sort();
        const indexMap = {};

        interfaces.forEach((iface) => {
          const data = interfaceData.get(iface);
          indexMap[iface] = {
            from: data.minIndex,
            to: data.maxIndex,
          };
        });

        commit('setInterfaces', interfaces);
        commit('setInterfaceIndexMap', indexMap);

        // Set default interface to first available
        if (interfaces.length > 0) {
          commit('setSelectedInterface', interfaces[0]);
        }

        return members;
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async getInterfaceSubscriptions({ commit, state }) {
      commit('setLoading', true);
      try {
        const interfaceName = state.selectedInterface;
        const indexRange = state.interfaceIndexMap[interfaceName];
        const allSubs = state.allSubscriptions;

        // Filter subscriptions for the selected interface
        const relevantSubs = allSubs.filter((member) => {
          const odataId = member['@odata.id'];
          const match = odataId.match(/eth(\d+)_(\d+)$/);
          if (match) {
            const eth = `eth${match[1]}`;
            const index = parseInt(match[2], 10);
            return (
              eth === interfaceName &&
              index >= indexRange.from &&
              index <= indexRange.to
            );
          }
          return false;
        });

        // Create array of 15 slots
        const subscriptions = [];
        for (let i = indexRange.from; i <= indexRange.to; i++) {
          const existingSub = relevantSubs.find((sub) => {
            const match = sub['@odata.id'].match(/_(\d+)$/);
            return match && parseInt(match[1], 10) === i;
          });

          if (existingSub) {
            // Fetch detailed data for this subscription
            try {
              const detailResponse = await api.get(existingSub['@odata.id']);
              const data = detailResponse.data;
              const snmpV3Username = extractUsernameFromDestination(
                data.Destination,
              );
              subscriptions.push({
                index: i,
                slotNumber: i - indexRange.from,
                configured: true,
                uri: existingSub['@odata.id'],
                id: data.Id,
                status: 'Enabled',
                destination: data.Destination || '--',
                username: snmpV3Username || data.UserName || '--',
                protocol: data.Protocol || '--',
                context: data.Context || '',
                eventFormatType: data.EventFormatType || '',
                name:
                  data.Name || `SNMP Trap Destination ${i - indexRange.from}`,
                communityString: data.SNMP?.TrapCommunity || '',
              });
            } catch (error) {
              console.error(
                `Error fetching details for ${existingSub['@odata.id']}:`,
                error,
              );
              subscriptions.push({
                index: i,
                slotNumber: i - indexRange.from,
                configured: false,
                uri: `${interfaceName}_${i}`,
                id: `${interfaceName}_${i}`,
                status: 'Not Configured',
                destination: '--',
                protocol: '--',
                health: '--',
              });
            }
          } else {
            subscriptions.push({
              index: i,
              slotNumber: i - indexRange.from,
              configured: false,
              uri: `${interfaceName}_${i}`,
              id: `${interfaceName}_${i}`,
              status: 'Not Configured',
              destination: '--',
              protocol: '--',
              health: '--',
            });
          }
        }

        commit('setSubscriptions', subscriptions);
        return subscriptions;
      } catch (error) {
        console.error('Error fetching interface subscriptions:', error);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    async changeInterface({ commit, dispatch }, interfaceName) {
      commit('setSelectedInterface', interfaceName);
      await dispatch('getInterfaceSubscriptions');
    },

    async createSubscription({ dispatch, state }, { index, data }) {
      try {
        const interfaceName = state.selectedInterface;
        const payload = {
          Context: data.context || '',
          Destination: data.destination,
          UserName: data.username || '',
          DeliveryRetryPolicy: data.deliveryRetryPolicy || 'SuspendRetries',
          SendHeartbeat: data.sendHeartbeat || false,
          HeartbeatIntervalMinutes: data.heartbeatInterval || 0,
          Protocol: 'Redfish',
          SubscriptionType: 'SNMPTrap',
          Oem: {
            Ami: {
              '@odata.type': '#AmiEventDestination.v1_0_0.AmiEventDestination',
              CommunityString: data.communityString,
              EthernetInterface: interfaceName,
              DestinationIndex: index,
              DestinationType: data.destinationType,
            },
          },
        };

        await api.post('/redfish/v1/EventService/Subscriptions', payload);

        // Refresh the data
        await dispatch('getAllSubscriptions');
        await dispatch('getInterfaceSubscriptions');

        return i18n.t('pageLanDestinations.toast.successCreateSubscription');
      } catch (error) {
        console.error('Error creating subscription:', error);
        throw new Error(
          i18n.t('pageLanDestinations.toast.errorCreateSubscription'),
        );
      }
    },

    async updateSubscription({ dispatch }, { uri, data }) {
      try {
        var payload = {};
        switch (data.protocol) {
          case 'SMTP':
            payload = {
              Protocol: data.protocol,
              UserName: data.username,
            };
            break;
          case 'SNMPv1':
          case 'SNMPv2c':
            payload = {
              Protocol: data.protocol,
              Destination: data.destination,
              SNMP: {
                TrapCommunity: data.communityString,
              },
            };
            break;
          case 'SNMPv3':
            payload = {
              Protocol: data.protocol,
              Destination: data.destination,
            };
            break;
          default:
            break;
        }

        await api.patch(uri, payload);

        // Refresh the data
        await dispatch('getAllSubscriptions');
        await dispatch('getInterfaceSubscriptions');

        return i18n.t('pageLanDestinations.toast.successUpdateSubscription');
      } catch (error) {
        console.error('Error updating subscription:', error);
        throw new Error(
          i18n.t('pageLanDestinations.toast.errorUpdateSubscription'),
        );
      }
    },

    async sendSubscriptionMail(_, uri) {
      try {
        await api.post(uri);
        return i18n.t('global.action.send');
      } catch (error) {
        console.error('Error sending subscription mail:', error);
        throw new Error(error.message || i18n.t('global.status.error'));
      }
    },

    async deleteSubscription({ dispatch }, uri) {
      try {
        await api.delete(uri);

        // Refresh the data
        await dispatch('getAllSubscriptions');
        await dispatch('getInterfaceSubscriptions');

        return i18n.t('pageLanDestinations.toast.successDeleteSubscription');
      } catch (error) {
        console.error('Error deleting subscription:', error);
        throw new Error(
          i18n.t('pageLanDestinations.toast.errorDeleteSubscription'),
        );
      }
    },
  },
};

export default LanDestinationsStore;
