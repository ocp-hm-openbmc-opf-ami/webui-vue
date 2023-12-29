import api from '@/store/api';

const KvmStore = {
  namespaced: true,
  state: {
    activeStatus: 0,
    isconsolewindow: null,
    softKeyboardStates: {
      keyboardLayoutStatus: 'default',
      altKeyStatus: false,
      ctlKeyStatus: false,
      shiftKeyStatus: false,
      capsKeyStatus: false,
      cmdKeyStatus: false,
    },
    keyboardLayout: 'en-us' /* Default keyboard layout */,
    clientKeyboardLEDState: -1,
    hostKeyboardLEDState: -1,
  },
  getters: {
    getKvmActiveStatus: (state) => state.activeStatus,
    getIsConsoleWindow: (state) => state.isconsolewindow,
    getSoftKeyboardStatus: (state) => state.softKeyboardStates,
    getKeyboardLayout: (state) => state.keyboardLayout,
    getclientKeyboardLEDState: (state) => state.clientKeyboardLEDState,
    gethostKeyboardLEDState: (state) => state.hostKeyboardLEDState,
  },
  mutations: {
    setKvmActiveStatusData: (state, statusData) =>
      (state.activeStatus = statusData.kvmActiveStatus),
    setIsConsoleWindow: (state, isconsolewindowOpen) => {
      state.isconsolewindow = isconsolewindowOpen;
    },
    updateSoftKeyStatus: (state, keyStatus) => {
      state.softKeyboardStates[keyStatus[1]] = keyStatus[0];
    },
    setKeyboardLayout: (state, statusData) =>
      (state.keyboardLayout = statusData),
    setclientKeyboardLEDState: (state, keyState) =>
      (state.clientKeyboardLEDState = keyState),
    sethostKeyboardLEDState: (state, keyState) =>
      (state.hostKeyboardLEDState = keyState),
  },
  actions: {
    async getData({ commit }) {
      commit(
        'setKeyboardLayout',
        /* Get the current browser display language and set it as keyboard
         * layout value */
        // TODO: remove this after menu implementation
        window.navigator.language.toLocaleLowerCase()
      );
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
