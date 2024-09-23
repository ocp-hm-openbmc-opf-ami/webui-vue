import api from '@/store/api';
import i18n from '@/i18n';

export const CERTIFICATE_TYPES = [
  {
    type: 'CacertPEM',
    label: i18n.t('pageSmtp.cacertPEM'),
  },
  {
    type: 'ServerCRT',
    label: i18n.t('pageSmtp.serverCRT'),
  },
  {
    type: 'ServerKey',
    label: i18n.t('pageSmtp.serverKey'),
  },
];
const getCertificateProp = (type, prop) => {
  const certificate = CERTIFICATE_TYPES.find(
    (certificate) => certificate.type === type,
  );
  return certificate ? certificate[prop] : null;
};
const SmtpStore = {
  namespaced: true,
  state: {
    sendTestAlert: false,
    primary: {
      smtpServiceEnabled: null,
      serverAddress: null,
      port: null,
      senderEmailAddress: null,
      recipientEmailAddress1: '',
      recipientEmailAddress2: '',
      recipientEmailAddress3: '',
      recipientEmailAddress4: '',
      tlsEnable: false,
      authentication: false,
      username: '',
      password: '',
      cacertModifiedDate: '',
      serverKeyModifiedDate: '',
      serverCrtModifiedDate: '',
    },
    secondary: {
      smtpServiceEnabled: null,
      serverAddress: null,
      port: null,
      senderEmailAddress: null,
      recipientEmailAddress1: '',
      recipientEmailAddress2: '',
      recipientEmailAddress3: '',
      recipientEmailAddress4: '',
      tlsEnable: false,
      authentication: false,
      username: '',
      password: '',
      cacertModifiedDate: '',
      serverKeyModifiedDate: '',
      serverCrtModifiedDate: '',
    },
  },
  getters: {
    isPrimaryConfig: (state) => state.primary,
    isSecondaryConfig: (state) => state.secondary,
    sendTestAlert: (state) => state.sendTestAlert,
  },
  mutations: {
    setSmtpData: (state, smtpData) => {
      if (smtpData.PrimaryConfiguration) {
        state.primary.smtpServiceEnabled =
          smtpData.PrimaryConfiguration?.Enable;
        state.primary.serverAddress = smtpData.PrimaryConfiguration?.Host;
        state.primary.port = smtpData.PrimaryConfiguration?.Port;
        state.primary.senderEmailAddress =
          smtpData.PrimaryConfiguration?.Sender;
        state.primary.recipientEmailAddress1 = smtpData.PrimaryConfiguration
          ?.Recipient[0]
          ? smtpData.PrimaryConfiguration?.Recipient[0]
          : '';
        state.primary.recipientEmailAddress2 = smtpData.PrimaryConfiguration
          ?.Recipient[1]
          ? smtpData.PrimaryConfiguration?.Recipient[1]
          : '';
        state.primary.recipientEmailAddress3 = smtpData.PrimaryConfiguration
          ?.Recipient[2]
          ? smtpData.PrimaryConfiguration?.Recipient[2]
          : '';
        state.primary.recipientEmailAddress4 = smtpData.PrimaryConfiguration
          ?.Recipient[3]
          ? smtpData.PrimaryConfiguration?.Recipient[3]
          : '';
        state.primary.tlsEnable = smtpData.PrimaryConfiguration?.TLSEnable;
        state.primary.authentication =
          smtpData.PrimaryConfiguration?.Authentication;
        state.primary.username = smtpData.PrimaryConfiguration?.UserName;
        state.primary.password = smtpData.PrimaryConfiguration?.Password;
        state.primary.cacertModifiedDate =
          smtpData.PrimaryConfiguration?.primaryCACERTModifiedDate;
        state.primary.serverCrtModifiedDate =
          smtpData.PrimaryConfiguration?.primaryserverCRTModifiedDate;
        state.primary.serverKeyModifiedDate =
          smtpData.PrimaryConfiguration?.primaryServerKeyModifiedDate;
      }
      if (smtpData.SecondaryConfiguration) {
        state.secondary.smtpServiceEnabled =
          smtpData.SecondaryConfiguration?.Enable;
        state.secondary.serverAddress = smtpData.SecondaryConfiguration?.Host;
        state.secondary.port = smtpData.SecondaryConfiguration?.Port;
        state.secondary.senderEmailAddress =
          smtpData.SecondaryConfiguration?.Sender;
        state.secondary.recipientEmailAddress1 = smtpData.SecondaryConfiguration
          ?.Recipient[0]
          ? smtpData.SecondaryConfiguration?.Recipient[0]
          : '';
        state.secondary.recipientEmailAddress2 = smtpData.SecondaryConfiguration
          ?.Recipient[1]
          ? smtpData.SecondaryConfiguration?.Recipient[1]
          : '';
        state.secondary.recipientEmailAddress3 = smtpData.SecondaryConfiguration
          ?.Recipient[2]
          ? smtpData.SecondaryConfiguration?.Recipient[2]
          : '';
        state.secondary.recipientEmailAddress4 = smtpData.SecondaryConfiguration
          ?.Recipient[3]
          ? smtpData.SecondaryConfiguration?.Recipient[3]
          : '';
        state.secondary.tlsEnable = smtpData.SecondaryConfiguration?.TLSEnable;
        state.secondary.authentication =
          smtpData.SecondaryConfiguration?.Authentication;
        state.secondary.username = smtpData.SecondaryConfiguration?.UserName;
        state.secondary.password = smtpData.SecondaryConfiguration?.Password;
        state.secondary.cacertModifiedDate =
          smtpData.SecondaryConfiguration?.secondaryCACERTModifiedDate;
        state.secondary.serverCrtModifiedDate =
          smtpData.SecondaryConfiguration?.secondaryserverCRTModifiedDate;
        state.secondary.serverKeyModifiedDate =
          smtpData.SecondaryConfiguration?.secondaryServerKeyModifiedDate;
      }
      if (
        (smtpData.PrimaryConfiguration.Enable &&
          smtpData.PrimaryConfiguration?.Host != '') ||
        (smtpData.SecondaryConfiguration.Enable &&
          smtpData.SecondaryConfiguration?.Host != '')
      ) {
        state.sendTestAlert = true;
      } else state.sendTestAlert = false;
    },
  },
  actions: {
    async getSMTPdata({ commit }) {
      return await api
        .get('/redfish/v1/EventService')
        .then((response) => {
          commit('setSmtpData', response.data.Oem.OpenBmc.SMTP);
        })
        .catch((error) => console.log(error));
    },
    async setSMTPdata({ dispatch }, data) {
      return await api
        .patch('/redfish/v1/EventService', data)
        .then(() => dispatch('getSMTPdata'))
        .then(() => i18n.t('pageSmtp.toast.successSMTPConfiguration'))
        .catch((error) => {
          console.log(error);
          if (error.response.data.error.message.indexOf('.pem') != -1) {
            throw new Error(i18n.t('pageSmtp.toast.errorAddPemCertificate'));
          } else if (error.response.data.error.message.indexOf('.crt') != -1) {
            throw new Error(i18n.t('pageSmtp.toast.errorAddCrtCertificate'));
          } else if (error.response.data.error.message.indexOf('.key') != -1) {
            throw new Error(i18n.t('pageSmtp.toast.errorAddKeyCertificate'));
          } else
            throw new Error(i18n.t('pageSmtp.toast.errorSMTPConfiguration'));
        });
    },
    async addNewCertificate({ dispatch }, { file, type, config }) {
      let uploadData = new FormData();
      uploadData.append('', file);
      let uri =
        '/redfish/v1/EventService/Actions/Oem/Ami/SMTP.PrimarySSLCertificateUpload';
      if (config == 'secondary') {
        uri =
          '/redfish/v1/EventService/Actions/Oem/Ami/SMTP.SecondarySSLCertificateUpload';
      }
      return await api
        .post(uri, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data;',
          },
        })
        .then(() => {
          dispatch('getSMTPdata');
          return i18n.t('pageSmtp.toast.successAddCertificate', {
            certificate: getCertificateProp(type, 'label'),
          });
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageSmtp.toast.errorAddCertificate'));
        });
    },
    async sendTestAlert(_, properties) {
      return await api
        .post(
          '/redfish/v1/PefService/Actions/PefService.SendAlertMail',
          properties,
        )
        .then(() => i18n.t('pageSmtp.toast.successMsgTestAlert'))
        .catch(() => {
          throw new Error(i18n.t('pageSmtp.toast.errorMsgAlert'));
        });
    },
  },
};

export default SmtpStore;
