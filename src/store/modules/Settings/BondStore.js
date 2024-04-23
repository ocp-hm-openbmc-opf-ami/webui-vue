import api from '@/store/api';
import i18n from '@/i18n';

const BondStore = {
  namespaced: true,
  state: {
    interfaceData: [],
    FirstInterfaceId: '',
    bondEnabledData: {},
  },
  getters: {
    getInterfaceData: (state) => state.interfaceData,
    getBondEnabledData: (state) => state.bondEnabledData,
  },
  mutations: {
    setInterfaceData: (state, interfaceData) =>
      (state.interfaceData = interfaceData),
    setBondEnabledData: (state, bondEnabledData) =>
      (state.bondEnabledData = bondEnabledData),
  },
  actions: {
    async getBondEthernetData({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces')
        .then((response) => {
          let interfaceiteam = [];
          response.data.Members.map((ethernetInterface) => {
            let res = ethernetInterface['@odata.id'].split('/');
            let lastElement = res[res.length - 1];
            interfaceiteam.push(lastElement);
            commit('setInterfaceData', interfaceiteam);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async setBondEthernetData(_, data) {
      return await api
        .post(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/${data.bondInterface}/Actions/Oem/Ami/EthernetInterface.CreateBond`,
          { MIIMonitorinms: parseInt(data.miiMonitorinms) }
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('bond.errorSavebond'));
        });
    },
    async setChangeActiveSlave(_, data) {
      return await api
        .post(
          `/redfish/v1/Managers/bmc/EthernetInterfaces/bond0/Actions/Oem/Ami/EthernetInterface.ChangeActiveSlave`,
          {
            ActiveSlave: {
              '@odata.id': `/redfish/v1/Managers/bmc/EthernetInterfaces/${data.bondInterface}`,
            },
          }
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('bond.errorSavebond'));
        });
    },
    async deleteBondEthernetData() {
      return await api
        .delete('/redfish/v1/Managers/bmc/EthernetInterfaces/bond0')
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('bond.errorDelete'));
        });
    },
    async getbondData({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces/bond0')
        .then((response) => {
          commit('setBondEnabledData', response.data.Oem.Ami.BondConfiguration);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('bond.errorGetBond'));
        });
    },
  },
};

export default BondStore;
