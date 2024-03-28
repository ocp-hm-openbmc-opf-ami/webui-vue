import api from '@/store/api';
import i18n from '@/i18n';

const CupsStore = {
  namespaced: true,

  state: {
    staticCoreLoadFactor: null,
    staticMemoryLoadFactor: null,
    staticIioLoadFactor: null,
    dynamicCoreLoadFactor: '',
    dynamicMemoryLoadFactor: '',
    dynamicIioLoadFactor: '',
    cupsServiceInterval: '',
    cupsServiceAveragingPeriod: '',
    loadFactorConfiguration: '',
  },
  getters: {
    staticCoreLoadFactor: (state) => state.staticCoreLoadFactor,
    staticMemoryLoadFactor: (state) => state.staticMemoryLoadFactor,
    staticIioLoadFactor: (state) => state.staticIioLoadFactor,
    dynamicCoreLoadFactor: (state) => state.dynamicCoreLoadFactor,
    dynamicMemoryLoadFactor: (state) => state.dynamicMemoryLoadFactor,
    dynamicIioLoadFactor: (state) => state.dynamicIioLoadFactor,
    cupsServiceInterval: (state) => state.cupsServiceInterval,
    cupsServiceAveragingPeriod: (state) => state.cupsServiceAveragingPeriod,
    loadFactorConfiguration: (state) => state.loadFactorConfiguration,
  },
  mutations: {
    setStaticCoreLoadFactor: (state, staticCoreLoadFactor) =>
      (state.staticCoreLoadFactor = staticCoreLoadFactor),
    setStaticMemoryLoadFactor: (state, staticMemoryLoadFactor) =>
      (state.staticMemoryLoadFactor = staticMemoryLoadFactor),
    setStaticIioLoadFactor: (state, staticIioLoadFactor) =>
      (state.staticIioLoadFactor = staticIioLoadFactor),
    setDynamicCoreLoadFactor: (state, dynamicCoreLoadFactor) =>
      (state.dynamicCoreLoadFactor = dynamicCoreLoadFactor),
    setDynamicMemoryLoadFactor: (state, dynamicMemoryLoadFactor) =>
      (state.dynamicMemoryLoadFactor = dynamicMemoryLoadFactor),
    setDynamicIioLoadFactor: (state, dynamicIioLoadFactor) =>
      (state.dynamicIioLoadFactor = dynamicIioLoadFactor),
    setCupsServiceInterval: (state, cupsServiceInterval) =>
      (state.cupsServiceInterval = cupsServiceInterval),
    setCupsServiceAveragingPeriod: (state, cupsServiceAveragingPeriod) =>
      (state.cupsServiceAveragingPeriod = cupsServiceAveragingPeriod),
    setLoadFactorConfiguration: (state, loadFactorConfiguration) =>
      (state.loadFactorConfiguration = loadFactorConfiguration),
  },
  actions: {
    async getCupsService({ commit }) {
      return await api
        .get('/redfish/v1')
        .then((response) => {
          return api.get(response.data?.Oem?.Intel?.CupsService['@odata.id']);
        })
        .then(({ data }) => {
          commit(
            'setStaticCoreLoadFactor',
            data.StaticLoadFactors?.CoreLoadFactor
          );
          commit(
            'setStaticMemoryLoadFactor',
            data.StaticLoadFactors?.MemoryLoadFactor
          );
          commit(
            'setStaticIioLoadFactor',
            data.StaticLoadFactors?.IioLoadFactor
          );
          commit(
            'setDynamicCoreLoadFactor',
            data.DynamicLoadFactors?.CoreLoadFactor
              ? data.DynamicLoadFactors?.CoreLoadFactor.toFixed(4)
              : 'NA'
          );
          commit(
            'setDynamicMemoryLoadFactor',
            data.DynamicLoadFactors?.MemoryLoadFactor
              ? data.DynamicLoadFactors?.MemoryLoadFactor.toFixed(4)
              : 'NA'
          );
          commit(
            'setDynamicIioLoadFactor',
            data.DynamicLoadFactors?.IioLoadFactor
              ? data.DynamicLoadFactors?.IioLoadFactor.toFixed(4)
              : 'NA'
          );
          const intervalString = data.Interval;
          const Interval = parseFloat(intervalString.replace(/[^\d.]/g, ''));
          console.log(Interval);
          commit('setCupsServiceInterval', Interval);
          const averagingPeriodString = data.AveragingPeriod;
          const AveragingPeriod = parseFloat(
            averagingPeriodString.replace(/[^\d.]/g, '')
          );
          console.log(AveragingPeriod);
          commit('setCupsServiceAveragingPeriod', AveragingPeriod);
          commit('setLoadFactorConfiguration', data.LoadFactorConfiguration);
        })
        .catch((error) => {
          console.log(error);
          commit('setDynamicCoreLoadFactor', 'NA');
          commit('setDynamicMemoryLoadFactor', 'NA');
          commit('setDynamicIioLoadFactor', 'NA');
          throw new Error(i18n.t('pageCups.toast.errorGettingIntelCups'));
        });
    },
    async updateCupsService(
      { dispatch },
      { AveragingPeriod, Interval, LoadFactorConfiguration, StaticLoadFactors }
    ) {
      const data = {};
      if (AveragingPeriod) data.AveragingPeriod = `PT${AveragingPeriod}S`;
      if (Interval) data.Interval = `PT${Interval}S`;
      if (LoadFactorConfiguration)
        data.LoadFactorConfiguration = LoadFactorConfiguration;
      if (StaticLoadFactors) data.StaticLoadFactors = StaticLoadFactors;
      return await api
        .patch('/redfish/v1/Oem/Intel/CupsService', data)
        .then(() => dispatch('getCupsService'))
        .then(() => i18n.t('pageCups.toast.successUpdateCupsService'))
        .catch((error) => {
          dispatch('getCupsService');
          console.log(error);
          throw new Error(i18n.t('pageCups.toast.errorUpdateCupsService'));
        });
    },
  },
};

export default CupsStore;
