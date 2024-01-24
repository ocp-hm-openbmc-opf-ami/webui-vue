import api from '@/store/api';

const SystemInventoryStore = {
  namespaced: true,
  state: {
    systems: [],
    processors: [],
    memoryController: [],
    baseBoard: [],
    basebordInfoNetworkinterfaces: [],
    basebordInfoNetworkInterfacesIpv6: [],
    pcieDevice: [],
    pcieFunction: [],
  },
  getters: {
    systems: (state) => state.systems,
    processors: (state) => state.processors,
    memoryController: (state) => state.memoryController,
    baseBoard: (state) => state.baseBoard,
    basebordInfoNetworkinterfaces: (state) =>
      state.basebordInfoNetworkinterfaces,
    basebordInfoNetworkInterfacesIpv6: (state) =>
      state.basebordInfoNetworkInterfacesIpv6,
    pcieDevice: (state) => state.pcieDevice,
    pcieFunction: (state) => state.pcieFunction,
  },
  mutations: {
    setSystems: (state, systems) => (state.systems = systems),
    setProcessors: (state, processors) => (state.processors = processors),
    setMemoryController: (state, memoryController) =>
      (state.memoryController = memoryController),
    setBaseboard: (state, baseBoard) => (state.baseBoard = baseBoard),
    setBasebordInfoNetworkinterfaces: (state, basebordInfoNetworkinterfaces) =>
      (state.basebordInfoNetworkinterfaces = basebordInfoNetworkinterfaces),
    setBasebordInfoNetworkInterfacesIpv6: (
      state,
      basebordInfoNetworkInterfacesIpv6
    ) =>
      (state.basebordInfoNetworkInterfacesIpv6 = basebordInfoNetworkInterfacesIpv6),
    setPcieDevice: (state, pcieDevice) => (state.pcieDevice = pcieDevice),
    setPcieFunction: (state, pcieFunction) =>
      (state.pcieFunction = pcieFunction),
  },
  actions: {
    async getSystemsInfo({ commit }) {
      const systemInfo = [];
      return await api
        .get('/redfish/v1/Systems/system')
        .then((response) => {
          const systemData = response;
          systemData.Name = response.data?.Name;
          systemData.Description = response.data?.Description;
          systemData.IndicatorLED = response.data?.LocationIndicatorActive;
          systemData.Manufacturer = response.data?.Manufacturer;
          systemData.PowerState = response.data?.PowerState;
          systemData.SerialNumuber = response.data?.SerialNumuber;
          systemData.PartNumuber = response.data?.PartNumuber;
          systemData.SystemType = response.data?.SystemType;
          systemData.AssetTag = response.data?.AssetTag;
          systemData.BiosVersion = response.data?.BiosVersion;
          systemData.UUID = response.data?.UUID;
          systemData.State = response.data?.Status?.State;
          systemInfo.push(systemData);
          commit('setSystems', systemInfo);
        })
        .catch((error) => console.log(error));
    },
    async getProcessorsInfo({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/Processors')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => api.get(member['@odata.id']))
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const proccessorInfo = response.map(({ data }) => {
            return {
              Id: data.Id,
              Name: data.Name,
              Manufacturer: data.Manufacturer,
              MaxSpeedMHz: data.MaxSpeedMHz,
              Model: data.Model,
              ProcessorArchitecture: data.ProcessorArchitecture,
              ProcessorType: data.ProcessorType,
              Socket: data.Socket,
              EffectiveFamily: data.EffectiveFamily,
              TotalCores: data.TotalCores,
              State: data.Status?.State,
            };
          });
          commit('setProcessors', proccessorInfo);
        })
        .catch((error) => console.log(error));
    },
    async getMemoryControllersInfo({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/Memory')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => api.get(member['@odata.id']))
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const memoryControllerInfo = response.map(({ data }) => {
            return {
              Id: data.Id,
              Name: data.Name,
              CapacityMiB: data.CapacityMiB,
              Manufacturer: data.Manufacturer,
              SerialNumuber: data.SerialNumuber,
              PartNumuber: data.PartNumuber,
              State: data.Status?.State,
              OperatingSpeedMhz: data.OperatingSpeedMhz,
              MemoryType: data.MemoryType,
              Description: data.Description,
              AllowedSpeedsMHz: data.AllowedSpeedsMHz,
              ServiceLabel: data.ServiceLabel,
            };
          });
          commit('setMemoryController', memoryControllerInfo);
        })
        .catch((error) => console.log(error));
    },
    async getBaseBoardInfo({ commit }) {
      return await api
        .get('/redfish/v1/Chassis/AC_Baseboard')
        .then((response) => {
          commit('setBaseboard', response.data.baseboard_info);
        })
        .catch((error) => console.log(error));
    },
    async getBasebordInfoNetworkinterfaces({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          commit(
            'setBasebordInfoNetworkinterfaces',
            response.data.NetworkInterface
          );
        })
        .catch((error) => console.log(error));
    },
    async getBasebordInfoNetworkInterfacesIpv6({ commit }) {
      return await api
        .get('/localApi/SystemInventory')
        .then((response) => {
          commit(
            'setBasebordInfoNetworkInterfacesIpv6',
            response.data.NetworkInterfaceIPv6
          );
        })
        .catch((error) => console.log(error));
    },
    async getPcieDeviceInfo({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/PCIeDevices')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => api.get(member['@odata.id']))
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const pcieDeviceInfo = response.map(({ data }) => {
            return {
              Name: data.Name,
              Manufacturer: data.Manufacturer,
              State: data.Status?.State,
            };
          });
          commit('setPcieDevice', pcieDeviceInfo);
        })
        .catch((error) => console.log(error));
    },
    async getPcieFunctionInfo({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/PCIeDevices')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => api.get(member['@odata.id']))
        )
        .then((promises) => api.all(promises))
        .then((response) =>
          response.map(({ data }) => api.get(data.PCIeFunctions['@odata.id']))
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const PciePromises = response.flatMap(
            ({ data: { Members = [] } = {} }) =>
              Members.map(async (member) => {
                const pcieFunction = await api.get(member['@odata.id']);
                const PcieResponse = {
                  Name: pcieFunction.data?.Name,
                  DeviceId: pcieFunction.data?.DeviceId,
                  VendorId: pcieFunction.data?.VendorId,
                  Id: pcieFunction.data?.Id,
                  DeviceClass: pcieFunction.data?.DeviceClass,
                  ClassCode: pcieFunction.data?.ClassCode,
                  FunctionId: pcieFunction.data?.FunctionId,
                  RevisionId: pcieFunction.data?.RevisionId,
                  SubSystemVendorId: pcieFunction.data?.SubsystemVendorId,
                };
                return PcieResponse;
              })
          );
          return Promise.all(PciePromises).then((pcieFunctionInfo) => {
            commit('setPcieFunction', pcieFunctionInfo);
          });
        })
        .catch((error) => console.log(error));
    },
  },
};
export default SystemInventoryStore;
