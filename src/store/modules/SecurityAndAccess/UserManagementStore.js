import api, { getResponseCount } from '@/store/api';
import i18n from '@/i18n';
import store from '../GlobalStore';

const UserManagementStore = {
  namespaced: true,
  state: {
    allUsers: [],
    accountRoles: [],
    accountLockoutDuration: null,
    accountLockoutThreshold: null,
    accountMinPasswordLength: null,
    accountMaxPasswordLength: null,
  },
  getters: {
    allUsers(state) {
      return state.allUsers;
    },
    accountRoles(state) {
      return state.accountRoles;
    },
    accountSettings(state) {
      return {
        lockoutDuration: state.accountLockoutDuration,
        lockoutThreshold: state.accountLockoutThreshold,
      };
    },
    accountPasswordRequirements(state) {
      return {
        minLength: state.accountMinPasswordLength,
        maxLength: state.accountMaxPasswordLength,
      };
    },
  },
  mutations: {
    setUsers(state, allUsers) {
      state.allUsers = allUsers;
    },
    setAccountRoles(state, accountRoles) {
      state.accountRoles = accountRoles;
    },
    setLockoutDuration(state, lockoutDuration) {
      state.accountLockoutDuration = lockoutDuration;
    },
    setLockoutThreshold(state, lockoutThreshold) {
      state.accountLockoutThreshold = lockoutThreshold;
    },
    setAccountMinPasswordLength(state, minPasswordLength) {
      state.accountMinPasswordLength = minPasswordLength;
    },
    setAccountMaxPasswordLength(state, maxPasswordLength) {
      state.accountMaxPasswordLength = maxPasswordLength;
    },
  },
  actions: {
    async getSessionsData() {
      return await api
        .get('/redfish/v1/SessionService/Sessions')
        .then((response) =>
          response.data.Members.map((sessionLogs) => sessionLogs['@odata.id'])
        )
        .then((sessionUris) =>
          api.all(sessionUris.map((sessionUri) => api.get(sessionUri)))
        )
        .then((sessionUris) => {
          const allSessionsData = sessionUris.map((sessionUri) => {
            return sessionUri.data;
          });
          return allSessionsData;
        })
        .catch((error) => {
          console.log('Client Session Data:', error);
        });
    },
    async getUsers({ commit }) {
      return await api
        .get('/redfish/v1/AccountService/Accounts')
        .then((response) =>
          response.data.Members.map((user) => user['@odata.id'])
        )
        .then((userIds) => {
          const userRequests = userIds.map((user) => {
            return api.get(user).catch((error) => {
              console.log(`Failed to fetch user ${user}: ${error}`);
              return null;
            });
          });
          return Promise.all(userRequests);
        })
        .then((users) => {
          const userData = users
            .filter((user) => user !== null)
            .map((user) => user.data);
          commit('setUsers', userData);
        })
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageUserManagement.toast.errorLoadUsers');
          throw new Error(message);
        });
    },
    getAccountSettings({ commit }) {
      api
        .get('/redfish/v1/AccountService')
        .then(({ data }) => {
          commit('setLockoutDuration', data.AccountLockoutDuration);
          commit('setLockoutThreshold', data.AccountLockoutThreshold);
          commit('setAccountMinPasswordLength', data.MinPasswordLength);
          commit('setAccountMaxPasswordLength', data.MaxPasswordLength);
        })
        .catch((error) => {
          console.log(error);
          const message = i18n.t(
            'pageUserManagement.toast.errorLoadAccountSettings'
          );
          throw new Error(message);
        });
    },
    getAccountRoles({ commit }) {
      api
        .get('/redfish/v1/AccountService/Roles')
        .then(({ data: { Members = [] } = {} }) => {
          const roles = Members.map((role) => {
            return role['@odata.id'].split('/').pop();
          });
          commit('setAccountRoles', roles);
        })
        .catch((error) => console.log(error));
    },
    async createUser(
      { dispatch },
      {
        username,
        password,
        privilege,
        status,
        PasswordChangeRequired,
        vmediaAccess,
      }
    ) {
      const data = {
        UserName: username,
        Password: password,
        RoleId: privilege,
        Enabled: status,
        PasswordChangeRequired: PasswordChangeRequired,
        OEMAccountTypes: vmediaAccess ? ['media'] : [],
      };
      return await api
        .post('/redfish/v1/AccountService/Accounts', data)
        .then(() => dispatch('getUsers'))
        .then(() =>
          i18n.t('pageUserManagement.toast.successCreateUser', {
            username,
          })
        )
        .catch(async (error) => {
          console.log(error);
          let temp = await dispatch('handleError', { error, username });
          throw new Error(temp);
        });
    },
    async updateUser(
      { dispatch },
      {
        originalUsername,
        username,
        password,
        privilege,
        status,
        locked,
        // PasswordChangeRequired,
        routerPath,
        vmediaAccess,
      }
    ) {
      const data = {};
      const globalPrivilege = store.getters.userPrivilege(store.state);
      if (globalPrivilege === 'Administrator') {
        if (originalUsername === 'root') {
          if (password) data.Password = password;
        } else {
          if (username) data.UserName = username;
          if (password) data.Password = password;
          if (privilege) data.RoleId = privilege;
          if (vmediaAccess !== undefined)
            data.OEMAccountTypes = vmediaAccess ? ['media'] : [];
          if (status !== undefined) data.Enabled = status;
          if (locked !== undefined) data.Locked = locked;
        }
      } else if (privilege === 'Operator' || privilege === 'ReadOnly') {
        if (password) data.Password = password;
      }
      /*if (PasswordChangeRequired !== undefined)
        data.PasswordChangeRequired = PasswordChangeRequired;*/
      return await api
        .patch(`/redfish/v1/AccountService/Accounts/${originalUsername}`, data)
        .then(() => dispatch('getUsers'))
        .then(() => {
          if (routerPath === '/change-password') {
            return i18n.t('pageUserManagement.toast.successPasswordChanged');
          } else {
            return i18n.t('pageUserManagement.toast.successUpdateUser', {
              username: originalUsername,
            });
          }
        })
        .catch(async (error) => {
          console.log(error);
          let temp = await dispatch('handleError', { error, originalUsername });
          throw new Error(temp);
        });
    },
    async deleteUser({ dispatch }, username) {
      return await api
        .delete(`/redfish/v1/AccountService/Accounts/${username}`)
        .then(() => dispatch('getUsers'))
        .then(() =>
          i18n.t('pageUserManagement.toast.successDeleteUser', {
            username,
          })
        )
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageUserManagement.toast.errorDeleteUser', {
            username,
          });
          throw new Error(message);
        });
    },
    async deleteUsers({ dispatch }, users) {
      const promises = users.map(({ username }) => {
        return api
          .delete(`/redfish/v1/AccountService/Accounts/${username}`)
          .catch((error) => {
            console.log(error);
            return error;
          });
      });
      return await api
        .all(promises)
        .then((response) => {
          dispatch('getUsers');
          return response;
        })
        .then(
          api.spread((...responses) => {
            const { successCount, errorCount } = getResponseCount(responses);
            let toastMessages = [];

            if (successCount) {
              const message = i18n.tc(
                'pageUserManagement.toast.successBatchDelete',
                successCount
              );
              toastMessages.push({ type: 'success', message });
            }

            if (errorCount) {
              const message = i18n.tc(
                'pageUserManagement.toast.errorBatchDelete',
                errorCount
              );
              toastMessages.push({ type: 'error', message });
            }

            return toastMessages;
          })
        );
    },
    async enableUsers({ dispatch }, users) {
      const data = {
        Enabled: true,
      };
      const promises = users.map(({ username }) => {
        return api
          .patch(`/redfish/v1/AccountService/Accounts/${username}`, data)
          .catch((error) => {
            console.log(error);
            return error;
          });
      });
      return await api
        .all(promises)
        .then((response) => {
          dispatch('getUsers');
          return response;
        })
        .then(
          api.spread((...responses) => {
            const { successCount, errorCount } = getResponseCount(responses);
            let toastMessages = [];

            if (successCount) {
              const message = i18n.tc(
                'pageUserManagement.toast.successBatchEnable',
                successCount
              );
              toastMessages.push({ type: 'success', message });
            }

            if (errorCount) {
              const message = i18n.tc(
                'pageUserManagement.toast.errorBatchEnable',
                errorCount
              );
              toastMessages.push({ type: 'error', message });
            }

            return toastMessages;
          })
        );
    },
    async disableUsers({ dispatch }, users) {
      const data = {
        Enabled: false,
      };
      const promises = users.map(({ username }) => {
        return api
          .patch(`/redfish/v1/AccountService/Accounts/${username}`, data)
          .catch((error) => {
            console.log(error);
            return error;
          });
      });
      return await api
        .all(promises)
        .then((response) => {
          dispatch('getUsers');
          return response;
        })
        .then(
          api.spread((...responses) => {
            const { successCount, errorCount } = getResponseCount(responses);
            let toastMessages = [];

            if (successCount) {
              const message = i18n.tc(
                'pageUserManagement.toast.successBatchDisable',
                successCount
              );
              toastMessages.push({ type: 'success', message });
            }

            if (errorCount) {
              const message = i18n.tc(
                'pageUserManagement.toast.errorBatchDisable',
                errorCount
              );
              toastMessages.push({ type: 'error', message });
            }

            return toastMessages;
          })
        );
    },
    async saveAccountSettings(
      { dispatch },
      { lockoutThreshold, lockoutDuration }
    ) {
      const data = {};
      if (lockoutThreshold !== undefined) {
        data.AccountLockoutThreshold = lockoutThreshold;
      }
      if (lockoutDuration !== undefined) {
        data.AccountLockoutDuration = lockoutDuration;
      }

      return await api
        .patch('/redfish/v1/AccountService', data)
        //GET new settings to update view
        .then(() => dispatch('getAccountSettings'))
        .then(() => i18n.t('pageUserManagement.toast.successSaveSettings'))
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageUserManagement.toast.errorSaveSettings');
          throw new Error(message);
        });
    },
    async handleError(_, { error, username, originalUsername }) {
      if (
        error.response &&
        error.response.data &&
        error.response.data['Password@Message.ExtendedInfo']
      ) {
        const extendedInfo =
          error.response.data['Password@Message.ExtendedInfo'];
        if (Array.isArray(extendedInfo) && extendedInfo.length > 0) {
          const message = extendedInfo[0].Message;
          if (message && message.indexOf('Password') !== -1) {
            const errorMessage = i18n.t(
              'pageUserManagement.toast.errorInvalidPassword',
              {
                username,
                originalUsername,
              }
            );
            return errorMessage;
          }
        }
      }
      if (username && username != undefined) {
        const errorMessage = i18n.t(
          'pageUserManagement.toast.errorCreateUser',
          {
            username,
          }
        );
        return errorMessage;
      }
      if (originalUsername && originalUsername != undefined) {
        const errorMessage = i18n.t(
          'pageUserManagement.toast.errorUpdateUser',
          {
            username: originalUsername,
          }
        );
        return errorMessage;
      }
    },
  },
};

export default UserManagementStore;
