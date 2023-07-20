import api from '@/store/api';
import i18n from '@/i18n';
const NetworkStore = {
  namespaced: true,
  state: {
    vlanTableData: [],
    vlanAllData: [],
  },
  getters: {
    vlanTableData: (state) => state.vlanTableData,
    vlanAllData: (state) => state.vlanAllData,
  },
  mutations: {
    setVlanTableData: (state, vlanData) => (state.vlanTableData = vlanData),
    setVlanAllData: (state, vlanData) => (state.vlanAllData = vlanData),
  },
  actions: {
    async getEthernetData({ commit }) {
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
        .then((ethernetInterfaces) => {
          const vlanAllData = ethernetInterfaces.map(
            (ethernetInterface) => ethernetInterface.data
          );
          commit('setVlanAllData', vlanAllData);
          console.log(vlanAllData);
          const vlanTableData = [];
          ethernetInterfaces.map((ethernetInterface) => {
            if (ethernetInterface.data.VLANs) {
              api
                .get(ethernetInterface.data.VLANs['@odata.id'])
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
                .then((result) => {
                  const vlanData = result.map(
                    (ethernetInterface) => ethernetInterface.data
                  );
                  vlanTableData.push(vlanData);
                });
            }
          });
          commit('setVlanTableData', vlanTableData);
          console.log('setVlanTableData', vlanTableData);
        })
        .catch((error) => {
          console.log('VLAN Error:', error);
        });
    },
    async addVlan({ dispatch }, { VLANEnable, VLANId, TabId }) {
      const data = {
        VLANId: VLANId,
        VLANEnable: VLANEnable,
      };
      return await api
        .post(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${TabId}/VLANs/`,
          data
        )
        .then(() => dispatch('getEthernetData'))
        .then(() => i18n.tc('pageVlan.toast.successAddedVlan'))
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.tc('pageVlan.toast.errorAddedVlan'));
        });
    },
    async deleteVlan({ dispatch }, { TabId, VirtualInterface }) {
      return await api
        .delete(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${TabId}/VLANs/${VirtualInterface}`
        )
        .then(() => dispatch('getEthernetData'))
        .then(() => i18n.t('pageVlan.toast.successDeleteVlan'))
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageVlan.toast.errorDeleteVlan');
          throw new Error(message);
        });
    },
  },
};

export default NetworkStore;
