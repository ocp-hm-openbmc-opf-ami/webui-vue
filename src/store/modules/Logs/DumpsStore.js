import api, { getResponseCount } from '@/store/api';
import i18n from '@/i18n';
import UtcDateTimeMixin from '@/components/Mixins/UtcDateTimeMixin';
import store from '@/store/';

const DumpsStore = {
  namespaced: true,
  state: {
    allDumps: [],
    hasActiveDumpTask: false,
  },
  getters: {
    allDumps: (state) => state.allDumps,
    hasActiveDumpTask: (state) => state.hasActiveDumpTask,
  },
  mutations: {
    setAllDumps: (state, allDumps) => (state.allDumps = allDumps),
    setHasActiveDumpTask: (state, value) => (state.hasActiveDumpTask = value),
  },
  actions: {
    async checkActiveDumpTasks({ commit }) {
      try {
        const tasksResp = await api.get('/redfish/v1/TaskService/Tasks');
        const members = tasksResp.data.Members || [];
        for (const member of members) {
          const taskUrl = member['@odata.id'];
          if (!taskUrl) continue;
          const taskResp = await api.get(taskUrl);
          const task = taskResp.data;
          if (
            task.Payload &&
            task.Payload.TargetUri ===
              '/redfish/v1/Managers/' +
                store.getters['global/managerInstance'] +
                '/LogServices/Dump/Actions/LogService.CollectDiagnosticData' &&
            task.TaskState === 'New'
          ) {
            commit('setHasActiveDumpTask', true);
            return;
          }
        }
        commit('setHasActiveDumpTask', false);
      } catch (e) {
        commit('setHasActiveDumpTask', false);
      }
    },
    async getBmcDumpEntries() {
      return api
        .get('/redfish/v1/')
        .then((response) => api.get(response.data.Managers['@odata.id']))
        .then((response) =>
          api.get(
            `${response.data['@odata.id']}/${store.getters['global/managerInstance']}`,
          ),
        )
        .then((response) => api.get(response.data.LogServices['@odata.id']))
        .then((response) => api.get(`${response.data['@odata.id']}/Dump`))
        .then((response) => api.get(response.data.Entries['@odata.id']))
        .catch((error) => console.log(error));
    },
    async getSystemDumpEntries() {
      return api
        .get('/redfish/v1/')
        .then((response) => api.get(response.data.Systems['@odata.id']))
        .then((response) => api.get(`${response.data['@odata.id']}/system`))
        .then((response) => api.get(response.data.LogServices['@odata.id']))
        .then((response) => api.get(`${response.data['@odata.id']}/Dump`))
        .then((response) => api.get(response.data.Entries['@odata.id']))
        .catch((error) => console.log(error));
    },
    async getAllDumps({ commit, dispatch }) {
      return await api
        .all([dispatch('getBmcDumpEntries'), dispatch('getSystemDumpEntries')])
        .then((response) => {
          const bmcDumpEntries = response[0].data?.Members || [];
          const systemDumpEntries = response[1].data?.Members || [];
          const allDumps = [...bmcDumpEntries, ...systemDumpEntries];
          const allDumpsData = allDumps.map((dump) => {
            let lastElement = dump['@odata.id'].split('/').pop();
            let downloadURIParts = dump.AdditionalDataURI.split('/');
            let extractedValue = downloadURIParts[downloadURIParts.length - 2];
            const dateTimeObj =
              UtcDateTimeMixin.methods.createDateWithISOString(dump.Created);
            return {
              data: extractedValue,
              dateTime: dateTimeObj,
              dumpType: dump.Name,
              id: dump.Id,
              uri: lastElement,
              size: dump.AdditionalDataSizeBytes,
            };
          });
          commit('setAllDumps', allDumpsData);
        })
        .catch((error) => console.log(error));
    },
    async createBmcDump() {
      return await api
        .post(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/LogServices/Dump/Actions/LogService.CollectDiagnosticData',
          {
            DiagnosticDataType: 'Manager',
            OEMDiagnosticDataType: '',
          },
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageDumps.toast.errorStartBmcDump'));
        });
    },
    async createSystemDump() {
      return await api
        .post(
          '/redfish/v1/Systems/system/LogServices/Dump/Actions/LogService.CollectDiagnosticData',
          {
            DiagnosticDataType: 'OEM',
            OEMDiagnosticDataType: 'System',
          },
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageDumps.toast.errorStartSystemDump'));
        });
    },
    async deleteDumps({ dispatch }, uris = []) {
      const promises = uris.map((uri) =>
        api.delete(uri).catch((error) => {
          console.log(error);
          return error;
        }),
      );
      return await api
        .all(promises)
        .then((response) => {
          dispatch('getAllDumps');
          return response;
        })
        .then(
          api.spread((...responses) => {
            const { successCount, errorCount } = getResponseCount(responses);
            const toastMessages = [];

            if (successCount) {
              const message = i18n.tc(
                'pageDumps.toast.successDeleteDump',
                successCount,
              );
              toastMessages.push({ type: 'success', message });
            }

            if (errorCount) {
              const message = i18n.tc(
                'pageDumps.toast.errorDeleteDump',
                errorCount,
              );
              toastMessages.push({ type: 'error', message });
            }

            return toastMessages;
          }),
        );
    },
    async deleteAllDumps({ commit, state }) {
      const totalDumpCount = state.allDumps.length;
      return await api
        .post(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/LogServices/Dump/Actions/LogService.ClearLog',
        )
        .then(() => {
          commit('setAllDumps', []);
          return i18n.tc('pageDumps.toast.successDeleteDump', totalDumpCount);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.tc('pageDumps.toast.errorDeleteDump', totalDumpCount),
          );
        });
    },
  },
};

export default DumpsStore;
