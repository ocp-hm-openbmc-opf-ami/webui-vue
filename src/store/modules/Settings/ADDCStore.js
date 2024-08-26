import api from '@/store/api';
import i18n from '@/i18n';

const ADDCStore = {
  namespaced: true,
  state: {
    addcData: {},
    entriesDownload: {},
  },
  getters: {
    getADDCAllData: (state) => state.addcData,
    getEntries: (state) => state.entriesDownload,
  },
  mutations: {
    setADDCData: (state, addcData) => (state.addcData = addcData),
    setEntriesDownload: (state, entriesDownload) =>
      (state.entriesDownload = entriesDownload),
  },
  actions: {
    async getADDCData({ commit, dispatch }) {
      return await api
        .get('/redfish/v1/Systems/system/LogServices/Crashdump')
        .then((response) => {
          commit('setADDCData', response.data);
          dispatch('getADDCEntriesDownload');
        })
        .catch((error) => console.log(error));
    },
    async setADDCConfiguration({ dispatch }, Configuration) {
      const aDDCConfig = {
        Oem: {
          Ami: {
            Configuration,
          },
        },
      };
      return await api
        .patch('/redfish/v1/Systems/system/LogServices/Crashdump', aDDCConfig)
        .then(() => {
          dispatch('getADDCData');
        })
        .then(() => i18n.t('pageAddc.toast.successSaveAddc'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageAddc.toast.errorSavedAddc'));
        });
    },
    async getADDCEntriesDownload({ state, commit }) {
      return await api
        .get(state.addcData?.Entries['@odata.id'])
        .then((response) => {
          const allADDCData = response.data.Members.map((sessionUri) => {
            let lastElement = sessionUri.AdditionalDataURI.split('/').pop();
            return {
              Id: sessionUri.Id,
              AdditionalDataURI: lastElement,
              Created: sessionUri.Created.replace(/[TZ]/g, ' '),
            };
          });
          commit('setEntriesDownload', allADDCData);
        })
        .catch((error) => console.log(error));
    },
    async logEntriesDownload(_, val) {
      return await api
        .get(val)
        .then(() => {
          const url = val;

          // Create a link element
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', val.split('/').pop());
          // Append the link to the body
          document.body.appendChild(link);
          link.click();
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageAddc.toast.errorAddcDownload'));
        });
    },
    async addcClearLog({ dispatch }) {
      return await api
        .post(
          '/redfish/v1/Systems/system/LogServices/Crashdump/Actions/LogService.ClearLog',
        )
        .then(() => {
          dispatch('getADDCData');
        })
        .then(() => i18n.t('pageAddc.toast.successAddcLogCleared'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageAddc.toast.errorAddcLogCleared'));
        });
    },
  },
};

export default ADDCStore;
