import api from '@/store/api';
import i18n from '@/i18n';

export const CERTIFICATE_TYPES = [
  {
    type: 'cacertPEM',
    label: i18n.t('advancedLogSettings.cacertPEM'),
  },
  {
    type: 'serverCRT',
    label: i18n.t('advancedLogSettings.serverCRT'),
  },
  {
    type: 'serverKey',
    label: i18n.t('advancedLogSettings.serverKey'),
  },
];
const getCertificateProp = (type, prop) => {
  const certificate = CERTIFICATE_TYPES.find(
    (certificate) => certificate.type === type,
  );
  return certificate ? certificate[prop] : null;
};

const AdvancedLogSettingsStore = {
  namespaced: true,
  state: {
    advancedLogsData: {},
  },
  getters: {
    getAdvancedLogsData: (state) => state.advancedLogsData,
  },
  mutations: {
    setAdvancedLogsData: (state, advancedLogsData) =>
      (state.advancedLogsData = advancedLogsData),
  },
  actions: {
    async getAdvancedLogsSettings({ commit }) {
      var syslogDataCollection = '';
      const response = await api.get('/redfish/v1/Systems/system');
      if (response.data.LogServices) {
        const sysloginfo = await api.get(
          response.data.LogServices['@odata.id'],
        );
        const syslogData = sysloginfo.data.Members.map(async (syslog) => {
          if (syslog['@odata.id'].split('/').pop() === 'Syslog') {
            const syslogResponse = await api.get(syslog['@odata.id']);
            return syslogResponse.data;
          }
        });
        syslogDataCollection = await Promise.all(syslogData);
        const getAdvancedLogsValues = syslogDataCollection.filter((values) => {
          if (values !== undefined) {
            return values;
          }
        });
        commit('setAdvancedLogsData', getAdvancedLogsValues[0]);
      }
    },
    async setAdvancedLogsSettings({ state }, Configuration) {
      const advancedLogsConfig = {
        Oem: {
          Ami: {
            SysLog: {
              Configuration,
            },
          },
        },
      };
      return await api
        .patch(state.advancedLogsData['@odata.id'], advancedLogsConfig)
        .then(() =>
          i18n.t('advancedLogSettings.toast.successSaveAdvancedLogsSettings'),
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('advancedLogSettings.toast.errorGettingVideoLog'),
          );
        });
    },
    async addAdvancedLogsCertificate(_, { file, type }) {
      let uploadData = new FormData();
      uploadData.append('', file.file);
      return await api
        .post(
          '/redfish/v1/Systems/system/LogServices/Syslog/Actions/Oem/Ami/Rsyslog.RemoteServerCertificateUpload',
          uploadData,
          {
            headers: {
              'Content-Type': 'multipart/form-data;',
            },
          },
        )
        .then(() => {
          return i18n.t('advancedLogSettings.toast.successCertificateUpload', {
            certificate: getCertificateProp(type, 'label'),
          });
        })
        .catch((error) => {
          console.log(type, error);
          throw new Error(
            i18n.t('advancedLogSettings.toast.errorAdvancedAddCertificate', {
              certificate: getCertificateProp(type, 'label'),
            }),
          );
        });
    },
  },
};

export default AdvancedLogSettingsStore;
