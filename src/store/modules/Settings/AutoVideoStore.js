import api from '@/store/api';

const AutoVideoStore = {
  namespaced: true,
  state: {
    videoTriggervalues: {},
    videoRemoteStoragevalues: {},
    preEventVideovalues: {},
  },
  getters: {
    getVideoTriggervalues: (state) => state.videoTriggervalues,
    getVideoRemoteStoragevalues: (state) => state.videoRemoteStoragevalues,
    getPreEventVideovalues: (state) => state.preEventVideovalues,
  },
  mutations: {
    setVideoTriggervalues: (state, videoTriggervalues) =>
      (state.videoTriggervalues = videoTriggervalues),
    setVideoRemoteStoragevalues: (state, videoRemoteStoragevalues) =>
      (state.videoRemoteStoragevalues = videoRemoteStoragevalues),
    setPreEventVideovalues: (state, preEventVideovalues) =>
      (state.preEventVideovalues = preEventVideovalues),
  },
  actions: {
    async getvideoTriggerSettings({ commit }) {
      return await api
        .get('/localApi/videotriggers')
        .then(({ data }) => {
          commit('setVideoTriggervalues', data);
        })
        .catch((error) => {
          console.log('Auto Video Data:', error);
        });
    },
    async getVideoRemoteStorage({ commit }) {
      return await api
        .get('/localApi/remotestorage')
        .then(({ data }) => {
          commit('setVideoRemoteStoragevalues', data);
        })
        .catch((error) => {
          console.log('Auto Video Data:', error);
        });
    },
    async getPreEventVideo({ commit }) {
      return await api
        .get('/localApi/preevent')
        .then(({ data }) => {
          commit('setPreEventVideovalues', data);
        })
        .catch((error) => {
          console.log('Auto Video Data:', error);
        });
    },
  },
};

export default AutoVideoStore;
