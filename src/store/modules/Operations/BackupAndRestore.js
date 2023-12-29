import api from '@/store/api';
import i18n from '@/i18n';

const BackupAndRestore = {
  namespaced: true,
  state: {
    BackupDatas: [],
    smtp: null,
    ipmi: null,
    kvm: null,
    network: null,
    ntp: null,
    snmp: null,
    sysLog: null,
    backupFile: {},
  },
  getters: {
    BackupDatas(state) {
      return state.BackupDatas;
    },
    smtp: (state) => state.smtp,
    ipmi: (state) => state.ipmi,
    kvm: (state) => state.kvm,
    network: (state) => state.network,
    ntp: (state) => state.ntp,
    snmp: (state) => state.snmp,
    sysLog: (state) => state.sysLog,
    backupFile: (state) => state.backupFile,
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
    setKvm(state, kvm) {
      state.kvm = kvm;
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
    setBackupFile(state, backupFile) {
      state.backupFile = backupFile;
    },
  },
  actions: {
    async updateBackup({ dispatch, commit }, authentication) {
      const data = {
        BackupFeatures: authentication,
      };
      return await api
        .post(
          '/redfish/v1/Managers/bmc/Actions/Oem/AMIManager.BackupConfig',
          data
        )
        .then((response) => {
          commit('setBackupFile', response.data);
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
              i18n.t('pageBackupAndRestore.toast.errorMessageNotConfigured')
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
            response.data.Oem.Ami?.SelectedBackupFeatures?.SMTP
          );
          commit(
            'setIPMI',
            response.data.Oem.Ami?.SelectedBackupFeatures?.IPMI
          );
          commit('setKvm', response.data.Oem.Ami?.SelectedBackupFeatures?.KVM);
          commit(
            'setNetwork',
            response.data.Oem.Ami?.SelectedBackupFeatures?.Network
          );
          commit(
            'setSnmp',
            response.data.Oem.Ami?.SelectedBackupFeatures?.SNMP
          );
          commit('setNtp', response.data.Oem.Ami?.SelectedBackupFeatures?.NTP);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageBackupAndRestore.toast.errorGettingBackupDetails')
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
          config
        )
        .then(() => {
          return i18n.t('pageBackupAndRestore.toast.fileUploadedSuccessfully');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageBackupAndRestore.toast.fileUploadedError')
          );
        });
    },
  },
};
export default BackupAndRestore;
