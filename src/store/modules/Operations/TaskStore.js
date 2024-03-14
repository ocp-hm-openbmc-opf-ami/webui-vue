import api from '@/store/api';
// import i18n from '@/i18n';

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
          console.log('data', response.data.Tasks);
          api
            .get(response.data.Tasks['@odata.id'])
            .then((response) =>
              response.data.Members.map((uri) => uri['@odata.id'])
            )
            .then((uri) =>
              api.all(uri.map((taskInterface) => api.get(taskInterface)))
            )
            .then((taskList) => {
              const taskData = taskList.map((list) => list.data);
              console.log('taskList', taskData);
              commit('setTaskData', taskData);
            });
        })
        .catch((error) => console.log(error));
    },
  },
};
export default TaskStore;
