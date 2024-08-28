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
    temperature: [],
    voltage: [],
    fpga: [],
    memoryAssembly: [],
    memoryMetrics: [],
    baseBoardId: '',
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
    temperature: (state) => state.temperature,
    voltage: (state) => state.voltage,
    fpga: (state) => state.fpga,
    memoryAssembly: (state) => state.memoryAssembly,
    memoryMetrics: (state) => state.memoryMetrics,
    baseBoardId: (state) => state.baseBoardId,
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
      basebordInfoNetworkInterfacesIpv6,
    ) =>
      (state.basebordInfoNetworkInterfacesIpv6 =
        basebordInfoNetworkInterfacesIpv6),
    setPcieDevice: (state, pcieDevice) => (state.pcieDevice = pcieDevice),
    setPcieFunction: (state, pcieFunction) =>
      (state.pcieFunction = pcieFunction),
    setFans: (state, fans) => (state.fans = fans),
    setPower: (state, power) => (state.power = power),
    setTemperature: (state, temperature) => (state.temperature = temperature),
    setvoltage: (state, voltage) => (state.voltage = voltage),
    setFpga: (state, fpga) => (state.fpga = fpga),
    setMemoryAssembly: (state, memoryAssembly) =>
      (state.memoryAssembly = memoryAssembly),
    setMemoryMetrics: (state, memoryMetrics) =>
      (state.memoryMetrics = memoryMetrics),
    setBaseBoardId: (state, baseBoardId) => (state.baseBoardId = baseBoardId),
  },
  actions: {
    async getSystemsInfo({ commit }) {
      const systemInfo = [];
      return await api
        .get('/redfish/v1/Systems/system')
        .then((response) => {
          const systemData = response;
          systemData.name = response.data?.Name || 'NA';
          systemData.description = response.data?.Description || 'NA';
          systemData.indicatorLED = response.data?.LocationIndicatorActive
            ? response.data?.LocationIndicatorActive
            : response.data?.LocationIndicatorActive === false
              ? response.data?.LocationIndicatorActive
              : 'NA';
          systemData.manufacturer = response.data?.Manufacturer || 'NA';
          systemData.powerState = response.data?.PowerState || 'NA';
          systemData.serialNumuber = response.data?.SerialNumber || 'NA';
          systemData.partNumuber = response.data?.PartNumber || 'NA';
          systemData.systemType = response.data?.SystemType || 'NA';
          systemData.assetTag = response.data?.AssetTag || 'NA';
          systemData.biosVersion = response.data?.BiosVersion || 'NA';
          systemData.state = response.data?.Status?.State || 'NA';
          systemInfo.push(systemData);
          commit('setSystems', systemInfo);
        })
        .catch((error) => console.log(error));
    },
    async getProcessorsInfo({ commit }) {
      const fpgaInfo = [];
      return await api
        .get('/redfish/v1/Systems/system/Processors')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => api.get(member['@odata.id'])),
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const proccessorInfo = response.map(({ data }) => {
            if (data?.FPGA) {
              const fpgaData = {
                id: data.Id || 'NA',
                name: data.Name || 'NA',
                firmwareId: data?.FPGA?.FirmwareId || 'NA',
                firmwareManufacturer: data?.FPGA?.FirmwareManufacturer || 'NA',
                fpgaType: data?.FPGA?.FpgaType || 'NA',
                interfaceType: data?.FPGA?.HostInterface?.InterfaceType || 'NA',
                fpgaModel: data?.FPGA?.Model || 'NA',
                pcieVirtualFunctions: data?.FPGA?.PCIeVirtualFunctions
                  ? data?.FPGA?.PCIeVirtualFunctions
                  : data?.FPGA?.PCIeVirtualFunctions === 0 || 0.0
                    ? data?.FPGA?.PCIeVirtualFunctions
                    : 'NA',
                programmableFromHost: data?.FPGA?.ProgrammableFromHost
                  ? data?.FPGA?.ProgrammableFromHost
                  : data?.FPGA?.ProgrammableFromHost === false
                    ? data?.FPGA?.ProgrammableFromHost
                    : 'NA',
              };
              fpgaInfo.push(fpgaData);
              commit('setFpga', fpgaInfo);
            }
            return {
              id: data.Id || 'NA',
              name: data.Name || 'NA',
              manufacturer: data.Manufacturer || 'NA',
              maxSpeedMHz: data.MaxSpeedMHz
                ? data.MaxSpeedMHz
                : data.MaxSpeedMHz === 0 || 0.0
                  ? data.MaxSpeedMHz
                  : 'NA',
              model: data.Model || 'NA',
              processorArchitecture: data.ProcessorArchitecture || 'NA',
              processorType: data.ProcessorType || 'NA',
              socket: data.Socket || 'NA',
              totalCores: data.TotalCores || 'NA',
              state: data.Status?.State || 'NA',
              totalEnabledCores: data?.TotalEnabledCores || 'NA',
              OperatingSpeedMHz: data?.OperatingSpeedMHz
                ? data?.OperatingSpeedMHz
                : data?.OperatingSpeedMHz === 0 || 0.0
                  ? data?.OperatingSpeedMHz
                  : 'NA',
            };
          });
          commit('setProcessors', proccessorInfo);
        })
        .catch((error) => console.log(error));
    },
    async getMemoryControllersInfo({ commit }) {
      const assembliesInfo = [];
      const metricsInfo = [];
      return await api
        .get('/redfish/v1/Systems/system/Memory')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => api.get(member['@odata.id'])),
        )
        .then((promises) => api.all(promises))
        .then(async (response) => {
          const memoryControllerInfo = await Promise.all(
            response.map(async ({ data }) => {
              if (data?.Assembly != undefined) {
                await api.get(data?.Assembly['@odata.id']).then((responses) => {
                  responses.data?.Assemblies.forEach((assemblies) => {
                    const assembliesData = {
                      id: assemblies?.MemberId || 'NA',
                      name: assemblies?.Name || 'NA',
                      binaryDataURI: assemblies?.BinaryDataURI || 'NA',
                      description: assemblies?.Description || 'NA',
                      engineeringChangeLevel:
                        assemblies?.EngineeringChangeLevel || 'NA',
                      model: assemblies?.Model || 'NA',
                      partNumber: assemblies?.PartNumber || 'NA',
                      physicalContext: assemblies?.PhysicalContext || 'NA',
                      producer: assemblies?.Producer || 'NA',
                      productionDate: assemblies?.ProductionDate || 'NA',
                      sku: assemblies?.SKU || 'NA',
                      serialNumber: assemblies?.SerialNumber || 'NA',
                      sparePartNumber: assemblies?.SparePartNumber || 'NA',
                      state: assemblies?.Status?.State || 'NA',
                      vendor: assemblies?.Vendor || 'NA',
                      version: assemblies?.Version || 'NA',
                    };
                    assembliesInfo.push(assembliesData);
                  });
                });
              }
              if (data?.MemoryMetrics != undefined) {
                await api
                  .get(data?.MemoryMetrics['@odata.id'])
                  .then((metricsresponse) => {
                    const MetricsData = {
                      id: metricsresponse?.data?.Id || 'NA',
                      name: metricsresponse?.data?.Name || 'NA',
                      bandwidthPercent: metricsresponse?.data?.BandwidthPercent
                        ? metricsresponse?.data?.BandwidthPercent
                        : metricsresponse?.data?.BandwidthPercent === 0 || 0.0
                          ? metricsresponse?.data?.BandwidthPercent
                          : 'NA',
                      blockSizeBytes: metricsresponse?.data?.BlockSizeBytes
                        ? metricsresponse?.data?.BlockSizeBytes
                        : metricsresponse?.data?.BlockSizeBytes === 0 || 0.0
                          ? metricsresponse?.data?.BlockSizeBytes
                          : 'NA',
                      blocBlocksWrittenksRead: metricsresponse?.data
                        ?.CurrentPeriod?.BlocBlocksWrittenksRead
                        ? metricsresponse?.data?.CurrentPeriod
                            ?.BlocBlocksWrittenksRead
                        : metricsresponse?.data?.CurrentPeriod
                              ?.BlocBlocksWrittenksRead === 0 || 0.0
                          ? metricsresponse?.data?.CurrentPeriod
                              ?.BlocBlocksWrittenksRead
                          : 'NA',
                      blocksRead: metricsresponse?.data?.CurrentPeriod
                        ?.BlocksRead
                        ? metricsresponse?.data?.CurrentPeriod?.BlocksRead
                        : metricsresponse?.data?.CurrentPeriod?.BlocksRead ===
                              0 || 0.0
                          ? metricsresponse?.data?.CurrentPeriod?.BlocksRead
                          : 'NA',
                      addressParityError: metricsresponse?.data?.HealthData
                        ?.AlarmTrips?.AddressParityError
                        ? metricsresponse?.data?.HealthData?.AlarmTrips
                            ?.AddressParityError
                        : metricsresponse?.data?.HealthData?.AlarmTrips
                              ?.AddressParityError === false
                          ? metricsresponse?.data?.HealthData?.AlarmTrips
                              ?.AddressParityError
                          : 'NA',
                      correctableECCError: metricsresponse?.data?.HealthData
                        ?.AlarmTrips?.CorrectableECCError
                        ? metricsresponse?.data?.HealthData?.AlarmTrips
                            ?.CorrectableECCError
                        : metricsresponse?.data?.HealthData?.AlarmTrips
                              ?.CorrectableECCError === false
                          ? metricsresponse?.data?.HealthData?.AlarmTrips
                              ?.CorrectableECCError
                          : 'NA',
                      spareBlock: metricsresponse?.data?.HealthData?.AlarmTrips
                        ?.SpareBlock
                        ? metricsresponse?.data?.HealthData?.AlarmTrips
                            ?.SpareBlock
                        : metricsresponse?.data?.HealthData?.AlarmTrips
                              ?.SpareBlock === false
                          ? metricsresponse?.data?.HealthData?.AlarmTrips
                              ?.SpareBlock
                          : 'NA',
                      temperature: metricsresponse?.data?.HealthData?.AlarmTrips
                        ?.Temperature
                        ? metricsresponse?.data?.HealthData?.AlarmTrips
                            ?.Temperature
                        : metricsresponse?.data?.HealthData?.AlarmTrips
                              ?.Temperature === false
                          ? metricsresponse?.data?.HealthData?.AlarmTrips
                              ?.Temperature
                          : 'NA',
                      dataLossDetected: metricsresponse?.data?.HealthData
                        ?.DataLossDetected
                        ? metricsresponse?.data?.HealthData?.DataLossDetected
                        : metricsresponse?.data?.HealthData
                              ?.DataLossDetected === false
                          ? metricsresponse?.data?.HealthData?.DataLossDetected
                          : 'NA',
                      lastShutdownSuccess: metricsresponse?.data?.HealthData
                        ?.LastShutdownSuccess
                        ? metricsresponse?.data?.HealthData?.LastShutdownSuccess
                        : metricsresponse?.data?.HealthData
                              ?.LastShutdownSuccess === false
                          ? metricsresponse?.data?.HealthData
                              ?.LastShutdownSuccess
                          : 'NA',
                      performanceDegraded: metricsresponse?.data?.HealthData
                        ?.PerformanceDegraded
                        ? metricsresponse?.data?.HealthData?.PerformanceDegraded
                        : metricsresponse?.data?.HealthData
                              ?.PerformanceDegraded === 0 || 0.0
                          ? metricsresponse?.data?.HealthData
                              ?.PerformanceDegraded
                          : 'NA',
                      predictedMediaLifeLeftPercent: metricsresponse?.data
                        ?.HealthData?.PredictedMediaLifeLeftPercent
                        ? metricsresponse?.data?.HealthData
                            ?.PredictedMediaLifeLeftPercent
                        : metricsresponse?.data?.HealthData
                              ?.PredictedMediaLifeLeftPercent === 0 || 0.0
                          ? metricsresponse?.data?.HealthData
                              ?.PredictedMediaLifeLeftPercent
                          : 'NA',
                      remainingSpareBlockPercentage: metricsresponse?.data
                        ?.HealthData?.RemainingSpareBlockPercentage
                        ? metricsresponse?.data?.HealthData
                            ?.RemainingSpareBlockPercentage
                        : metricsresponse?.data?.HealthData
                              ?.RemainingSpareBlockPercentage === 0 || 0.0
                          ? metricsresponse?.data?.HealthData
                              ?.RemainingSpareBlockPercentage
                          : 'NA',
                      operatingSpeedMHz: metricsresponse?.data
                        ?.OperatingSpeedMHz
                        ? metricsresponse?.data?.OperatingSpeedMHz
                        : metricsresponse?.data?.OperatingSpeedMHz === 0 || 0.0
                          ? metricsresponse?.data?.OperatingSpeedMHz
                          : 'NA',
                    };
                    metricsInfo.push(MetricsData);
                  });
              }
              return {
                id: data.Id || 'NA',
                name: data.Name || 'NA',
                capacityMiB: data.CapacityMiB
                  ? data.CapacityMiB
                  : data.CapacityMiB === 0 || 0.0
                    ? data.CapacityMiB
                    : 'NA',
                manufacturer: data.Manufacturer || 'NA',
                serialNumuber: data.SerialNumber || 'NA',
                partNumuber: data.PartNumber || 'NA',
                state: data.Status?.State || 'NA',
                operatingSpeedMhz: data.OperatingSpeedMhz
                  ? data.OperatingSpeedMhz
                  : data.OperatingSpeedMhz === 0 || 0.0
                    ? data.OperatingSpeedMhz
                    : 'NA',
                memoryType: data.MemoryType || 'NA',
                allowedSpeedsMHz: data.AllowedSpeedsMHz[0] || 'NA',
                serviceLabel: data.Location?.PartLocation?.ServiceLabel || 'NA',
              };
            }),
          );

          commit('setMemoryController', memoryControllerInfo);
          commit('setMemoryAssembly', assembliesInfo);
          commit('setMemoryMetrics', metricsInfo);
        })
        .catch((error) => console.log(error));
    },
    async getBaseBoardInfo({ commit, state }) {
      const baseBoardInfo = [];
      return await api
        .get(`/redfish/v1/Chassis/${state.baseBoardId}`)
        .then((response) => {
          const baseBoard = response;
          baseBoard.name = response.data?.Name || 'NA';
          baseBoard.locationIndicatorActive = response.data
            ?.LocationIndicatorActive
            ? response.data?.LocationIndicatorActive
            : response.data?.LocationIndicatorActive === false
              ? response.data?.LocationIndicatorActive
              : 'NA';
          baseBoard.indicatorLED = response.data?.IndicatorLED || 'NA';
          baseBoard.manufacturer = response.data?.Manufacturer || 'NA';
          baseBoard.powerState = response.data?.PowerState || 'NA';
          baseBoard.serialNumber = response.data?.SerialNumber || 'NA';
          baseBoard.partNumber = response.data?.PartNumber || 'NA';
          baseBoard.model = response.data?.Model || 'NA';
          baseBoard.assetTag = response.data?.AssetTag || 'NA';
          baseBoard.state = response.data?.Status?.State || 'NA';
          baseBoardInfo.push(baseBoard);
          commit('setBaseboard', baseBoardInfo);
        })
        .catch((error) => console.log(error));
    },
    async getBasebordInfoNetworkinterfaces({ commit }) {
      const networkInterfacesInfo = [];
      return await api
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces')
        .then((response) =>
          response.data.Members.map(
            (ethernetInterface) => ethernetInterface['@odata.id'],
          ),
        )
        .then((ethernetInterfaceIds) =>
          api.all(
            ethernetInterfaceIds.map((ethernetInterface) =>
              api.get(ethernetInterface),
            ),
          ),
        )
        .then((ethernetInterfaces) => {
          ethernetInterfaces.forEach(({ data }) => {
            data.IPv4Addresses.forEach((ipv4) => {
              const networkIntefaces = {
                id: data.Id || 'NA',
                mACAddress: data.MACAddress || 'NA',
                interfaceEnabled: data?.InterfaceEnabled
                  ? data?.InterfaceEnabled
                  : data?.InterfaceEnabled === false
                    ? data?.InterfaceEnabled
                    : 'NA',
                iPv4Addresses: ipv4.Address || 'NA',
                hostName: data.HostName || 'NA',
                state: data.Status?.State || 'NA',
                address: ipv4.Address || 'NA',
              };
              networkInterfacesInfo.push(networkIntefaces);
            });
          });
          commit('setBasebordInfoNetworkinterfaces', networkInterfacesInfo);
        })
        .catch((error) => console.log(error));
    },
    async getBasebordInfoNetworkInterfacesIpv6({ commit }) {
      const ipv6AddressInfo = [];
      return await api
        .get('/redfish/v1/Managers/bmc/EthernetInterfaces')
        .then((response) =>
          response.data.Members.map(
            (ethernetInterface) => ethernetInterface['@odata.id'],
          ),
        )
        .then((ethernetInterfaceIds) =>
          api.all(
            ethernetInterfaceIds.map((ethernetInterface) =>
              api.get(ethernetInterface),
            ),
          ),
        )
        .then((ethernetInterfaces) => {
          ethernetInterfaces.forEach(({ data }) => {
            data.IPv6Addresses.forEach((ipv6) => {
              const ipv6Address = {
                id: data.Id || 'NA',
                address: ipv6.Address || 'NA',
                prefixLength: ipv6.PrefixLength || 'NA',
                scope: ipv6.AddressOrigin
                  ? ipv6.AddressOrigin === 'SLAAC'
                    ? 'Global'
                    : ipv6.AddressOrigin === 'LinkLocal'
                      ? 'LinkLocal'
                      : ''
                  : 'NA',
              };
              ipv6AddressInfo.push(ipv6Address);
            });
          });
          commit('setBasebordInfoNetworkInterfacesIpv6', ipv6AddressInfo);
        })
        .catch((error) => console.log(error));
    },
    async getPcieDeviceInfo({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system/PCIeDevices')
        .then(({ data: { Members = [] } = {} }) =>
          Members.map((member) => api.get(member['@odata.id'])),
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const pcieDeviceInfo = response.map(({ data }) => {
            return {
              id: data.Id || 'NA',
              name: data.Name || 'NA',
              manufacturer: data.Manufacturer || 'NA',
              state: data.Status?.State || 'NA',
              assetTag: data?.AssetTag || 'NA',
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
          Members.map((member) => api.get(member['@odata.id'])),
        )
        .then((promises) => api.all(promises))
        .then((response) =>
          response.map(({ data }) => api.get(data.PCIeFunctions['@odata.id'])),
        )
        .then((promises) => api.all(promises))
        .then((response) => {
          const PciePromises = response.flatMap(
            ({ data: { Members = [] } = {} }) =>
              Members.map(async (member) => {
                const pcieFunction = await api.get(member['@odata.id']);
                const PcieResponse = {
                  name: pcieFunction.data?.Name || 'NA',
                  deviceId: pcieFunction.data?.DeviceId || 'NA',
                  vendorId: pcieFunction.data?.VendorId || 'NA',
                  id: pcieFunction.data?.Id || 'NA',
                  deviceClass: pcieFunction.data?.DeviceClass || 'NA',
                  classCode: pcieFunction.data?.ClassCode || 'NA',
                  functionId: pcieFunction.data?.FunctionId
                    ? pcieFunction.data?.FunctionId
                    : pcieFunction.data?.FunctionId === 0
                      ? pcieFunction.data?.FunctionId
                      : 'NA',
                  functionType: pcieFunction.data?.FunctionType || 'NA',
                  revisionId: pcieFunction.data?.RevisionId || 'NA',
                  subSystemVendorId:
                    pcieFunction.data?.SubsystemVendorId || 'NA',
                };
                return PcieResponse;
              }),
          );
          return Promise.all(PciePromises).then((pcieFunctionInfo) => {
            commit('setPcieFunction', pcieFunctionInfo);
          });
        })
        .catch((error) => console.log(error));
    },
    async getFansInfo({ commit, state }) {
      return await api
        .get(`/redfish/v1/Chassis/${state.baseBoardId}/ThermalSubsystem`)
        .then((response) => {
          return api.get(`${response.data.Fans['@odata.id']}`);
        })
        .then(({ data: { Members } }) => {
          const promises = Members.map((member) =>
            api.get(member['@odata.id']),
          );
          return api.all(promises);
        })
        .then((response) => {
          const data = response.map(({ data }) => data);
          const promises = data.map((member) =>
            api.get(member.SpeedPercent.DataSourceUri),
          );
          return api.all(promises);
        })
        .then((responses) => {
          const thermalFanInfo = responses.map(({ data }) => {
            return {
              name: data.Name || 'NA',
              state: data.Status?.State || 'NA',
              readingRPM: data.Reading
                ? data.Reading
                : data.Reading === 0 || 0.0
                  ? data.Reading
                  : 'NA',
              minReadingRange: data.ReadingRangeMin
                ? data.ReadingRangeMin
                : data.ReadingRangeMin === 0 || 0.0
                  ? data.ReadingRangeMin
                  : 'NA',
              maxReadingRange: data.ReadingRangeMax
                ? data.ReadingRangeMax
                : data.ReadingRangeMax === 0 || 0.0
                  ? data.ReadingRangeMax
                  : 'NA',
            };
          });
          commit('setFans', thermalFanInfo);
        })
        .catch((error) => console.log(error));
    },
    async getPowerInfo({ commit, state }) {
      return await api
        .get(`/redfish/v1/Chassis/${state.baseBoardId}/PowerSubsystem`)
        .then((response) => {
          return api.get(response.data.PowerSupplies['@odata.id']);
        })
        .then(({ data: { Members } }) => {
          const promises = Members.map((member) =>
            api.get(member['@odata.id']),
          );
          return api.all(promises);
        })
        .then((responses) => {
          const powerInfo = responses.map(({ data }) => {
            return {
              name: data.Name || 'NA',
              manufacturer: data.Manufacturer || 'NA',
              model: data.Model || 'NA',
              plugType: data.PlugType || 'NA',
              powerCapacityWatts: data.PowerCapacityWatts
                ? data.PowerCapacityWatts
                : data.PowerCapacityWatts === 0 || 0.0
                  ? data.PowerCapacityWatts
                  : 'NA',
              PowerSupplyType: data.PowerSupplyType || 'NA',
              SerialNumber: data.SerialNumber || 'NA',
              state: data.Status?.State || 'NA',
            };
          });
          commit('setPower', powerInfo);
        })
        .catch((error) => console.log(error));
    },
    async getTemperatureInfo({ commit, state }) {
      return await api
        .get(`/redfish/v1/Chassis/${state.baseBoardId}/Sensors`)
        .then(({ data: { Members = [] } = {} }) => {
          const promises = Members.filter((member) =>
            member['@odata.id'].includes('temperature'),
          ).map((member) => api.get(member['@odata.id']));
          return api.all(promises);
        })
        .then((response) => {
          const temperatureInfo = response.map(({ data }) => {
            return {
              name: data.Name || 'NA',
              physicalContext: data.PhysicalContext || 'NA',
              readingUnits: data.ReadingUnits || 'NA',
              reading: data.Reading
                ? data.Reading
                : data.Reading === 0 || 0.0
                  ? data.Reading
                  : 'NA',
              readingRangeMin: data.ReadingRangeMin
                ? data.ReadingRangeMin
                : data.ReadingRangeMin === 0 || 0.0
                  ? data.ReadingRangeMin
                  : 'NA',
              readingRangeMax: data.ReadingRangeMax
                ? data.ReadingRangeMax
                : data.ReadingRangeMax === 0 || 0.0
                  ? data.ReadingRangeMax
                  : 'NA',
              readingType: data.ReadingType || 'NA',
              upperThresholdFatal: data.Thresholds?.UpperCaution?.Reading
                ? data.Thresholds?.UpperCaution?.Reading
                : data.Thresholds?.UpperCaution?.Reading === 0 || 0.0
                  ? data.Thresholds?.UpperCaution?.Reading
                  : 'NA',
              upperThresholdCritical: data.Thresholds?.UpperCritical?.Reading
                ? data.Thresholds?.UpperCritical?.Reading
                : data.Thresholds?.UpperCritical?.Reading === 0 || 0.0
                  ? data.Thresholds?.UpperCritical?.Reading
                  : 'NA',
              lowerThresholdCritical: data.Thresholds?.LowerCritical?.Reading
                ? data.Thresholds?.LowerCritical?.Reading
                : data.Thresholds?.LowerCritical?.Reading === 0 || 0.0
                  ? data.Thresholds?.LowerCritical?.Reading
                  : 'NA',
              lowerThresholdFatal: data.Thresholds?.LowerCaution?.Reading
                ? data.Thresholds?.LowerCaution?.Reading
                : data.Thresholds?.LowerCaution?.Reading === 0 || 0.0
                  ? data.Thresholds?.LowerCaution?.Reading
                  : 'NA',
              state: data.Status?.State || 'NA',
            };
          });
          commit('setTemperature', temperatureInfo);
        })
        .catch((error) => console.log(error));
    },
    async getVoltageInfo({ commit, state }) {
      return await api
        .get(`/redfish/v1/Chassis/${state.baseBoardId}/Sensors`)
        .then(({ data: { Members = [] } = {} }) => {
          const promises = Members.filter((member) =>
            member['@odata.id'].includes('voltage'),
          ).map((member) => api.get(member['@odata.id']));
          return api.all(promises);
        })
        .then((response) => {
          const voltageInfo = response.map(({ data }) => {
            return {
              name: data.Name || 'NA',
              readingUnits: data.ReadingUnits || 'NA',
              reading: data.Reading
                ? data.Reading
                : data.Reading === 0 || 0.0
                  ? data.Reading
                  : 'NA',
              readingRangeMin: data.ReadingRangeMin
                ? data.ReadingRangeMin
                : data.ReadingRangeMin === 0 || 0.0
                  ? data.ReadingRangeMin
                  : 'NA',
              readingRangeMax: data.ReadingRangeMax
                ? data.ReadingRangeMax
                : data.ReadingRangeMax === 0 || 0.0
                  ? data.ReadingRangeMax
                  : 'NA',
              readingType: data.ReadingType || 'NA',
              upperThresholdFatal: data.Thresholds?.UpperCaution?.Reading
                ? data.Thresholds?.UpperCaution?.Reading
                : data.Thresholds?.UpperCaution?.Reading === 0 || 0.0
                  ? data.Thresholds?.UpperCaution?.Reading
                  : 'NA',
              upperThresholdCritical: data.Thresholds?.UpperCritical?.Reading
                ? data.Thresholds?.UpperCritical?.Reading
                : data.Thresholds?.UpperCritical?.Reading === 0 || 0.0
                  ? data.Thresholds?.UpperCritical?.Reading
                  : 'NA',
              lowerThresholdCritical: data.Thresholds?.LowerCritical?.Reading
                ? data.Thresholds?.LowerCritical?.Reading
                : data.Thresholds?.LowerCritical?.Reading === 0 || 0.0
                  ? data.Thresholds?.LowerCritical?.Reading
                  : 'NA',
              lowerThresholdFatal: data.Thresholds?.LowerCaution?.Reading
                ? data.Thresholds?.LowerCaution?.Reading
                : data.Thresholds?.LowerCaution?.Reading === 0 || 0.0
                  ? data.Thresholds?.LowerCaution?.Reading
                  : 'NA',
              state: data.Status?.State || 'NA',
            };
          });
          commit('setvoltage', voltageInfo);
        })
        .catch((error) => console.log(error));
    },
    async ChassisCollection({ commit }) {
      return await api
        .get('/redfish/v1/Chassis')
        .then(({ data: { Members = [] } = {} }) => {
          Members.filter((member) =>
            member['@odata.id'].includes('Baseboard'),
          ).map((member) => {
            const url = member['@odata.id'].split('/');
            const lastValue = url[url.length - 1];
            commit('setBaseBoardId', lastValue);
          });
        })
        .catch((error) => {
          console.log(error);
          commit('setBaseBoardId', '');
        });
    },
  },
};
export default SystemInventoryStore;
