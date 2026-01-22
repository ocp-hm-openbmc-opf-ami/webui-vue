import api from '@/store/api';
import i18n from '@/i18n';
import store from '@/store';

const VideoLogStore = {
  namespaced: true,
  state: {
    allVideoLogs: [],
  },
  getters: {
    getAllVideoLogs: (state) => state.allVideoLogs,
  },
  mutations: {
    setAllVideoLogs: (state, allVideoLogs) =>
      (state.allVideoLogs = allVideoLogs),
  },
  actions: {
    async getVideoLogData({ commit }) {
      return await api
        .get(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/Oem/Ami/AutoVideoSettings/VideoLogs',
        )
        .then(({ data }) => {
          const allVideoLogs = data.Members.map((val) => {
            let lastElement = val['@odata.id'].split('/').pop();
            return {
              file: lastElement,
            };
          });
          commit('setAllVideoLogs', allVideoLogs);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('videoLog.toast.errorGettingVideoLog'));
        });
    },
    async videoLogDownload(_, file) {
      try {
        const response = await api.get(file);
        console.log(response.data.length); // wait until the file is fully downloaded from API
        const url = file;

        // Create a link element for download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.split('/').pop());
        // Append link to body, trigger download, then remove
        document.body.appendChild(link);
        link.click();
        // Revoke the object URL to release memory
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error(error);
        throw new Error(i18n.t('videoLog.toast.errorVideoLogDownload'));
      }
    },
    async deletevideoLog({ dispatch }, uris = []) {
      const promises = uris.map((uri) =>
        api.delete(uri).catch((error) => {
          console.log(error);
          return error;
        }),
      );
      return await api.all(promises).then((response) => {
        dispatch('getVideoLogData');
        return response;
      });
    },
  },
};

export default VideoLogStore;
