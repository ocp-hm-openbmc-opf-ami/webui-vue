import api from '@/store/api';
import i18n from '@/i18n';
import store from '@/store';

const DateTimeStore = {
  namespaced: true,
  state: {
    ntpServers: [],
    isNtpProtocolEnabled: null,
    secureNtpServers: [],
    isSecureNtpEnabled: null,
  },
  getters: {
    ntpServers: (state) => state.ntpServers,
    isNtpProtocolEnabled: (state) => state.isNtpProtocolEnabled,
    secureNtpServers: (state) => state.secureNtpServers,
    isSecureNtpEnabled: (state) => state.isSecureNtpEnabled,
  },
  mutations: {
    setNtpServers: (state, ntpServers) => (state.ntpServers = ntpServers),
    setIsNtpProtocolEnabled: (state, isNtpProtocolEnabled) =>
      (state.isNtpProtocolEnabled = isNtpProtocolEnabled),
    setSecureNtpServers: (state, secureNtpServers) =>
      (state.secureNtpServers = secureNtpServers),
    setIsSecureNtpEnabled: (state, isSecureNtpEnabled) =>
      (state.isSecureNtpEnabled = isSecureNtpEnabled),
  },
  actions: {
    async getNtpData({ commit }) {
      return await api
        .get(
          '/redfish/v1/Managers/' +
            store.getters['global/managerInstance'] +
            '/NetworkProtocol',
        )
        .then((response) => {
          const ntpServers = response.data.NTP?.NTPServers || [];
          const isNtpProtocolEnabled =
            response.data.NTP?.ProtocolEnabled || false;
          commit('setNtpServers', ntpServers);
          commit('setIsNtpProtocolEnabled', isNtpProtocolEnabled);
          const secureNtpServers =
            response.data.Oem?.Ami?.EncryptedNTP?.NTPServers || [];
          const isSecureNtpEnabled =
            response.data.Oem?.Ami?.EncryptedNTP?.NTPStatus || false;
          commit('setSecureNtpServers', secureNtpServers);
          commit('setIsSecureNtpEnabled', isSecureNtpEnabled);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updateDateTime({ state }, dateTimeForm) {
      const ntpData = {
        NTP: {
          ProtocolEnabled: dateTimeForm.ntpProtocolEnabled,
          ...(dateTimeForm.ntpProtocolEnabled && {
            NTPServers: dateTimeForm.ntpServersArray || [],
          }),
        },
        ...(process.env.VUE_APP_ONETREE_RTP_ENABLED === 'true' && {
          Oem: {
            Ami: {
              EncryptedNTP: {
                NTPStatus: dateTimeForm.secureNtpProtocolEnabled,
                ...(dateTimeForm.secureNtpProtocolEnabled && {
                  NTPServers: dateTimeForm.secureNtpServersArray || [],
                }),
              },
            },
          },
        }),
      };
      return await api
        .patch(
          `/redfish/v1/Managers/${store.getters['global/managerInstance']}/NetworkProtocol`,
          ntpData,
        )
        .then(async () => {
          let dateTimePayload = {};
          if (
            dateTimeForm.ntpProtocolEnabled ||
            dateTimeForm.secureNtpProtocolEnabled
          ) {
            dateTimePayload.TimeZoneName = dateTimeForm.TimeZoneName;
          } else {
            dateTimePayload.DateTime = dateTimeForm.updatedDateTime;
            dateTimePayload.TimeZoneName = dateTimeForm.TimeZoneName;
          }
          /**
           * https://github.com/openbmc/phosphor-time-manager/blob/master/README.md#special-note-on-changing-ntp-setting
           * When time mode is initially set to Manual from NTP,
           * NTP service is disabled and the NTP service is
           * stopping but not stopped, setting time will return an error.
           * There are no responses from backend to notify when NTP is stopped.
           * To work around, a timeout is set to allow NTP to fully stop
           * TODO: remove timeout if backend solves
           * https://github.com/openbmc/openbmc/issues/3459
           */
          const timeoutVal =
            state.isNtpProtocolEnabled || state.isSecureNtpEnabled ? 20000 : 0;
          return await new Promise((resolve, reject) => {
            setTimeout(() => {
              return api
                .patch(
                  `/redfish/v1/Managers/${store.getters['global/managerInstance']}`,
                  dateTimePayload,
                )
                .then(() => resolve())
                .catch(() => reject());
            }, timeoutVal);
          });
        })
        .then(() => {
          return i18n.t('pageDateTime.toast.successSaveDateTime');
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageDateTime.toast.errorSaveDateTime'));
        });
    },
  },
};

export default DateTimeStore;
