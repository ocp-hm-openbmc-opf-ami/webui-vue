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
      return await api
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces')
        .then((response) =>
          response.data.Members.map(
            (ethernetInterface) => ethernetInterface['@odata.id']
          )
        )
        .then((ethernetInterfaceIds) =>
          api.all(
            ethernetInterfaceIds.map((ethernetInterface) =>
              api.get(ethernetInterface)
            )
          )
        )
        .then(async (ethernetInterfaces) => {
          const ethernetData = ethernetInterfaces.map(
            (ethernetInterface) => ethernetInterface.data
          );
          const ncsiData = await dispatch('getNcsiData', ethernetData);
          let ncsiInterfaceId = [];
          let ncsiConfiguration = [];
          ncsiData.forEach((data) => {
            ncsiConfiguration.push(data);
            commit('setNcsiData', ncsiConfiguration);
            ncsiInterfaceId.push(data.Id);
          });
          commit('setNcsiInterface', ncsiInterfaceId);
          commit('setEthernetData', ethernetData);
        })
        .catch((error) => {
          console.log('Network Data:', error);
          throw new Error(i18n.t('pageNcsi.toast.errorGettingNcsi'));
        });
    },
    async getNcsiData({ commit }, ethernetData) {
      let ncsiInterfaces = [];
      ethernetData.forEach((ethernet) => {
        if (ethernet.Id != 'usb0') {
          if (
            ethernet?.Oem?.Ami?.NCSIConfiguration &&
            ethernet?.Oem?.Ami?.NCSIConfiguration?.ChannelId
          ) {
            ncsiInterfaces.push(ethernet);
            commit('setNcsiEnable', true);
          } else {
            commit('setNcsiEnable', false);
          }
        }
      });
      return ncsiInterfaces;
    },
    async saveNcsiConfigurations(
      { dispatch },
      { Mode, PackageId, ChannelId, interFace }
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
          setNcsi
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
