import api from '@/store/api';
import i18n from '@/i18n';

const BsodStore = {
  namespaced: true,

  state: { bsodImageData: null },
  getters: { bsodImageData: (state) => state.bsodImageData },
  mutations: {
    SetBsodImageData: (state, bsodImageData) =>
      (state.bsodImageData = bsodImageData),
  },
  actions: {
    async getBsodImage({ commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/Oem/OpenBmc/Jpeg')
        .then((response) => {
          commit('SetBsodImageData', response.data.Image);
        })
        .catch((error) => {
          commit('SetBsodImageData', 'Image File is  not Created');
          console.log('Error in getting BSOD Image ', error);
          throw new Error(i18n.t('pageBsod.toast.errorGettingBsodApi'));
        });
    },
    async deleteBsodImage({ dispatch }) {
      return await api
        .delete(`/redfish/v1/Managers/bmc/Oem/OpenBmc/Jpeg`)
        .then(() => dispatch('getBsodImage'))
        .then(() => i18n.t('pageBsod.toast.successDeleteBsodImage'))
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageBsod.toast.errorDeleteBsodImage');
          throw new Error(message);
        });
    },
  },
};

export default BsodStore;
