import api from '@/store/api';
import i18n from '@/i18n';

const SbmrLogsStore = {
  namespaced: true,
  state: {
    allPostCodes: [],
  },
  getters: {
    allPostCodes: (state) => state.allPostCodes,
  },
  mutations: {
    setAllPostCodes: (state, allPostCodes) =>
      (state.allPostCodes = allPostCodes),
  },
  actions: {
    async getPostCodesLogData({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/LogServices/PostCodes/Entries')
        .then(({ data: { Members = [] } = {} }) => {
          const postCodeLogs = Members.map((log) => {
            const { Created, MessageArgs, AdditionalDataURI } = log;
            // Parse MessageArgs[2] which contains postCode-postCodeString format
            const combinedValue = MessageArgs[2] || '';
            const [postCode, postCodeString] = combinedValue.split('-');

            return {
              date: new Date(Created),
              bootCount: MessageArgs[0],
              timeStampOffset: MessageArgs[1],
              postCode: postCode || '',
              postCodeString: postCodeString || '',
              uri: AdditionalDataURI,
            };
          });
          commit('setAllPostCodes', postCodeLogs);
        })
        .catch((error) => {
          console.log('POST Codes Log Data:', error);
        });
    },
    async deleteAllPostCodeLogs({ dispatch }, data) {
      return await api
        .post(
          '/redfish/v1/Systems/system/LogServices/PostCodes/Actions/LogService.ClearLog',
        )
        .then(() => dispatch('getPostCodesLogData'))
        .then(() =>
          i18n.tc('pagePostCodeLogs.toast.successDelete', data.length),
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.tc('pagePostCodeLogs.toast.errorDelete', data.length),
          );
        });
    },
  },
};

export default SbmrLogsStore;
