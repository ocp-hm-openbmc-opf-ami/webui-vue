import api from '@/store/api';
import i18n from '@/i18n';
import store from '@/store/';

const AutoVideoStore = {
  namespaced: true,
  state: {
    videoTriggerValues: {},
    videoRemoteStorageValues: {},
    // preEventVideoValues: {},
    autoVideoSettingsURL: '',
    autoVideoRecordFeature: {},
  },
  getters: {
    getVideoTriggerValues: (state) => state.videoTriggerValues,
    getVideoRemoteStorageValues: (state) => state.videoRemoteStorageValues,
    // getPreEventVideoValues: (state) => state.preEventVideoValues,
    getAutoVideoRecordFeature: (state) => state.autoVideoRecordFeature,
  },
  mutations: {
    setVideoTriggerValues: (state, videoTriggerValues) =>
      (state.videoTriggerValues = videoTriggerValues),
    setVideoRemoteStorageValues: (state, videoRemoteStorageValues) =>
      (state.videoRemoteStorageValues = videoRemoteStorageValues),
    // setPreEventVideoValues: (state, preEventVideoValues) =>
    //   (state.preEventVideoValues = preEventVideoValues),
    setAutoVideoRecordFeature: (state, autoVideoRecordFeature) =>
      (state.autoVideoRecordFeature = autoVideoRecordFeature),
  },
  actions: {
    getActiveBmcVideoSettings({ state, commit }) {
      return api
        .get('/redfish/v1/Managers/' + store.getters['global/managerInstance'])
        .then(({ data }) => {
          state.autoVideoSettingsURL =
            data.Oem?.Ami?.AutoVideoSettings['@odata.id'];
        })
        .then(() => api.get(state.autoVideoSettingsURL))
        .then((autoVideoRecordFeature) => {
          commit('setAutoVideoRecordFeature', autoVideoRecordFeature.data);
        })
        .catch((error) => console.log(error));
    },
    async getVideoTriggerSettings({ commit, state }) {
      return await api
        .get(state.autoVideoRecordFeature.VideoTriggerSetting['@odata.id'])
        .then(({ data }) => {
          commit('setVideoTriggerValues', data);
        })
        .catch((error) => {
          console.log('Auto Video Data:', error);
        });
    },
    async getVideoRemoteStorage({ commit, state }) {
      return await api
        .get(state.autoVideoRecordFeature.RemoteVideoStorage['@odata.id'])
        .then(({ data }) => {
          commit('setVideoRemoteStorageValues', data);
        })
        .catch((error) => {
          console.log('Auto Video Data:', error);
        });
    },
    async setVideoTriggerSettings(_, data) {
      return await api
        .patch(
          `/redfish/v1/Managers/${store.getters['global/managerInstance']}/Oem/Ami/AutoVideoSettings/VideoTriggerSetting`,
          data,
        )
        .then(() => i18n.t('pageVideo.toast.successSaveVideoTriggerSettings'))
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageVideo.toast.errorsavedVideoTriggerSettings'),
          );
        });
    },
    async setVideoRemoteStorage(_, data) {
      return await api
        .patch(
          `/redfish/v1/Managers/${store.getters['global/managerInstance']}/Oem/Ami/AutoVideoSettings/RemoteVideoStorage`,
          data,
        )
        .then(() => i18n.t('pageVideo.toast.successSaveVideoRemoteSettings'))
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageVideo.toast.errorsavedVideoRemoteSettings'),
          );
        });
    },
    // async getPreEventVideo({ commit }) {
    //   return await api
    //     .get('/localApi/preevent')
    //     .then(({ data }) => {
    //       commit('setPreEventVideoValues', data);
    //     })
    //     .catch((error) => {
    //       console.log('Auto Video Data:', error);
    //     });
    // },
  },
};

export default AutoVideoStore;
