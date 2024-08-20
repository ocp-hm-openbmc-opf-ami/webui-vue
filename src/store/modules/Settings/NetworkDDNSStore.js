import api from '@/store/api';
import i18n from '@/i18n';

const NetworkDDNSStore = {
  namespaced: true,
  state: {
    ddnsEthernetData: [],
    ddnsSelectedInterfaceId: '', // which tab is selected
    ddnsFirstInterfaceId: '', //used for setting global DHCP settings
    ddnsFirstEtherData: [],
    hostNameEnabled: false,
    nsUpdateEnabled: false,
    domainName: '',
    ipPriority: null,
    hostName: '',
    staticHostName: null,
    domainNameServer: [],
  },
  getters: {
    ddnsEthernetData: (state) => state.ddnsEthernetData,
    ddnsSelectedInterfaceId: (state) => state.ddnsSelectedInterfaceId,
    ddnsFirstInterfaceId: (state) => state.ddnsFirstInterfaceId,
    ddnsFirstEtherData: (state) => state.ddnsFirstEtherData,
    hostNameEnabled: (state) => state.hostNameEnabled,
    nsUpdateEnabled: (state) => state.nsUpdateEnabled,
    domainName: (state) => state.domainName,
    ipPriority: (state) => state.ipPriority,
    hostName: (state) => state.hostName,
    staticHostName: (state) => state.staticHostName,
    domainNameServer: (state) => state.domainNameServer,
  },
  mutations: {
    setDDNSEthernetData: (state, ddnsEthernetData) =>
      (state.ddnsEthernetData = ddnsEthernetData),
    setDDNSSelectedInterfaceId: (state, ddnsSelectedInterfaceId) =>
      (state.ddnsSelectedInterfaceId = ddnsSelectedInterfaceId),
    setDDNSFirstInterfaceId: (state, ddnsFirstInterfaceId) =>
      (state.ddnsFirstInterfaceId = ddnsFirstInterfaceId),
    setDDNSFirstEtherData: (state, ddnsFirstEtherData) =>
      (state.ddnsFirstEtherData = ddnsFirstEtherData),
    setNsUpdateEnabled: (state, nsUpdateEnabled) =>
      (state.nsUpdateEnabled = nsUpdateEnabled),
    setHostNameEnabled: (state, hostNameEnabled) =>
      (state.hostNameEnabled = hostNameEnabled),
    setDomainName: (state, domainName) => (state.domainName = domainName),
    setIpPriority: (state, ipPriority) => (state.ipPriority = ipPriority),
    setHostName: (state, hostName) => (state.hostName = hostName),
    setStaticHostName: (state, staticHostName) =>
      (state.staticHostName = staticHostName),
    setDomainNameServer: (state, data) => {
      state.domainNameServer = data.map(({ data }) => {
        const { DHCPv4, DHCPv6 } = data;
        return {
          dhcpv4: {
            useDnsEnabled: DHCPv4.UseDNSServers,
            useDomainNameEnabled: DHCPv4.UseDomainName,
          },
          dhcpv6: {
            useDnsEnabled: DHCPv6.UseDNSServers,
            useDomainNameEnabled: DHCPv6.UseDomainName,
          },
        };
      });
    },
  },
  actions: {
    async getfirstEtherData({ commit }, firstEtherData) {
      const FirstEtherData = firstEtherData?.Oem?.Ami?.DNSConfiguration;
      const hostNameEnabled =
        FirstEtherData?.DHCPConfiguration?.SendHostNameEnabled;
      const nsUpdateEnabled =
        FirstEtherData?.DHCPConfiguration?.SendNsupdateEnabled;
      const domainName = FirstEtherData?.DomainConfiguration?.DomainNameSetting;
      const ipPriority =
        FirstEtherData?.DomainConfiguration?.IPPriority === 0
          ? null
          : FirstEtherData?.DomainConfiguration?.IPPriority;
      const hostName = FirstEtherData?.HostConfiguration?.HostNameSetting;
      const staticHostName = FirstEtherData?.HostConfiguration?.StaticHostName;
      commit('setNsUpdateEnabled', nsUpdateEnabled);
      commit('setHostNameEnabled', hostNameEnabled);
      commit('setDomainName', domainName);
      commit('setIpPriority', ipPriority);
      commit('setHostName', hostName);
      commit('setStaticHostName', staticHostName);
    },
    async getDDNSEthernetData({ commit, dispatch }) {
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
        .then(async (ethernetInterfaces) => {
          const ethernetData = ethernetInterfaces.map(
            (ethernetInterface) => ethernetInterface.data,
          );
          const firstEtherData = ethernetData[0];
          const firstInterfaceId = ethernetData[0].Id;
          commit('setDDNSSelectedInterfaceId', firstInterfaceId);
          commit('setDDNSEthernetData', ethernetData);
          commit('setDDNSFirstInterfaceId', firstInterfaceId);
          commit('setDDNSFirstEtherData', firstEtherData);
          commit('setDomainNameServer', ethernetInterfaces);
          await dispatch('getfirstEtherData', firstEtherData);
        })
        .catch((error) => {
          console.log('Network Data:', error);
        });
    },
    async nsUpdate({ state, dispatch }) {
      return await api
        .post(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.ddnsFirstInterfaceId}/Actions/Oem/Ami/EthernetInterface.DoNsupdate`,
        )
        .then(() => dispatch('getDDNSEthernetData'))
        .then(() => {
          return i18n.t('pageDDNSNetwork.toast.successNsUpdate');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageDDNSNetwork.toast.errorNsUpdate'));
        });
    },
    async setddnsSelectedTabId({ commit }, tabId) {
      commit('setDDNSSelectedInterfaceId', tabId);
    },
    async saveInterfaceConfiguration(
      { state, dispatch },
      { DDNSMethod, NSUpdateEnable, UseTSIG },
    ) {
      const ddnsData = {
        Oem: {
          Ami: {
            DNSConfiguration: {
              InterfacesConfiguration: {
                NSUpdateEnable: NSUpdateEnable,
                UseTSIG: UseTSIG,
                DDNSMethod: DDNSMethod,
              },
            },
          },
        },
      };
      return await api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.ddnsSelectedInterfaceId}`,
          ddnsData,
        )
        .then(() => dispatch('getDDNSEthernetData'))
        .then(() => {
          return i18n.t('pageDDNSNetwork.toast.successInterfaceConfiguration');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageDDNSNetwork.toast.errorInterfaceConfiguration'),
          );
        });
    },
    async saveHostNameEnabled({ state, dispatch }, SendHostNameEnabled) {
      const dhcpState = {
        Oem: {
          Ami: {
            DNSConfiguration: {
              DHCPConfiguration: {
                SendHostNameEnabled: SendHostNameEnabled,
              },
            },
          },
        },
      };
      return await api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.ddnsFirstInterfaceId}`,
          dhcpState,
        )
        .then(() => dispatch('getDDNSEthernetData'))
        .then(() => {
          return i18n.t('pageDDNSNetwork.toast.successEnableHostName');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageDDNSNetwork.toast.errorEnableHostName'));
        });
    },
    async saveNsupdateEnabled({ state, dispatch }, SendNsupdateEnabled) {
      const dhcpState = {
        Oem: {
          Ami: {
            DNSConfiguration: {
              DHCPConfiguration: {
                SendNsupdateEnabled: SendNsupdateEnabled,
              },
            },
          },
        },
      };
      return await api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.ddnsFirstInterfaceId}`,
          dhcpState,
        )
        .then(() => dispatch('getDDNSEthernetData'))
        .then(() => {
          return i18n.t('pageDDNSNetwork.toast.successEnableNsUpdate');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageDDNSNetwork.toast.errorEnableNsUpdate'));
        });
    },
    async uploadTSIGFile({ state }, uploadTSIGFile) {
      let uploadData = new FormData();
      uploadData.append('conf_file', uploadTSIGFile);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      return await api
        .post(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.ddnsSelectedInterfaceId}/Actions/Oem/Ami/EthernetInterface.TSIGUpload`,
          uploadData,
          config,
        )
        .then(() => {
          return i18n.t('pageDDNSNetwork.toast.successUpdateTsig');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageDDNSNetwork.toast.errorUpdateTsig'));
        });
    },
    async saveHostConfigurations({ state, dispatch }, data) {
      const ddnsData = {
        Oem: {
          Ami: {
            DNSConfiguration: {
              HostConfiguration: {
                HostNameSetting: data.HostNameSetting,
              },
            },
          },
        },
      };
      // Add StaticHostName only if it's not undefined
      if (data.StaticHostName !== undefined) {
        ddnsData.Oem.Ami.DNSConfiguration.HostConfiguration.StaticHostName =
          data.StaticHostName;
      }

      return await api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.ddnsSelectedInterfaceId}`,
          ddnsData,
        )
        .then(() => dispatch('getDDNSEthernetData'))
        .then(() => {
          return i18n.t('pageDDNSNetwork.toast.successSaveConfiguratin');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageDDNSNetwork.toast.errorSaveConfiguratin'),
          );
        });
    },
    async saveDomainNameConfigurations({ state, dispatch }, DomainNames) {
      const DomainNameUpdate = {
        Oem: {
          Ami: {
            DNSConfiguration: {
              DomainConfiguration: {
                DomainNames: DomainNames,
              },
            },
          },
        },
      };
      return await api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${state.ddnsSelectedInterfaceId}`,
          DomainNameUpdate,
        )
        .then(() => dispatch('getDDNSEthernetData'))
        .then(() => {
          return i18n.t('pageDDNSNetwork.toast.successSaveConfiguratin');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageDDNSNetwork.toast.errorSaveConfiguratin'),
          );
        });
    },
  },
};
export default NetworkDDNSStore;
