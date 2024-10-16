import api from '@/store/api';
import i18n from '@/i18n';

const PamOrderList = {
  namespaced: true,
  state: {
    pamOrderListData: [],
  },
  getters: {
    getPamOrderData: (state) => state.pamOrderListData,
  },
  mutations: {
    setPamOrderData: (state, pamOrderListData) =>
      (state.pamOrderListData = pamOrderListData),
  },
  actions: {
    async getPamOrderData({ commit }) {
      return await api
        .get('/redfish/v1/AccountService')
        .then((response) => {
          const pamOrderData = response.data?.Oem?.Ami?.Configuration?.PamOrder;
          commit('setPamOrderData', pamOrderData);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pagePamOrder.toast.errorGettingPamorder'));
        });
    },
    async updatePamOrderData({ dispatch }, PamOrder) {
      const pamOrderData = {
        Oem: {
          Ami: {
            Configuration: {
              PamOrder,
            },
          },
        },
      };
      return await api
        .patch('/redfish/v1/AccountService', pamOrderData)
        .then(() => dispatch('getPamOrderData'))
        .then(() => {
          return i18n.t('pagePamOrder.toast.successSavingPamOrder');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pagePamOrder.toast.errorSavingPamOrder'));
        });
    },
  },
};

export default PamOrderList;
