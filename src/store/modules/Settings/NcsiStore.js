import api from '@/store/api';
import i18n from '@/i18n';

const NcsiStore = {
  namespaced: true,
  state: {
    ethernetData: [],
    ncsiInterface: [],
    ncsiData: [],
  },
  getters: {
    ethernetData: (state) => state.ethernetData,
    ncsiInterface: (state) => state.ncsiInterface,
    ncsiData: (state) => state.ncsiData,
  },
  mutations: {
    setEthernetData: (state, ethernetData) =>
      (state.ethernetData = ethernetData),
    setNcsiInterface: (state, ncsiInterface) =>
      (state.ncsiInterface = ncsiInterface),
    setNcsiData: (state, ncsiData) => (state.ncsiData = ncsiData),
  },
  actions: {
    async getEthernetInterfaces({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc')
        .then((response) => {
          const ncsiEthernetInterfaces =
            response.data.Oem?.Ami?.NCSIEthernetInterfaces || [];
          return ncsiEthernetInterfaces.map(
            (ncsiEthernetInterface) => ncsiEthernetInterface['@odata.id'],
          );
        })
        .then((ncsiEthernetfaceIds) =>
          api.all(
            ncsiEthernetfaceIds.map((ncsiEthernetInterface) =>
              api.get(ncsiEthernetInterface),
            ),
          ),
        )
        .then((ncsiEthernetInterfaces) => {
          const ncsiEthernetInterfacesIteam = ncsiEthernetInterfaces.map(
            (ethernetInterface) => {
              return ethernetInterface.data;
            },
          );
          let ncsiInterfaceIteam = [];
          ncsiEthernetInterfacesIteam.map((ncsiEthernetInterface) => {
            let lastElement = ncsiEthernetInterface['@odata.id']
              .split('/')
              .pop();
            ncsiInterfaceIteam.push(lastElement);
            commit('setNcsiInterface', ncsiInterfaceIteam);
          });
        })
        .catch((error) => {
          console.error('Network Data:', error);
          throw new Error(i18n.t('pageNcsi.toast.errorGettingNcsi'));
        });
    },
    async getNcsiData({ commit }, ethernetData) {
      return await api
        .get(`/redfish/v1/Managers/bmc/EthernetInterfaces/${ethernetData}`)
        .then((response) => {
          commit('setNcsiData', response.data);
          return response.data;
        })
        .catch((error) => {
          console.error('NCSI Data:', error);
          throw new Error(i18n.t('pageNcsi.toast.errorGettingNcsiData'));
        });
    },
    async saveNcsiConfigurations(_, { Mode, PackageId, ChannelId, interFace }) {
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
