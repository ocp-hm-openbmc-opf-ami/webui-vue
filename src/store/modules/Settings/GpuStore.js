import api from '@/store/api';
import i18n from '@/i18n';

const GpuStore = {
  namespaced: true,
  state: {
    gpuSystemsInfo: {},
    gpgpuChassisData: {},
    gpuProcessorData: [],
    fpgaSensorData: {},
    fpgaInfoData: '',
    fpgaProcessorData: [],
    fpgaPortData: {},
    baseBoardInfo: '',
    baseBoardSensorData: '',
    baseBoardAssembly: '',
    gpuEnvironmentInfo: '',
    gpuPCIeInfo: '',
    gpuMemoryDeviceCollections: '',
    gpuMemoryEnvironmentMetricsCollections: '',
    gpuMemoryMetricsCollections: '',
    gpgpuChassisSelectedInfo: '',
    gpuChassisSensorInfo: '',
    gpuProcessorPortData: '',
  },
  getters: {
    getGpuSystemsInfo: (state) => state.gpuSystemsInfo,
    getGpgpuChassisData: (state) => state.gpgpuChassisData,
    getFpgaInfoData: (state) => state.fpgaInfoData,
    getFpgaSensorData: (state) => state.fpgaSensorData,
    getBaseBoardInfo: (state) => state.baseBoardInfo,
    getBaseBoardAssemblyInfo: (state) => state.baseBoardAssembly,
    getBaseBoardSensorData: (state) => state.baseBoardSensorData,
    getGpuProcessorData: (state) => state.gpuProcessorData,
    getFpgaProcessorData: (state) => state.fpgaProcessorData,
    getfpgaPortData: (state) => state.fpgaPortData,
    getGpuEnvironmentInfo: (state) => state.gpuEnvironmentInfo,
    getGpuPCIeData: (state) => state.gpuPCIeInfo,
    getMemoryDeviceCollections: (state) => state.gpuMemoryDeviceCollections,
    getMemoryEnvironmentMetricsData: (state) =>
      state.gpuMemoryEnvironmentMetricsCollections,
    getMemoryMetricsData: (state) => state.gpuMemoryMetricsCollections,
    getgpuChassisSelectedInfo: (state) => state.gpgpuChassisSelectedInfo,
    getGpuChassisSensorData: (state) => state.gpuChassisSensorInfo,
    setgpuProcessorPortData: (state) => state.gpuProcessorPortData,
  },
  mutations: {
    setGpuSystemsInfo: (state, gpuSystemsInfo) =>
      (state.gpuSystemsInfo = gpuSystemsInfo),
    setGpgpuChassisData: (state, gpgpuChassisData) =>
      (state.gpgpuChassisData = gpgpuChassisData),
    setFpgaSensorData: (state, fpgaSensorData) =>
      (state.fpgaSensorData = fpgaSensorData),
    setFpgaInfoData: (state, fpgaInfoData) =>
      (state.fpgaInfoData = fpgaInfoData),
    setBaseBoardInfo: (state, baseBoardInfo) =>
      (state.baseBoardInfo = baseBoardInfo),
    setBaseBoardSensorData: (state, baseBoardSensorData) =>
      (state.baseBoardSensorData = baseBoardSensorData),
    setBaseBoardAssemblyInfo: (state, baseBoardAssembly) =>
      (state.baseBoardAssembly = baseBoardAssembly),
    setGpuProcessorData: (state, gpuProcessorData) =>
      (state.gpuProcessorData = gpuProcessorData),
    setFpgaProcessorData: (state, fpgaProcessorData) =>
      (state.fpgaProcessorData = fpgaProcessorData),
    setFpgaPortData: (state, fpgaPortData) =>
      (state.fpgaPortData = fpgaPortData),
    setGpuEnvironmentInfo: (state, gpuEnvironmentInfo) =>
      (state.gpuEnvironmentInfo = gpuEnvironmentInfo),
    setGpuPCIeData: (state, gpuPCIeInfo) => (state.gpuPCIeInfo = gpuPCIeInfo),
    setMemoryDeviceCollections: (state, gpuMemoryDeviceCollections) =>
      (state.gpuMemoryDeviceCollections = gpuMemoryDeviceCollections),
    setMemoryEnvironmentMetricsData: (
      state,
      gpuMemoryEnvironmentMetricsCollections,
    ) =>
      (state.gpuMemoryEnvironmentMetricsCollections =
        gpuMemoryEnvironmentMetricsCollections),
    setMemoryMetricsData: (state, gpuMemoryMetricsCollections) =>
      (state.gpuMemoryMetricsCollections = gpuMemoryMetricsCollections),
    setgpuChassisSelectedInfo: (state, gpgpuChassisSelectedInfo) =>
      (state.gpgpuChassisSelectedInfo = gpgpuChassisSelectedInfo),
    setGpuChassisSensorData: (state, gpuChassisSensorInfo) =>
      (state.gpuChassisSensorInfo = gpuChassisSensorInfo),
    setgpuProcessorPortData: (state, gpuProcessorPortData) =>
      (state.gpuProcessorPortData = gpuProcessorPortData),
  },
  actions: {
    // GPGPU Start
    async getGpuSystems({ commit }) {
      return await api
        .get('/redfish/v1/Systems/system')
        .then((systemInfo) => {
          commit('setGpuSystemsInfo', systemInfo.data);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('gpgpu.toast.errorGettingSystems'));
        });
    },
    async getGpgpuChassisData({ commit }) {
      return await api
        .get('/redfish/v1/Chassis')
        .then((chassisInfo) => {
          commit('setGpgpuChassisData', chassisInfo.data.Members);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('gpgpu.toast.errorGettingChassis'));
        });
    },
    async getGpuProcessors({ commit }, uri) {
      const gpuProcessorData = [];
      const fpgaProcessorData = [];
      const response = await api.get(uri?.Processors['@odata.id']);
      response?.data?.Members?.map(async (processor) => {
        var deviceName = processor['@odata.id']?.split('/').pop();
        if (
          deviceName.includes('GPU') &&
          !deviceName.includes('ERoT') &&
          !deviceName.includes('IRoT')
        ) {
          const portValuesResponse = await api.get(processor['@odata.id']);
          gpuProcessorData.push(portValuesResponse.data);
        }
        if (
          deviceName.includes('FPGA') &&
          !deviceName.includes('ERoT') &&
          !deviceName.includes('IRoT')
        ) {
          const fpgaProcessorid = await api.get(processor['@odata.id']);
          fpgaProcessorData.push(fpgaProcessorid.data);
        }
      });
      commit('setGpuProcessorData', gpuProcessorData);
      commit('setFpgaProcessorData', fpgaProcessorData);
    },
    // GPGPU END

    // GPU Start
    async getGpuEnvironmentInfo({ commit }, uri) {
      var environmentMetricsResponse = {};
      var ProcessorMetricsResponse = {};
      var ProcessorMemorySummary = {};
      var gpuSubResponse = {};
      if (uri?.EnvironmentMetrics) {
        environmentMetricsResponse = await api.get(
          uri?.EnvironmentMetrics['@odata.id'],
        );
        gpuSubResponse.environmentMetricsResponse =
          environmentMetricsResponse.data;
        // commit('setGpuEnvironmentInfo', environmentMetricsResponse.data);
      }
      if (uri?.Metrics) {
        ProcessorMetricsResponse = await api.get(uri?.Metrics['@odata.id']);
        gpuSubResponse.ProcessorMetricsResponse = ProcessorMetricsResponse.data;
      }
      if (uri?.MemorySummary?.Metrics) {
        ProcessorMemorySummary = await api.get(
          uri?.MemorySummary.Metrics['@odata.id'],
        );
        gpuSubResponse.ProcessorMemorySummary = ProcessorMemorySummary.data;
      }
      commit('setGpuEnvironmentInfo', gpuSubResponse);
    },
    async getGPUPCIeData({ commit }, uri) {
      var gpuPCIeResponse = {};
      var gpufPCIeFunctionCollection = {};
      var pcieFunctionsCollections = {};
      const response = await api.get(uri['@odata.id']);
      const portData = response.data.Members.map(async (portValues) => {
        const portValuesResponse = await api.get(portValues['@odata.id']);
        return portValuesResponse.data;
      });
      gpufPCIeFunctionCollection = await Promise.all(portData);
      gpuPCIeResponse.gpufPCIeFunctionCollection = gpufPCIeFunctionCollection;
      const pcieFunctionPromises = gpufPCIeFunctionCollection.map(
        async (functionsURL) => {
          const metricsResponse =
            functionsURL?.PCIeFunctions?.['@odata.id'] &&
            (await api.get(functionsURL.PCIeFunctions['@odata.id']));
          return metricsResponse?.data ?? null;
        },
      );
      pcieFunctionsCollections = await Promise.all(pcieFunctionPromises);
      const pcieFunctionsDevicesValues = (
        await Promise.all(
          pcieFunctionsCollections.map(async (metrics) => {
            const members = metrics?.Members || []; // Fallback to empty array
            const metricsPromises = members.map(async (member) => {
              const metricsResponse = await api.get(member['@odata.id']);
              return metricsResponse?.data ?? null;
            });
            return await Promise.all(metricsPromises);
          }),
        )
      ).flat();
      gpuPCIeResponse.pcieFunctionsDevicesValues = pcieFunctionsDevicesValues;
      commit('setGpuPCIeData', gpuPCIeResponse);
    },
    async gpuMemoryInfo({ commit }, uri) {
      var gpuMemoryDeviceInfo = {};
      const response = await api.get(uri.Memory['@odata.id']);
      const gpuMemoryData = response.data.Members.map(async (memory) => {
        const memoryResponse = await api.get(memory['@odata.id']);
        return memoryResponse.data;
      });
      gpuMemoryDeviceInfo = await Promise.all(gpuMemoryData);
      commit('setMemoryDeviceCollections', gpuMemoryDeviceInfo);
    },
    async gpuMemoryEnvironmentMetricsInfo({ commit }, uri) {
      return await api
        .get(uri)
        .then((response) => {
          commit('setMemoryEnvironmentMetricsData', response.data);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('gpgpu.toast.errorGettingEnvironmentMetrics'));
        });
    },
    async gpuMemoryMetricsInfo({ commit }, uri) {
      return await api
        .get(uri)
        .then((response) => {
          commit('setMemoryMetricsData', response.data);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('gpgpu.toast.errorGettingMemoryMetrics'));
        });
    },
    async gpgpuChassisInfoSelected({ commit }, uri) {
      return await api
        .get(uri)
        .then((response) => {
          commit('setgpuChassisSelectedInfo', response.data);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('gpgpu.toast.errorGettingChassis'));
        });
    },
    async getgpuChassisSensors({ commit }, sensorsInfo) {
      const sensorData = [];
      const sensors = await api
        .get(sensorsInfo['@odata.id'])
        .then((response) => response.data.Members)
        .catch((error) => {
          commit('setGpuChassisSensorData', sensorData);
          console.log(error);
        });
      if (!sensors) return;
      const promises = sensors.map((sensor) => {
        return api.get(sensor['@odata.id']).catch((error) => {
          console.log(error);
          return error;
        });
      });
      return await api.all(promises).then((responses) => {
        responses.forEach((response) => {
          if (response.data) {
            sensorData.push({
              Id: response.data.Id || 'NA',
              Name: response.data.Name || 'NA',
              Reading: response.data.Reading || 'NA',
              ReadingRangeMax: response.data.ReadingRangeMax || 'NA',
              ReadingType: response.data.ReadingType || 'NA',
              ReadingUnits: response.data.ReadingUnits || 'NA',
              health: response.data.Status?.Health || 'NA',
              state: response.data.Status?.State || 'NA',
            });
          }
        });
        commit('setGpuChassisSensorData', sensorData);
      });
    },
    async getgpuProcessorPortData({ commit }, url) {
      var gpuPortResponse = {};
      var gpuPortCollection = {};
      const response = await api.get(url.Ports['@odata.id']);
      const portData = response.data.Members.map(async (portValues) => {
        const portValuesResponse = await api.get(portValues['@odata.id']);
        return portValuesResponse.data;
      });
      gpuPortCollection = await Promise.all(portData);
      gpuPortResponse.gpuPortCollection = gpuPortCollection;
      commit('setgpuProcessorPortData', gpuPortResponse);
    },
    // GPU End

    // FPGA Start
    async getFpgaInfo({ commit }, uri) {
      return await api
        .get(uri)
        .then((fpgaInfo) => {
          commit('setFpgaInfoData', fpgaInfo.data);
        })
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('gpgpu.toast.errorGettingFpgaInfo'));
        });
    },
    async getFpgaSensors({ commit }, sensorsInfo) {
      const sensors = await api
        .get(sensorsInfo['@odata.id'])
        .then((response) => response.data.Members)
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('gpgpu.toast.errorGettingFpgaSensorInfo'));
        });
      if (!sensors) return;
      const promises = sensors.map((sensor) => {
        return api.get(sensor['@odata.id']).catch((error) => {
          console.log(error);
          return error;
        });
      });
      return await api.all(promises).then((responses) => {
        const sensorData = [];
        responses.forEach((response) => {
          if (response.data) {
            sensorData.push({
              id: response.data.Id || 'NA',
              name: response.data.Name || 'NA',
              physicalContext: response.data?.PhysicalContext || 'NA',
              health: response.data.Status?.Health || 'NA',
              state: response.data.Status?.State || 'NA',
              currentValue: response.data.Reading || 'NA',
              thresholdsId:
                (response.data?.Oem?.Ami?.SensorThreshold ?? '') === ''
                  ? 'NA'
                  : response.data?.Oem?.Ami?.SensorThreshold['@odata.id'],
              lowerCaution:
                response.data.Thresholds?.LowerCaution?.Reading || 'NA',
              upperCaution:
                response.data.Thresholds?.UpperCaution?.Reading || 'NA',
              lowerCritical:
                response.data.Thresholds?.LowerCritical?.Reading || 'NA',
              upperCritical:
                response.data.Thresholds?.UpperCritical?.Reading || 'NA',
              units: response.data.ReadingUnits || 'NA',
            });
          }
        });
        commit('setFpgaSensorData', sensorData);
      });
    },

    async getFpgaPortData({ commit }, url) {
      var fpgaPortResponse = {};
      var fpgaPortHostCollection = {};
      var fpgaMetricsCollection = {};
      const response = await api.get(url);
      const portData = response.data.Members.map(async (portValues) => {
        const portValuesResponse = await api.get(portValues['@odata.id']);
        return portValuesResponse.data;
      });
      fpgaPortHostCollection = await Promise.all(portData);
      const metricsPromises = fpgaPortHostCollection.map(async (metrics) => {
        const metricsResponse = await api.get(metrics.Metrics['@odata.id']);
        return metricsResponse.data;
      });
      fpgaMetricsCollection = await Promise.all(metricsPromises);
      fpgaPortResponse.fpgaMetricsCollection = fpgaMetricsCollection;
      fpgaPortResponse.fpgaPortHostCollection = fpgaPortHostCollection;
      commit('setFpgaPortData', fpgaPortResponse);
    },
    // FPGA End
    //BaseBoard start
    async getBaseBoardInfo({ commit }, uri) {
      const baseBoardInfo = await api
        .get(uri)
        .then((response) => response.data)
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('gpgpu.toast.errorGettingBaseBoardInfo'));
        });
      commit('setBaseBoardInfo', baseBoardInfo);
    },
    async getBaseBoardAssembly({ commit }, uri) {
      return await api
        .get(uri)
        .then((response) => {
          const assemblyData = [];
          response.data.Assemblies.forEach((response) => {
            if (response) {
              assemblyData.push({
                MemberId: response.MemberId || 'NA',
                Model: response.Model || 'NA',
                Name: response.Name || 'NA',
                PartNumber: response.PartNumber || 'NA',
                PhysicalContext: response.PhysicalContext || 'NA',
                ProductionDate: response.ProductionDate || 'NA',
                SerialNumber: response.SerialNumber || 'NA',
                Vendor: response.Vendor || 'NA',
              });
            }
          });
          commit('setBaseBoardAssemblyInfo', assemblyData);
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    },
    async getBaseBoardSensor({ commit }, sensorsInfo) {
      const sensors = await api
        .get(sensorsInfo)
        .then((response) => response.data.Members)
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('gpgpu.toast.errorGettingBaseBoardSensorInfo'),
          );
        });
      if (!sensors) return;
      const promises = sensors.map((sensor) => {
        return api.get(sensor['@odata.id']).catch((error) => {
          console.log(error);
          return error;
        });
      });
      return await api.all(promises).then((responses) => {
        const sensorData = [];
        responses.forEach((response) => {
          if (response.data) {
            sensorData.push({
              Name: response?.data?.Name || 'NA',
              Reading: response.data.Reading || 'NA',
              ReadingType: response.data.ReadingType || 'NA',
              ReadingUnits: response.data.ReadingUnits || 'NA',
            });
          }
        });
        commit('setBaseBoardSensorData', sensorData);
      });
    },

    //BaseBoard End
  },
};

export default GpuStore;
