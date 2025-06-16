<template>
  <div>
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
    <h3>{{ $t('gpgpu.gpgpuInterfaceInfoContentTitle') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuinfofields"
      :items="gpgpuinfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
    ></b-table>
    <h3>
      {{ $t('gpgpu.gpgpuInterfaceProcessorMemorySummaryContentTitle') }}
    </h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuProcessorMemorySummaryInfofields"
      :items="gpgpuProcessorMemorySummaryInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
    ></b-table>
    <h3>
      {{ $t('gpgpu.gpgpuInterfaceProcessorEnvironmentmetricsContentTitle') }}
    </h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuProcessorEnvironmentMetricsInfofields"
      :items="gpgpuProcessorEnvironmentMetricsInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
    ></b-table>
    <h3>
      {{ $t('gpgpu.gpgpuInterfaceProcessorMetricsContentTitle') }}
    </h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuProcessorMetricsInfofields"
      :items="gpgpuProcessorMetricsInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="auto_scroll"
    ></b-table>
    <h3>{{ $t('gpgpu.fpga.fpgaInterfaceProcessorPortContentTitle') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="gpuPortInfofields"
      :items="gpuPortInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="mb-0 auto_scroll"
    ></b-table>
  </div>
</template>
<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';

export default {
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  props: {
    processorInfo: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      gpgpuinfofields: [
        'Id',
        'Name',
        'Version',
        'Updateable',
        'HealthRollup',
        'State',
      ],
      gpgpuProcessorMemorySummaryInfofields: [
        'Id',
        'Name',
        'CorrectableECCErrorCount',
        'UncorrectableECCErrorCount',
        'OperatingSpeedMHz',
      ],
      gpgpuProcessorEnvironmentMetricsInfofields: [
        'Name',
        'EnergyJoules',
        'EnergykWhReading',
        'PowerLimitWattsControlMode',
        'PowerLimitWattsReading',
        'PowerLimitWattsSetPoint',
        'PowerWattsReading',
        'TemperatureCelsiusReading',
      ],
      gpgpuProcessorMetricsInfofields: [
        'Name',
        'BandwidthPercent',
        'CorrectableECCErrorCount',
        'UncorrectableECCErrorCount',
        'CoreVoltage',
        'PCIeRXBytes',
        'PCIeTXBytes',
        'SMUtilizationPercent',
        'OperatingSpeedMHz',
        'CorrectableErrorCount',
        'FatalErrorCount',
        'L0ToRecoveryCount',
        'NAKReceivedCount',
        'NAKSentCount',
        'NonFatalErrorCount',
        'ReplayCount',
        'ReplayRolloverCount',
      ],
      gpuPortInfofields: [
        'Id',
        'Name',
        'LinkStatus',
        'PortProtocol',
        'PortType',
        'Health',
        'HealthRollup',
        'State',
      ],
      //gpgpu Processor
      gpgpu: [],
      gpgpuinfo: [],
      gpgpuProcessorEnvironmentMetricsInfo: [],
      gpgpuProcessorMemorySummaryInfo: [],
      gpgpuProcessorSystemInterfaceInfo: [],
      gpgpuProcessorMetricsInfo: [],
      gpgpuProcessorOptions: [],
      selectgpgpuProcessorDevice: '',
      gpuPortInfo: [],
      gpuProcessorData: [],
      gpuProcessoeDevicseInfo: [],
    };
  },
  watch: {
    processorInfo(val) {
      if (this.gpuProcessorData.length <= 0) {
        this.gpuProcessorData = val;
      }
    },
    gpuProcessorData(val) {
      this.gpgpuProcessorOptionBind(val);
    },
  },
  created() {
    this.gpuProcessorData = this.$store.getters['gpu/getGpuProcessorData'];
  },
  methods: {
    gpgpuProcessorInfoChange(selectedval) {
      this.gpgpuinfo = [];
      this.gpgpuProcessorEnvironmentMetricsInfo = [];
      this.gpgpuProcessorMemorySummaryInfo = [];
      this.gpgpuProcessorSystemInterfaceInfo = [];
      this.gpgpuProcessorMetricsInfo = [];
      this.startLoader();
      this.gpuInventoryInt(selectedval);
      this.gpuProcessorInfo(selectedval);
      this.gpgpuPortInit(selectedval);
    },
    //GPGPU Memory
    //Processor Tab Start
    gpgpuProcessorOptionBind(val) {
      this.gpgpuProcessorOptions = [];
      let gpgpuOptionsVal = {};
      this.selectgpgpuProcessorDevice = '';
      this.gpuProcessoeDevicseInfo = val || [];
      if (this.gpuProcessoeDevicseInfo.length > 0) {
        this.gpuProcessoeDevicseInfo.forEach((val) => {
          if (this.gpuProcessoeDevicseInfo.length > 0) {
            gpgpuOptionsVal = {
              value: val.Id,
              text: val.Id,
            };
            this.gpgpuProcessorOptions.push(gpgpuOptionsVal);
            this.selectgpgpuProcessorDevice =
              this.gpgpuProcessorOptions[0].value;
          }
        });
        this.gpgpuProcessorInfoChange(this.selectgpgpuProcessorDevice);
      }
      // });
    },
    gpuInventoryInt(selectedval) {
      this.gpgpuinfo = [];
      var gpuInfovalue = {};
      const gpuFirmwareinfo =
        this.$store.getters['firmware/getGpuFirmwareinfo'];
      const FwVersion = 'FW_' + selectedval;
      gpuFirmwareinfo.forEach((val) => {
        if (FwVersion == val.Id) {
          gpuInfovalue = {
            Id: this.getValidValue(val.Id),
            Name: this.getValidValue(val.Name),
            Version: this.getValidValue(val.Version),
            Updateable: this.getValidValue(val.Updateable),
            HealthRollup: this.getValidValue(val.Status.HealthRollup),
            State: this.getValidValue(val.Status.HealthRollup),
          };
          this.gpgpuinfo.push(gpuInfovalue);
        }
      });
    },
    gpuProcessorInfo(selectedval) {
      var gpuEnvironmentValues = {};
      var getGpuEnvironmentInfo = {};
      this.gpgpuProcessorMemorySummaryInfo = [];
      this.gpuPortInfo = [];
      this.gpuProcessoeDevicseInfo.forEach((val) => {
        if (selectedval == val.Id) {
          this.$store
            .dispatch('gpu/getGpuEnvironmentInfo', val)
            .then(() => {
              getGpuEnvironmentInfo =
                this.$store.getters['gpu/getGpuEnvironmentInfo'] || {};
              if (getGpuEnvironmentInfo?.environmentMetricsResponse) {
                gpuEnvironmentValues = {
                  Name: this.getValidValue(
                    getGpuEnvironmentInfo?.environmentMetricsResponse?.Name,
                  ),
                  EnergyJoules: this.getValidValue(
                    getGpuEnvironmentInfo.environmentMetricsResponse
                      ?.EnergyJoules?.Reading,
                  ),
                  EnergykWhReading: this.getValidValue(
                    getGpuEnvironmentInfo.environmentMetricsResponse
                      ?.EnergyJoules?.Reading,
                  ),
                  PowerLimitWattsControlMode: this.getValidValue(
                    getGpuEnvironmentInfo.environmentMetricsResponse
                      ?.PowerLimitWatts?.ControlMode,
                  ),
                  PowerLimitWattsReading: this.getValidValue(
                    getGpuEnvironmentInfo.environmentMetricsResponse
                      ?.PowerLimitWatts?.Reading,
                  ),
                  PowerLimitWattsSetPoint: this.getValidValue(
                    getGpuEnvironmentInfo.environmentMetricsResponse
                      ?.PowerLimitWatts?.SetPoint,
                  ),
                  PowerWattsReading: this.getValidValue(
                    getGpuEnvironmentInfo.environmentMetricsResponse?.PowerWatts
                      ?.Reading,
                  ),
                  TemperatureCelsiusReading: this.getValidValue(
                    getGpuEnvironmentInfo.environmentMetricsResponse
                      ?.TemperatureCelsius?.Reading,
                  ),
                };

                this.gpgpuProcessorEnvironmentMetricsInfo = [];
                this.gpgpuProcessorEnvironmentMetricsInfo.push(
                  gpuEnvironmentValues,
                );
              }
              //calling the Processor Metrics function
              if (getGpuEnvironmentInfo.ProcessorMetricsResponse) {
                this.gpgpuProcessorMetricsInfoInit(getGpuEnvironmentInfo);
              }
              //calling the Processor Memory Summary function
              if (getGpuEnvironmentInfo.ProcessorMemorySummary) {
                this.gpgpuProcessorMemorySummaryInit(getGpuEnvironmentInfo);
              }
              //calling the Port function
              // if (val.Ports) {
              //   this.gpgpuPortInit(val);
              // }
            })
            .finally(() => {});
        }
      });
    },
    gpgpuProcessorMetricsInfoInit(getGpuEnvironmentInfo) {
      var GpuProcessorMetrics = {};
      GpuProcessorMetrics = {
        Name: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.Name,
        ),
        BandwidthPercent: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.BandwidthPercent,
        ),
        CorrectableECCErrorCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.CacheMetricsTotal
            ?.LifeTime?.CorrectableECCErrorCount,
        ),
        UncorrectableECCErrorCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.CacheMetricsTotal
            ?.LifeTime?.UncorrectableECCErrorCount,
        ),
        CoreVoltage: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.CoreVoltage?.Reading,
        ),
        PCIeRXBytes: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.Oem?.Nvidia
            ?.PCIeRXBytes,
        ),
        PCIeTXBytes: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.Oem?.Nvidia
            ?.PCIeTXBytes,
        ),
        SMUtilizationPercent: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.Oem?.Nvidia
            ?.SMUtilizationPercent,
        ),
        OperatingSpeedMHz: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.OperatingSpeedMHz,
        ),
        CorrectableErrorCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.PCIeErrors
            ?.CorrectableErrorCount,
        ),
        FatalErrorCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.PCIeErrors
            ?.FatalErrorCount,
        ),
        L0ToRecoveryCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.PCIeErrors
            ?.L0ToRecoveryCount,
        ),
        NAKReceivedCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.PCIeErrors
            ?.NAKReceivedCount,
        ),
        NAKSentCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.PCIeErrors
            ?.NAKSentCount,
        ),
        NonFatalErrorCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.PCIeErrors
            ?.NonFatalErrorCount,
        ),
        ReplayCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.PCIeErrors
            ?.ReplayCount,
        ),
        ReplayRolloverCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMetricsResponse?.PCIeErrors
            ?.ReplayRolloverCount,
        ),
      };
      this.gpgpuProcessorMetricsInfo = [];
      this.gpgpuProcessorMetricsInfo.push(GpuProcessorMetrics);
    },
    gpgpuProcessorMemorySummaryInit(getGpuEnvironmentInfo) {
      this.gpgpuProcessorMemorySummaryInfo = [];
      var GpuProcessorMemorySummary = {};
      GpuProcessorMemorySummary = {
        Id: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMemorySummary?.Id,
        ),
        Name: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMemorySummary?.Name,
        ),
        OperatingSpeedMHz: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMemorySummary?.OperatingSpeedMHz,
        ),
        CorrectableECCErrorCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMemorySummary?.LifeTime
            ?.CorrectableECCErrorCount,
        ),
        UncorrectableECCErrorCount: this.getValidValue(
          getGpuEnvironmentInfo.ProcessorMemorySummary?.LifeTime
            ?.UncorrectableECCErrorCount,
        ),
      };
      this.gpgpuProcessorMemorySummaryInfo = [];
      this.gpgpuProcessorMemorySummaryInfo.push(GpuProcessorMemorySummary);
    },
    gpgpuPortInit(selectedval) {
      var gpuProcessorPortData = {};
      this.gpuPortInfo = [];
      this.gpuProcessoeDevicseInfo.forEach((val) => {
        if (selectedval == val.Id) {
          if (val.Ports) {
            this.$store
              .dispatch('gpu/getgpuProcessorPortData', val)
              .then(() => {
                gpuProcessorPortData =
                  this.$store.getters['gpu/setgpuProcessorPortData'] || {};
                var gpuPortData = {};
                this.gpuPortInfo = [];
                gpuProcessorPortData.gpuPortCollection.forEach((val) => {
                  gpuPortData = {
                    Id: val.Id,
                    Name: val.Name,
                    LinkStatus: this.getValidValue(val.LinkStatus),
                    PortProtocol: this.getValidValue(val.PortProtocol),
                    PortType: this.getValidValue(val.PortType),
                    Health: this.getValidValue(val.Status.Health),
                    HealthRollup: this.getValidValue(val.Status.HealthRollup),
                    State: this.getValidValue(val.Status.State),
                  };
                  this.gpuPortInfo.push(gpuPortData);
                });
              })
              .finally(() => {
                this.endLoader();
              });
          } else {
            this.endLoader();
          }
        }
      });
    },
    //Processor Tab END
  },
};
</script>
<style lang="scss" scoped>
.auto_scroll {
  overflow: auto;
  box-shadow: 4px 6px 12px 0 rgba(0, 0, 0, 0.3);
  background-color: white;
}
.table_auto {
  margin-bottom: 20px;
}
</style>
