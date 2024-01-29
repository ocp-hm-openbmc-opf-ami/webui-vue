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
    fans: [],
    power: [],
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
    fans: (state) => state.fans,
    power: (state) => state.power,
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
    setFans: (state, fans) => (state.fans = fans),
    setPower: (state, power) => (state.power = power),
  },
  actions: {
    async getSystemsInfo({ commit }) {
      const systemInfo = [];
      return await api
        .get('/redfish/v1/Systems/system')
        .then((response) => {
          const systemData = response;
          systemData.name = response.data?.Name ? response.data?.Name : 'NA';
          systemData.description = response.data?.Description
            ? response.data?.Description
            : 'NA';
          systemData.indicatorLED = response.data?.LocationIndicatorActive
            ? response.data?.LocationIndicatorActive
            : 'NA';
          systemData.manufacturer = response.data?.Manufacturer
            ? response.data?.Manufacturer
            : 'NA';
          systemData.powerState = response.data?.PowerState
            ? response.data?.PowerState
            : 'NA';
          systemData.serialNumuber = response.data?.SerialNumber
            ? response.data?.SerialNumber
            : 'NA';
          systemData.partNumuber = response.data?.PartNumuber
            ? response.data?.PartNumuber
            : 'NA';
          systemData.systemType = response.data?.SystemType;
          systemData.assetTag = response.data?.AssetTag
            ? response.data?.AssetTag
            : 'NA';
          systemData.biosVersion = response.data?.BiosVersion
            ? response.data?.BiosVersion
            : 'NA';
          systemData.state = response.data?.Status?.State
            ? response.data?.Status?.State
            : 'NA';
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
              id: data.Id ? data.Id : 'NA',
              name: data.Name ? data.Name : 'NA',
              manufacturer: data.Manufacturer ? data.Manufacturer : 'NA',
              maxSpeedMHz: data.MaxSpeedMHz ? data.MaxSpeedMHz : 'NA',
              model: data.Model ? data.Model : 'NA',
              processorArchitecture: data.ProcessorArchitecture
                ? data.ProcessorArchitecture
                : 'NA',
              processorType: data.ProcessorType ? data.ProcessorType : 'NA',
              socket: data.Socket ? data.Socket : 'NA',
              totalCores: data.TotalCores ? data.TotalCores : 'NA',
              state: data.Status?.State ? data.Status?.State : 'NA',
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
              id: data.Id ? data.Id : 'NA',
              name: data.Name ? data.Name : 'NA',
              capacityMiB: data.CapacityMiB ? data.CapacityMiB : 'NA',
              manufacturer: data.Manufacturer ? data.Manufacturer : 'NA',
              serialNumuber: data.SerialNumber ? data.SerialNumber : 'NA',
              partNumuber: data.PartNumber ? data.PartNumber : 'NA',
              state: data.Status?.State ? data.Status?.State : 'NA',
              operatingSpeedMhz: data.OperatingSpeedMhz
                ? data.OperatingSpeedMhz
                : 'NA',
              memoryType: data.MemoryType ? data.MemoryType : 'NA',
              allowedSpeedsMHz: data.AllowedSpeedsMHz
                ? data.AllowedSpeedsMHz
                : 'NA',
              serviceLabel: data.Location.PartLocation.ServiceLabel
                ? data.Location.PartLocation.ServiceLabel
                : 'NA',
            };
          });
          commit('setMemoryController', memoryControllerInfo);
        })
        .catch((error) => console.log(error));
    },
    async getBaseBoardInfo({ commit }) {
      const baseBoardInfo = [];
      return await api
        .get('/redfish/v1/Chassis/AC_Baseboard')
        .then((response) => {
          const baseBoard = response;
          baseBoard.name = response.data?.Name ? response.data?.Name : 'NA';
          baseBoard.locationIndicatorActive = response.data
            ?.LocationIndicatorActive
            ? response.data?.LocationIndicatorActive
            : 'NA';
          baseBoard.indicatorLED = response.data?.IndicatorLED
            ? response.data?.IndicatorLED
            : 'NA';
          baseBoard.manufacturer = response.data?.Manufacturer
            ? response.data?.Manufacturer
            : 'NA';
          baseBoard.powerState = response.data?.PowerState
            ? response.data?.PowerState
            : 'NA';
          baseBoard.serialNumber = response.data.SerialNumber
            ? response.data.SerialNumber
            : 'NA';
          baseBoard.partNumuber = response.data?.PartNumber
            ? response.data?.PartNumber
            : 'NA';
          baseBoard.model = response.data?.Model ? response.data?.Model : 'NA';
          baseBoard.assetTag = response.data?.AssetTag
            ? response.data?.AssetTag
            : 'NA';
          baseBoard.state = response.data?.Status?.State
            ? response.data?.Status?.State
            : 'NA';
          baseBoardInfo.push(baseBoard);
          commit('setBaseboard', baseBoardInfo);
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
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces')
        .then((response) =>
          response.data.Members.map(
            (ethernetInterface) => ethernetInterface['@odata.id']
          )
        )
        .then((ethernetInterfaceIds) =>
          api.all(
            ethernetInterfaceIds.map((ethernetInterface) =>
              api.get(ethernetInterface)
            )
          )
        )
        .then((ethernetInterfaces) => {
          const ipv6AddressInfo = ethernetInterfaces.map(({ data }) => {
            return {
              address: data.IPv6Addresses[0]?.Address
                ? data.IPv6Addresses[0]?.Address
                : 'NA',
              prefixLength: data.IPv6Addresses[0]?.PrefixLength
                ? data.IPv6Addresses[0]?.PrefixLength
                : 'NA',
              scope: data.IPv6Addresses[0]?.AddressOrigin
                ? data.IPv6Addresses[0]?.AddressOrigin == 'SLAAC'
                  ? 'Global'
                  : data.IPv6Addresses[0]?.AddressOrigin == 'LinkLocal'
                  ? 'LinkLocal'
                  : ''
                : 'NA',
            };
          });
          commit('setBasebordInfoNetworkInterfacesIpv6', ipv6AddressInfo);
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
              id: data.Id ? data.Id : 'NA',
              name: data.Name ? data.Name : 'NA',
              manufacturer: data.Manufacturer ? data.Manufacturer : 'NA',
              state: data.Status?.State ? data.Status?.State : 'NA',
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
                  name: pcieFunction.data?.Name
                    ? pcieFunction.data?.Name
                    : 'NA',
                  deviceId: pcieFunction.data?.DeviceId
                    ? pcieFunction.data?.Name
                    : 'NA',
                  vendorId: pcieFunction.data?.VendorId
                    ? pcieFunction.data?.VendorId
                    : 'NA',
                  id: pcieFunction.data?.Id ? pcieFunction.data?.Id : 'NA',
                  deviceClass: pcieFunction.data?.DeviceClass
                    ? pcieFunction.data?.DeviceClass
                    : 'NA',
                  classCode: pcieFunction.data?.ClassCode
                    ? pcieFunction.data?.ClassCode
                    : 'NA',
                  functionId: pcieFunction.data?.FunctionId
                    ? pcieFunction.data?.FunctionId
                    : 'NA',
                  functionType: pcieFunction.data?.FunctionType
                    ? pcieFunction.data?.FunctionType
                    : 'NA',
                  revisionId: pcieFunction.data?.RevisionId
                    ? pcieFunction.data?.RevisionId
                    : 'NA',
                  subSystemVendorId: pcieFunction.data?.SubsystemVendorId
                    ? pcieFunction.data?.SubsystemVendorId
                    : 'NA',
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
    async getFansInfo({ commit }) {
      return await api
        .get('/redfish/v1/Chassis/AC_Baseboard/ThermalSubsystem')
        .then((response) => {
          return api.get(`${response.data.Fans['@odata.id']}`);
        })
        .then(({ data: { Members } }) => {
          const promises = Members.map((member) =>
            api.get(member['@odata.id'])
          );
          return api.all(promises);
        })
        .then((response) => {
          const data = response.map(({ data }) => data);
          const promises = data.map((member) =>
            api.get(member.SpeedPercent.DataSourceUri)
          );
          return api.all(promises);
        })
        .then((responses) => {
          const thermalFanInfo = responses.map(({ data }) => {
            return {
              name: data.Name ? data.Name : 'NA',
              state: data.Status?.State ? data.Status?.State : 'NA',
              readingRPM: data.Reading ? data.Reading : 'NA',
              minReadingRange: data.ReadingRangeMin
                ? data.ReadingRangeMin
                : 'NA',
              maxReadingRange: data.ReadingRangeMax
                ? data.ReadingRangeMax
                : 'NA',
            };
          });
          commit('setFans', thermalFanInfo);
        })
        .catch((error) => console.log(error));
    },
    async getPowerInfo({ commit }) {
      return await api
        .get('/redfish/v1/Chassis/AC_Baseboard/PowerSubsystem')
        .then((response) => {
          return api.get(response.data.PowerSupplies['@odata.id']);
        })
        .then(({ data: { Members } }) => {
          const promises = Members.map((member) =>
            api.get(member['@odata.id'])
          );
          return api.all(promises);
        })
        .then((responses) => {
          const powerInfo = responses.map(({ data }) => {
            return {
              name: data.Name ? data.Name : 'NA',
              manufacturer: data.Manufacturer ? data.Manufacturer : 'NA',
              model: data.Model ? data.Model : 'NA',
              plugType: data.PlugType ? data.PlugType : 'NA',
              powerCapacityWatts: data.PowerCapacityWatts
                ? data.PowerCapacityWatts
                : 'NA',
              PowerSupplyType: data.PowerSupplyType
                ? data.PowerSupplyType
                : 'NA',
              SerialNumber: data.SerialNumber ? data.SerialNumber : 'NA',
              state: data.Status?.State ? data.Status?.State : 'NA',
              efficiencyPercent: data.EfficiencyRatings[0]?.EfficiencyPercent
                ? data.EfficiencyRatings[0]?.EfficiencyPercent
                : 'NA',
              inputRanges: data.InputRanges[0]?.NominalVoltageType
                ? data.InputRanges[0]?.NominalVoltageType
                : 'NA',
            };
          });
          commit('setPower', powerInfo);
        })
        .catch((error) => console.log(error));
    },
  },
};
export default SystemInventoryStore;
