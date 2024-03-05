import i18n from '@/i18n';
import api from '@/store/api';

const AutonomousCrashDumpStore = {
  namespaced: true,
  state: {
    allCrashDump: [],
    TaskState: null,
    ACDEnabled: null,
  },
  getters: {
    allCrashDump: (state) => state.allCrashDump,
    TaskState: (state) => state.TaskState,
    ACDEnabled: (state) => state.ACDEnabled,
  },
  mutations: {
    setAllCrashDump: (state, allCrashDump) =>
      (state.allCrashDump = allCrashDump),
    setTaskState: (state, TaskState) => (state.TaskState = TaskState),
    setAcdServerEnabled: (state, ACDEnabled) => (state.ACDEnabled = ACDEnabled),
  },
  actions: {
    async checkStatus({ commit, dispatch }, data) {
      return await api.get(data).then((response) => {
        localStorage.setItem('polling', data);
        if (response.data.TaskState === 'Running') {
          commit('setTaskState', response.data.TaskState);
        } else {
          if (response.data.TaskState === 'Completed') {
            commit('setTaskState', response.data.TaskState);
            localStorage.removeItem('polling');
            dispatch('getAcdServerStatus');
            return i18n.t(
              'pageAutonomousCrashDump.toast.successGenerateCrashDumpLog'
            );
          }
        }
      });
    },
    async createCrashDump() {
      return await api
        .post(
          '/redfish/v1/Systems/system/LogServices/Crashdump/Actions/LogService.CollectDiagnosticData/',
          {
            DiagnosticDataType: 'OEM',
            OEMDiagnosticDataType: 'OnDemand',
          }
        )
        .then((response) => {
          const data = response.data['@odata.id'];
          return data;
        })
        .catch((error) => {
          console.log(error);
          throw new Error(error.response.data.error.message);
        });
    },
    async getAcdServerStatus({ commit }) {
      return await api
        .get('/redfish/v1/Oem/Ami/AutonomousCrashDump')
        .then((response) => {
          const dumpFileUrls = response.data?.DumpFiles;
          const allCrashDumpData = dumpFileUrls.map((log, index) => {
            var createdate = new Date(log.Created);
            return {
              date: createdate,
              filename: log.FilePath.split('/').pop(),
              urls: log.FilePath,
              Sino: index + 1,
            };
          });
          commit('setAcdServerEnabled', response.data.Enabled);
          commit('setAllCrashDump', allCrashDumpData);
          return dumpFileUrls;
        })
        .catch((error) => console.log(error));
    },
    async saveAcdServerStatus({ commit, dispatch }, acdServerEnabled) {
      commit('setAcdServerEnabled', acdServerEnabled);
      const ACD = {
        Enabled: acdServerEnabled,
      };
      return await api
        .patch('/redfish/v1/Oem/Ami/AutonomousCrashDump', ACD)
        .then(dispatch('getAcdServerStatus'))
        .then(() => {
          if (acdServerEnabled) {
            return i18n.t('pageAutonomousCrashDump.toast.successACDEnabled');
          } else {
            return i18n.t('pageAutonomousCrashDump.toast.successACDDisabled');
          }
        })
        .catch((error) => {
          console.log(error);
          commit('setAcdServerEnabled', !acdServerEnabled);
          if (acdServerEnabled) {
            throw new Error(
              i18n.t('pageAutonomousCrashDump.toast.errorACDEnabled')
            );
          } else {
            throw new Error(
              i18n.t('pageAutonomousCrashDump.toast.errorACDDisabled')
            );
          }
        });
    },
    async getJsonData(_, data) {
      return await api.get(data).then((response) => {
        if (response.data == '') {
          const getJsonFile = {};
          return getJsonFile;
        } else {
          const getJsonFile = response.data;
          return getJsonFile;
        }
      });
    },
  },
};
export default AutonomousCrashDumpStore;
