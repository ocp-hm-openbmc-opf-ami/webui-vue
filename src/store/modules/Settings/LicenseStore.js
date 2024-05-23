import api from '@/store/api';
import i18n from '@/i18n';

const LicenseStore = {
  namespaced: true,
  state: {
    licenseData: {},
    licenseExpireData: {},
    licenseMinData: '',
  },
  getters: {
    getLicenseData: (state) => state.licenseData,
    getLicenseExpireData: (state) => state.licenseExpireData,
    getLicenseMinData: (state) => state.licenseMinData,
  },
  mutations: {
    setLicenseData: (state, licenseData) => (state.licenseData = licenseData),
    setLicenseExpireData: (state, licenseExpireData) =>
      (state.licenseExpireData = licenseExpireData),
    setLicenseMinData: (state, licenseMinData) =>
      (state.licenseMinData = licenseMinData),
  },
  actions: {
    async getUserAlertCount({ commit }) {
      return await api
        .get('/redfish/v1/Oem/Ami/LicenseControl')
        .then((licenseControl) => {
          let licenseFeature = licenseControl.data.Oem?.Ami.LicenseKey.split(
            ';'
          );
          var items = [];
          var minItems = [];
          licenseFeature?.forEach((val) => {
            const licenseVal = val.split(':');
            if (licenseVal[1] > 0) {
              minItems.push(licenseVal[1]);
            }
            if (licenseVal[1] > 0) {
              const validLicenseDays =
                parseInt(
                  licenseVal[1] -
                    licenseControl.data.Oem?.Ami.ServicesUpCountDays
                ) < 0
                  ? 0
                  : parseInt(
                      licenseVal[1] -
                        licenseControl.data.Oem?.Ami.ServicesUpCountDays
                    );
              if (licenseVal[0] != '' && validLicenseDays > 0) {
                items.push(licenseVal[0]);
              }
            }
          });
          commit(
            'setLicenseMinData',
            minItems.length > 0 ? Math.min(...minItems) : 0
          );
          commit('setLicenseData', licenseControl);
          commit('setLicenseExpireData', items);
        })
        .catch((error) => console.log(error));
    },
    async setUserAlertCount({ dispatch }, percentageVal) {
      return await api
        .patch('/redfish/v1/Oem/Ami/LicenseControl', percentageVal)
        .then(() => dispatch('getUserAlertCount'))
        .then(() => i18n.t('license.toast.successSavelicense'))
        .catch(() => {
          throw new Error(i18n.t('license.toast.errorsavedlicense'));
        });
    },
    async uploadLicenseKey({ dispatch }, file) {
      let uploadData = new FormData();
      uploadData.append('LicenseKeyFile', file);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data;',
        },
      };
      return await api
        .post('/redfish/v1/Oem/Ami/LicenseControl', uploadData, config)
        .then(() => dispatch('getUserAlertCount'))
        .then(() => i18n.t('license.toast.successSavelicense'))
        .catch(() => {
          throw new Error(i18n.t('license.toast.errorsavedlicense'));
        });
    },
  },
};

export default LicenseStore;
