import api from '@/store/api';
import i18n from '@/i18n';

const VideoLogStore = {
  namespaced: true,
  state: {
    allVideolLogs: [],
  },
  getters: {
    getAllVideolLogs: (state) => state.allVideolLogs,
  },
  mutations: {
    setAllVideolLogs: (state, allVideolLogs) =>
      (state.allVideolLogs = allVideolLogs),
  },
  actions: {
    async getVideoLogData({ commit }) {
      return await api
        .get('/localApi/videoLogs')
        .then(({ data }) => {
          const allVideoLogs = data.Members.map((val) => {
            let lastElement = val.file.split('/').pop();
            return {
              id: val.id,
              file: lastElement,
              date: val.fileinfo,
            };
          });
          commit('setAllVideolLogs', allVideoLogs);
        })
        .catch((error) => {
          console.log('Video Log Data:', error);
        });
    },
    async videoLogDownload(_, file) {
      return await api
        .get('/localApi/' + file)
        .then(() => {
          const url = file;

          // Create a link element
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.split('/').pop());
          // Append the link to the body
          document.body.appendChild(link);
          link.click();
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.log('Video Log Data:', error);
        });
    },
    async deletevideoLog({ dispatch }, file) {
      return await api
        .get('/localApi/' + file)
        .then(() => {
          dispatch('getVideoLogData');
        })
        .then(() => i18n.t('videoLog.toast.successVideoLogCleared'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('videoLog.toast.errorDelete'));
        });
    },
  },
};

export default VideoLogStore;
