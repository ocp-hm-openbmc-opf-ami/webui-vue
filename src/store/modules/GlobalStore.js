import api from '@/store/api';
import UtcDateTimeMixin from '@/components/Mixins/UtcDateTimeMixin';

const HOST_STATE = {
  on: 'xyz.openbmc_project.State.Host.HostState.Running',
  off: 'xyz.openbmc_project.State.Host.HostState.Off',
  error: 'xyz.openbmc_project.State.Host.HostState.Quiesced',
  diagnosticMode: 'xyz.openbmc_project.State.Host.HostState.DiagnosticMode',
};

const privilegesId = {
  admin: 'Administrator',
  operator: 'Operator',
  readOnly: 'ReadOnly',
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

const GlobalStore = {
  namespaced: true,
  state: {
    managerInstance: '',
    assetTag: null,
    bmcTime: null,
    bmcDateTime: null,
    timeZone: null,
    modelType: null,
    serialNumber: null,
    serverStatus: 'unreachable',
    languagePreference: localStorage.getItem('storedLanguage') || 'en-US',
    isUtcDisplay: localStorage.getItem('storedUtcDisplay')
      ? JSON.parse(localStorage.getItem('storedUtcDisplay'))
      : true,
    username: localStorage.getItem('storedUsername'),
    isAuthorized: true,
    userPrivilege: null,
    virtualMediaServiceEnabledAccess: true,
    virtualMediaServiceEnabledAccessHost2: true,
    kvmServiceEnabledAccess: true,
    sessionId: null, // Store Session_ID from login
  },
  getters: {
    managerInstance: (state) => state.managerInstance,
    assetTag: (state) => state.assetTag,
    modelType: (state) => state.modelType,
    serialNumber: (state) => state.serialNumber,
    serverStatus: (state) => state.serverStatus,
    bmcTime: (state) => state.bmcTime,
    bmcDateTime: (state) => state.bmcDateTime,
    timeZone: (state) => state.timeZone,
    languagePreference: (state) => state.languagePreference,
    isUtcDisplay: (state) => state.isUtcDisplay,
    username: (state) => state.username,
    isAuthorized: (state) => state.isAuthorized,
    userPrivilege: (state) => state.userPrivilege,
    virtualMediaServiceEnabledAccess: (state) =>
      state.virtualMediaServiceEnabledAccess,
    virtualMediaServiceEnabledAccessHost2: (state) =>
      state.virtualMediaServiceEnabledAccessHost2,
    kvmServiceEnabledAccess: (state) => state.kvmServiceEnabledAccess,
    sessionId: (state) => state.sessionId,
  },
  mutations: {
    setManagerInstance: (state, managerInstance) =>
      (state.managerInstance = managerInstance),
    setAssetTag: (state, assetTag) => (state.assetTag = assetTag),
    setModelType: (state, modelType) => (state.modelType = modelType),
    setSerialNumber: (state, serialNumber) =>
      (state.serialNumber = serialNumber),
    setBmcTime: (state, bmcTime) => (state.bmcTime = bmcTime),
    setBmcDateTime: (state, bmcDateTime) => (state.bmcDateTime = bmcDateTime),
    setTimeZone: (state, timeZone) => (state.timeZone = timeZone),
    setServerStatus: (state, serverState) =>
      (state.serverStatus = serverStateMapper(serverState)),
    setLanguagePreference: (state, language) =>
      (state.languagePreference = language),
    setUsername: (state, username) => (state.username = username),
    setUtcTime: (state, isUtcDisplay) => (state.isUtcDisplay = isUtcDisplay),
    setUnauthorized: (state) => {
      state.isAuthorized = false;
      window.setTimeout(() => {
        state.isAuthorized = true;
      }, 100);
    },
    setPrivilege: (state, privilege) => {
      state.userPrivilege = privilege;
    },
    setVirtualMediaServiceEnabledAccess: (
      state,
      virtualMediaServiceEnabledAccess,
    ) => {
      state.virtualMediaServiceEnabledAccess = virtualMediaServiceEnabledAccess;
    },
    setVirtualMediaServiceEnabledAccessHost2: (
      state,
      virtualMediaServiceEnabledAccessHost2,
    ) => {
      state.virtualMediaServiceEnabledAccessHost2 =
        virtualMediaServiceEnabledAccessHost2;
    },
    setkvmServiceEnabledAccess: (state, kvmServiceEnabledAccess) => {
      state.kvmServiceEnabledAccess = kvmServiceEnabledAccess;
    },
    setSessionId: (state, sessionId) => (state.sessionId = sessionId),
  },
  actions: {
    getManagerinstance({ commit, state }) {
      if (!state.managerInstance) {
        api
          .get('/redfish/v1/Managers')
          .then((response) => {
            const managerInstance = response.data.Members[0]['@odata.id']
              .split('/')
              .pop();
            console.log(managerInstance);
            commit('setManagerInstance', managerInstance);
          })
          .catch((error) => {
            console.log(error);
            commit('setManagerInstance', '');
          });
      }
    },
    async getBmcTime({ commit, state }) {
      return await api
        .get('/redfish/v1/Managers/' + state.managerInstance)
        .then((response) => {
          const timeZone = response.data.TimeZoneName;
          var bmcDateTime = response.data.DateTime;
          const date =
            UtcDateTimeMixin.methods.createDateWithISOString(bmcDateTime);

          commit('setBmcTime', date);
          commit('setTimeZone', timeZone);
        })
        .catch((error) => console.log(error));
    },
    async getSystemInfo({ commit }, dualKvmEnabeled) {
      const dualKvmUrl = dualKvmEnabeled
        ? dualKvmEnabeled
        : '/redfish/v1/Systems/system';
      const isHost2 = dualKvmUrl === '/redfish/v1/Systems/system1';
      return await api
        .get(dualKvmUrl)
        .then(
          ({
            data: {
              AssetTag,
              Model,
              PowerState,
              SerialNumber,
              VirtualMediaConfig,
              GraphicalConsole,
              Status: { State } = {},
            },
          } = {}) => {
            commit('setAssetTag', AssetTag);
            commit('setSerialNumber', SerialNumber);
            commit('setModelType', Model);
            if (isHost2) {
              commit(
                'setVirtualMediaServiceEnabledAccessHost2',
                VirtualMediaConfig.ServiceEnabled,
              );
            } else {
              commit(
                'setVirtualMediaServiceEnabledAccess',
                VirtualMediaConfig.ServiceEnabled,
              );
            }
            commit(
              'setkvmServiceEnabledAccess',
              GraphicalConsole.ServiceEnabled,
            );
            if (State === 'Quiesced' || State === 'InTest') {
              // OpenBMC's host state interface is mapped to 2 Redfish
              // properties "Status""State" and "PowerState". Look first
              // at State for certain cases.
              commit('setServerStatus', State);
            } else {
              commit('setServerStatus', PowerState);
            }
          },
        )
        .catch((error) => console.log(error));
    },
  },
};
export { GlobalStore, serverStateMapper, privilegesId };

export default GlobalStore;
