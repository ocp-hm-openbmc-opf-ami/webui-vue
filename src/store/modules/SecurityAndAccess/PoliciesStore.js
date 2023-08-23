import api from '@/store/api';
import i18n from '@/i18n';

const PoliciesStore = {
  namespaced: true,
  state: {
    sshProtocolEnabled: false,
    ipmiProtocolEnabled: false,
    kvmServiceEnabled: false,
    virtualMediaServiceEnabled: false,
    solSshServiceEnabled: false,
    solSshPortValue: null,
    rtadEnabled: 'Disabled',
    vtpmEnabled: 'Disabled',
    sessionTimeoutValue: null,
    kvmEnabled: true,
    vmcEnabled: true,
    solEnabled: true,
    complexity: '',
    passwordHistory: null,
  },
  getters: {
    sshProtocolEnabled: (state) => state.sshProtocolEnabled,
    ipmiProtocolEnabled: (state) => state.ipmiProtocolEnabled,
    solSshPortValue: (state) => state.solSshPortValue,
    rtadEnabled: (state) => state.rtadEnabled,
    vtpmEnabled: (state) => state.vtpmEnabled,
    getSessionTimeoutValue: (state) => state.sessionTimeoutValue,
    kvmEnabled: (state) => state.kvmEnabled,
    vmcEnabled: (state) => state.vmcEnabled,
    solEnabled: (state) => state.solEnabled,
    solSshServiceEnabled: (state) => state.solSshServiceEnabled,
    kvmServiceEnabled: (state) => state.kvmServiceEnabled,
    virtualMediaServiceEnabled: (state) => state.virtualMediaServiceEnabled,
    complexity: (state) => state.complexity,
    passwordHistory: (state) => state.passwordHistory,
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
  },
  actions: {
    setSolSshPortUpdatedValue({ commit }, solSshProtocolPort) {
      commit('setSolSshPort', solSshProtocolPort);
    },
    async getNetworkProtocolStatus({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/NetworkProtocol')
        .then((response) => {
          const sshProtocol = response.data.SSH.ProtocolEnabled;
          const ipmiProtocol = response.data.IPMI.ProtocolEnabled;
          commit('setSshProtocolEnabled', sshProtocol);
          commit('setIpmiProtocolEnabled', ipmiProtocol);
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
    async getKvmServiceStatus({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system')
        .then((response) => {
          const kvmServiceEnabled =
            response.data.GraphicalConsole.ServiceEnabled;
          const virtualMediaServiceEnabled =
            response.data.VirtualMediaConfig.ServiceEnabled;
          const solSshServiceEnabled =
            response.data.SerialConsole.SSH.ServiceEnabled;
          const solSshPortValue = response.data.SerialConsole.SSH.Port;
          commit('setKvmServiceEnabled', kvmServiceEnabled);
          commit('setVirtualMediaServiceEnabled', virtualMediaServiceEnabled);
          commit('setSolSshServiceEnabled', solSshServiceEnabled);
          commit('setSolSshPort', solSshPortValue);
        })
        .catch((error) => console.log(error));
    },
    async getSessionTimeout({ commit }) {
      return await api
        .get('/redfish/v1/SessionService')
        .then((response) => {
          const sessionTimeoutValue = response.data.SessionTimeout;
          commit('setSessionTimeoutValue', sessionTimeoutValue);
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
    async saveIpmiProtocolState({ commit }, protocolEnabled) {
      commit('setIpmiProtocolEnabled', protocolEnabled);
      const ipmi = {
        IPMI: {
          ProtocolEnabled: protocolEnabled,
        },
      };
      return await api
        .patch('/redfish/v1/Managers/bmc/NetworkProtocol', ipmi)
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
        .patch('/redfish/v1/Managers/bmc/NetworkProtocol', ssh)
        .then(() => {
          if (protocolEnabled) {
            return i18n.t('pagePolicies.toast.successSshEnabled');
          } else {
            return i18n.t('pagePolicies.toast.successSshDisabled');
          }
        })
        .catch((error) => {
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
          } else {
            throw new Error(i18n.t('pagePolicies.toast.errorSOLDisabled'));
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
    async saveSessionTimeoutValue({ dispatch }, sessionTimeoutNewValue) {
      const sessionValue = {
        SessionTimeout: sessionTimeoutNewValue,
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
        if (passwordHistoryValue) {
          return i18n.t('pagePolicies.toast.successPasswordHistory');
        }
      })
      .catch((error) => {
        console.log(error);
        if (passwordHistoryValue) {
          throw new Error(i18n.t('pagePolicies.toast.errorPasswordHistory'));
        }
      });
  },
};

export default PoliciesStore;
