import api from '@/store/api';
import i18n from '@/i18n';

export const CERTIFICATE_TYPES = [
  {
    type: 'radius_ca',
    label: i18n.t('pageRadius.radiusBlastCa'),
  },
  {
    type: 'radius_client',
    label: i18n.t('pageRadius.radiusBlastClient'),
  },
  {
    type: 'radius_key',
    label: i18n.t('pageRadius.radiusBlastKey'),
  },
];
const getCertificateProp = (type, prop) => {
  const certificate = CERTIFICATE_TYPES.find(
    (certificate) => certificate.type === type,
  );
  return certificate ? certificate[prop] : null;
};

const RadiusStore = {
  namespaced: true,
  state: {
    radiusValues: {},
    serviceEnabled: '',
    enableEapTLS: false,
  },
  getters: {
    getRadiusValues: (state) => state.radiusValues,
    getServiceEnabled: (state) => state.serviceEnabled,
    getEnableEapTLS: (state) => state.enableEapTLS,
  },
  mutations: {
    setRadiusValues: (state, radiusValues) =>
      (state.radiusValues = radiusValues),
    setServiceEnabled: (state, serviceEnabled) =>
      (state.serviceEnabled = serviceEnabled),
    setEnableEapTLS: (state, enableEapTLS) =>
      (state.enableEapTLS = enableEapTLS),
  },
  actions: {
    async radiusConfigValues({ commit }) {
      return await api
        .get('/redfish/v1/AccountService/ExternalAccountProviders/RADIUS')
        .then((response) => {
          commit('setRadiusValues', response.data?.Oem?.Ami?.RADIUS);
          commit('setServiceEnabled', response.data?.ServiceEnabled);
          commit(
            'setEnableEapTLS',
            response.data?.Oem?.Ami?.RADIUS?.EnableEapTLS,
          );
        })
        .catch((error) => {
          console.log('Error in getting Radius configuration.', error);
          throw new Error(i18n.t('pageRadius.toast.errorGettingRadiusConfig'));
        });
    },
    async saveRadiusConfig({ dispatch }, saveConfigValues) {
      const Oem = {
        Oem: {
          Ami: {
            RADIUS: {
              ServiceAddress: saveConfigValues.serverAddress,
              ServicePort: saveConfigValues.port,
              Secret: saveConfigValues.secret,
            },
          },
        },
        ServiceEnabled: saveConfigValues.authentication,
      };
      [
        'GroupName1',
        'GroupName2',
        'GroupName3',
        'Privilege1',
        'Privilege2',
        'Privilege3',
      ].forEach((key) => {
        if (saveConfigValues[key]) {
          Oem.Oem.Ami.RADIUS[key] = saveConfigValues[key];
        }
      });
      return await api
        .patch(
          '/redfish/v1/AccountService/ExternalAccountProviders/RADIUS',
          Oem,
        )
        .then(() => dispatch('radiusConfigValues'))
        .then(() => {
          return i18n.t('pageRadius.toast.successRadiusConfiguration');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageRadius.toast.errorRadiusConfiguration'));
        });
    },
    async addNewCertificate({ dispatch }, { file, type }) {
      let uploadData = new FormData();
      uploadData.append(type, file);
      let uri =
        '/redfish/v1/AccountService/ExternalAccountProviders/Actions/Oem/Ami/RADIUS.SSLCertificateUpload';
      return await api
        .post(uri, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data;',
          },
        })
        .then(() => dispatch('radiusConfigValues'))
        .then(() => {
          return i18n.t('pageRadius.toast.successAddCertificate', {
            certificate: getCertificateProp(type, 'label'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageRadius.toast.errorAddCertificate'));
        });
    },
    async ChangeEnableEapTLS({ commit, dispatch }, enableEapTLS) {
      commit('setEnableEapTLS', enableEapTLS);
      const data = {
        Oem: {
          Ami: {
            RADIUS: {
              EnableEapTLS: enableEapTLS,
            },
          },
        },
      };
      return await api
        .patch(
          '/redfish/v1/AccountService/ExternalAccountProviders/RADIUS',
          data,
        )
        .then(() => dispatch('radiusConfigValues'))
        .then(() => {
          if (enableEapTLS) {
            return i18n.t('pageRadius.toast.successEnableEapTLS');
          } else {
            return i18n.t('pageRadius.toast.successDisableEapTLS');
          }
        })
        .catch((error) => {
          commit('setEnableEapTLS', !enableEapTLS);
          console.log(error);
          if (!enableEapTLS) {
            throw new Error(i18n.t('pageRadius.toast.errorEnableEapTLS'));
          } else {
            throw new Error(i18n.t('pageRadius.toast.errorDisableEapTLS'));
          }
        });
    },
  },
};

export default RadiusStore;
