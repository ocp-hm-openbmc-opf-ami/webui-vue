import api from '@/store/api';
import Cookies from 'js-cookie';
import router from '@/router';

const AuthenticationStore = {
  namespaced: true,
  state: {
    consoleWindow: null,
    authError: false,
    authLocked: false,
    xsrfCookie: Cookies.get('XSRF-TOKEN'),
    isAuthenticatedCookie: Cookies.get('IsAuthenticated'),
  },
  getters: {
    consoleWindow: (state) => state.consoleWindow,
    authError: (state) => state.authError,
    authLocked: (state) => state.authLocked,
    isLoggedIn: (state) => {
      return (
        state.xsrfCookie !== undefined || state.isAuthenticatedCookie == 'true'
      );
    },
    token: (state) => state.xsrfCookie,
  },
  mutations: {
    authSuccess(state) {
      state.authError = false;
      state.xsrfCookie = Cookies.get('XSRF-TOKEN');
    },
    authError(state, authError = true) {
      state.authError = authError;
      state.authLocked = !authError;
    },
    authLocked(state, authLocked = true) {
      state.authLocked = authLocked;
      state.authError = authLocked;
    },
    logout(state) {
      Cookies.remove('XSRF-TOKEN');
      Cookies.remove('IsAuthenticated');
      localStorage.removeItem('storedUsername');
      state.xsrfCookie = undefined;
      state.isAuthenticatedCookie = undefined;
    },
    setConsoleWindow: (state, window) => (state.consoleWindow = window),
  },
  actions: {
    login({ commit }, { username, password }) {
      commit('authError', false);
      return api
        .post('/login', { data: [username, password] })
        .then(() => commit('authSuccess'))
        .catch((error) => {
          if (error.response.status == 423) {
            commit('authLocked');
          } else {
            commit('authError');
          }
          throw new Error(error);
        });
    },
    logout({ commit }) {
      api
        .post('/logout', { data: [] })
        .then(() => {
          commit('setConsoleWindow', false);
          commit('logout');
        })
        .then(() => router.push('/login'))
        .catch((error) => console.log(error));
    },
    getUserInfo(_, username) {
      return api
        .get(`/redfish/v1/AccountService/Accounts/${username}`)
        .then(({ data }) => data)
        .catch((error) => {
          if (error.response.status == 404) {
            return Promise.resolve({
              PasswordChangeRequired: false,
              RoleId: 'Administrator',
            });
          }
        });
    },
    resetStoreState({ state }) {
      state.authError = false;
      state.authLocked = false;
      state.xsrfCookie = Cookies.get('XSRF-TOKEN');
      state.isAuthenticatedCookie = Cookies.get('IsAuthenticated');
    },
  },
};

export default AuthenticationStore;
