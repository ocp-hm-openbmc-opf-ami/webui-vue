import api from '@/store/api';

const DeviceOwnerTransfershipStore = {
  namespaced: true,
  state: {
    activeStep: 2, // Start from step 3
    cakUnlockStatus: null,
    dotDisableStatus: null,
    dotEnableStatus: null,
    cakInstallStatus: null,
    cakLockStatus: null,
    cakTestStatus: null,
    cakSignTestStatus: null,
    taskPollingInterval: null,
  },
  mutations: {
    setActiveStep(state, step) {
      state.activeStep = step;
    },
    // setCakUnlockStatus(state, status) {
    //   state.cakUnlockStatus = status;
    // },
    // setDotDisableStatus(state, status) {
    //   state.dotDisableStatus = status;
    // },
    setDotEnableStatus(state, status) {
      state.dotEnableStatus = status;
    },
    setCakInstallStatus(state, status) {
      state.cakInstallStatus = status;
    },
    setCakLockStatus(state, status) {
      state.cakLockStatus = status;
    },
    setCakTestStatus(state, status) {
      state.cakTestStatus = status;
    },
    setCakSignTestStatus(state, status) {
      state.cakSignTestStatus = status;
    },
    resetSteps(state) {
      state.activeStep = 2; // Reset to step 3
      // state.cakUnlockStatus = null;
      // state.dotDisableStatus = null;
      state.dotEnableStatus = null;
      state.cakInstallStatus = null;
      state.cakLockStatus = null;
      state.cakTestStatus = null;
      state.cakSignTestStatus = null;
      if (state.taskPollingInterval) {
        clearInterval(state.taskPollingInterval);
      }
      state.taskPollingInterval = null;
    },
    setTaskPollingInterval(state, interval) {
      state.taskPollingInterval = interval;
    },
    clearTaskPollingInterval(state) {
      if (state.taskPollingInterval) {
        clearInterval(state.taskPollingInterval);
        state.taskPollingInterval = null;
      }
    },
  },
  actions: {
    pollTask({ commit, state }, { taskUrl, filename }) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          if (!state.taskPollingInterval) {
            clearInterval(interval);
            return;
          }
          try {
            const response = await api.get(taskUrl);
            const task = response?.data;
            if (
              task.TaskState === 'Completed' ||
              task.TaskState === 'Exception'
            ) {
              commit('clearTaskPollingInterval');
              // Extract 'Location' header from array of header strings
              let URL = null;
              const headers = task?.Payload?.HttpHeaders;
              if (Array.isArray(headers)) {
                const locationHeader = headers.find((h) =>
                  h.toLowerCase().startsWith('location:'),
                );
                if (locationHeader) {
                  URL = locationHeader.split(':', 2)[1]?.trim();
                }
              }
              if (URL) {
                // Handle the successful case
                // Create a link element
                const link = document.createElement('a');
                link.href = URL;
                link.setAttribute('download', filename);
                // Append the link to the body
                document.body.appendChild(link);
                link.click();
                // Cleanup
                document.body.removeChild(link);
                resolve(task); // Resolve if we get a file URL
              } else if (task.TaskState === 'Exception') {
                reject(task);
              } else {
                resolve(task);
              }
            }
          } catch (error) {
            commit('clearTaskPollingInterval');
            reject(error);
          }
        }, 2000); // Polling every 2 seconds
        commit('setTaskPollingInterval', interval);
      });
    },

    // step1_generateCAKUnlockToken({ dispatch }) {
    //   if (mock) {
    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         const error = new Error('Mock token generation');
    //         error.attachment = new Blob(['mock token data step 1'], {
    //           type: 'application/octet-stream',
    //         });
    //         reject(error);
    //       }, 1000);
    //     });
    //   }
    //   return api
    //     .post(
    //       '/redfish/v1/Systems/system/LogServices/DebugTokenService/CollectDiagnosticData',
    //       {
    //         DiagnosticDataType: 'OEM',
    //         OEMDiagnosticDataType: 'GetDOTCAKUnlockTokenRequest',
    //       },
    //     )
    //     .then((response) => {
    //       const taskUrl = response.data['@odata.id'];
    //       if (!taskUrl) {
    //         throw new Error('Task URL not found in response');
    //       }
    //       return dispatch('pollTask', taskUrl);
    //     });
    // },

    // step2_dotDisable(_, file) {
    //   if (mock) {
    //     return new Promise((resolve) => {
    //       setTimeout(() => {
    //         console.log('Mocking step2_dotDisable with file:', file.name);
    //         resolve();
    //       }, 1000);
    //     });
    //   }
    //   return api.post(
    //     '/redfish/v1/Chassis/ERoT_CPU_0/Actions/Oem/DOTDisable',
    //     file,
    //     {
    //       headers: { 'Content-Type': 'application/octet-stream' },
    //     },
    //   );
    // },

    step3_generateEnableToken({ dispatch }) {
      return api
        .post(
          '/redfish/v1/Systems/system/LogServices/DebugTokenService/CollectDiagnosticData',
          {
            DiagnosticDataType: 'OEM',
            OEMDiagnosticDataType: 'GetDOTEnableTokenRequest',
          },
        )
        .then((response) => {
          const taskUrl = response.data['@odata.id'];
          if (!taskUrl) {
            throw new Error('Task URL not found in response');
          }
          return dispatch('pollTask', {
            taskUrl,
            filename: '14_dot_token.bin',
          });
        });
    },

    async step4_cakInstall(_, file) {
      const fileContent = await file.text();
      return api.post('/redfish/v1/Chassis/ERoT_CPU_0/Actions/Oem/CAKInstall', {
        CAKKey: fileContent,
      });
    },
    async step5_cakLock(_, file) {
      const fileContent = await file.text();
      return api.post('/redfish/v1/Chassis/ERoT_CPU_0/Actions/Oem/CAKLock', {
        Key: fileContent,
      });
    },

    step6_cakTest() {
      return api.post('/redfish/v1/Chassis/ERoT_CPU_0/Actions/Oem/CAKTest', {});
    },

    step7_generateSignTestToken({ dispatch }) {
      return api
        .post(
          '/redfish/v1/Systems/system/LogServices/DebugTokenService/CollectDiagnosticData',
          {
            DiagnosticDataType: 'OEM',
            OEMDiagnosticDataType: 'GetDOTSignTestToken',
          },
        )
        .then((response) => {
          const taskUrl = response.data['@odata.id'];
          if (!taskUrl) {
            throw new Error('Task URL not found in response');
          }
          return dispatch('pollTask', {
            taskUrl,
            filename: 'dot_sign_token.bin',
          });
        });
    },

    async uploadDotToken(_, file) {
      console.log('Uploading DOT token with file:', file);
      return await api.post(
        '/redfish/v1/Chassis/ERoT_CPU_0/Actions/Oem/DOTTokenInstall',
        file,
        {
          headers: { 'Content-Type': 'application/octet-stream' },
        },
      );
    },

    resetSteps({ commit }) {
      commit('resetSteps');
    },
  },
};

export default DeviceOwnerTransfershipStore;
