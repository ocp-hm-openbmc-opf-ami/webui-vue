import api from '@/store/api';

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

const GlobalStore = {
  namespaced: true,
  state: {
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
    isAmdPlatform: false,
    userPrivilege: null,
    backupAndRestore: null,
    virtualMediaServiceEnabledAccess: true,
    kvmServiceEnabledAccess: true,
  },
  getters: {
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
    backupAndRestore: (state) => state.backupAndRestore,
    isAmdPlatform: (state) => state.isAmdPlatform,
    virtualMediaServiceEnabledAccess: (state) =>
      state.virtualMediaServiceEnabledAccess,
    kvmServiceEnabledAccess: (state) => state.kvmServiceEnabledAccess,
  },
  mutations: {
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
    setbackupAndRestore: (state, backupAndRestore) => {
      state.backupAndRestore = backupAndRestore;
    },
    setVirtualMediaServiceEnabledAccess: (
      state,
      virtualMediaServiceEnabledAccess,
    ) => {
      state.virtualMediaServiceEnabledAccess = virtualMediaServiceEnabledAccess;
    },
    setkvmServiceEnabledAccess: (state, kvmServiceEnabledAccess) => {
      state.kvmServiceEnabledAccess = kvmServiceEnabledAccess;
    },
    setIsAmdPlatform: (state, isAmdPlatform) => {
      state.isAmdPlatform = isAmdPlatform;
    },
  },
  actions: {
    async getBmcTime({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc')
        .then((response) => {
          const availableActions = response.data.Actions;

          const isBackupConfigAvailable =
            availableActions &&
            availableActions.Oem &&
            availableActions.Oem['#AMIManager.BackupConfig'] &&
            availableActions.Oem['#AMIManager.BackupConfig'][
              '@Redfish.ActionInfo'
            ];

          const isRestoreConfigAvailable =
            availableActions &&
            availableActions.Oem &&
            availableActions.Oem['#AMIManager.RestoreConfig'] &&
            availableActions.Oem['#AMIManager.RestoreConfig'][
              '@Redfish.ActionInfo'
            ];

          const areBothActionsAvailable =
            isBackupConfigAvailable !== undefined &&
            isRestoreConfigAvailable !== undefined;
          const bmcDateTime = response.data.DateTime;
          const date = new Date(bmcDateTime);
          const timeZone = response.data.DateTimeLocalOffset;
          commit('setBmcTime', date);
          commit('setBmcDateTime', bmcDateTime);
          commit('setTimeZone', timeZone);
          commit('setbackupAndRestore', areBothActionsAvailable);
        })
        .catch((error) => console.log(error));
    },
    getSystemInfo({ commit }) {
      api
        .get('/redfish/v1/Systems/system')
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
            commit(
              'setVirtualMediaServiceEnabledAccess',
              VirtualMediaConfig.ServiceEnabled,
            );
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

export default GlobalStore;
