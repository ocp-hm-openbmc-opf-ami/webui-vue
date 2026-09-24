import api from '@/store/api';
import i18n from '@/i18n';
import store from '@/store/';

const BackupAndRestore = {
  namespaced: true,
  state: {
    backupConfigValues: {},
  },
  getters: {
    getBackupConfigValues: (state) => state.backupConfigValues,
  },
  mutations: {
    setBackupConfigValues: (state, backupConfigValues) =>
      (state.backupConfigValues = backupConfigValues),
  },
  actions: {
    async updateBackup({ dispatch }, authentication) {
      const data = {
        BackupFeatures: authentication,
      };
      return await api
        .post(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/Actions/Oem/AmiManager.BackupConfig',
          data,
        )
        .then((response) => {
          // Create a temporary URL
          const url =
            response.data['BackupFeatures@Message.ExtendedInfo'][0]
              .MessageArgs[0];

          // Create a link element
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'bmc-config.tar');
          // Append the link to the body
          document.body.appendChild(link);
          link.click();
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        })
        .then(() => dispatch('getBackupConfig'))
        .then(() => {
          return i18n.t('pageBackupAndRestore.toast.successMessage');
        })
        .catch((error) => {
          console.log(error);
          const errorMessage = error.response.data?.error?.message || '';
          if (errorMessage.includes('Configuration file doesnot exit')) {
            throw new Error(
              i18n.t('pageBackupAndRestore.toast.errorMessageNotConfigured'),
            );
          } else {
            throw new Error(i18n.t('pageBackupAndRestore.toast.errorMessage'));
          }
        });
    },
    async getBackupConfig({ commit }) {
      return await api
        .get('/redfish/v1/Managers/' + store.getters['global/managerInstance'])
        .then((response) => {
          const getBackupConfigValues =
            response.data.Oem.Ami?.SelectedBackupFeatures;
          const togglebuttons = {};
          if (getBackupConfigValues?.SMTP !== undefined) {
            togglebuttons.SMTP = getBackupConfigValues?.SMTP;
          }
          if (getBackupConfigValues?.['Virtual-media'] !== undefined) {
            togglebuttons.VirtualMedia =
              getBackupConfigValues?.['Virtual-media'];
          }
          if (getBackupConfigValues?.Network !== undefined) {
            togglebuttons.Network = getBackupConfigValues?.Network;
          }
          if (getBackupConfigValues?.NTP !== undefined) {
            togglebuttons.NTP = getBackupConfigValues?.NTP;
          }
          commit('setBackupConfigValues', togglebuttons);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageBackupAndRestore.toast.errorGettingBackupDetails'),
          );
        });
    },
    async uploadRestoreFiles(_, uploadRestoreFiles) {
      let uploadData = new FormData();
      uploadData.append('conf_file', uploadRestoreFiles);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      return await api
        .post(
          'redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/Actions/Oem/AmiManager.RestoreConfig',
          uploadData,
          config,
        )
        .then(() => {
          return i18n.t('pageBackupAndRestore.toast.fileUploadedSuccessfully');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageBackupAndRestore.toast.fileUploadedError'),
          );
        });
    },
  },
};
export default BackupAndRestore;
