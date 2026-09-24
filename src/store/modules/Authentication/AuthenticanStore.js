import api from '@/store/api';
import Cookies from 'js-cookie';
import router from '@/router';
import i18n from '@/i18n';
import store from '../../index';
import RuntimeConfig from '@/utilities/RuntimeConfig';

const AuthenticationStore = {
  namespaced: true,
  state: {
    consoleWindow: null,
    loginRoleId: null,
    authError: false,
    authLocked: false,
    xsrfCookie: Cookies.get('XSRF-TOKEN'),
    isAuthenticatedCookie: Cookies.get('IsAuthenticated'),
    tfaEnabled: false,
    tfaFeatureEnabled: false,
    isExternalUser: false,
    tfaPending: localStorage.getItem('tfaPending') === 'true',
    userType: null,
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
    isExternalUser: (state) => state.isExternalUser,
    loginRoleId: (state) => state.loginRoleId,
    tfaPending: (state) => state.tfaPending,
    userType: (state) => state.userType,
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
      localStorage.removeItem('loginRoleId');
      localStorage.removeItem('tfaPending');
      store.commit('global/setUtcTime', true);
      state.xsrfCookie = undefined;
      state.isAuthenticatedCookie = undefined;
      state.tfaPending = false;
      store.commit('dashboard/resetDashboardData');
      RuntimeConfig.reset();
      state.consoleWindow = null;
      router.push('/login').catch(() => {});
    },
    setConsoleWindow: (state, window) => (state.consoleWindow = window),
    setTfaEnabled: (state, tfaEnabled) => (state.tfaEnabled = tfaEnabled),
    setTfaFeatureEnabled: (state, tfaFeatureEnabled) =>
      (state.tfaFeatureEnabled = tfaFeatureEnabled),
    setIsExternalUser: (state, isExternal) =>
      (state.isExternalUser = isExternal),
    setTfaPending: (state, pending) => {
      state.tfaPending = pending;
      if (pending) {
        localStorage.setItem('tfaPending', 'true');
      } else {
        localStorage.removeItem('tfaPending');
      }
    },
    setUserType: (state, type) => (state.userType = type),
  },
  actions: {
    login({ commit, state }, { username, password }) {
      commit('authError', false);
      return api
        .post('/login', { data: [username, password] })
        .then((response) => {
          commit('authSuccess');
          const userType = response.data?.UserType
            ? response.data.UserType
            : '';
          commit('setUserType', userType);
          // Store Session_ID in global store if present
          if (response.data.Session_ID !== undefined) {
            store.commit('global/setSessionId', response.data.Session_ID);
          }
          if (response.data.RoleId) {
            store.commit('global/setPrivilege', response.data.RoleId);
            localStorage.setItem('loginRoleId', response.data.RoleId); //stored in the localStorage because store getting null when browser refresh
            store.loginRoleId = response.data.RoleId;
            state.loginRoleId = response.data.RoleId;
          }
          if (response.data.TwoFacEnableStatus != undefined) {
            if (response.data.TwoFacEnableStatus == 'N/A') {
              commit('setTfaFeatureEnabled', false);
            } else {
              commit('setTfaEnabled', response.data.TwoFacEnableStatus);
              commit('setTfaFeatureEnabled', true);
              // Set 2FA as pending if enabled - user must verify OTP
              if (response.data.TwoFacEnableStatus) {
                commit('setTfaPending', true);
              }
            }
          }
          if (response.data.RemoteUser) {
            commit('setIsExternalUser', true);
            localStorage.setItem('isExternalUser', 'true');
          } else {
            commit('setIsExternalUser', false);
            localStorage.removeItem('isExternalUser');
          }
        })
        .catch((error) => {
          console.log(error);
          const errorMessage = error.response.data?.error?.code || '';
          if (errorMessage.includes('SessionLimitExceeded')) {
            throw new Error(i18n.t('pagePolicies.toast.errorMaxSessionLogin'));
          }
          if (errorMessage.includes('InsufficientPrivilege')) {
            throw new Error(i18n.t('pagePolicies.toast.noPrivilegeUser'));
          }
          if (error.response.status == 423) {
            commit('authLocked');
          } else {
            commit('authError');
          }
          throw new Error(error);
        });
    },

    async generateOtp(_, { username }) {
      return await api.post('/generate_otp', { username });
    },
    async validateOtp(_, { username, verificationCode, password }) {
      return await api.post('/validate_otp', {
        username,
        verificationcode: verificationCode,
        password,
      });
    },
    async logout({ commit, dispatch }) {
      const isConsoleWindow = store.getters['kvm/getIsConsoleWindow'];
      if (isConsoleWindow && isConsoleWindow.isconsolewindowOpen) {
        try {
          isConsoleWindow.isconsolewindowOpen.close();
        } catch (e) {
          console.log('Could not close KVM console window:', e);
        }
      }

      if (window.isConsoleWindow && !window.isConsoleWindow.closed) {
        try {
          window.isConsoleWindow.postMessage(
            { type: 'SOL_LOGOUT' },
            window.location.origin,
          );
          window.isConsoleWindow.close();
        } catch (e) {
          console.log('Could not close SOL console window:', e);
        }
      }

      return await api
        .post('/logout', { data: [] })
        .then(() => {
          commit('setConsoleWindow', false);
          commit('logout');
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 403) {
            dispatch('customizedResetLogout');
          }
        });
    },
    getUserInfo(_, username) {
      return api
        .get(`/redfish/v1/AccountService/Accounts/${username}`)
        .then(({ data }) => data)
        .catch((error) => {
          if (error?.response?.status === 404) {
            store.loginRoleId =
              store.loginRoleId || localStorage.getItem('loginRoleId');
            return Promise.resolve({
              PasswordChangeRequired: false,
              RoleId: store.loginRoleId,
            });
          }
        });
    },

    async enableTfa({ commit }) {
      const username = localStorage.getItem('storedUsername');
      return await api
        .post(
          `/redfish/v1/AccountService/Accounts/${username}/Actions/Oem/AmiManagerAccount.TwoFactorAuthentication`,
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
          `/redfish/v1/AccountService/Accounts/${username}/Actions/Oem/AmiManagerAccount.TwoFactorAuthentication`,
        )
        .then(() => {
          commit('setTfaEnabled', false);
        })
        .catch((error) => console.log(error));
    },
    async verifyOtp({ commit }, verifyData) {
      const data = {
        username: verifyData.username,
        verificationcode: verifyData.verificationcode,
      };
      return await api
        .post('/verify_otp', data)
        .then((response) => {
          // Clear 2FA pending state after successful verification
          commit('setTfaPending', false);
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
      const isConsoleWindow = store.getters['kvm/getIsConsoleWindow'];
      if (isConsoleWindow && isConsoleWindow.isconsolewindowOpen) {
        try {
          isConsoleWindow.isconsolewindowOpen.close();
        } catch (e) {
          console.log('Could not close KVM console window:', e);
        }
      }
      if (window.isConsoleWindow && !window.isConsoleWindow.closed) {
        try {
          window.isConsoleWindow.postMessage(
            { type: 'SOL_LOGOUT' },
            window.location.origin,
          );
          window.isConsoleWindow.close();
        } catch (e) {
          console.log('Could not close SOL console window:', e);
        }
      }

      commit('setConsoleWindow', false);
      commit('logout');
      localStorage.removeItem('storedLanguage');
      Cookies.remove('loginSessionSuccess');
      router.push('/login').catch(() => {});
    },
    clearCookie({ commit }) {
      Cookies.remove('XSRF-TOKEN');
      Cookies.remove('IsAuthenticated');
      Cookies.remove('loginSessionSuccess');
      localStorage.removeItem('tfaPending');
      commit('setConsoleWindow', false);
      commit('setTfaPending', false);
    },
  },
};

export default AuthenticationStore;
