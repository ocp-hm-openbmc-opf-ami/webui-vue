import api, { getResponseCount } from '@/store/api';
import i18n from '@/i18n';

const SessionsStore = {
  namespaced: true,
  state: {
    allConnections: [],
  },
  getters: {
    allConnections: (state) => state.allConnections,
  },
  mutations: {
    setAllConnections: (state, allConnections) =>
      (state.allConnections = allConnections),
  },
  actions: {
    async getSessionsData({ commit }) {
      return await api
        .get('/redfish/v1/SessionService/Oem/Ami/ActiveSessions')
        .then((response) => {
          const allUris = [
            ...(response.data.SSH || []).map((session) => session['@odata.id']),
            ...(response.data.WEB || []).map((session) => session['@odata.id']),
            ...(response.data.KVM || []).map((session) => session['@odata.id']),
            ...(response.data.VMEDIA || []).map(
              (session) => session['@odata.id'],
            ),
            ...(response.data.REDFISH || []).map(
              (session) => session['@odata.id'],
            ),
          ];
          return api.all(allUris.map((uri) => api.get(uri)));
        })
        .then((sessionUris) => {
          const allConnectionsData = sessionUris.map((sessionUri) => {
            let userID = sessionUri.data?.UserId ?? 'NA';
            if (sessionUri.data?.Oem?.Ami?.UserId !== undefined) {
              userID = sessionUri.data.Oem.Ami.UserId;
            }
            let mountType = sessionUri.data?.Oem?.Ami?.MountType ?? 'NA';
            let sessionType = sessionUri.data?.SessionType;
            if (sessionType === 'VirtualMedia') {
              const slotId = sessionUri.data?.Oem?.Ami?.SlotId;
              if (slotId) {
                sessionType += ' - ' + slotId;
              }
            }
            return {
              sessionID: sessionUri.data?.Id,
              sessionType,
              userID,
              username: sessionUri.data?.UserName,
              ipAddress: sessionUri.data?.ClientOriginIPAddress,
              privilege: sessionUri.data?.Roles?.[0],
              uri: sessionUri.data['@odata.id'],
              mountType,
            };
          });
          commit('setAllConnections', allConnectionsData);
        })
        .catch((error) => {
          console.log('Client Session Data:', error);
        });
    },
    async disconnectSessions({ dispatch }, uris = []) {
      const promises = uris.map((uri) =>
        api.delete(uri).catch((error) => {
          console.log(error);
          return error;
        }),
      );
      return await api
        .all(promises)
        .then((response) => {
          dispatch('getSessionsData');
          return response;
        })
        .then(
          api.spread((...responses) => {
            const { successCount, errorCount } = getResponseCount(responses);
            const toastMessages = [];

            if (successCount) {
              const message = i18n.tc(
                'pageSessions.toast.successDelete',
                successCount,
              );
              toastMessages.push({ type: 'success', message });
            }

            if (errorCount) {
              const message = i18n.tc(
                'pageSessions.toast.errorDelete',
                errorCount,
              );
              toastMessages.push({ type: 'error', message });
            }
            return toastMessages;
          }),
        );
    },
  },
};
export default SessionsStore;
