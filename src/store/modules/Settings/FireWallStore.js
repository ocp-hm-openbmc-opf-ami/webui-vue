import api from '@/store/api';
import i18n from '@/i18n';

const FireWallStore = {
  namespaced: true,
  state: {
    FireWallData: [],
    FirstInterfaceId: '',
  },
  getters: {
    getFireWallAllData: (state) => state.FireWallData,
  },
  mutations: {
    setFireWallData: (state, FireWallData) =>
      (state.FireWallData = FireWallData),
  },
  actions: {
    async getFireWallData({ state, commit }) {
      return await api
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces')
        .then((response) => {
          state.FirstInterfaceId = response.data.Members[0]['@odata.id'];
        })
        .then(() =>
          api.get(`${state.FirstInterfaceId}/Oem/Ami/GetFirewallRules`),
        )
        .then((firewallallRules) => {
          commit('setFireWallData', firewallallRules);
        })
        .catch((error) => console.log(error));
    },
    async setFireWallData({ state, dispatch }, data) {
      return await api
        .post(
          `${state.FirstInterfaceId}/Actions/Oem/Ami/EthernetInterface.AddFirewallRules`,
          data,
        )
        .then(() => dispatch('getFireWallData'))
        .then(() => i18n.t('pageFireWall.toast.successSaveFireWall'))
        .catch((error) => {
          console.log(error);
          if (
            error.response.data['EndTime@Message.ExtendedInfo'] ||
            error.response.data['StartTime@Message.ExtendedInfo']
          ) {
            throw new Error(
              i18n.t('pageFireWall.toast.errorDateOrTimeSaveFireWall'),
            );
          } else if (
            error.response.data['StartSourceIPAddress@Message.ExtendedInfo'] ||
            error.response.data['EndSourceIPAddress@Message.ExtendedInfo'] ||
            error.response.data.error[
              '@Message.ExtendedInfo'
            ][0].Message.includes('EndSourceIPAddress') ||
            error.response.data.error[
              '@Message.ExtendedInfo'
            ][0].Message.includes('StartSourceIPAddress')
          ) {
            throw new Error(
              i18n.t('pageFireWall.toast.errorStartorEndIpSaveFireWall'),
            );
          } else {
            throw new Error(i18n.t('pageFireWall.toast.errorSaveFireWall'));
          }
        });
    },
    async deleteFireWallRules({ state, dispatch }, items) {
      return await api
        .post(
          `${state.FirstInterfaceId}/Actions/Oem/Ami/EthernetInterface.DeleteFirewallRules`,
          items,
        )
        .then(() => dispatch('getFireWallData'))
        .then(() => i18n.t('pageFireWall.toast.successDeleteFireWall'))
        .catch(() => {
          throw new Error(i18n.t('pageFireWall.toast.errorDelete'));
        });
    },
    async deleteFlushAll({ state, dispatch }, items) {
      return await api
        .post(
          `${state.FirstInterfaceId}/Actions/Oem/Ami/EthernetInterface.FlushFirewallRules`,
          items,
        )
        .then(() => dispatch('getFireWallData'))
        .then(() => i18n.t('pageFireWall.toast.successDeleteFireWall'))
        .catch(() => {
          throw new Error(i18n.t('pageFireWall.toast.errorDelete'));
        });
    },
  },
};

export default FireWallStore;
