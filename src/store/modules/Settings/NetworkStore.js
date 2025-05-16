import api from '@/store/api';
import i18n from '@/i18n';

const NetworkStore = {
  namespaced: true,
  state: {
    ethernetData: [],
    firstInterfaceId: '', //used for setting global DHCP settings
    globalNetworkSettings: [],
    selectedInterfaceId: '', // which tab is selected
    selectedInterfaceIndex: 0, // which tab is selected
    networkBond: null,
    systemFirewall: null,
    enableLanNetworkSettings: [],
  },
  getters: {
    ethernetData: (state) => state.ethernetData,
    firstInterfaceId: (state) => state.firstInterfaceId,
    globalNetworkSettings: (state) => state.globalNetworkSettings,
    selectedInterfaceId: (state) => state.selectedInterfaceId,
    selectedInterfaceIndex: (state) => state.selectedInterfaceIndex,
    getNetworkBond: (state) => state.networkBond,
    getSystemFirewall: (state) => state.systemFirewall,
    getEnableLanNetworkSettings: (state) => state.enableLanNetworkSettings,
  },
  mutations: {
    setDomainNameState: (state, domainState) =>
      (state.domainState = domainState),
    setDnsState: (state, dnsState) => (state.dnsState = dnsState),
    setEthernetData: (state, ethernetData) =>
      (state.ethernetData = ethernetData),
    setFirstInterfaceId: (state, firstInterfaceId) =>
      (state.firstInterfaceId = firstInterfaceId),
    setIpv4Dhcp: (state, { dhcpEnable, index }) => {
      state.globalNetworkSettings[index].ipv4DhcpEnabled = dhcpEnable;
    },
    setIpv6Dhcp: (state, { dhcpEnable, index }) => {
      state.globalNetworkSettings[index].ipv6DhcpEnabled = dhcpEnable;
    },
    setGlobalNetworkSettings: (state, data) => {
      state.globalNetworkSettings = data
        .filter(function (item) {
          return item.data.InterfaceEnabled; // Keep only enabled interfaces
        })
        .map(function (item) {
          var ethernetData = item.data;
          const {
            DHCPv4,
            DHCPv6,
            HostName,
            IPv4Addresses,
            IPv4StaticAddresses,
            LinkStatus,
            MACAddress,
            Id,
            Oem,
          } = ethernetData;

          return {
            defaultGateway: IPv4StaticAddresses[0]?.Gateway, //First static gateway is the default gateway
            dhcpAddress: IPv4Addresses.filter(
              (ipv4) => ipv4.AddressOrigin === 'DHCP',
            ),
            hostname: HostName,
            macAddress: MACAddress,
            linkStatus: LinkStatus,
            staticAddress: IPv4StaticAddresses[0]?.Address, // Display first static address on overview page
            ipv4Status: Oem?.Ami
              ? Oem?.Ami?.IPv4IPv6Configuration?.IPv4Enable
              : true,
            ipv6Status: Oem?.Ami
              ? Oem?.Ami?.IPv4IPv6Configuration?.IPv6Enable
              : true,
            dhcpv4: {
              useDnsEnabled: DHCPv4.UseDNSServers,
              useDomainNameEnabled: DHCPv4.UseDomainName,
              useNtpEnabled: DHCPv4.UseNTPServers,
            },
            dhcpv6: {
              useDnsEnabled: DHCPv6.UseDNSServers,
              useDomainNameEnabled: DHCPv6.UseDomainName,
              useNtpEnabled: DHCPv6.UseNTPServers,
            },
            useDnsEnabled: DHCPv4.UseDNSServers,
            useDomainNameEnabled: DHCPv4.UseDomainName,
            useNtpEnabled: DHCPv4.UseNTPServers,
            ipv4DhcpEnabled: DHCPv4.DHCPEnabled,
            ipv6DhcpEnabled: DHCPv6.OperatingMode == 'Enabled' ? true : false,
            id: Id,
          };
        });
    },
    setNtpState: (state, ntpState) => (state.ntpState = ntpState),
    setSelectedInterfaceId: (state, selectedInterfaceId) =>
      (state.selectedInterfaceId = selectedInterfaceId),
    setSelectedInterfaceIndex: (state, selectedInterfaceIndex) =>
      (state.selectedInterfaceIndex = selectedInterfaceIndex),
    setNetworkBond: (state, networkBond) => {
      state.networkBond = networkBond;
    },
    setSystemFirewall: (state, systemFirewall) => {
      state.systemFirewall = systemFirewall;
    },
    setEnableLanNetworkSettings: (state, enableLanNetworkSettings) => {
      state.enableLanNetworkSettings = enableLanNetworkSettings;
    },
  },
  actions: {
    async getEthernetData({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces')
        .then((response) =>
          response.data.Members.map(
            (ethernetInterface) => ethernetInterface['@odata.id'],
          ),
        )
        .then((ethernetInterfaceIds) =>
          api.all(
            ethernetInterfaceIds.map((ethernetInterface) =>
              api.get(ethernetInterface),
            ),
          ),
        )
        .then((ethernetInterfaces) => {
          const ethernetData = ethernetInterfaces
            .filter(function (ethernetInterface) {
              return ethernetInterface.data.InterfaceEnabled; // Only include enabled interfaces
            })
            .map(function (ethernetInterface) {
              return ethernetInterface.data;
            });
          const firstInterfaceId = ethernetData[0].Id;
          commit('setEthernetData', ethernetData);
          commit('setFirstInterfaceId', firstInterfaceId);
          commit('setSelectedInterfaceId', firstInterfaceId);
          commit('setGlobalNetworkSettings', ethernetInterfaces);
          commit('setEnableLanNetworkSettings', ethernetInterfaces);
          commit(
            'setNetworkBond',
            ethernetData[0].Actions?.Oem?.Ami[
              '#EthernetInterface.CreateBond'
            ] ||
              ethernetData[0].Actions?.Oem?.Ami[
                '#EthernetInterface.ChangeActiveSlave'
              ]
              ? true
              : false,
          );
          commit(
            'setSystemFirewall',
            ethernetData[0].Actions?.Oem?.Ami[
              '#EthernetInterface.AddFirewallRules'
            ]
              ? true
              : false,
          );
        })
        .catch((error) => {
          console.log('Network Data:', error);
        });
    },
    async saveDhcpv4DomainNameState({ commit, state }, domainState) {
      commit('setDomainNameState', domainState);
      const data = {
        DHCPv4: {
          UseDomainName: domainState,
        },
      };
      // Saving to the first interface automatically updates DHCPv4 and DHCPv6
      // on all interfaces
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          data,
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.domainName'),
          });
        })
        .catch((error) => {
          console.log(error);
          commit('setDomainNameState', !domainState);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.domainName'),
            }),
          );
        });
    },
    async saveDhcpv4DnsState({ commit, state }, dnsState) {
      commit('setDnsState', dnsState);
      const data = {
        DHCPv4: {
          UseDNSServers: dnsState,
        },
      };
      // Saving to the first interface automatically updates DHCPv4 and DHCPv6
      // on all interfaces
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          data,
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.dns'),
          });
        })
        .catch((error) => {
          console.log(error);
          commit('setDnsState', !dnsState);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.dns'),
            }),
          );
        });
    },
    async saveDhcpv4NtpState({ commit, state }, ntpState) {
      commit('setNtpState', ntpState);
      const data = {
        DHCPv4: {
          UseNTPServers: ntpState,
        },
      };
      // Saving to the first interface automatically updates DHCPv4 and DHCPv6
      // on all interfaces
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          data,
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.ntp'),
          });
        })
        .catch((error) => {
          console.log(error);
          commit('setNtpState', !ntpState);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.ntp'),
            }),
          );
        });
    },
    async setSelectedTabIndex({ commit }, tabIndex) {
      commit('setSelectedInterfaceIndex', tabIndex);
    },
    async setSelectedTabId({ commit }, tabId) {
      commit('setSelectedInterfaceId', tabId);
    },
    async saveIpv4Address({ dispatch, state }, ipv4Form) {
      const originalAddresses = state.ethernetData[
        state.selectedInterfaceIndex
      ].IPv4StaticAddresses.map((ipv4) => {
        const { Address, SubnetMask, Gateway } = ipv4;
        return {
          Address,
          SubnetMask,
          Gateway,
        };
      });
      const newAddress = [ipv4Form];
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          { IPv4StaticAddresses: originalAddresses.concat(newAddress) },
        )
        .then(dispatch('getEthernetData'))
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.ipv4'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.ipv4'),
            }),
          );
        });
    },
    async saveIpv4Dhcp({ dispatch, state }, dhcpState) {
      let DHCPv4 = {
        DHCPv4: {
          DHCPEnabled: dhcpState,
        },
      };

      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          DHCPv4,
        )
        .then(dispatch('getEthernetData'))
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.ipv4'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.ipv4'),
            }),
          );
        });
    },
    async saveIpv6Dhcp({ state }, dhcpState) {
      let DHCPv6 = {
        DHCPv6: {
          OperatingMode: dhcpState,
        },
      };

      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          DHCPv6,
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.ipv6'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.ipv6'),
            }),
          );
        });
    },
    async saveIpv6Address(
      { state },
      { dhcpv6State, ipv6Data, modalFormData, getOemAmiActions },
    ) {
      let DHCPv6 = {
        OperatingMode: 'Disabled',
      };
      let IPv6StaticAddresses = [];
      let IPv6StaticDefaultGateways = [];
      if (getOemAmiActions && modalFormData.ipv6Index !== undefined) {
        // REP(Actions/Oem/Ami) Enabled pass the ipv6Index else remove the ipv6Index
        IPv6StaticAddresses.push({
          Address: modalFormData.Address,
          PrefixLength: parseInt(modalFormData.PrefixLength),
          Oem: {
            Ami: {
              StaticIPv6AddressIndex: parseInt(modalFormData.ipv6Index),
            },
          },
        });
      } else {
        ipv6Data.forEach((rowData) => {
          IPv6StaticAddresses.push({
            Address: rowData.Address,
            PrefixLength: parseInt(rowData.PrefixLength),
          });
        });
      }
      IPv6StaticDefaultGateways.push({
        Address: modalFormData.Gateway,
      });
      var StaticIpv6 = {};

      if (dhcpv6State == 'Enabled') {
        StaticIpv6 = {
          DHCPv6,
          IPv6StaticAddresses: IPv6StaticAddresses,
          IPv6StaticDefaultGateways: IPv6StaticDefaultGateways,
        };
      } else {
        StaticIpv6 = {
          IPv6StaticAddresses: IPv6StaticAddresses,
          IPv6StaticDefaultGateways: IPv6StaticDefaultGateways,
        };
      }

      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          StaticIpv6,
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.ipv6'),
          });
        })
        .catch((error) => {
          console.log(error);
          if (
            (error.response &&
              error.response.data &&
              error.response.data.error[
                '@Message.ExtendedInfo'
              ][0].MessageId.includes('SameIPv6Address')) ||
            error.response.data.error[
              '@Message.ExtendedInfo'
            ][0].MessageId.includes('PropertyValueIncorrect')
          ) {
            throw new Error(
              i18n.t('pageNetwork.toast.errorAddressSaveNetworkSettings'),
            );
          } else {
            throw new Error(
              i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
                setting: i18n.t('pageNetwork.ipv6'),
              }),
            );
          }
        });
    },
    async deleteIpv6Address({ state }, { ipv6TabelDataList, ipv6DataItem }) {
      let IPv6StaticAddresses = [];
      if (ipv6DataItem && ipv6DataItem.ipv6Index !== undefined) {
        // REP(Actions/Oem/Ami) Enabled pass the ipv6Index else remove the ipv6Index
        IPv6StaticAddresses.push({
          Address: null,
          Oem: {
            Ami: {
              StaticIPv6AddressIndex: parseInt(ipv6DataItem.ipv6Index),
            },
          },
          PrefixLength: parseInt(ipv6DataItem.PrefixLength),
        });
      } else {
        ipv6TabelDataList.forEach((rowData) => {
          IPv6StaticAddresses.push({
            Address: rowData.Address,
            PrefixLength: parseInt(rowData.PrefixLength),
          });
        });
      }

      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          {
            IPv6StaticAddresses: IPv6StaticAddresses,
          },
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.ipv6'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.ipv6'),
            }),
          );
        });
    },
    async editIpv4Address({ dispatch, state }, ipv4TableData) {
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          {
            DHCPv4: {
              DHCPEnabled: false,
            },
            IPv4StaticAddresses: ipv4TableData,
          },
        )
        .then(dispatch('getEthernetData'))
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.ipv4'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.ipv4'),
            }),
          );
        });
    },
    async saveSettings({ state, dispatch }, interfaceSettingsForm) {
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          interfaceSettingsForm,
        )
        .then(dispatch('getEthernetData'))
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.network'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.network'),
            }),
          );
        });
    },
    async saveDnsAddress({ dispatch, state }, dnsForm) {
      const newAddress = dnsForm;
      const originalAddresses =
        state.ethernetData[state.selectedInterfaceIndex].StaticNameServers;
      const newDnsArray = originalAddresses.concat(newAddress);
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          { StaticNameServers: newDnsArray },
        )
        .then(dispatch('getEthernetData'))
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.dns'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.dns'),
            }),
          );
        });
    },
    async editDnsAddress({ dispatch, state }, dnsTableData) {
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          { StaticNameServers: dnsTableData },
        )
        .then(dispatch('getEthernetData'))
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.dns'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.dns'),
            }),
          );
        });
    },
    async saveDhcpv6DomainNameState({ commit, state }, domainState) {
      commit('setDomainNameState', domainState);
      const data = {
        DHCPv6: {
          UseDomainName: domainState,
        },
      };
      // Saving to the first interface automatically updates DHCPv4 and DHCPv6
      // on all interfaces
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          data,
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.domainName'),
          });
        })
        .catch((error) => {
          console.log(error);
          commit('setDomainNameState', !domainState);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.domainName'),
            }),
          );
        });
    },
    async saveDhcpv6DnsState({ commit, state }, dnsState) {
      commit('setDnsState', dnsState);
      const data = {
        DHCPv6: {
          UseDNSServers: dnsState,
        },
      };
      // Saving to the first interface automatically updates DHCPv4 and DHCPv6
      // on all interfaces
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          data,
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.dns'),
          });
        })
        .catch((error) => {
          console.log(error);
          commit('setDnsState', !dnsState);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.dns'),
            }),
          );
        });
    },
    async saveDhcpv6NtpState({ commit, state }, ntpState) {
      commit('setNtpState', ntpState);
      const data = {
        DHCPv6: {
          UseNTPServers: ntpState,
        },
      };
      // Saving to the first interface automatically updates DHCPv4 and DHCPv6
      // on all interfaces
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          data,
        )
        .then(() => {
          return i18n.t('pageNetwork.toast.successSaveNetworkSettings', {
            setting: i18n.t('pageNetwork.ntp'),
          });
        })
        .catch((error) => {
          console.log(error);
          commit('setNtpState', !ntpState);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveNetworkSettings', {
              setting: i18n.t('pageNetwork.ntp'),
            }),
          );
        });
    },
    async interfaceEnabledStatus(_, data) {
      const params = {
        InterfaceEnabled: data.form.InterfaceEnabled,
      };
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${data.form.lanInterface}`,
          params,
        )
        .then(() =>
          i18n.t(
            'pageNetwork.toast.successSaveLanconfigurationNetworkSettings',
          ),
        )
        .catch((error) => {
          console.log(error);
          if (
            (error.response &&
              error.response.data &&
              error.response.data.error[
                '@Message.ExtendedInfo'
              ][0].MessageId.includes('SingleEthernetEnabled')) ||
            error.response.data.error[
              '@Message.ExtendedInfo'
            ][0].MessageId.includes('propertyValueExternalConflict')
          ) {
            throw new Error(
              i18n.t('pageNetwork.toast.AllInterfaceDisableInfo'),
            );
          } else {
            throw new Error(
              i18n.t(
                'pageNetwork.toast.errorSaveLanconfigurationNetworkSettings',
              ),
            );
          }
        });
    },
    async networkIpv4Ipv6Status({ state }, IPv4IPv6Configuration) {
      const params = {
        Oem: {
          Ami: {
            IPv4IPv6Configuration,
          },
        },
      };
      return api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.selectedInterfaceId}`,
          params,
        )
        .then(() => i18n.t('pageNetwork.toast.successSaveiIpNetworkSettings'))
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageNetwork.toast.errorSaveIpNetworkSettings'),
          );
        });
    },
  },
};

export default NetworkStore;
