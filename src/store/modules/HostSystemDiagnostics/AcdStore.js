import i18n from '@/i18n';
import api from '@/store/api';

const AutonomousCrashDumpStore = {
  namespaced: true,
  state: {
    allCrashDump: [],
    getJsonFile: [],
    TaskState: null,
    ACDEnabled: null,
  },
  getters: {
    allCrashDump: (state) => state.allCrashDump,
    getJsonFile: (state) => state.getJsonFile,
    TaskState: (state) => state.TaskState,
    ACDEnabled: (state) => state.ACDEnabled,
  },
  mutations: {
    setAllCrashDump: (state, allCrashDump) =>
      (state.allCrashDump = allCrashDump),
    setJsonFile: (state, getJsonFile) => (state.getJsonFile = getJsonFile),
    setTaskState: (state, TaskState) => (state.TaskState = TaskState),
    setAcdServerEnabled: (state, ACDEnabled) => (state.ACDEnabled = ACDEnabled),
  },
  actions: {
    async getcrashDumpData({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/LogServices/Crashdump/Entries')
        .then(({ data: { Members = [] } = {} }) => {
          const allCrashDumpData = Members.map((log, index) => {
            var createdate = new Date(log.Created);
            return {
              date: createdate,
              filename: log.AdditionalDataURI.split('/').pop(),
              Sino: index + 1,
            };
          });

          commit('setAllCrashDump', allCrashDumpData);
          return Members[0]?.AdditionalDataURI;
        })
        .then((data) => {
          if (data != null && data != undefined) {
            api.get(data).then((response) => {
              const getData = response.data;
              commit('setJsonFile', getData);
            });
          }
        })
        .catch((error) => {
          console.log('Crash Dump:', error);
        });
    },
    async checkStatus({ commit, dispatch }, data) {
      return await api.get(data).then((response) => {
        localStorage.setItem('polling', data);
        if (response.data.TaskState === 'Running') {
          commit('setTaskState', response.data.TaskState);
        } else {
          if (response.data.TaskState === 'Completed') {
            commit('setTaskState', response.data.TaskState);
            localStorage.removeItem('polling');
            dispatch('getcrashDumpData');
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
          commit('setAcdServerEnabled', response.data.Enabled);
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
  },
};
export default AutonomousCrashDumpStore;
