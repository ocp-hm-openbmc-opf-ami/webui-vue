import api from '@/store/api';

const SystemInventoryStore = {
  namespaced: true,
  state: {
    systems: [],
    processors: [],
    microControllers: [],
    baseBoard: [],
  },
  getters: {
    systems: (state) => state.systems,
    processors: (state) => state.processors,
    memoryController: (state) => state.memoryController,
    baseBoard: (state) => state.baseBoard,
  },
  mutations: {
    setSystems: (state, systems) => (state.systems = systems),
    setProcessors: (state, processors) => (state.processors = processors),
    setMemoryController: (state, memoryController) =>
      (state.memoryController = memoryController),
    setBaseboard: (state, baseBoard) => (state.baseBoard = baseBoard),
  },
  actions: {
    async getSystemsInfo({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          console.log('getSystemsInfo', response.data.system);
          commit('setSystems', response.data.system);
        })
        .catch((error) => console.log(error));
    },
    async getProcessorsInfo({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          console.log('getProcessorsInfo', response.data.processor);
          commit('setProcessors', response.data.processor);
        })
        .catch((error) => console.log(error));
    },
    async getMemoryControllersInfo({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          console.log('getMicroCntrollersInfo', response.data.memoryController);
          commit('setMemoryController', response.data.memoryController);
        })
        .catch((error) => console.log(error));
    },
    async getBaseBoardInfo({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          console.log('getBaseBoardInfo', response.data.baseBoard);
          commit('setBaseboard', response.data.baseBoard);
        })
        .catch((error) => console.log(error));
    },
    async getBasebordInfoNetworkinterfaces({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          console.log(
            'getBasebordInfoNetworkinterfaces',
            response.data.basebordInfoNetworkinterfaces
          );
          commit('setBaseboard', response.data.basebordInfoNetworkinterfaces);
        })
        .catch((error) => console.log(error));
    },
  },
};
export default SystemInventoryStore;
