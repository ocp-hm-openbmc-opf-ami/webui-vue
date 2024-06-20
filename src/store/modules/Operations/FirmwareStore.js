import api from '@/store/api';
import i18n from '@/i18n';

const FirmwareStore = {
  namespaced: true,
  state: {
    bmcFirmware: [],
    hostFirmware: [],
    bmcActiveFirmwareId: null,
    hostActiveFirmwareId: null,
    applyTime: null,
    httpPushUri: null,
    tftpAvailable: false,
    clearConfig: false,
    bmcBackupEnabled: false,
    bmcActiveEnabled: true,
    backupHttpBusyStatus: false,
    backupHttpPushUriTargetsValue: [],
  },
  getters: {
    isTftpUploadAvailable: (state) => state.tftpAvailable,
    isSingleFileUploadEnabled: (state) => state.hostFirmware.length === 0,
    clearConfigState: (state) => state.clearConfig,
    activeBmcFirmware: (state) => {
      return state.bmcFirmware.find(
        (firmware) => firmware.id === state.bmcActiveFirmwareId,
      );
    },
    activeHostFirmware: (state) => {
      return state.hostFirmware.find(
        (firmware) => firmware.id === state.hostActiveFirmwareId,
      );
    },
    backupBmcFirmware: (state) => {
      return state.bmcFirmware.find((firmware) => firmware.id === 'bmc_bkup');
    },
    backupHostFirmware: (state) => {
      return state.hostFirmware.find(
        (firmware) => firmware.id !== state.hostActiveFirmwareId,
      );
    },
    bmcBackupEnabledStatus: (state) => state.bmcBackupEnabled,
    bmcActiveEnabledStatus: (state) => state.bmcActiveEnabled,
    httpBusyStatus: (state) => state.backupHttpBusyStatus,
    httpPushUriTargetsValue: (state) => state.backupHttpPushUriTargetsValue,
  },
  mutations: {
    setActiveBmcFirmwareId: (state, id) => (state.bmcActiveFirmwareId = id),
    setActiveHostFirmwareId: (state, id) => (state.hostActiveFirmwareId = id),
    setBmcFirmware: (state, firmware) => (state.bmcFirmware = firmware),
    setHostFirmware: (state, firmware) => (state.hostFirmware = firmware),
    setApplyTime: (state, applyTime) => (state.applyTime = applyTime),
    setHttpPushUri: (state, httpPushUri) => (state.httpPushUri = httpPushUri),
    setTftpUploadAvailable: (state, tftpAvailable) =>
      (state.tftpAvailable = tftpAvailable),
    setClearConfigState: (state, clearConfig) =>
      (state.clearConfig = clearConfig),
    setBmcBackupEnabled: (state, bmcBackupEnabled) =>
      (state.bmcBackupEnabled = bmcBackupEnabled),
    setActiveEnabled: (state, bmcActiveEnabled) =>
      (state.bmcActiveEnabled = bmcActiveEnabled),
    setHttpPushUriTargetsBusyStatus: (state, backupHttpBusyStatus) =>
      (state.backupHttpBusyStatus = backupHttpBusyStatus),
    setHttpPushUriTargetsValue: (state, backupHttpPushUriTargetsValue) =>
      (state.backupHttpPushUriTargetsValue = backupHttpPushUriTargetsValue),
  },
  actions: {
    async getFirmwareInformation({ dispatch }) {
      dispatch('getActiveHostFirmware');
      dispatch('getActiveBmcFirmware');
      return await dispatch('getFirmwareInventory');
    },
    getActiveBmcFirmware({ commit }) {
      return api
        .get('/redfish/v1/Managers/bmc')
        .then(({ data: { Links } }) => {
          const id = Links?.ActiveSoftwareImage['@odata.id'].split('/').pop();
          commit('setActiveBmcFirmwareId', id);
        })
        .catch((error) => console.log(error));
    },
    getActiveHostFirmware({ commit }) {
      return api
        .get('/redfish/v1/Systems/system/Bios')
        .then(({ data: { Links } }) => {
          const id = Links?.ActiveSoftwareImage['@odata.id'].split('/').pop();
          commit('setActiveHostFirmwareId', id);
        })
        .catch((error) => console.log(error));
    },
    async getFirmwareInventory({ commit }) {
      const inventoryList = await api
        .get('/redfish/v1/UpdateService/FirmwareInventory')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((item) => api.get(item['@odata.id'])),
        )
        .catch((error) => console.log(error));
      let bmcBackupEnabled = false;
      await api
        .all(inventoryList)
        .then((response) => {
          const bmcFirmware = [];
          const hostFirmware = [];
          response.forEach(({ data }) => {
            const firmwareType = data?.RelatedItem?.[0]?.['@odata.id']
              .split('/')
              .pop();
            const item = {
              version: data?.Version,
              id: data?.Id,
              location: data?.['@odata.id'],
              status: data?.Status?.Health,
            };
            // Check if bmc_bkup is available
            if (
              data?.['@odata.id'] ===
              '/redfish/v1/UpdateService/FirmwareInventory/bmc_bkup'
            ) {
              bmcBackupEnabled = true;
            }
            commit('setBmcBackupEnabled', bmcBackupEnabled);
            if (firmwareType === 'bmc') {
              bmcFirmware.push(item);
            } else if (firmwareType === 'Bios') {
              hostFirmware.push(item);
            }
          });
          commit('setBmcFirmware', bmcFirmware);
          commit('setHostFirmware', hostFirmware);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUpdateServiceSettings({ commit }) {
      return await api
        .get('/redfish/v1/UpdateService')
        .then(({ data }) => {
          const applyTime =
            data.HttpPushUriOptions.HttpPushUriApplyTime.ApplyTime;
          const allowableActions =
            data?.Actions?.['#UpdateService.SimpleUpdate']?.[
              'TransferProtocol@Redfish.AllowableValues'
            ];
          commit('setApplyTime', applyTime);
          commit('setClearConfigState', data.Oem.ApplyOptions.ClearConfig);
          const httpPushUri = data.HttpPushUri;
          commit('setHttpPushUri', httpPushUri);
          if (allowableActions?.includes('TFTP')) {
            commit('setTftpUploadAvailable', true);
          }
          let activeEnabledValue = true;
          if (
            data?.HttpPushUriTargets?.includes('bmc_active') ||
            data?.HttpPushUriTargets.length <= 0
          ) {
            activeEnabledValue = false;
          }
          commit('setActiveEnabled', activeEnabledValue);
          commit(
            'setHttpPushUriTargetsBusyStatus',
            data?.HttpPushUriTargetsBusy,
          );
          commit('setHttpPushUriTargetsValue', data?.HttpPushUriTargets);
        })
        .catch((error) => console.log(error));
    },
    setApplyTimeImmediate({ commit }) {
      const data = {
        HttpPushUriOptions: {
          HttpPushUriApplyTime: {
            ApplyTime: 'Immediate',
          },
        },
      };
      return api
        .patch('/redfish/v1/UpdateService', data)
        .then(() => commit('setApplyTime', 'Immediate'))
        .catch((error) => console.log(error));
    },
    async uploadFirmware({ state, dispatch }, image) {
      if (state.applyTime !== 'Immediate') {
        // ApplyTime must be set to Immediate before making
        // request to update firmware
        await dispatch('setApplyTimeImmediate');
      }
      return await api
        .post(state.httpPushUri, image, {
          headers: { 'Content-Type': 'application/octet-stream' },
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageFirmware.toast.errorUpdateFirmware'));
        });
    },
    async uploadFirmwareTFTP({ state, dispatch }, fileAddress) {
      const data = {
        TransferProtocol: 'TFTP',
        ImageURI: fileAddress,
      };
      if (state.applyTime !== 'Immediate') {
        // ApplyTime must be set to Immediate before making
        // request to update firmware
        await dispatch('setApplyTimeImmediate');
      }
      return await api
        .post(
          '/redfish/v1/UpdateService/Actions/UpdateService.SimpleUpdate',
          data,
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageFirmware.toast.errorUpdateFirmware'));
        });
    },
    async switchBmcFirmwareAndReboot({ getters }) {
      const backupLocation = getters.backupBmcFirmware.location;
      const data = {
        Links: {
          ActiveSoftwareImage: {
            '@odata.id': backupLocation,
          },
        },
      };
      return await api
        .patch('/redfish/v1/Managers/bmc', data)
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageFirmware.toast.errorSwitchImages'));
        });
    },
    async checkStatus(_, uri) {
      return await api.get(uri).then((response) => {
        return response.data;
      });
    },
    async setFirmwarUpdateActive(_, data) {
      let activeValue = {
        HttpPushUriTargets: data,
        HttpPushUriTargetsBusy: true,
      };
      return await api
        .patch('/redfish/v1/UpdateService', activeValue)
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageFirmware.toast.errorSwitchImages'));
        });
    },
    async saveClearConfig({ commit }, clearStatus) {
      commit('setClearConfigState', clearStatus);
      const clearConfigStatus = {
        Oem: {
          ApplyOptions: {
            ClearConfig: clearStatus,
          },
        },
      };
      return await api
        .patch('/redfish/v1/UpdateService', clearConfigStatus)
        .then(() => {
          if (clearStatus) {
            return i18n.t('pageFirmware.toast.successEnabledClearConfig');
          } else {
            return i18n.t('pageFirmware.toast.successDisabledClearConfig');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setClearConfigState', !clearStatus);
          if (clearStatus) {
            throw new Error(
              i18n.t('pageFirmware.toast.errorEnabledClearConfig'),
            );
          } else {
            throw new Error(
              i18n.t('pageFirmware.toast.errorDisabledClearConfig'),
            );
          }
        });
    },
  },
};

export default FirmwareStore;
