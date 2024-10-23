import api from '@/store/api';
import i18n from '@/i18n';

const TaskStore = {
  namespaced: true,
  state: {
    taskData: [],
  },
  getters: {
    taskData: (state) => state.taskData,
  },
  mutations: {
    setTaskData: (state, taskData) => {
      state.taskData = taskData;
    },
  },
  actions: {
    async getTaskData({ commit }) {
      return await api
        .get('/redfish/v1/TaskService')
        .then((response) => {
          api
            .get(response.data.Tasks['@odata.id'])
            .then((response) =>
              response.data.Members.map((uri) => uri['@odata.id']),
            )
            .then((uri) =>
              api.all(uri.map((taskInterface) => api.get(taskInterface))),
            )
            .then((taskList) => {
              const taskData = taskList.map((list) => {
                const Id = list.data.Id;
                const EndTime =
                  list.data.TaskState === 'New'
                    ? 'NA'
                    : new Date(list.data.EndTime);
                const StartTime = new Date(list.data.StartTime);
                const Name = list.data.Name;
                const PercentComplete = list.data.PercentComplete;
                const HttpOperation = list.data.Payload.HttpOperation;
                const TargetUri = list.data.Payload.TargetUri;
                const state = list.data.TaskState;
                return {
                  Id: Id,
                  Name: Name,
                  StartTime: StartTime,
                  EndTime: EndTime,
                  PercentComplete: PercentComplete,
                  HttpOperation: HttpOperation,
                  TargetUri: TargetUri,
                  state: state,
                };
              });
              commit('setTaskData', taskData);
            });
        })
        .catch((error) => console.log(error));
    },
    async deleteTask({ dispatch }, Id) {
      return await api
        .delete(`/redfish/v1/TaskService/Tasks/${Id}`)
        .then(() => dispatch('getTaskData'))
        .then(() =>
          i18n.t('pageTask.toast.successfullyCancelledTask', {
            Id,
          }),
        )
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageTask.toast.errorCancellingTask', {
            Id,
          });
          throw new Error(message);
        });
    },
  },
};
export default TaskStore;
