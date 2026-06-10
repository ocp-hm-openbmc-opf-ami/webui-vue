import api from '@/store/api';
import i18n from '@/i18n';
import UtcDateTimeMixin from '@/components/Mixins/UtcDateTimeMixin';

const PostCodeLogsStore = {
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
        .get('/redfish/v1/Systems/system1/LogServices/PostCodes/Entries')
        .then(({ data: { Members = [] } = {} }) => {
          const postCodeLogs = Members.map((log) => {
            const { Created, MessageArgs, AdditionalDataURI } = log;
            const dateObj =
              UtcDateTimeMixin.methods.createDateWithISOString(Created);
            return {
              date: dateObj,
              bootCount: MessageArgs[0],
              timeStampOffset: MessageArgs[1],
              postCode: MessageArgs[2],
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
          '/redfish/v1/Systems/system1/LogServices/PostCodes/Actions/LogService.ClearLog',
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

export default PostCodeLogsStore;
