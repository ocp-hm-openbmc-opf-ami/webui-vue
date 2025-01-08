const KvmStore = {
  namespaced: true,
  state: {
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
    getIsConsoleWindow: (state) => state.isconsolewindow,
    getSoftKeyboardStatus: (state) => state.softKeyboardStates,
    getKeyboardLayout: (state) => state.keyboardLayout,
    getclientKeyboardLEDState: (state) => state.clientKeyboardLEDState,
    gethostKeyboardLEDState: (state) => state.hostKeyboardLEDState,
  },
  mutations: {
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
        window.navigator.language.toLocaleLowerCase(),
      );
    },
  },
};

export default KvmStore;
