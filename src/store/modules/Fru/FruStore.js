import api from '@/store/api';
import i18n from '@/i18n';

const FruStore = {
  namespaced: true,
  state: {
    fruDeviceInfo: [],
    fruCollectionInfo: {},
  },
  getters: {
    getFruDeviceAvailable: (state) => state.fruDeviceInfo,
    getFruCollectionInfo: (state) => state.fruCollectionInfo,
  },
  mutations: {
    setFruDeviceInfo: (state, fruDeviceInfo) =>
      (state.fruDeviceInfo = fruDeviceInfo),
    setFruCollectionInfo: (state, fruCollectionInfo) =>
      (state.fruCollectionInfo = fruCollectionInfo),
  },
  actions: {
    async getFruDeviceInfo({ commit }) {
      return await api
        .get('/redfish/v1/Chassis')
        .then(({ data: { Members = [] } }) => {
          return [api.get(Members[0]['@odata.id'])];
        })
        .then((promises) => api.all(promises))
        .then((response) => {
          if (response[0].data.Oem.AMI.FRU) {
            return [api.get(response[0].data.Oem.AMI.FRU['@odata.id'])];
          }
        })
        .then((promises) => api.all(promises))
        .then((response) => {
          commit('setFruDeviceInfo', response[0].data.Members);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('fru.toast.errorGetFru'));
        });
    },
    async getFruCollectionInfo({ commit }, selectedValue) {
      return api
        .get(selectedValue['@odata.id'])
        .then((response) => {
          commit('setFruCollectionInfo', response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};

export default FruStore;
