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
    setSlot1Started: (state, start) => (state.Slot1Started = start),
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
        .get('/redfish/v1/Managers/bmc/VirtualMedia')
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
            };
          });
          commit('setMediaAlreadyRedirected', slot);
          const proxyDevices = deviceData
            .filter((d) => d.transferProtocolType === transferProtocolType.OEM)
            .map((device) => {
              if (state.slot0Nbd || state.slot1Nbd) {
                return {
                  ...device,
                  file: null,
                  nbd:
                    device.id == 'Slot_0' && state.slot0Nbd
                      ? state.slot0Nbd
                      : device.id == 'Slot_1' && state.slot1Nbd
                        ? state.slot1Nbd
                        : null,
                };
              } else {
                return {
                  ...device,
                  file: null,
                };
              }
            });
          const legacyDevices = deviceData
            .filter((d) => d.transferProtocolType !== transferProtocolType.OEM)
            .map((device) => {
              return {
                ...device,
                serverUri: '',
                username: '',
                password: '',
                isRW: false,
              };
            });
          commit('setProxyDevicesData', [...proxyDevices].reverse());
          commit('setLegacyDevicesData', [...legacyDevices].reverse());
          commit('setVirtualMediaAccess', true);
          commit('setVirtualMediaPolicies', false);
        })
        .catch((error) => {
          console.log('Virtual Media:', error);
          if (error.response.status != 500) {
            commit('setVirtualMediaAccess', false);
          } else {
            commit('setVirtualMediaAccess', true);
            throw new Error();
          }
        });
    },
    async mountImage(_, { id, data }) {
      return await api
        .post(
          `/redfish/v1/Managers/bmc/VirtualMedia/${id}/Actions/VirtualMedia.InsertMedia`,
          data,
        )
        .catch((error) => {
          console.log('Mount image:', error);
          throw new Error();
        });
    },
    async unmountImage(_, id) {
      return await api
        .post(
          `/redfish/v1/Managers/bmc/VirtualMedia/${id}/Actions/VirtualMedia.EjectMedia`,
        )
        .catch((error) => {
          console.log('Unmount image:', error);
          throw new Error();
        });
    },
  },
};

export default VirtualMediaStore;
