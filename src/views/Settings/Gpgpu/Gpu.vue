<template>
  <b-tabs active-nav-item-class="font-weight-bold" card content-class="xl-12">
    <b-tab :title="$t('gpgpu.tab.gpgpuInterfaceProcessorTab')">
      <b-row>
        <b-col sm="4">
          <b-form-group
            :label="$t('gpgpu.gpgpuDevices')"
            label-for="gpgpuProcessor"
          >
            <b-form-select
              id="gpgpuProcessor"
              v-model="selectgpgpuProcessorDevice"
              :options="gpgpuProcessorOptions"
              data-test-id="gpgpuProcessor-option"
              @change="gpgpuProcessorInfoChange"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <gpgpu-list-table
        :fields="gpgpuinfofields"
        :data-items="gpgpuinfo"
        :title="$t('gpgpu.gpgpuInterfaceInfoContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="gpgpuProcessorMemorySummaryInfofields"
        :data-items="gpgpuProcessorMemorySummaryInfo"
        :title="$t('gpgpu.gpgpuInterfaceProcessorMemorySummaryContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="gpgpuProcessorEnvironmentMetricsInfofields"
        :data-items="gpgpuProcessorEnvironmentMetricsInfo"
        :title="
          $t('gpgpu.gpgpuInterfaceProcessorEnvironmentmetricsContentTitle')
        "
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="gpgpuProcessorSystemInterfaceInfofields"
        :data-items="gpgpuProcessorSystemInterfaceInfo"
        :title="$t('gpgpu.gpgpuInterfaceProcessorSystemInterfaceContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="gpgpuProcessorMetricsInfofields"
        :data-items="gpgpuProcessorMetricsInfo"
        :title="$t('gpgpu.gpgpuInterfaceProcessorMetricsContentTitle')"
      ></gpgpu-list-table
    ></b-tab>
    <b-tab :title="$t('gpgpu.tab.gpgpuInterfaceMemoryTab')">
      <b-row>
        <b-col sm="4">
          <b-form-group
            :label="$t('gpgpu.gpgpuDevices')"
            label-for="gpgpuMemory"
          >
            <b-form-select
              id="gpgpuMemory"
              v-model="selectgpgpuMemoryDevice"
              :options="gpgpuMemoryOptions"
              data-test-id="gpgpuMemory-option"
              @change="gpgpuMemoryInfoChange"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <gpgpu-list-table
        :fields="gpgpuMemoryinfofields"
        :data-items="gpgpuMemoryinfo"
        :title="$t('gpgpu.gpgpuInterfaceMemoryContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="gpgpuMemoryMetricsInfofields"
        :data-items="gpgpuMemoryMetricsInfo"
        :title="$t('gpgpu.gpgpuInterfaceMemoryMetricsContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="gpgpuMemoryEnvironmentMetricsInfofields"
        :data-items="gpgpuMemoryEnvironmentMetricsInfo"
        :title="
          $t('gpgpu.gpgpuInterfaceProcessorEnvironmentmetricsContentTitle')
        "
      ></gpgpu-list-table>
    </b-tab>
    <b-tab :title="$t('gpgpu.tab.gpgpuInterfaceChassisTab')">
      <b-row>
        <b-col sm="4">
          <b-form-group
            :label="$t('gpgpu.gpgpuDevices')"
            label-for="gpgpuchassis"
          >
            <b-form-select
              id="gpgpuchassis"
              v-model="selectgpgpuChassisDevice"
              :options="gpgpuChassisOptions"
              data-test-id="gpgpuchassis-option"
              @change="gpgpuChassisInfoChange"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <gpgpu-list-table
        :fields="gpgpuChassisinfofields"
        :data-items="gpgpuChassisinfo"
        :title="$t('gpgpu.gpgpuInterfaceMemoryContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="gpgpuChassisPCIeInfofields"
        :data-items="gpgpuChassisPCIeInfo"
        :title="$t('gpgpu.gpgpuInterfaceMemoryContentTitle')"
      ></gpgpu-list-table>
      <gpgpu-list-table
        :fields="gpgpuChassisSensorInfofields"
        :data-items="gpgpuChassisSensorInfo"
        :title="$t('gpgpu.gpgpuInterfaceMemoryContentTitle')"
      ></gpgpu-list-table>
    </b-tab>
  </b-tabs>
</template>
<script>
import GpgpuListTable from './GpgpuListTable.vue';
export default {
  components: {
    GpgpuListTable,
  },
  data() {
    return {
      gpgpuinfofields: [
        'Id',
        'Name',
        'FirmwareVersion',
        'MinSpeedMHz',
        'MaxSpeedMHz',
        'SerialNumber',
        'UUID',
        'OperatingSpeedMHz',
        'ProcessorType',
      ],
      gpgpuProcessorEnvironmentMetricsInfofields: [
        'Name',
        'Reading',
        'PowerLimitWattsAllowableMin',
        'PowerLimitWattsAllowableMax',
        'TemperatureCelsiusReading',
        'EDPpPercentAllowableMin',
        'EDPpPercentAllowableMax',
      ],
      gpgpuProcessorMemorySummaryInfofieldsfields: [
        'Id',
        'Name',
        'CorrectableECCErrorCount',
        'UnCorrectableECCErrorCount',
      ],
      gpgpuProcessorSystemInterfaceInfofields: [
        'PCIeLanesInUse',
        'PCIeMaxPCIeType',
        'PCIeType',
      ],
      gpgpuProcessorMetricsInfofields: [
        'Name',
        'OperatingSpeedMHz',
        'CorrectableErrorCount',
        'NAKReceivedCount',
        'PCIeErrorsNAKSentCount',
        'ReplayCount',
        'NonFatalErrorCount',
        'L0ToRecoveryCount',
        'FatalErrorCount',
        'ReplayRolloverCount',
        'ThrottleReasons',
        'UnCorrectableECCErrorCount',
        'CorrectableECCErrorCount',
      ],
      gpgpuMemoryinfofields: [
        'Id',
        'Name',
        'MemoryType',
        'RowRemappingFailed',
        'RowRemappingPending',
      ],
      gpgpuMemoryEnvironmentMetricsInfofields: ['Id', 'Name', 'Reading'],
      gpgpuMemoryMetricsInfofields: [
        'Id',
        'Name',
        'BandwidthPercent',
        'CorrectableECCErrorCount',
        'UnCorrectableECCErrorCount',
        'CorrectableRowRemappingCount',
        'UncorrectableRowRemappingCount',
      ],
      gpgpu_memory_metrics_infofields: [
        'Id',
        'Name',
        'BandwidthPercent',
        'CorrectableECCErrorCount',
        'UnCorrectableECCErrorCount',
        'CorrectableRowRemappingCount',
        'UncorrectableRowRemappingCount',
      ],
      gpgpu_environment_metrics_infofields: ['Id', 'Name', 'Reading'],
      gpgpuChassisinfofields: [
        'Id',
        'Name',
        'ChassisType',
        'MaxPowerWatts',
        'MinPowerWatts',
        'ResourceExists',
        'HeightMm',
        'DepthMm',
        'WidthMm',
        'AssemblyPartNumber',
        'AssemblyProductionDate',
        'AssemblySortedIDs',
      ],
      gpgpuChassisPCIeInfofields: [
        'Id',
        'Name',
        'PCIeFunctionsSubsystemId',
        'PCIeFunctionsName',
      ],
      gpgpuChassisSensorInfofields: [
        'Id',
        'Name',
        'ReadingType',
        'ReadingUnits',
        'Reading',
      ],
      gpgpu: [
        {
          Id: 'GPU_1',
          Name: 'Processor',
          FirmwareVersion: '96.00.8D.00.03',
          MinSpeedMHz: '345000',
          MaxSpeedMHz: '1980000',
          SerialNumber: '1642723000188',
          UUID: '4cb1247ecba4ccfe1a0ccfa6aa8e83cd',
          OperatingSpeedMHz: '690000',
          ProcessorType: 'GPU',
          gpgpu_memory_summary_info: {
            ECCModeEnabled: '0',
            Id: 'MemoryMetrics',
            Name: 'GPU_1_MemorySummaryMetrics',
            CorrectableECCErrorCount: '0',
            UnCorrectableECCErrorCount: '0',
          },
          gpgpu_environment_metrics_info: {
            Id: 'EnvironmentMetrics',
            Name: 'GPU_1_EnvironmentMetrics',
            Reading: '0',
            PowerLimitWattsAllowableMin: '100000',
            PowerLimitWattsAllowableMax: '900000',
            TemperatureCelsiusReading: '33.00000000',
            EDPpPercentAllowableMin: '60',
            EDPpPercentAllowableMax: '100',
          },
          gpgpu_system_interface_info: {
            PCIeLanesInUse: '1',
            PCIeMaxPCIeType: 'PCIe Gen 5.0',
            PCIeType: 'PCIe Gen 4.0',
          },
          gpgpu_processor_metrics_info: {
            Id: 'ProcessorMetrics',
            Name: 'GPU_1_ProcessorMetrics',
            OperatingSpeedMHz: '690000',
            CorrectableErrorCount: '0',
            NAKReceivedCount: '0',
            PCIeErrorsNAKSentCount: '0',
            ReplayCount: '0',
            NonFatalErrorCount: '0',
            L0ToRecoveryCount: '3',
            FatalErrorCount: '0',
            ReplayRolloverCount: '0',
            ThrottleReasons:
              'WRONGTYPE Operation against a key holding the wrong kind of value',
            UnCorrectableECCErrorCount: '0',
            CorrectableECCErrorCount: '0',
          },
        },
        {
          Id: 'GPU_2',
          Name: 'Processor',
          FirmwareVersion: '96.00.8D.00.03',
          MinSpeedMHz: '345000',
          MaxSpeedMHz: '1980000',
          SerialNumber: '1642723000188',
          UUID: '4cb1247ecba4ccfe1a0ccfa6aa8e83cd',
          OperatingSpeedMHz: '690000',
          ProcessorType: 'GPU',
          gpgpu_memory_summary_info: {
            ECCModeEnabled: '0',
            Id: 'MemoryMetrics',
            Name: 'GPU_2_MemorySummaryMetrics',
            CorrectableECCErrorCount: '0',
            UnCorrectableECCErrorCount: '0',
          },
          gpgpu_environment_metrics_info: {
            Id: 'EnvironmentMetrics',
            Name: 'GPU_2_EnvironmentMetrics',
            Reading: '0',
            PowerLimitWattsAllowableMin: '100000',
            PowerLimitWattsAllowableMax: '900000',
            TemperatureCelsiusReading: '33.00000000',
            EDPpPercentAllowableMin: '60',
            EDPpPercentAllowableMax: '100',
          },
          gpgpu_system_interface_info: {
            PCIeLanesInUse: '1',
            PCIeMaxPCIeType: 'PCIe Gen 5.0',
            PCIeType: 'PCIe Gen 4.0',
          },
          gpgpu_processor_metrics_info: {
            Id: 'ProcessorMetrics',
            Name: 'GPU_2_ProcessorMetrics',
            OperatingSpeedMHz: '690000',
            CorrectableErrorCount: '0',
            NAKReceivedCount: '0',
            PCIeErrorsNAKSentCount: '0',
            ReplayCount: '0',
            NonFatalErrorCount: '0',
            L0ToRecoveryCount: '3',
            FatalErrorCount: '0',
            ReplayRolloverCount: '0',
            ThrottleReasons:
              'WRONGTYPE Operation against a key holding the wrong kind of value',
            UnCorrectableECCErrorCount: '0',
            CorrectableECCErrorCount: '0',
          },
        },
      ],
      gpgpu_memoryinfo: [
        {
          Id: 'GPU_1_DRAM_0',
          Name: 'DIMM_Slot',
          MemoryType: 'DRAM',
          RowRemappingFailed: '0',
          RowRemappingPending: '0',
          gpgpu_memory_metrics_info: {
            Id: 'MemoryMetrics',
            Name: 'GPU_1_DRAM_0 Memory Metrics',
            BandwidthPercent: '0',
            CorrectableECCErrorCount: '0',
            UnCorrectableECCErrorCount: '0',
            CorrectableRowRemappingCount: '0',
            UncorrectableRowRemappingCount: '0',
          },
          gpgpu_environment_metrics_info: {
            Id: 'EnvironmentMetrics',
            Name: 'GPU_1_DRAM_0 Environment Metrics',
            Reading: '39.00000000',
          },
        },
        {
          Id: 'GPU_2_DRAM_0',
          Name: 'DIMM_Slot',
          MemoryType: 'DRAM',
          RowRemappingFailed: '0',
          RowRemappingPending: '0',
          gpgpu_memory_metrics_info: {
            Id: 'MemoryMetrics',
            Name: 'GPU_2_DRAM_0 Memory Metrics',
            BandwidthPercent: '0',
            CorrectableECCErrorCount: '0',
            UnCorrectableECCErrorCount: '0',
            CorrectableRowRemappingCount: '0',
            UncorrectableRowRemappingCount: '0',
          },
          gpgpu_environment_metrics_info: {
            Id: 'EnvironmentMetrics',
            Name: 'GPU_2_DRAM_0 Environment Metrics',
            Reading: '39.00000000',
          },
        },
      ],
      gpgpu_chassic_info: [
        {
          Id: 'GPU_1',
          Name: 'GPU_1',
          ChassisType: 'Module',
          MaxPowerWatts: '615000',
          MinPowerWatts: '200000',
          ResourceExists: 'true',
          HeightMm: '0000000000',
          DepthMm: '0000000000',
          WidthMm: '0000000000',
          AssemblyPartNumber: 'NA',
          AssemblyProductionDate: 'NA',
          AssemblySortedIDs: 'NA',
          gpu_pcie_device_function_info: [
            {
              Id: 'GPU_1',
              Name: 'PCIe Device',
              PCIeFunctionsSubsystemId: '0',
              PCIeFunctionsName: 'PCIe Function',
            },
          ],
          gpu_sensors_info: [
            {
              Id: 'GPU_1_DRAM_0_Temp_0',
              Name: 'GPU_1_DRAM_0_Temp_0',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: '39.00000000',
            },
            {
              Id: 'GPU_1_Voltage_0',
              Name: 'GPU_1_Voltage_0',
              ReadingType: 'Voltage',
              ReadingUnits: 'V',
              Reading: 'NA',
            },
            {
              Id: 'GPU_1_Temp_0',
              Name: 'GPU_1_Temp_0',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: '33.31250000',
            },
            {
              Id: 'GPU_1_Temp_1',
              Name: 'GPU_1_Temp_1',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: 'NA',
            },
            {
              Id: 'GPU_1_Power_0',
              Name: 'GPU_1_Power_0',
              ReadingType: 'Power',
              ReadingUnits: 'W',
              Reading: 'NA',
            },
            {
              Id: 'GPU_1_Energy_0',
              Name: 'GPU_1_Energy_0',
              ReadingType: 'EnergyJoules',
              ReadingUnits: 'J',
              Reading: 'NA',
            },
          ],
        },
        {
          Id: 'GPU_2',
          Name: 'GPU_2',
          ChassisType: 'Module',
          MaxPowerWatts: '615000',
          MinPowerWatts: '200000',
          ResourceExists: 'true',
          HeightMm: '0000000000',
          DepthMm: '0000000000',
          WidthMm: '0000000000',
          AssemblyPartNumber: 'NA',
          AssemblyProductionDate: 'NA',
          AssemblySortedIDs: 'NA',
          gpu_pcie_device_function_info: [
            {
              Id: 'GPU_2',
              Name: 'PCIe Device',
              PCIeFunctionsSubsystemId: '0',
              PCIeFunctionsName: 'PCIe Function',
            },
          ],
          gpu_sensors_info: [
            {
              Id: 'GPU_2_DRAM_0_Temp_0',
              Name: 'GPU_2_DRAM_0_Temp_0',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: '39.00000000',
            },
            {
              Id: 'GPU_2_Voltage_0',
              Name: 'GPU_2_Voltage_0',
              ReadingType: 'Voltage',
              ReadingUnits: 'V',
              Reading: 'NA',
            },
            {
              Id: 'GPU_2_Temp_0',
              Name: 'GPU_2_Temp_0',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: '33.31250000',
            },
            {
              Id: 'GPU_2_Temp_1',
              Name: 'GPU_2_Temp_1',
              ReadingType: 'Temperature',
              ReadingUnits: 'Cel',
              Reading: 'NA',
            },
            {
              Id: 'GPU_2_Power_0',
              Name: 'GPU_2_Power_0',
              ReadingType: 'Power',
              ReadingUnits: 'W',
              Reading: 'NA',
            },
            {
              Id: 'GPU_2_Energy_0',
              Name: 'GPU_2_Energy_0',
              ReadingType: 'EnergyJoules',
              ReadingUnits: 'J',
              Reading: 'NA',
            },
          ],
        },
      ],
      //gpgpu Processor
      gpgpuinfo: [],
      gpgpuProcessorEnvironmentMetricsInfo: [],
      gpgpuProcessorMemorySummaryInfo: [],
      gpgpuProcessorSystemInterfaceInfo: [],
      gpgpuProcessorMetricsInfo: [],
      gpgpuProcessorOptions: [],
      selectgpgpuProcessorDevice: '',
      //gpgpu Memory
      gpgpuMemoryOptions: [],
      gpgpuMemoryinfo: [],
      gpgpuMemoryEnvironmentMetricsInfo: [],
      gpgpuMemoryMetricsInfo: [],
      selectgpgpuMemoryDevice: '',
      //gpgpu Chassis
      gpgpuChassisOptions: [],
      gpgpuChassisinfo: [],
      gpgpuChassisPCIeInfo: [],
      gpgpuChassisSensorInfo: [],
      selectgpgpuChassisDevice: '',
    };
  },
  created() {
    this.iteam();
  },
  methods: {
    iteam() {
      this.gpgpuProcessorOptionBind();
      this.gpgpuMemoryOptionBind();
      this.gpgpuChassisOptionBind();
    },
    //GPGPU Processor
    gpgpuProcessorOptionBind() {
      this.gpgpu.forEach((val) => {
        if (this.gpgpu.length > 0) {
          let gpgpuOptionsVal = {
            value: val.Id,
            text: val.Id,
          };
          this.gpgpuProcessorOptions.push(gpgpuOptionsVal);
          this.selectgpgpuProcessorDevice = this.gpgpuProcessorOptions[0].value;
          this.gpgpuProcessorInfoChange(this.selectgpgpuProcessorDevice);
        }
      });
    },
    gpgpuProcessorInfoChange(selectedval) {
      this.gpgpuinfo = [];
      this.gpgpuProcessorEnvironmentMetricsInfo = [];
      this.gpgpuProcessorMemorySummaryInfo = [];
      this.gpgpuProcessorSystemInterfaceInfo = [];
      this.gpgpuProcessorMetricsInfo = [];
      this.gpgpu.forEach((val) => {
        if (selectedval == val.Id) {
          if (this.gpgpu.length > 0) {
            let gpgpu_info = {
              Id: val.Id,
              Name: val.Name,
              FirmwareVersion: val.FirmwareVersion,
              MinSpeedMHz: val.MinSpeedMHz,
              MaxSpeedMHz: val.MaxSpeedMHz,
              SerialNumber: val.SerialNumber,
              UUID: val.UUID,
              OperatingSpeedMHz: val.OperatingSpeedMHz,
              ProcessorType: val.ProcessorType,
            };
            this.gpgpuinfo.push(gpgpu_info);
            this.gpgpuProcessorEnvironmentMetricsInfo.push(
              val.gpgpu_environment_metrics_info
            );
            this.gpgpuProcessorMemorySummaryInfo.push(
              val.gpgpu_memory_summary_info
            );
            this.gpgpuProcessorSystemInterfaceInfo.push(
              val.gpgpu_system_interface_info
            );
            this.gpgpuProcessorMetricsInfo.push(
              val.gpgpu_processor_metrics_info
            );
          }
        }
      });
    },
    //GPGPU Memory
    gpgpuMemoryOptionBind() {
      this.gpgpu_memoryinfo.forEach((val) => {
        if (this.gpgpu.length > 0) {
          let gpgpuMemoryVal = {
            value: val.Id,
            text: val.Id,
          };
          this.gpgpuMemoryOptions.push(gpgpuMemoryVal);
          this.selectgpgpuMemoryDevice = this.gpgpuMemoryOptions[0].value;
          this.gpgpuMemoryInfoChange(this.selectgpgpuMemoryDevice);
        }
      });
    },
    gpgpuMemoryInfoChange(selectedval) {
      this.gpgpuMemoryinfo = [];
      this.gpgpuMemoryEnvironmentMetricsInfo = [];
      this.gpgpuMemoryMetricsInfo = [];
      this.gpgpu_memoryinfo.forEach((val) => {
        if (selectedval == val.Id) {
          if (this.gpgpu_memoryinfo.length > 0) {
            let gpgpu_Memory_info = {
              Id: val.Id,
              Name: val.Name,
              MemoryType: val.MemoryType,
              RowRemappingFailed: val.RowRemappingFailed,
              RowRemappingPending: val.RowRemappingPending,
            };
            this.gpgpuMemoryinfo.push(gpgpu_Memory_info);
            this.gpgpuMemoryMetricsInfo.push(val.gpgpu_memory_metrics_info);
            this.gpgpuMemoryEnvironmentMetricsInfo.push(
              val.gpgpu_environment_metrics_info
            );
          }
        }
      });
    },
    //GPGPU Chassis
    gpgpuChassisOptionBind() {
      this.gpgpu_chassic_info.forEach((val) => {
        if (this.gpgpu_chassic_info.length > 0) {
          let gpgpuChassisVal = {
            value: val.Id,
            text: val.Id,
          };
          this.gpgpuChassisOptions.push(gpgpuChassisVal);
          this.selectgpgpuChassisDevice = this.gpgpuChassisOptions[0].value;
          this.gpgpuChassisInfoChange(this.selectgpgpuChassisDevice);
        }
      });
    },
    gpgpuChassisInfoChange(selectedval) {
      this.gpgpuChassisinfo = [];
      this.gpgpuChassisPCIeInfo = [];
      this.gpgpuChassisSensorInfo = [];
      this.gpgpu_chassic_info.forEach((val) => {
        if (selectedval == val.Id) {
          if (this.gpgpu_chassic_info.length > 0) {
            let gpgpu_Chassis_info = {
              Id: val.Id,
              Name: val.Name,
              MemoryType: val.ChassisType,
              RowRemappingFailed: val.MaxPowerWatts,
              RowRemappingPending: val.MinPowerWatts,
              ResourceExists: val.ResourceExists,
              HeightMm: val.HeightMm,
              DepthMm: val.DepthMm,
              WidthMm: val.WidthMm,
              AssemblyPartNumber: val.AssemblyPartNumber,
              AssemblyProductionDate: val.AssemblyProductionDate,
              AssemblySortedIDs: val.AssemblySortedIDs,
            };
            this.gpgpuChassisinfo.push(gpgpu_Chassis_info);
            this.gpgpuChassisPCIeInfo = val.gpu_pcie_device_function_info;
            this.gpgpuChassisSensorInfo = val.gpu_sensors_info;
          }
        }
      });
    },
  },
};
</script>
