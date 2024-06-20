import api from '@/store/api';
import i18n from '@/i18n';

const BackupAndRestore = {
  namespaced: true,
  state: {
    BackupDatas: [],
    smtp: null,
    ipmi: null,
    virtualMedia: null,
    network: null,
    ntp: null,
    snmp: null,
    sysLog: null,
  },
  getters: {
    BackupDatas(state) {
      return state.BackupDatas;
    },
    smtp: (state) => state.smtp,
    ipmi: (state) => state.ipmi,
    virtualMedia: (state) => state.virtualMedia,
    network: (state) => state.network,
    ntp: (state) => state.ntp,
    snmp: (state) => state.snmp,
    sysLog: (state) => state.sysLog,
  },
  mutations: {
    setBackupDatas(state, BackupDatas) {
      state.BackupDatas = BackupDatas;
    },
    setSmtp(state, smtp) {
      state.smtp = smtp;
    },
    setIPMI(state, ipmi) {
      state.ipmi = ipmi;
    },
    setVirtualMedia(state, virtualMedia) {
      state.virtualMedia = virtualMedia;
    },
    setNetwork(state, network) {
      state.network = network;
    },
    setNtp(state, ntp) {
      state.ntp = ntp;
    },
    setSnmp(state, snmp) {
      state.snmp = snmp;
    },
    setSysLog(state, sysLog) {
      state.sysLog = sysLog;
    },
  },
  actions: {
    async updateBackup({ dispatch }, authentication) {
      const data = {
        BackupFeatures: authentication,
      };
      return await api
        .post(
          '/redfish/v1/Managers/bmc/Actions/Oem/AMIManager.BackupConfig',
          data,
        )
        .then((response) => {
          // Create a temporary URL
          const url = response.data['@Message.ExtendedInfo'][0].MessageArgs[0];

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
        .get('/redfish/v1/Managers/bmc')
        .then((response) => {
          commit(
            'setSmtp',
            response.data.Oem.Ami?.SelectedBackupFeatures?.SMTP,
          );
          commit(
            'setIPMI',
            response.data.Oem.Ami?.SelectedBackupFeatures?.IPMI,
          );
          commit(
            'setVirtualMedia',
            response.data.Oem.Ami?.SelectedBackupFeatures?.['Virtual-media'],
          );
          commit(
            'setNetwork',
            response.data.Oem.Ami?.SelectedBackupFeatures?.Network,
          );
          commit(
            'setSnmp',
            response.data.Oem.Ami?.SelectedBackupFeatures?.SNMP,
          );
          commit('setNtp', response.data.Oem.Ami?.SelectedBackupFeatures?.NTP);
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
          'redfish/v1/Managers/bmc/Actions/Oem/AMIManager.RestoreConfig',
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
