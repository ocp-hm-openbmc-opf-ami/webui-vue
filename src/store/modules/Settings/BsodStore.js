import api from '@/store/api';
import i18n from '@/i18n';
import store from '@/store';

const BsodStore = {
  namespaced: true,
  state: {
    bsodImageData: null,
    bsodImageURI: null,
  },
  getters: {
    bsodImageData: (state) => state.bsodImageData,
    bsodImageURI: (state) => state.bsodImageURI,
  },
  mutations: {
    SetBsodImageData: (state, bsodImageData) =>
      (state.bsodImageData = bsodImageData),
    SetBsodImageURI: (state, bsodImageURI) =>
      (state.bsodImageURI = bsodImageURI),
  },
  actions: {
    async getBsodImage({ commit }) {
      return await api
        .get(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/Oem/Ami/Jpeg',
        )
        .then(async (response) => {
          const imageURIData = response.data.ImageURI;
          const imageURI =
            typeof imageURIData === 'string'
              ? imageURIData
              : imageURIData?.['@odata.id'];
          if (imageURI === undefined || imageURI === null) {
            commit('SetBsodImageData', null);
            commit('SetBsodImageURI', null);
            return;
          }
          if (
            typeof imageURI === 'string' &&
            imageURI.startsWith('/redfish/')
          ) {
            try {
              const imageResponse = await api.get(imageURI);
              commit('SetBsodImageData', imageResponse.data.Image);
              commit('SetBsodImageURI', imageURI);
            } catch (error) {
              console.log('Error fetching image from URI:', imageURI, error);
              commit('SetBsodImageData', null);
              commit('SetBsodImageURI', null);
              throw new Error(i18n.t('pageBsod.toast.errorGettingBsodApi'));
            }
          }
        });
    },
    async deleteBsodImage({ dispatch }) {
      return await api
        .delete(
          `/redfish/v1/Managers/${store.getters['global/managerInstance']}/Oem/Ami/Jpeg/Image`,
        )
        .then(() => dispatch('getBsodImage'))
        .then(() => i18n.t('pageBsod.toast.successDeleteBsodImage'))
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageBsod.toast.errorDeleteBsodImage');
          throw new Error(message);
        });
    },
    async triggerBsodImage({ dispatch }) {
      return await api
        .post(
          `/redfish/v1/Managers/${store.getters['global/managerInstance']}/Oem/Ami/Jpeg`,
        )
        .then(() => dispatch('getBsodImage'))
        .then(() => i18n.t('pageBsod.toast.successTriggerBsodImage'))
        .catch((error) => {
          console.log(error);
          const message = i18n.t('pageBsod.toast.errorTriggerBsodImage');
          throw new Error(message);
        });
    },
  },
};

export default BsodStore;
