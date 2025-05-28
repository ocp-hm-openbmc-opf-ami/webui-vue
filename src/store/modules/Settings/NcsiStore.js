import api from '@/store/api';
import i18n from '@/i18n';

const NcsiStore = {
  namespaced: true,
  state: {
    ethernetData: [],
    ncsiInterface: [],
    ncsiData: [],
    ncsiEnable: true,
  },
  getters: {
    ethernetData: (state) => state.ethernetData,
    ncsiInterface: (state) => state.ncsiInterface,
    ncsiData: (state) => state.ncsiData,
    ncsiEnable: (state) => state.ncsiEnable,
  },
  mutations: {
    setEthernetData: (state, ethernetData) =>
      (state.ethernetData = ethernetData),
    setNcsiInterface: (state, ncsiInterface) =>
      (state.ncsiInterface = ncsiInterface),
    setNcsiData: (state, ncsiData) => (state.ncsiData = ncsiData),
    setNcsiEnable: (state, ncsiEnable) => {
      state.ncsiEnable = ncsiEnable;
    },
  },
  actions: {
    async getEthernetInterfaces({ commit, dispatch }) {
      try {
        const response = await api.get('/redfish/v1/Managers/bmc');
        const ethernetData =
          response.data.Oem?.Ami?.NCSIEthernetInterfaces[0]['@odata.id'];
        const ncsiData = await dispatch('getNcsiData', ethernetData);
        commit('setNcsiData', [ncsiData[0]]);
        commit('setNcsiInterface', [ncsiData[0].Id]);
        commit('setEthernetData', ethernetData);
      } catch (error) {
        console.error('Network Data:', error);
        throw new Error(i18n.t('pageNcsi.toast.errorGettingNcsi'));
      }
    },
    async getNcsiData({ commit }, ethernetData) {
      let ncsiInterfaces = [];
      try {
        const response = await api.get(ethernetData);
        const ncsiConfiguration = response.data.Oem?.Ami?.NCSIConfiguration;
        const ethernetId = ethernetData.split('/').pop();
        if (ethernetId != 'hostusb0') {
          if (ncsiConfiguration && ncsiConfiguration?.ChannelId !== undefined) {
            commit('setNcsiEnable', true);
            ncsiInterfaces.push(response.data);
          } else {
            commit('setNcsiEnable', false);
          }
        }
      } catch (error) {
        commit('setNcsiEnable', false);
      }
      return ncsiInterfaces;
    },
    async saveNcsiConfigurations(
      { dispatch },
      { Mode, PackageId, ChannelId, interFace },
    ) {
      let setNcsi;
      if (Mode === 'Auto') {
        setNcsi = {
          Oem: {
            Ami: {
              NCSIConfiguration: {
                Mode: Mode,
              },
            },
          },
        };
      } else {
        setNcsi = {
          Oem: {
            Ami: {
              NCSIConfiguration: {
                ChannelId: ChannelId,
                Mode: Mode,
                PackageId: PackageId,
              },
            },
          },
        };
      }
      return await api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${interFace}`,
          setNcsi,
        )
        .then(() => dispatch('getEthernetInterfaces'))
        .then(() => {
          return i18n.t('pageNcsi.toast.successSavingNcsiInterface');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageNcsi.toast.errorSavinNcsiInterface'));
        });
    },
  },
};

export default NcsiStore;
