import api from '@/store/api';
import i18n from '@/i18n';

import { serverStateMapper } from '@/store/modules/GlobalStore';

const SystemStore = {
  namespaced: true,
  state: {
    systems: [],
    greenLedStatus: null,
    amberLedStatus: null,
    susackLedStatus: null,
    serverStatus: 'unreachable',
  },
  getters: {
    systems: (state) => state.systems,
    getGreenLedStatus: (state) => state.greenLedStatus,
    getAmberLedStatus: (state) => state.amberLedStatus,
    getSusackLedStatus: (state) => state.susackLedStatus,
    serverStatus: (state) => state.serverStatus,
  },
  mutations: {
    setSystemInfo: (state, data) => {
      const system = {};
      system.assetTag = data.AssetTag;
      system.description = data.Description;
      system.firmwareVersion = data.BiosVersion;
      system.hardwareType = data.Name;
      system.health = data.Status?.Health;
      system.totalSystemMemoryGiB = data.MemorySummary?.TotalSystemMemoryGiB;
      system.id = data.Id;
      system.locationIndicatorActive = data.LocationIndicatorActive;
      system.locationNumber = data.Location?.PartLocation?.ServiceLabel;
      system.manufacturer = data.Manufacturer;
      system.memorySummaryHealth = data.MemorySummary?.Status?.Health;
      system.memorySummaryHealthRollup =
        data.MemorySummary?.Status?.HealthRollup;
      system.memorySummaryState = data.MemorySummary?.Status?.State;
      system.model = data.Model;
      system.processorSummaryCount = data.ProcessorSummary?.Count;
      system.processorSummaryCoreCount = data.ProcessorSummary?.CoreCount;
      system.processorSummaryHealth = data.ProcessorSummary?.Status?.Health;
      system.processorSummaryHealthRoll =
        data.ProcessorSummary?.Status?.HealthRollup;
      system.processorSummaryState = data.ProcessorSummary?.Status?.State;
      system.powerState = data.PowerState;
      system.serialNumber = data.SerialNumber;
      system.healthRollup = data.Status?.HealthRollup;
      system.subModel = data.SubModel;
      system.statusState = data.Status?.State;
      system.systemType = data.SystemType;
      state.systems = [system];
    },
    setPhysicalLedStatus: (state, data) => {
      state.greenLedStatus = data.GreenLED;
      state.amberLedStatus = data.AmberLED;
      state.susackLedStatus = data.SusackLED;
    },
    setServerStatus: (state, serverState) =>
      (state.serverStatus = serverStateMapper(serverState)),
  },
  actions: {
    async getSystem({ commit }) {
      return await api
        .get('/redfish/v1')
        .then((response) =>
          api.get(`${response.data.Systems['@odata.id']}/system`),
        )
        .then(({ data }) => {
          commit('setSystemInfo', data);
          if (
            data.Status?.State === 'Quiesced' ||
            data.Status?.State === 'InTest'
          ) {
            // OpenBMC's host state interface is mapped to 2 Redfish
            // properties "Status""State" and "PowerState". Look first
            // at State for certain cases.
            commit('setServerStatus', data.Status?.State);
          } else {
            commit('setServerStatus', data?.PowerState);
          }
          if (
            Object.keys(data).includes('Oem') &&
            Object.keys(data.Oem).includes('OpenBmc')
          ) {
            if (data.Oem.OpenBmc.PhysicalLED) {
              commit('setPhysicalLedStatus', data.Oem.OpenBmc.PhysicalLED);
            }
          }
        })
        .catch((error) => console.log(error));
    },
    async changeIdentifyLedState({ commit }, ledState) {
      return await api
        .patch('/redfish/v1/Systems/system', {
          LocationIndicatorActive: ledState,
        })
        .catch((error) => {
          commit('setSystemInfo', this.state.system.systems[0]);
          console.log('error', error);
          if (ledState) {
            throw new Error(
              i18n.t('pageInventory.toast.errorEnableIdentifyLed'),
            );
          } else {
            throw new Error(
              i18n.t('pageInventory.toast.errorDisableIdentifyLed'),
            );
          }
        });
    },
  },
};

export default SystemStore;
