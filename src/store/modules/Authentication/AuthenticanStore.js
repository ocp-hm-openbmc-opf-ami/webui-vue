import api from '@/store/api';
import Cookies from 'js-cookie';
import router from '@/router';
import i18n from '@/i18n';
import store from '../../index';

const AuthenticationStore = {
  namespaced: true,
  state: {
    consoleWindow: null,
    authError: false,
    authLocked: false,
    xsrfCookie: Cookies.get('XSRF-TOKEN'),
    isAuthenticatedCookie: Cookies.get('IsAuthenticated'),
    tfaEnabled: false,
    tfaFeatureEnabled: false,
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
    tfaEnabled: (state) => state.tfaEnabled,
    tfaFeatureEnabled: (state) => state.tfaFeatureEnabled,
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
      Cookies.remove('loginSessionSuccess');
      localStorage.removeItem('storedUsername');
      store.commit('global/setUtcTime', true);
      state.xsrfCookie = undefined;
      state.isAuthenticatedCookie = undefined;
      router.push('/login').catch(() => {});
    },
    setConsoleWindow: (state, window) => (state.consoleWindow = window),
    setTfaEnabled: (state, tfaEnabled) => (state.tfaEnabled = tfaEnabled),
    setTfaFeatureEnabled: (state, tfaFeatureEnabled) =>
      (state.tfaFeatureEnabled = tfaFeatureEnabled),
  },
  actions: {
    login({ commit }, { username, password }) {
      commit('authError', false);
      return api
        .post('/login', { data: [username, password] })
        .then((response) => {
          commit('authSuccess');
          if (response.data.TwoFacEnableStatus == 'N/A') {
            commit('setTfaFeatureEnabled', false);
          } else {
            commit('setTfaEnabled', response.data.TwoFacEnableStatus);
            commit('setTfaFeatureEnabled', true);
          }
        })
        .catch((error) => {
          if (error.response.status == 423) {
            commit('authLocked');
          } else {
            commit('authError');
          }
          throw new Error(error);
        });
    },
    async logout({ commit }) {
      return await api
        .post('/logout', { data: [] })
        .then(() => {
          commit('setConsoleWindow', false);
          commit('logout');
        })
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

    async enableTfa({ commit }) {
      const username = localStorage.getItem('storedUsername');
      return await api
        .post(
          `/redfish/v1/AccountService/Accounts/${username}/Actions/Oem/Ami/TwoFactorAuthentication`,
        )
        .then(({ data }) => {
          commit('setTfaEnabled', true);
          return data;
        })
        .catch((error) => console.log(error));
    },
    async disableTfa({ commit }) {
      const username = localStorage.getItem('storedUsername');
      return await api
        .delete(
          `/redfish/v1/AccountService/Accounts/${username}/Actions/Oem/Ami/TwoFactorAuthentication`,
        )
        .then(() => {
          commit('setTfaEnabled', false);
        })
        .catch((error) => console.log(error));
    },
    async verifyOtp(_, verifyData) {
      const data = {
        username: verifyData.username,
        verificationcode: verifyData.verificationcode,
      };
      return await api
        .post('/verify_otp', data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.error) {
            throw new Error(error.response.data.error);
          } else throw new Error(i18n.t('pageTfa.toast.tfaFailed'));
        });
    },
    resetStoreState({ state }) {
      state.authError = false;
      state.authLocked = false;
      state.xsrfCookie = Cookies.get('XSRF-TOKEN');
      state.isAuthenticatedCookie = Cookies.get('IsAuthenticated');
    },
    customizedResetLogout({ commit }) {
      commit('setConsoleWindow', false);
      commit('logout');
      localStorage.removeItem('storedLanguage');
      Cookies.remove('loginSessionSuccess');
      router.push('/login');
    },
  },
};

export default AuthenticationStore;
