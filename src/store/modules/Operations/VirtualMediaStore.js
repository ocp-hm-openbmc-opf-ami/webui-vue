import api from '@/store/api';
import i18n from '@/i18n';

const transferProtocolType = {
  CIFS: 'CIFS',
  FTP: 'FTP',
  SFTP: 'SFTP',
  HTTP: 'HTTP',
  HTTPS: 'HTTPS',
  NFS: 'NFS',
  SCP: 'SCP',
  TFTP: 'TFTP',
  OEM: 'OEM',
};

const parseVirtualMediaUrl = (image, backupImageURL) => {
  let url = image;
  if (!url || url.trim() === '') {
    url = backupImageURL;
  }
  if (!url || url.trim() === '') {
    return {
      serverUri: '',
      imagePath: '',
      transferProtocolType: '',
    };
  }

  let protocol = '';
  let serverUri = '';
  let imagePath = '';

  if (url.startsWith('smb://')) {
    protocol = 'CIFS';
    const withoutProto = url.substring(6);
    if (withoutProto.includes(':/')) {
      const parts = withoutProto.split(':/');
      serverUri = parts[0];
      imagePath = '/' + parts.slice(1).join('/');
    } else {
      const parts = withoutProto.split('/');
      serverUri = parts[0];
      imagePath = '/' + parts.slice(1).join('/');
    }
  } else if (url.startsWith('https://')) {
    protocol = 'HTTPS';
    const withoutProto = url.substring(8);
    const parts = withoutProto.split(':/');
    serverUri = parts[0];
    imagePath = '/' + parts.slice(1).join('/');
  } else if (url.startsWith('nfs://')) {
    protocol = 'NFS';
    const withoutProto = url.substring(6);
    const parts = withoutProto.split(':/');
    serverUri = parts[0];
    imagePath = '/' + parts.slice(1).join('/');
  }

  return {
    serverUri: serverUri,
    imagePath: imagePath,
    transferProtocolType: protocol,
  };
};

const VirtualMediaStore = {
  namespaced: true,
  state: {
    proxyDevices: [],
    legacyDevices: [],
    connections: [],
    vmStarted: 0,
    slot0Started: false,
    slot1Started: false,
    slot0Nbd: null,
    slot1Nbd: null,
    legacyStarted: 0,
    virtualMediaAccess: true,
    virtualMediaPolicies: false,
    mediaAlreadyRedirected: [],
    slotArray: [],
    slot0File: null,
    slot1File: null,
    emmcMemoryData: null,
    localMediaList: [],
    localMediaUploadInProgress: false,
  },
  getters: {
    proxyDevices: (state) => state.proxyDevices,
    legacyDevices: (state) => state.legacyDevices,
    vmStarted: (state) => state.vmStarted,
    slot0Started: (state) => state.slot0Started,
    slot1Started: (state) => state.slot1Started,
    legacyStarted: (state) => state.legacyStarted,
    virtualMediaAccess: (state) => state.virtualMediaAccess,
    mediaAlreadyRedirected: (state) => state.mediaAlreadyRedirected,
    slotData: (state) => {
      const filtered = state.slotArray.filter(
        (slot) => slot.id === 'Slot_2' || slot.id === 'Slot_3',
      );
      return filtered;
    },
    slot0File: (state) => state.slot0File,
    slot1File: (state) => state.slot1File,
    localMediaUploadInProgress: (state) => state.localMediaUploadInProgress,
  },
  mutations: {
    setProxyDevicesData: (state, deviceData) =>
      (state.proxyDevices = deviceData),
    setLegacyDevicesData: (state, deviceData) =>
      (state.legacyDevices = deviceData),
    setVirtualMediaAccess: (state, keyState) =>
      (state.virtualMediaAccess = keyState),
    setVirtualMediaPolicies: (state, keyState) =>
      (state.virtualMediaPolicies = keyState),
    setMediaAlreadyRedirected: (state, slot) =>
      (state.mediaAlreadyRedirected = slot),
    setSlot0Started: (state, start) => (state.slot0Started = start),
    setSlot1Started: (state, start) => (state.slot1Started = start),
    setSlotData(state, { slotId, slotData }) {
      const slotIndex = state.slotArray.findIndex((slot) => slot.id === slotId);
      if (slotIndex !== -1) {
        state.slotArray.splice(slotIndex, 1, { id: slotId, data: slotData });
      } else {
        if (slotId === 'Slot_2' || slotId === 'Slot_3') {
          state.slotArray.push({ id: slotId, data: slotData });
        }
      }
    },
    setSlot0File: (state, file) => (state.slot0File = file),
    setSlot1File: (state, file) => (state.slot1File = file),
    setEmmcMemoryData: (state, data) => (state.emmcMemoryData = data),
    setLocalMediaList: (state, data) => (state.localMediaList = data),
    setLocalMediaUploadInProgress: (state, inProgress) =>
      (state.localMediaUploadInProgress = inProgress),
  },
  actions: {
    async getData({ commit, state }) {
      const virtualMediaListEnabled =
        process.env.VUE_APP_VIRTUAL_MEDIA_LIST_ENABLED === 'true'
          ? true
          : false;
      if (!virtualMediaListEnabled) {
        const device = {
          id: i18n.t('pageVirtualMedia.defaultDeviceName'),
          websocket: '/vm/0/0',
          file: null,
          transferProtocolType: transferProtocolType.OEM,
          isActive: false,
        };
        commit('setProxyDevicesData', [device]);
        return;
      }
      commit('setMediaAlreadyRedirected', []);
      return await api
        .get('/redfish/v1/Systems/system/VirtualMedia')
        .then((response) =>
          response.data.Members.map(
            (virtualMedia) => virtualMedia['@odata.id'],
          ),
        )
        .then((devices) => api.all(devices.map((device) => api.get(device))))
        .then((devices) => {
          var slot = [];
          const deviceData = devices.map((device) => {
            const isActive = device.data?.Inserted === true ? true : false;
            if (
              device.data.Id == 'Slot_0' &&
              device.data?.Inserted &&
              !state.slot0Nbd
            ) {
              slot.push(device.data.Id);
            } else if (
              device.data.Id == 'Slot_1' &&
              device.data?.Inserted &&
              !state.slot1Nbd
            ) {
              slot.push(device.data.Id);
            }
            return {
              id: device.data?.Id,
              transferProtocolType: device.data?.TransferProtocolType,
              websocket: device.data?.Oem?.OpenBMC?.WebSocketEndpoint,
              isActive: isActive,
              data: device.data,
            };
          });
          commit('setMediaAlreadyRedirected', slot);
          const proxyDevices = deviceData
            .filter(
              (d) =>
                d.transferProtocolType === transferProtocolType.OEM &&
                (d.id === 'Slot_0' || d.id === 'Slot_1'),
            )
            .map((device) => {
              let file = null;
              if (device.id === 'Slot_0' && state.slot0File) {
                file = state.slot0File;
              } else if (device.id === 'Slot_1' && state.slot1File) {
                file = state.slot1File;
              }

              return {
                ...device,
                file: file,
                nbd:
                  device.id == 'Slot_0' && state.slot0Nbd
                    ? state.slot0Nbd
                    : device.id == 'Slot_1' && state.slot1Nbd
                      ? state.slot1Nbd
                      : null,
              };
            });
          const legacyDevices = deviceData
            .filter(
              (d) =>
                d.transferProtocolType !== transferProtocolType.OEM &&
                d.id !== 'Slot_0' &&
                d.id !== 'Slot_1',
            )
            .map((device) => {
              // Check if there's saved slot data for this device
              const savedSlot = state.slotArray.find(
                (slot) => slot.id === device.id,
              );
              if (savedSlot && savedSlot.data) {
                // Use saved slot data
                return {
                  ...device,
                  serverUri: savedSlot.data.serverUri,
                  imagePath: savedSlot.data.imagePath,
                  username: savedSlot.data.username,
                  password: savedSlot.data.password,
                  isRW: savedSlot.data.isRW,
                  transferProtocolType: savedSlot.data.transferProtocolType,
                  image: device.data?.Image,
                  backupImageURL: device.data?.Oem?.Ami?.BackupImageURL,
                };
              } else {
                // Parse from URLs
                const parsed = parseVirtualMediaUrl(
                  device.data?.Image,
                  device.data?.Oem?.Ami?.BackupImageURL,
                );
                return {
                  ...device,
                  serverUri: parsed.serverUri,
                  imagePath: parsed.imagePath,
                  username: '',
                  password: '',
                  isRW: false,
                  transferProtocolType: parsed.transferProtocolType,
                  image: device.data?.Image,
                  backupImageURL: device.data?.Oem?.Ami?.BackupImageURL,
                };
              }
            });
          commit('setProxyDevicesData', [...proxyDevices].reverse());
          commit('setLegacyDevicesData', [...legacyDevices].reverse());
          commit('setVirtualMediaAccess', true);
          commit('setVirtualMediaPolicies', false);
        })
        .catch((error) => {
          console.log('Virtual Media:', error);
          if (error.response.status == 404) {
            throw new Error(i18n.t('pageVirtualMedia.toast.errorVirtualMedia'));
          } else if (error.response.status != 500) {
            commit('setVirtualMediaAccess', false);
          } else {
            commit('setVirtualMediaAccess', true);
            throw new Error(i18n.t('pageVirtualMedia.toast.errorVirtualMedia'));
          }
        });
    },
    async mountImage(_, { id, data }) {
      return await api
        .post(
          `/redfish/v1/Systems/system/VirtualMedia/${id}/Actions/VirtualMedia.InsertMedia`,
          data,
        )
        .catch((error) => {
          console.log('Mount image:', error);
          if (
            error.response.status == 400 &&
            error.response.data.error.code.includes('ResourceAlreadyExists')
          ) {
            throw new Error(
              i18n.t('pageVirtualMedia.toast.errorResourceInUse', {
                Slot: id,
              }),
            );
          } else if (
            error.response.status == 400 &&
            error.response.data.error.code.includes('invalidImageSize')
          ) {
            throw new Error(
              i18n.t(
                'pageVirtualMedia.toast.virtualMediaErrorFileMountImageTooSmall',
              ),
            );
          } else {
            throw new Error(i18n.t('pageVirtualMedia.toast.errorMounting'));
          }
        });
    },
    async unmountImage(_, id) {
      return await api
        .post(
          `/redfish/v1/Systems/system/VirtualMedia/${id}/Actions/VirtualMedia.EjectMedia`,
        )
        .catch((error) => {
          console.log('Unmount image:', error);
          throw new Error();
        });
    },

    async getEmmcMemoryData({ commit }) {
      try {
        const response = await api.get('/redfish/v1/Systems/system');
        if (!response.data) {
          throw new Error(i18n.t('pageVirtualMedia.toast.apiCallFailed'));
        }
        let localMediaPath = response.data?.Oem?.Ami?.LocalMedia;
        let memoryData = localMediaPath?.Memory;
        let redirectionImage = localMediaPath?.RedirectionImage;

        if (!memoryData) {
          memoryData = response.data?.LocalMedia?.Memory;
        }
        if (!memoryData) {
          throw new Error(i18n.t('pageVirtualMedia.toast.memoryDataNotFound'));
        }
        commit('setEmmcMemoryData', memoryData);
        return {
          Memory: memoryData,
          RedirectionImage: redirectionImage || '',
        };
      } catch (error) {
        console.error('Error fetching memory data:', error);
        throw error;
      }
    },

    async getLocalMediaList({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/Oem/Ami/LocalMedia')
        .then((response) => {
          commit('setLocalMediaList', response.data);
          return response.data;
        });
    },

    async uploadLocalMedia({ commit }, { file }) {
      commit('setLocalMediaUploadInProgress', true);
      try {
        return await api.post(
          '/redfish/v1/Systems/system/Actions/Oem/AmiVirtualMedia.LocalMediaUpload',
          file,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/octet-stream',
              'X-File-Name': file.name,
            },
            transformRequest: [(data) => data],
          },
        );
      } catch (error) {
        console.log('Upload local media:', error);
        throw new Error(i18n.t('pageVirtualMedia.eMMC.uploadError'));
      } finally {
        commit('setLocalMediaUploadInProgress', false);
      }
    },

    async startLocalMediaRedirect(
      { dispatch },
      { localMedia, writeProtected },
    ) {
      return await api
        .post(
          '/redfish/v1/Systems/system/Actions/Oem/AmiVirtualMedia.LocalMediaRedirect',
          {
            LocalMedia: localMedia,
            WriteProtected: writeProtected,
          },
        )
        .then(async () => {
          await dispatch('getData');
          await dispatch('getLocalMediaList');
        })
        .catch((error) => {
          console.log('Start local media redirect:', error);
          throw new Error(
            i18n.t('pageVirtualMedia.eMMC.errorStartingRedirection'),
          );
        });
    },

    async stopLocalMediaRedirect({ dispatch }) {
      return await api
        .post(
          '/redfish/v1/Systems/system/Actions/Oem/AmiVirtualMedia.LocalMediaStopRedirect',
        )
        .then(async () => {
          await dispatch('getData');
          await dispatch('getLocalMediaList');
        })
        .catch((error) => {
          console.log('Stop local media redirect:', error);
          throw new Error(
            i18n.t('pageVirtualMedia.eMMC.errorStoppingRedirection'),
          );
        });
    },

    async deleteLocalMedia(_, odataId) {
      return await api.delete(odataId).catch((error) => {
        console.log('Delete local media:', error);
        throw new Error(i18n.t('pageVirtualMedia.eMMC.errorDeletingImage'));
      });
    },

    async getImageDetails(_, imageName) {
      return await api
        .get(`/redfish/v1/Systems/system/Oem/Ami/LocalMedia/${imageName}`)
        .then((response) => response.data)
        .catch((error) => {
          console.log('Get image details:', error);
          throw new Error(
            i18n.t('pageVirtualMedia.eMMC.errorLoadingImageDetails'),
          );
        });
    },
  },
};

export default VirtualMediaStore;
