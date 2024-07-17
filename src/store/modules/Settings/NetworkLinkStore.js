import api from '@/store/api';
import i18n from '@/i18n';

const NetworkLinkStore = {
  namespaced: true,
  state: {
    interfaceData: [],
    networkLinkData: [],
  },
  getters: {
    getInterfaceData: (state) => state.interfaceData,
    getNetworkLinkData: (state) => state.networkLinkData,
  },
  mutations: {
    setInterfaceData: (state, interfaceData) =>
      (state.interfaceData = interfaceData),
    setNetworkLinkData: (state, networkLinkData) =>
      (state.networkLinkData = networkLinkData),
  },
  actions: {
    async getNetworkEthernetData({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces')
        .then((response) => {
          let interfaceIteam = [];
          response.data.Members.map((ethernetInterface) => {
            let lastElement = ethernetInterface['@odata.id'].split('/').pop();
            interfaceIteam.push(lastElement);
            commit('setInterfaceData', interfaceIteam);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getInterfaceNetworkLinkData({ commit }, selectedValue) {
      return api
        .get(`/redfish/v1/Managers/bmc/EthernetInterfaces/${selectedValue}`)
        .then((response) => {
          commit('setNetworkLinkData', response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async setInterfaceNetworkLinkData(
      _,
      { networkInterfaceLink, selectedLanInterface },
    ) {
      return await api
        .patch(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${selectedLanInterface}`,
          networkInterfaceLink,
        )
        .then(() => i18n.t('networkLink.toast.successSaveNetworkLink'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('networkLink.toast.errorSavedNetworkLink'));
        });
    },
  },
};

export default NetworkLinkStore;
