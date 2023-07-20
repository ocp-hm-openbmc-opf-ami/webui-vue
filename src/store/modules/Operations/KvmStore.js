import api from '@/store/api';

const KvmStore = {
  namespaced: true,
  state: {
    activeStatus: 0,
    softKeyboardStates: {
      keyboardLayoutStatus: 'default',
      altKeyStatus: false,
      ctlKeyStatus: false,
      shiftKeyStatus: false,
      capsKeyStatus: false,
      cmdKeyStatus: false,
    },
  },
  getters: {
    getKvmActiveStatus: (state) => state.activeStatus,
    getSoftKeyboardStatus: (state) => state.softKeyboardStates,
  },
  mutations: {
    setKvmActiveStatusData: (state, statusData) =>
      (state.activeStatus = statusData.kvmActiveStatus),
    updateSoftKeyStatus: (state, keyStatus) => {
      state.softKeyboardStates[keyStatus[1]] = keyStatus[0];
    },
  },
  actions: {
    async getData({ commit }) {
      return await api
        .get('/kvm/kvmActiveStatus')
        .then((response) => {
          console.log('kvm active status', response);
          commit('setKvmActiveStatusData', response.data);
        })
        .catch((error) => {
          console.log('Error in getting KVM active status', error);
        });
    },
  },
};

export default KvmStore;
