import api from '@/store/api';
import i18n from '@/i18n';

const OnDemand = {
  namespaced: true,
  state: {
    Ondemand: [],
    tableVariants: [],
  },
  getters: {
    Ondemand: (state) => state.Ondemand,
    tableVariants: (state) => state.tableVariants,
  },
  mutations: {
    setOndemand: (state, Ondemand) => (state.Ondemand = Ondemand),
    setTableVariants: (state, tableVariants) =>
      (state.tableVariants = tableVariants),
  },
  actions: {
    async getOnDemandData({ dispatch, commit }) {
      const OnDemand = [];
      const selectOptionValue = i18n.t('pageOnDemand.all');
      const tableVariants = [selectOptionValue];
      return await api
        .get('/redfish/v1/Systems/system')
        .then((response) => response.data.Processors['@odata.id'])
        .then((processorurl) => {
          api.get(processorurl).then(({ data: { Members } }) => {
            if (Members.length > 0) {
              Members.forEach((cpus) => {
                api.get(cpus['@odata.id']).then(async (response) => {
                  const Processors = response;
                  const MeteringFeatureUrl =
                    response.data?.Oem?.Intel?.MeteringFeature['@odata.id'];
                  const MeteringFeatureData = await dispatch(
                    'getMeteringFeature',
                    MeteringFeatureUrl
                  );
                  const StateFeatureUrl =
                    response.data?.Oem?.Intel?.StateFeature['@odata.id'];
                  const StateFeatureData = await dispatch(
                    'getStateFeature',
                    StateFeatureUrl
                  );
                  const DynamicFeatureUrl =
                    response.data?.Oem?.Intel?.DynamicFeature['@odata.id'];
                  const DynamicFeatureData = await dispatch(
                    'getDynamicFeature',
                    DynamicFeatureUrl
                  );
                  const ProvisionFeatureUrl =
                    response.data?.Oem?.Intel?.ProvisionFeature['@odata.id'];
                  const ProvisionFeatureData = await dispatch(
                    'getProvisionFeature',
                    ProvisionFeatureUrl
                  );
                  tableVariants.push(response.data.Id);
                  Processors.Name = response.data.Id;
                  Processors.MeteringFeature =
                    MeteringFeatureData.FeatureStatus;
                  Processors.StateFeature = StateFeatureData.FeatureStatus;
                  Processors.DynamicFeature = DynamicFeatureData.FeatureStatus;
                  Processors.ProvisionFeature =
                    ProvisionFeatureData.FeatureStatus;
                  OnDemand.push(Processors);
                });
                commit('setOndemand', OnDemand);
                commit('setTableVariants', tableVariants);
              });
            } else {
              commit(
                'setOndemand',
                i18n.t('pageOnDemand.toast.errorGettingCpus')
              );
            }
          });
        })
        .catch((err) => {
          commit('setOndemand', '');
          console.log(err);
          throw new Error(
            i18n.t('pageOnDemand.toast.errorShowingOnDemandInfo')
          );
        });
    },
    async getMeteringFeature(_, data) {
      return new Promise((resolve, reject) => {
        var interval = setInterval(async () => {
          return await api
            .get(data)
            .then((response) => {
              if (response.data.TaskState) {
                return;
              } else {
                clearInterval(interval);
                resolve(response.data);
              }
            })
            .catch((error) => {
              console.log(error);
              clearInterval(interval);
              reject(error);
            });
        }, 2000);
      });
    },
    async getStateFeature(_, data) {
      return new Promise((resolve, reject) => {
        var interval = setInterval(async () => {
          return await api
            .get(data)
            .then((response) => {
              if (response.data.TaskState) {
                return;
              } else {
                clearInterval(interval);
                resolve(response.data);
              }
            })
            .catch((error) => {
              console.log(error);
              clearInterval(interval);
              reject(error);
            });
        }, 2000);
      });
    },
    async getDynamicFeature(_, data) {
      return await api.get(data).then((response) => {
        return response.data;
      });
    },
    async getProvisionFeature(_, data) {
      return await api.get(data).then((response) => {
        return response.data;
      });
    },
    async updateProcessors({ dispatch, commit }, val) {
      const OnDemand = [];
      let data = '/redfish/v1/Systems/system/Processors/' + val;
      return await api
        .get(data)
        .then(async (response) => {
          const Processors = response;
          const MeteringFeatureUrl =
            response.data.Oem.Intel.MeteringFeature['@odata.id'];
          const MeteringFeatureData = await dispatch(
            'getMeteringFeature',
            MeteringFeatureUrl
          );
          const StateFeatureUrl =
            response.data.Oem.Intel.StateFeature['@odata.id'];
          const StateFeatureData = await dispatch(
            'getMeteringFeature',
            StateFeatureUrl
          );
          const DynamicFeatureUrl =
            response.data?.Oem?.Intel?.DynamicFeature['@odata.id'];
          const DynamicFeatureData = await dispatch(
            'getDynamicFeature',
            DynamicFeatureUrl
          );
          const ProvisionFeatureUrl =
            response.data?.Oem?.Intel?.ProvisionFeature['@odata.id'];
          const ProvisionFeatureData = await dispatch(
            'getProvisionFeature',
            ProvisionFeatureUrl
          );
          Processors.Name = response.data.Id;
          Processors.MeteringFeature = MeteringFeatureData.FeatureStatus;
          Processors.StateFeature = StateFeatureData.FeatureStatus;
          Processors.DynamicFeature = DynamicFeatureData.FeatureStatus;
          Processors.ProvisionFeature = ProvisionFeatureData.FeatureStatus;
          OnDemand.push(Processors);
          commit('setOndemand', OnDemand);
        })
        .catch((error) => {
          console.log(error);
          commit('setOndemand', '');
          throw new Error(
            i18n.t('pageOnDemand.toast.errorShowingOnDemandInfo')
          );
        });
    },
  },
};
export default OnDemand;
