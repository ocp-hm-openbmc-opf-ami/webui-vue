import api from '@/store/api';

const BackupAndRestore = {
  namespaced: true,
  state: {
    BackupDatas: [],
    authentication: null,
    ipmi: null,
    kvm: null,
    network: null,
    ntp: null,
    snmp: null,
    sysLog: null,
    backupFile: [],
  },
  getters: {
    BackupDatas(state) {
      return state.BackupDatas;
    },
    authentication: (state) => state.authentication,
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
    setAuthentication(state, authentication) {
      state.authentication = authentication;
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
    async updateBackup({ dispatch }, authentication) {
      const data = {
        BackupFeatures: authentication,
      };
      return await api
        .post(
          '/redfish/v1/Managers/bmc/Actions/Oem/AMIManager.BackupConfig',
          data
        )
        .then(dispatch('getBackupConfig'));
    },
    async getBackupConfig({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc')
        .then((response) => {
          commit(
            'setAuthentication',
            response.data.Oem.Ami?.SelectedBackupFeatures?.Authentication
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
        .catch((error) => console.log(error));
    },
  },
};
export default BackupAndRestore;
