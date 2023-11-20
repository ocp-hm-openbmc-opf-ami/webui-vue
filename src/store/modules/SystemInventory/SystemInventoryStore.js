import api from '@/store/api';

const SystemInventoryStore = {
  namespaced: true,
  state: {
    systems: [],
    processors: [],
    memoryController: [],
    baseBoard: [],
    basebordInfoNetworkinterfaces: [],
    basebordInfoNetworkInterfacesIpv6: [],
  },
  getters: {
    systems: (state) => state.systems,
    processors: (state) => state.processors,
    memoryController: (state) => state.memoryController,
    baseBoard: (state) => state.baseBoard,
    basebordInfoNetworkinterfaces: (state) =>
      state.basebordInfoNetworkinterfaces,
    basebordInfoNetworkInterfacesIpv6: (state) =>
      state.basebordInfoNetworkInterfacesIpv6,
  },
  mutations: {
    setSystems: (state, systems) => (state.systems = systems),
    setProcessors: (state, processors) => (state.processors = processors),
    setMemoryController: (state, memoryController) =>
      (state.memoryController = memoryController),
    setBaseboard: (state, baseBoard) => (state.baseBoard = baseBoard),
    setBasebordInfoNetworkinterfaces: (state, basebordInfoNetworkinterfaces) =>
      (state.basebordInfoNetworkinterfaces = basebordInfoNetworkinterfaces),
    setBasebordInfoNetworkInterfacesIpv6: (
      state,
      basebordInfoNetworkInterfacesIpv6
    ) =>
      (state.basebordInfoNetworkInterfacesIpv6 = basebordInfoNetworkInterfacesIpv6),
  },
  actions: {
    async getSystemsInfo({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          commit('setSystems', response.data.system);
        })
        .catch((error) => console.log(error));
    },
    async getProcessorsInfo({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          commit('setProcessors', response.data.processor);
        })
        .catch((error) => console.log(error));
    },
    async getMemoryControllersInfo({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          commit('setMemoryController', response.data.memoryController);
        })
        .catch((error) => console.log(error));
    },
    async getBaseBoardInfo({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          commit('setBaseboard', response.data.baseboard_info);
        })
        .catch((error) => console.log(error));
    },
    async getBasebordInfoNetworkinterfaces({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          commit(
            'setBasebordInfoNetworkinterfaces',
            response.data.NetworkInterface
          );
        })
        .catch((error) => console.log(error));
    },
    async getBasebordInfoNetworkInterfacesIpv6({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          commit(
            'setBasebordInfoNetworkInterfacesIpv6',
            response.data.NetworkInterfaceIPv6
          );
        })
        .catch((error) => console.log(error));
    },
  },
};
export default SystemInventoryStore;
