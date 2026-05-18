import api from '@/store/api';
import i18n from '@/i18n';
import UtcDateTimeMixin from '@/components/Mixins/UtcDateTimeMixin';
import { isFeatureEnabled } from '@/components/Mixins/FeatureMixin';

/**
 * Watch for serverStatus changes in GlobalStore module
 * to set isOperationInProgress state
 * Stop watching status changes and resolve Promise when
 * serverStatus value matches passed argument or after 5 minutes
 * @param {string} serverStatus
 * @returns {Promise}
 */
const HOST_STATE = {
  on: 'xyz.openbmc_project.State.Host.HostState.Running',
  off: 'xyz.openbmc_project.State.Host.HostState.Off',
  error: 'xyz.openbmc_project.State.Host.HostState.Quiesced',
  diagnosticMode: 'xyz.openbmc_project.State.Host.HostState.DiagnosticMode',
};
const serverStateMapper = (hostState) => {
  switch (hostState) {
    case HOST_STATE.on:
    case 'On': // Redfish PowerState
      return 'on';
    case HOST_STATE.off:
    case 'Off': // Redfish PowerState
      return 'off';
    case HOST_STATE.error:
    case 'Quiesced': // Redfish Status
      return 'error';
    case HOST_STATE.diagnosticMode:
    case 'InTest': // Redfish Status
      return 'diagnosticMode';
    default:
      return 'unreachable';
  }
};
const checkForServerStatus = function (serverStatus, isKvm1) {
  /* If power action is done from KVM console
   * means timeout value reduced 10 seconds for
   * updating the server status
   */
  const timeoutValue = isKvm1 === 'kvm' ? 10000 : 8000;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve();
      unwatch();
    }, timeoutValue);
    const unwatch = this.watch(
      (state) => state.global.serverStatus,
      (value) => {
        if (value === serverStatus) {
          resolve();
          unwatch();
          clearTimeout(timer);
        }
      },
    );
  });
};

const kvm1ControlStore = {
  namespaced: true,
  state: {
    serverStatus: 'unreachable',
    isOperationInProgress: false,
    lastPowerOperationTime: null,
    lastBmcRebootTime: null,
  },
  getters: {
    isOperationInProgress: (state) => state.isOperationInProgress,
    lastPowerOperationTime: (state) => state.lastPowerOperationTime,
    lastBmcRebootTime: (state) => state.lastBmcRebootTime,
    serverStatus: (state) => state.serverStatus,
  },
  mutations: {
    setOperationInProgress: (state, inProgress) =>
      (state.isOperationInProgress = inProgress),
    setLastPowerOperationTime: (state, lastPowerOperationTime) =>
      (state.lastPowerOperationTime = lastPowerOperationTime),
    setLastBmcRebootTime: (state, lastBmcRebootTime) =>
      (state.lastBmcRebootTime = lastBmcRebootTime),
    setServerStatus: (state, serverState) =>
      (state.serverStatus = serverStateMapper(serverState)),
  },
  actions: {
    async getLastPowerOperationTime({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system1')
        .then((response) => {
          commit('setOperationInProgress', false);
          const lastReset = response.data.LastResetTime;
          if (lastReset) {
            const lastPowerOperationTime =
              UtcDateTimeMixin.methods.createDateWithISOString(lastReset);
            commit('setLastPowerOperationTime', lastPowerOperationTime);
          }
          if (
            response.data.Status.State === 'Quiesced' ||
            response.data.Status.State === 'InTest'
          ) {
            commit('setServerStatus', response.data.Status.State);
          } else {
            commit('setServerStatus', response.data.PowerState);
          }
        })
        .catch((error) => console.log(error));
    },
    getLastBmcRebootTime({ commit }) {
      return api
        .get('/redfish/v1/Managers/bmc')
        .then((response) => {
          const lastBmcReset = response.data.LastResetTime;
          const lastBmcRebootTime =
            UtcDateTimeMixin.methods.createDateWithISOString(lastBmcReset);
          commit('setLastBmcRebootTime', lastBmcRebootTime);
        })
        .catch((error) => console.log(error));
    },
    async rebootBmc() {
      const data = { ResetType: 'GracefulRestart' };
      return await api
        .post('/redfish/v1/Managers/bmc/Actions/Manager.Reset', data)
        .then(() => {
          return !isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
            ? i18n.t('pageRebootBmc1.toast.successRebootStart')
            : i18n.t('pageRebootBmc.toastPmc.successRebootStart');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            !isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
              ? i18n.t('pageRebootBmc1.toast.errorRebootStart')
              : i18n.t('pageRebootBmc.toastPmc.errorRebootStart'),
          );
        });
    },
    async serverPowerOn({ dispatch, commit }, isKvm1) {
      const data = { ResetType: 'On' };
      return dispatch('serverPowerChange', data)
        .then(async () => {
          await checkForServerStatus.bind(this, 'on', isKvm1)();
          commit('setOperationInProgress', false);
          dispatch('getLastPowerOperationTime');
          return i18n.t('pageKvm.toast.success');
        })
        .catch((error) => {
          console.error(error);
          throw new Error(i18n.t('pageKvm.toast.error'));
        });
    },
    async serverSoftReboot({ dispatch, commit }, isKvm1) {
      const data = { ResetType: 'GracefulRestart' };
      return dispatch('serverPowerChange', data)
        .then(async () => {
          await checkForServerStatus.bind(this, 'on', isKvm1)();
          commit('setOperationInProgress', false);
          dispatch('getLastPowerOperationTime');
          return i18n.t('pageKvm.toast.success');
        })
        .catch((error) => {
          console.error(error);
          throw new Error(i18n.t('pageKvm.toast.error'));
        });
    },
    async serverHardReboot({ dispatch, commit }, isKvm1) {
      const data = { ResetType: 'ForceRestart' };
      return dispatch('serverPowerChange', data)
        .then(async () => {
          await checkForServerStatus.bind(this, 'on', isKvm1)();
          commit('setOperationInProgress', false);
          dispatch('getLastPowerOperationTime');
          return i18n.t('pageKvm.toast.success');
        })
        .catch((error) => {
          console.error(error);
          throw new Error(i18n.t('pageKvm.toast.error'));
        });
    },
    async serverSoftPowerOff({ dispatch, commit }, isKvm1) {
      const data = { ResetType: 'GracefulShutdown' };
      return dispatch('serverPowerChange', data)
        .then(async () => {
          await checkForServerStatus.bind(this, 'off', isKvm1)();
          commit('setOperationInProgress', false);
          dispatch('getLastPowerOperationTime');
          return i18n.t('pageKvm.toast.success');
        })
        .catch((error) => {
          console.error(error);
          throw new Error(i18n.t('pageKvm.toast.error'));
        });
    },
    async serverHardPowerOff({ dispatch, commit }, isKvm1) {
      const data = { ResetType: 'ForceOff' };
      return dispatch('serverPowerChange', data)
        .then(async () => {
          await checkForServerStatus.bind(this, 'off', isKvm1)();
          commit('setOperationInProgress', false);
          dispatch('getLastPowerOperationTime');
          return i18n.t('pageKvm.toast.success');
        })
        .catch((error) => {
          console.error(error);
          throw new Error(i18n.t('pageKvm.toast.error'));
        });
    },
    async serverPowerChange({ commit }, data) {
      commit('setOperationInProgress', true);
      return await api
        .post('/redfish/v1/Systems/system1/Actions/ComputerSystem.Reset', data)
        .catch((error) => {
          console.log(error);
          commit('setOperationInProgress', false);
          throw error;
        });
    },
  },
};

export default kvm1ControlStore;
