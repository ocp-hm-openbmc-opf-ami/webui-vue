import api from '@/store/api';
import i18n from '@/i18n';

const SpdmStore = {
  namespaced: true,
  state: {
    spdmData: [],
    selectedSpdmId: '',
    selectedSpdmIndex: 0,
    spdmInfo: [],
    spdmActionInfo: null,
    selectedSpdmCertificate: null,
  },
  getters: {
    spdmData: (state) => state.spdmData,
    selectedSpdmId: (state) => state.selectedSpdmId,
    selectedSpdmIndex: (state) => state.selectedSpdmIndex,
    spdmInfo: (state) => state.spdmInfo,
    spdmActionInfo: (state) => state.spdmActionInfo,
    selectedSpdmCertificate: (state) => state.selectedSpdmCertificate,
  },
  mutations: {
    setSpdmData(state, spdmData) {
      state.spdmData = spdmData;
    },
    setSelectedSpdmId(state, selectedSpdmId) {
      state.selectedSpdmId = selectedSpdmId;
    },
    setSelectedSpdmIndex(state, selectedSpdmIndex) {
      state.selectedSpdmIndex = selectedSpdmIndex;
    },
    setSpdmInfo(state, spdmInfo) {
      state.spdmInfo = spdmInfo;
    },
    setSpdmActionInfo(state, spdmActionInfo) {
      state.spdmActionInfo = spdmActionInfo;
    },
    setSelectedSpdmCertificate(state, certificate) {
      state.selectedSpdmCertificate = certificate;
    },
  },
  actions: {
    async getSpdmData({ dispatch, commit }) {
      return await api
        .get('/redfish/v1/ComponentIntegrity')
        .then((response) => {
          const members = response.data.Members;
          return members.map((spdmInterface) => spdmInterface['@odata.id']);
        })
        .then((erotIds) => api.all(erotIds.map((erot) => api.get(erot))))
        .then((erots) => {
          const erotData = erots.map(function (spdmInterface) {
            return spdmInterface.data;
          });
          const selectedSpdmId = erotData.length > 0 ? erotData[0].Id : '';
          commit('setSpdmData', erotData);
          commit('setSelectedSpdmId', selectedSpdmId);
          if (selectedSpdmId) {
            dispatch('getSpdmInfo');
          }
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageSPDM.toast.errorGettingComponentIntegrityData'),
          );
        });
    },
    async setSelectedTabIndex({ commit }, tabIndex) {
      commit('setSelectedSpdmIndex', tabIndex);
    },
    async setSelectedTabId({ commit }, tabId) {
      commit('setSelectedSpdmId', tabId);
    },
    async getSpdmInfo({ commit, state }) {
      const { selectedSpdmId } = state;
      if (!selectedSpdmId) return;
      return await api
        .get(`/redfish/v1/ComponentIntegrity/${selectedSpdmId}`)
        .then((response) => {
          const spdmInfo = response.data;
          commit('setSpdmInfo', spdmInfo);
          return Promise.resolve({ data: null });
        })
        .then((response) => {
          const spdmActionInfo = response.data;
          commit('setSpdmActionInfo', spdmActionInfo);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageSPDM.toast.errorInGettingSpdmDevicesInfo'),
          );
        });
    },
    async getSignedMeasurements(_, { spdmId }) {
      return await api.post(
        `/redfish/v1/ComponentIntegrity/${spdmId}/Actions/SPDMGetSignedMeasurements`,
      );
    },
    async pollTaskStatus(_, taskLocation) {
      // Use the task location directly as it comes from @odata.id
      return await api.get(taskLocation).then((response) => response.data);
    },
    async getSignedMeasurementsData(_, dataLocation) {
      // Get the signed measurements data from the Location provided in completed task
      return await api.get(dataLocation).then((response) => response.data);
    },
    getCertificate({ commit }, { spdmId }) {
      return api
        .get(`/redfish/v1/Chassis/${spdmId}/Certificates/CertChain`)
        .then((response) => {
          const certificate = response.data.CertificateString;
          commit('setSelectedSpdmCertificate', certificate);
          return certificate;
        })
        .then(() => {
          return i18n.t('pageSPDM.toast.successInGettingCertificate');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageSPDM.toast.errorInGettingCertificate'));
        });
    },
  },
};

export default SpdmStore;
