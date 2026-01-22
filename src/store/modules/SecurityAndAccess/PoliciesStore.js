import api from '@/store/api';
import i18n from '@/i18n';
import store from '@/store/';

const PoliciesStore = {
  namespaced: true,
  state: {
    sshProtocolEnabled: false,
    ipmiProtocolEnabled: false,
    kvmServiceEnabled: false,
    virtualMediaServiceEnabled: false,
    solSshServiceEnabled: false,
    solSshPortValue: null,
    multiSolSshList: [],
    isMultiSolMode: false,
    rtadEnabled: 'Disabled',
    vtpmEnabled: 'Disabled',
    sessionTimeoutValue: null,
    kvmEnabled: true,
    vmcEnabled: true,
    solEnabled: true,
    complexity: '',
    passwordHistory: null,
    ssdpProtocolEnabled: false,
    ssdpPortValue: null,
    sslFipsProtocolEnabled: false,
    kvmSessionTimeout: null,
    kvmPortValue: null,
    webPortValue: null,
    solBitRate: null,
    vmReconnectData: {},
    maxSessions: [],
    channelList: [],
    defaultChannelList: {},
  },
  getters: {
    sshProtocolEnabled: (state) => state.sshProtocolEnabled,
    ipmiProtocolEnabled: (state) => state.ipmiProtocolEnabled,
    solSshPortValue: (state) => state.solSshPortValue,
    multiSolSshList: (state) => state.multiSolSshList,
    isMultiSolMode: (state) => state.isMultiSolMode,
    rtadEnabled: (state) => state.rtadEnabled,
    vtpmEnabled: (state) => state.vtpmEnabled,
    sessionTimeoutValue: (state) => state.sessionTimeoutValue,
    kvmEnabled: (state) => state.kvmEnabled,
    vmcEnabled: (state) => state.vmcEnabled,
    solEnabled: (state) => state.solEnabled,
    solSshServiceEnabled: (state) => state.solSshServiceEnabled,
    kvmServiceEnabled: (state) => state.kvmServiceEnabled,
    virtualMediaServiceEnabled: (state) => state.virtualMediaServiceEnabled,
    complexity: (state) => state.complexity,
    passwordHistory: (state) => state.passwordHistory,
    ssdpProtocolEnabled: (state) => state.ssdpProtocolEnabled,
    ssdpPortValue: (state) => state.ssdpPortValue,
    sslFipsProtocolEnabled: (state) => state.sslFipsProtocolEnabled,
    kvmSessionTimeout: (state) => state.kvmSessionTimeout,
    kvmPortValue: (state) => state.kvmPortValue,
    webPortValue: (state) => state.webPortValue,
    solBitRate: (state) => state.solBitRate,
    vmReconnectData: (state) => state.vmReconnectData,
    maxSessions: (state) => state.maxSessions,
    getChannelList: (state) => state.channelList,
    getDefaultChannelList: (state) => state.defaultChannelList,
  },
  mutations: {
    setSshProtocolEnabled: (state, sshProtocolEnabled) =>
      (state.sshProtocolEnabled = sshProtocolEnabled),
    setIpmiProtocolEnabled: (state, ipmiProtocolEnabled) =>
      (state.ipmiProtocolEnabled = ipmiProtocolEnabled),
    setSolSshPort: (state, solSshPortValue) =>
      (state.solSshPortValue = solSshPortValue),
    setRtadEnabled: (state, rtadEnabled) => (state.rtadEnabled = rtadEnabled),
    setVtpmEnabled: (state, vtpmEnabled) => (state.vtpmEnabled = vtpmEnabled),
    setKvmEnabled: (state, kvmEnabled) => (state.kvmEnabled = kvmEnabled),
    setVmcEnabled: (state, vmcEnabled) => (state.vmcEnabled = vmcEnabled),
    setSOLEnabled: (state, solEnabled) => (state.solEnabled = solEnabled),
    setSolSshServiceEnabled: (state, solSshServiceEnabled) =>
      (state.solSshServiceEnabled = solSshServiceEnabled),
    setMultiSolSshList: (state, multiSolSshList) =>
      (state.multiSolSshList = multiSolSshList),
    updateMultiSolSshService: (state, { solId, enabled }) => {
      const service = state.multiSolSshList.find((sol) => sol.Id === solId);
      if (service) {
        service.ServiceEnabled = enabled;
        service.Masked = !enabled;
      }
    },
    setIsMultiSolMode: (state, isMultiSolMode) =>
      (state.isMultiSolMode = isMultiSolMode),
    setKvmServiceEnabled: (state, kvmServiceEnabled) =>
      (state.kvmServiceEnabled = kvmServiceEnabled),
    setVirtualMediaServiceEnabled: (state, virtualMediaServiceEnabled) =>
      (state.virtualMediaServiceEnabled = virtualMediaServiceEnabled),
    setSessionTimeoutValue(state, sessionTimeoutValue) {
      state.sessionTimeoutValue = sessionTimeoutValue;
    },
    setComplexity: (state, complexity) => (state.complexity = complexity),
    setPasswordHistory: (state, passwordHistory) =>
      (state.passwordHistory = passwordHistory),
    setSsdpProtocolEnabled: (state, ssdpProtocolEnabled) =>
      (state.ssdpProtocolEnabled = ssdpProtocolEnabled),
    setSsdpPort: (state, ssdpPortValue) =>
      (state.ssdpPortValue = ssdpPortValue),
    setSslFipsProtocolEnabled: (state, sslFipsProtocolEnabled) =>
      (state.sslFipsProtocolEnabled = sslFipsProtocolEnabled),
    setKvmSessionTimeout: (state, kvmSessionTimeout) =>
      (state.kvmSessionTimeout = kvmSessionTimeout),
    setKvmPortValue: (state, kvmPortValue) =>
      (state.kvmPortValue = kvmPortValue),
    setWebPortValue: (state, webPortValue) =>
      (state.webPortValue = webPortValue),
    setSolBitRate: (state, solBitRate) => (state.solBitRate = solBitRate),
    setVMReconnectValues: (state, vmReconnectData) =>
      (state.vmReconnectData = vmReconnectData),
    setMaxSessions: (state, maxSessions) => (state.maxSessions = maxSessions),
    setChannelList: (state, channelList) => (state.channelList = channelList),
    setDefaultChannelList: (state, defaultChannelList) =>
      (state.defaultChannelList = defaultChannelList),
  },
  actions: {
    setSolSshPortUpdatedValue({ commit }, solSshProtocolPort) {
      commit('setSolSshPort', solSshProtocolPort);
    },
    async getNetworkProtocolStatus({ commit, dispatch }) {
      return await api
        .get(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/NetworkProtocol',
        )
        .then((response) => {
          const sshProtocol = response.data?.SSH?.ProtocolEnabled;
          const ChannelList = response.data?.Oem?.Ami?.AvailableChannelList;
          const curProtocolEnabled = response.data?.IPMI?.ProtocolEnabled;
          const curIpmiMasked = response.data?.Oem?.Ami?.IPMI?.Masked;
          if (curIpmiMasked == curProtocolEnabled)
            dispatch('syncIpmiMasked', curIpmiMasked);
          const ssdpProtocol = response.data?.SSDP?.ProtocolEnabled;
          const ssdpPortValue = response.data?.SSDP?.Port;
          const defaultChannelInfo = response.data?.Oem?.Ami?.DefaultChannel;
          commit('setSshProtocolEnabled', sshProtocol);
          commit('setIpmiProtocolEnabled', curProtocolEnabled);
          commit('setSsdpProtocolEnabled', ssdpProtocol);
          commit('setSsdpPort', ssdpPortValue);
          commit('setChannelList', ChannelList);
          commit('setDefaultChannelList', defaultChannelInfo);
        })
        .catch((error) => console.log(error));
    },
    async getBiosStatus({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/Bios')
        .then((response) => {
          commit('setRtadEnabled', response.data.Attributes.pvm_rtad);
          commit('setVtpmEnabled', response.data.Attributes.pvm_vtpm);
        })
        .catch((error) => console.log(error));
    },
    async getSslFipsStatus({ commit }) {
      return await api
        .get('/redfish/v1/Managers/' + store.getters['global/managerInstance'])
        .then((response) => {
          commit(
            'setSslFipsProtocolEnabled',
            response.data.Oem.Ami?.OpensslFIPSStatus.Enabled,
          );
        })
        .catch((error) => console.log(error));
    },
    async getKvmServiceStatus({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system')
        .then((response) => {
          const kvmServiceEnabled =
            response.data?.GraphicalConsole?.ServiceEnabled;
          const virtualMediaServiceEnabled =
            response.data?.VirtualMediaConfig?.ServiceEnabled;
          const multiSolSshData =
            response.data?.Oem?.Ami?.SerialConsole?.SSH?.SOLSSH;
          if (multiSolSshData?.length > 0) {
            commit('setMultiSolSshList', multiSolSshData);
            commit('setIsMultiSolMode', true);
            commit('setSolSshServiceEnabled', false);
            commit('setSolSshPort', null);
          } else {
            const solSshServiceEnabled =
              response.data?.SerialConsole?.SSH?.ServiceEnabled;
            const solSshPortValue = response.data?.SerialConsole?.SSH?.Port;
            commit('setSolSshServiceEnabled', solSshServiceEnabled);
            commit('setSolSshPort', solSshPortValue);
            commit('setIsMultiSolMode', false);
            commit('setMultiSolSshList', []);
          }
          commit('setKvmServiceEnabled', kvmServiceEnabled);
          commit('setVirtualMediaServiceEnabled', virtualMediaServiceEnabled);
        })
        .catch((error) => console.log(error));
    },
    async getSessionTimeout({ commit }) {
      const maxSessionsServiceInfo = [];
      return await api
        .get('/redfish/v1/SessionService')
        .then((response) => {
          const commonValidation = (value, defaultValue = 'NA') =>
            value !== '' && value !== undefined ? value : defaultValue;
          const sessionTimeoutValue = commonValidation(
            response.data.SessionTimeout,
          );
          const kvmSessionTimeoutValue = commonValidation(
            response.data?.Oem?.Ami?.KVMSessionTimeout,
          );
          const kvmPortValue = commonValidation(
            response.data?.Oem?.Ami?.KVMPort,
          );
          const webPortValue = commonValidation(
            response.data?.Oem?.Ami?.BMCwebPort,
          );
          const maxSessions = response;
          maxSessions.kvmMaxSession = commonValidation(
            response.data?.Oem?.Ami?.KvmMaxSession,
          );
          maxSessions.redfishMaxSession = commonValidation(
            response.data?.Oem?.Ami?.RedfishMaxSession,
          );
          maxSessions.sshMaxSession = commonValidation(
            response.data?.Oem?.Ami?.SshMaxSession,
          );
          maxSessions.vmMaxSession = commonValidation(
            response.data?.Oem?.Ami?.VmMaxSession,
          );
          maxSessions.webMaxSession = commonValidation(
            response.data?.Oem?.Ami?.WebMaxSession,
          );
          maxSessionsServiceInfo.push(maxSessions);
          commit('setSessionTimeoutValue', sessionTimeoutValue);
          commit('setKvmSessionTimeout', kvmSessionTimeoutValue);
          commit('setKvmPortValue', kvmPortValue);
          commit('setWebPortValue', webPortValue);
          commit('setMaxSessions', maxSessionsServiceInfo);
        })
        .catch((error) => console.log(error));
    },
    async getAccountService({ commit }) {
      return await api
        .get('/redfish/v1/AccountService')
        .then((response) => {
          const ComplexityValue =
            response.data.Oem.OpenBMC.PasswordPolicyComplexity;
          const passwordHistory =
            response.data.Oem.OpenBMC.RememberOldPasswordTimes;
          commit('setComplexity', ComplexityValue);
          commit('setPasswordHistory', passwordHistory);
        })
        .catch((error) => console.log(error));
    },
    async syncIpmiMasked(_, protocolEnabled) {
      const ipmi = {
        Oem: {
          Ami: {
            IPMI: {
              Masked: !protocolEnabled,
            },
          },
        },
      };
      return await api
        .patch(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/NetworkProtocol',
          ipmi,
        )
        .catch((error) => {
          console.log('Failed to sync Masked:', error);
        });
    },
    async saveIpmiProtocolState({ commit, dispatch }, protocolEnabled) {
      commit('setIpmiProtocolEnabled', protocolEnabled);
      return dispatch('syncIpmiMasked', protocolEnabled)
        .then(() => {
          if (protocolEnabled) {
            return i18n.t('pagePolicies.toast.successIpmiEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successIpmiDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setIpmiProtocolEnabled', !protocolEnabled);
          if (protocolEnabled) {
            throw new Error(i18n.t('pagePolicies.toast.errorIpmiEnabled'));
          } else {
            throw new Error(i18n.t('pagePolicies.toast.errorIpmiDisabled'));
          }
        });
    },
    async saveSshProtocolState({ commit }, protocolEnabled) {
      commit('setSshProtocolEnabled', protocolEnabled);
      const ssh = {
        SSH: {
          ProtocolEnabled: protocolEnabled,
        },
      };
      return await api
        .patch(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/NetworkProtocol',
          ssh,
        )
        .then(() => {
          if (protocolEnabled) {
            return i18n.t('pagePolicies.toast.successSshEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successSshDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setSshProtocolEnabled', !protocolEnabled);
          if (protocolEnabled) {
            throw new Error(i18n.t('pagePolicies.toast.errorSshEnabled'));
          } else {
            throw new Error(i18n.t('pagePolicies.toast.errorSshDisabled'));
          }
        });
    },
    async saveRtadState({ commit }, updatedRtad) {
      commit('setRtadEnabled', updatedRtad);
      return await api
        .patch('/redfish/v1/Systems/system/Bios/Settings', {
          Attributes: {
            pvm_rtad: updatedRtad,
          },
        })
        .then(() => {
          if (updatedRtad === 'Enabled') {
            return i18n.t('pagePolicies.toast.successRtadEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successRtadDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          if (updatedRtad === 'Enabled') {
            throw new Error(i18n.t('pagePolicies.toast.errorRtadEnabled'));
          } else {
            throw new Error(i18n.t('pagePolicies.toast.errorRtadDisabled'));
          }
        });
    },
    async saveVtpmState({ commit }, updatedVtpm) {
      commit('setVtpmEnabled', updatedVtpm);
      return await api
        .patch('/redfish/v1/Systems/system/Bios/Settings', {
          Attributes: {
            pvm_vtpm: updatedVtpm,
          },
        })
        .then(() => {
          if (updatedVtpm === 'Enabled') {
            return i18n.t('pagePolicies.toast.successVtpmEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successVtpmDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          if (updatedVtpm === 'Enabled') {
            throw new Error(i18n.t('pagePolicies.toast.errorVtpmEnabled'));
          } else {
            throw new Error(i18n.t('pagePolicies.toast.errorVtpmDisabled'));
          }
        });
    },
    async saveKvmState({ commit }, kvmServiceEnabled) {
      commit('setKvmServiceEnabled', kvmServiceEnabled);
      const kvm = {
        GraphicalConsole: {
          ServiceEnabled: kvmServiceEnabled,
        },
      };
      return await api
        .patch('/redfish/v1/Systems/system', kvm)
        .then(() => {
          if (kvmServiceEnabled) {
            return i18n.t('pagePolicies.toast.successKvmEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successKvmDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setKvmServiceEnabled', !kvmServiceEnabled);
          if (kvmServiceEnabled) {
            throw new Error(i18n.t('pagePolicies.toast.errorKvmEnabled'));
          } else {
            throw new Error(i18n.t('pagePolicies.toast.errorKvmDisabled'));
          }
        });
    },
    async saveVmcState({ commit }, virtualMediaServiceEnabled) {
      commit('setVirtualMediaServiceEnabled', virtualMediaServiceEnabled);
      const virtualMedia = {
        VirtualMediaConfig: {
          ServiceEnabled: virtualMediaServiceEnabled,
        },
      };
      return await api
        .patch('/redfish/v1/Systems/system', virtualMedia)
        .then(() => {
          if (virtualMediaServiceEnabled) {
            return i18n.t('pagePolicies.toast.successVmcEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successVmcDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setVirtualMediaServiceEnabled', !virtualMediaServiceEnabled);
          if (virtualMediaServiceEnabled) {
            throw new Error(i18n.t('pagePolicies.toast.errorVmcEnabled'));
          } else {
            throw new Error(i18n.t('pagePolicies.toast.errorVmcDisabled'));
          }
        });
    },
    async saveSOLSshState({ commit }, solEnabled) {
      commit('setSolSshServiceEnabled', solEnabled);
      const solSsh = {
        SerialConsole: {
          SSH: {
            ServiceEnabled: solEnabled,
          },
        },
      };
      return await api
        .patch('/redfish/v1/Systems/system', solSsh)
        .then(() => {
          if (solEnabled) {
            return i18n.t('pagePolicies.toast.successSOLEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successSOLDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setSolSshServiceEnabled', !solEnabled);
          if (solEnabled) {
            throw new Error(i18n.t('pagePolicies.toast.errorSOLEnabled'));
          }
        });
    },
    async saveMultiSOLSshState({ commit }, { solId, enabled }) {
      commit('updateMultiSolSshService', { solId, enabled });
      const solSshUpdate = {
        Oem: {
          Ami: {
            SerialConsole: {
              SSH: {
                SOLSSH: [
                  {
                    Id: solId,
                    ServiceEnabled: enabled,
                    Masked: !enabled,
                  },
                ],
              },
            },
          },
        },
      };
      return await api
        .patch('/redfish/v1/Systems/system', solSshUpdate)
        .then(() => {
          if (enabled) {
            return i18n.t('pagePolicies.toast.successMultiSOLEnabled', {
              solId,
            });
          } else {
            return i18n.t('pagePolicies.toast.successMultiSOLDisabled', {
              solId,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          commit('updateMultiSolSshService', { solId, enabled: !enabled });
          if (enabled) {
            throw new Error(
              i18n.t('pagePolicies.toast.errorMultiSOLEnabled', { solId }),
            );
          } else {
            throw new Error(
              i18n.t('pagePolicies.toast.errorMultiSOLDisabled', { solId }),
            );
          }
        });
    },
    async saveSolSshPortState({ commit }, solSshProtocolPortNewValue) {
      commit('saveSOLSshState', solSshProtocolPortNewValue);
      const portValue = {
        SerialConsole: {
          SSH: {
            Port: solSshProtocolPortNewValue,
          },
        },
      };
      return await api
        .patch('/redfish/v1/Systems/system', portValue)
        .then(() => {
          if (solSshProtocolPortNewValue) {
            return i18n.t('pagePolicies.toast.successSolSshPort');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('saveSOLSshState', solSshProtocolPortNewValue);
          if (solSshProtocolPortNewValue) {
            throw new Error(i18n.t('pagePolicies.toast.errorSolSshPort'));
          }
        });
    },
    async saveSSDPProtocolState({ commit }, protocolEnabled) {
      commit('setSsdpProtocolEnabled', protocolEnabled);
      const SSDP = {
        SSDP: {
          ProtocolEnabled: protocolEnabled,
        },
      };
      return await api
        .patch(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/NetworkProtocol',
          SSDP,
        )
        .then(() => {
          if (protocolEnabled) {
            return i18n.t('pagePolicies.toast.successSSDPEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successSSDPDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setSsdpProtocolEnabled', !protocolEnabled);
          if (protocolEnabled) {
            throw new Error(i18n.t('pagePolicies.toast.errorSSDPEnabled'));
          } else {
            throw new Error(i18n.t('pagePolicies.toast.errorSSDPDisabled'));
          }
        });
    },
    async saveSslFipsProtocolState({ commit, dispatch }, protocolEnabled) {
      commit('setSslFipsProtocolEnabled', protocolEnabled);
      const SslFipsMode = {
        Enabled: protocolEnabled,
      };
      return await api
        .post(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/Actions/Oem/AMIManager.ChangeOpensslFIPSStatus',
          SslFipsMode,
        )
        .then(() => dispatch('getSslFipsStatus'))
        .then(() => {
          if (protocolEnabled) {
            return i18n.t('pagePolicies.toast.successOpenSSLFIPSEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successOpenSSLFIPSDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setSslFipsProtocolEnabled', !protocolEnabled);
          if (protocolEnabled) {
            throw new Error(
              i18n.t('pagePolicies.toast.errorOpenSSLFIPSEnabled'),
            );
          } else {
            throw new Error(
              i18n.t('pagePolicies.toast.errorOpenSSLFIPSDisabled'),
            );
          }
        });
    },
    async saveWebSessionTimeoutValue({ dispatch }, webSessionTimeoutValue) {
      const sessionValue = {
        SessionTimeout: webSessionTimeoutValue,
      };
      return await api
        .patch('/redfish/v1/SessionService', sessionValue)
        .then(() => dispatch('getSessionTimeout'))
        .then(() => {
          return i18n.t('pagePolicies.toast.successSessionTimeout');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pagePolicies.toast.errorSessionTimeout'));
        });
    },
    async saveComplexity({ commit }, complexityValue) {
      commit('setComplexity', complexityValue);
      const Oem = {
        Oem: {
          OpenBMC: {
            PasswordPolicyComplexity: complexityValue,
          },
        },
      };
      return await api
        .patch('/redfish/v1/AccountService', Oem)
        .then(() => {
          if (complexityValue) {
            return i18n.t('pagePolicies.toast.successComplexity');
          }
        })
        .catch((error) => {
          console.log(error);
          if (complexityValue) {
            throw new Error(i18n.t('pagePolicies.toast.errorComplexity'));
          }
        });
    },
    async savePasswordHistory({ commit }, passwordHistoryValue) {
      commit('setPasswordHistory', passwordHistoryValue);
      const Oem = {
        Oem: {
          OpenBMC: {
            RememberOldPasswordTimes: passwordHistoryValue,
          },
        },
      };
      return await api
        .patch('/redfish/v1/AccountService', Oem)
        .then(() => {
          if (passwordHistoryValue >= 0 && passwordHistoryValue <= 5) {
            return i18n.t('pagePolicies.toast.successPasswordHistory');
          }
        })
        .catch((error) => {
          console.log(error);
          if (passwordHistoryValue >= 0 && passwordHistoryValue <= 5) {
            throw new Error(i18n.t('pagePolicies.toast.errorPasswordHistory'));
          }
        });
    },
    async saveKVMSessionTimeout({ dispatch }, KVMSessionTimeout) {
      const Oem = {
        Oem: {
          Ami: {
            KVMSessionTimeout: KVMSessionTimeout,
          },
        },
      };
      return await api
        .patch('/redfish/v1/SessionService', Oem)
        .then(() => dispatch('getSessionTimeout'))
        .then(() => {
          return i18n.t('pagePolicies.toast.successKVMSessionTimeout');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pagePolicies.toast.errorKVMSessionTimeout'));
        });
    },
    async saveKVMPortValue({ dispatch }, kvmPortValue) {
      const Oem = {
        Oem: {
          Ami: {
            KVMPort: kvmPortValue,
          },
        },
      };
      return await api
        .patch('/redfish/v1/SessionService', Oem)
        .then(() => dispatch('getSessionTimeout'))
        .then(() => {
          return i18n.t('pagePolicies.toast.successKVMPort');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pagePolicies.toast.errorKVMPort'));
        });
    },
    async saveWebPortValue({ dispatch }, webPortValue) {
      const Oem = {
        Oem: {
          Ami: {
            BMCwebPort: webPortValue,
          },
        },
      };
      return await api
        .patch('/redfish/v1/SessionService', Oem)
        .then(() => dispatch('getSessionTimeout'))
        .then(() => {
          return i18n.t('pagePolicies.toast.successWebPort');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pagePolicies.toast.errorWebPort'));
        });
    },
    async getSolBitRateData({ commit }) {
      return await api
        .get(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/SerialInterfaces/IPMI-SOL',
        )
        .then((response) => {
          const bitRateValue = response.data.BitRate;
          commit('setSolBitRate', bitRateValue);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async saveSolBitRateValue({ commit }, BitRate) {
      commit('setSolBitRate', BitRate);
      return await api
        .patch(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/SerialInterfaces/IPMI-SOL',
          {
            BitRate: BitRate,
          },
        )
        .then(() => commit('setSolBitRate', BitRate))
        .then(() => i18n.t('pagePolicies.toast.successSolBitRate'))
        .catch(() => {
          throw new Error(i18n.t('pagePolicies.toast.errorSolBitRate'));
        });
    },
    async getVMReconnect({ commit }) {
      return await api
        .get(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/VirtualMedia',
        )
        .then((response) =>
          response.data.Members.map(
            (virtualMedia) => virtualMedia['@odata.id'],
          ),
        )
        .then((devices) => api.all(devices.map((device) => api.get(device))))
        .then((devices) => {
          devices.some((virtualMedia) => {
            if (virtualMedia.data.TransferProtocolType !== 'OEM') {
              const config = virtualMedia.data.Oem?.Ami || {};
              const vmValues = {
                RetryCount: config?.RetryCount || 3,
                RetryInterval: config?.RetryInterval || 15,
                vmReconnectUrl: config['@odata.id'],
              };
              commit('setVMReconnectValues', vmValues);
              return true; // stops further iteration
            }
            return false;
          });
        })
        .catch((error) => console.log(error));
    },
    async saveVMReconnectValue({ dispatch, state }, vmReconnectValue) {
      const payLoad = {
        Oem: {
          Ami: {
            RetryCount: parseInt(vmReconnectValue.vmCount),
            RetryInterval: parseInt(vmReconnectValue.vmInterval),
          },
        },
      };
      return await api
        .patch(state.vmReconnectData.vmReconnectUrl, payLoad)
        .then(() => dispatch('getVMReconnect'))
        .then(() => {
          return i18n.t('pagePolicies.toast.successVMReconnect');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pagePolicies.toast.errorVMReconnect'));
        });
    },
  },
};

export default PoliciesStore;
