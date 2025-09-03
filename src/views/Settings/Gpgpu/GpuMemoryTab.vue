<template>
  <div>
    <b-row>
      <b-col sm="4">
        <b-form-group :label="$t('gpgpu.gpgpuDevices')" label-for="gpgpuMemory">
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
    <h3>{{ $t('gpgpu.gpgpuInterfaceMemoryContentTitle') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuMemoryinfofields"
      :items="gpgpuMemoryinfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="auto_scroll"
    ></b-table>
    <h3>{{ $t('gpgpu.gpgpuInterfaceMemoryMetricsContentTitle') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuMemoryMetricsInfofields"
      :items="gpgpuMemoryMetricsInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="auto_scroll"
    ></b-table>
    <h3>
      {{ $t('gpgpu.gpgpuInterfaceProcessorEnvironmentmetricsContentTitle') }}
    </h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuMemoryEnvironmentMetricsInfofields"
      :items="gpgpuMemoryEnvironmentMetricsInfo"
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
  data() {
    return {
      gpgpuMemoryinfofields: [
        'Id',
        'Name',
        'MemoryType',
        'OperatingSpeedMhz',
        'PartNumber',
        'ErrorCorrection',
        'Manufacturer',
        'RowRemappingFailed',
        'RowRemappingPending',
        'Health',
        'State',
      ],
      gpgpuMemoryEnvironmentMetricsInfofields: [
        'Id',
        'Name',
        'EnergyJoules',
        'EnergykWhReading',
        'PowerWattsReading',
        'TemperatureCelsiusReading',
      ],
      gpgpuMemoryMetricsInfofields: [
        'Id',
        'Name',
        'CorrectableECCErrorCount',
        'UncorrectableECCErrorCount',
        'OperatingSpeedMHz',
      ],

      //gpgpu Memory
      gpgpu_memoryinfo: [],
      gpgpuMemoryOptions: [],
      gpgpuMemoryinfo: [],
      gpgpuMemoryEnvironmentMetricsInfo: [],
      gpgpuMemoryMetricsInfo: [],
      selectgpgpuMemoryDevice: '',
      memoryDeviceCollections: '',
      gpgpuOptions: {},
    };
  },
  created() {
    this.gpgpuOptions = this.$store.getters['gpu/getGpuSystemsInfo'];
    this.memoryModuleInt(this.gpgpuOptions);
  },
  methods: {
    //Memory Tab Start
    memoryModuleInt(getGpuSystemsInfo) {
      this.memoryDeviceCollections = [];
      this.gpgpuMemoryOptions = [];
      this.selectgpgpuMemoryDevice = '';
      let gpgpuMemoryVal = {};
      if (getGpuSystemsInfo.Memory) {
        this.startLoader();
        this.$store
          .dispatch('gpu/gpuMemoryInfo', getGpuSystemsInfo)
          .then(() => {
            this.memoryDeviceCollections =
              this.$store.getters['gpu/getMemoryDeviceCollections'] || {};
            if (this.memoryDeviceCollections.length > 0) {
              this.memoryDeviceCollections.forEach((val) => {
                gpgpuMemoryVal = {
                  value: val.Id,
                  text: val.Id,
                };
                this.gpgpuMemoryOptions.push(gpgpuMemoryVal);
                this.selectgpgpuMemoryDevice = this.gpgpuMemoryOptions[0].value;
              });
              this.gpgpuMemoryInfoChange(this.selectgpgpuMemoryDevice);
            } else {
              this.endLoader();
            }
          })
          .finally(() => {});
      }
    },
    gpgpuMemoryInfoChange(selectedval) {
      this.gpgpuMemoryinfo = [];
      this.gpgpuMemoryEnvironmentMetricsInfo = [];
      this.gpgpuMemoryMetricsInfo = [];
      this.memoryDeviceCollections.forEach((val) => {
        if (selectedval == val.Id) {
          if (this.memoryDeviceCollections.length > 0) {
            this.startLoader();
            let gpgpu_Memory_info = {
              Id: this.getValidValue(val.Id),
              Name: this.getValidValue(val.Name),
              MemoryType: this.getValidValue(val.MemoryDeviceType),
              OperatingSpeedMhz: this.getValidValue(val.OperatingSpeedMhz),
              PartNumber: this.getValidValue(val.PartNumber),
              ErrorCorrection: this.getValidValue(val.ErrorCorrection),
              Manufacturer: this.getValidValue(val.Manufacturer),
              RowRemappingFailed: this.getValidValue(
                val.Oem?.Nvidia?.RowRemappingFailed,
              ),
              RowRemappingPending: this.getValidValue(
                val.Oem?.Nvidia?.RowRemappingPending,
              ),
              Health: this.getValidValue(val?.Status?.Health),
              State: this.getValidValue(val?.Status?.State),
            };
            this.gpgpuMemoryinfo.push(gpgpu_Memory_info);
            if (val?.EnvironmentMetrics) {
              this.gpuMemoryEnvironmentMetricsInfo(
                val.EnvironmentMetrics['@odata.id'],
              );
            }
            if (val?.Metrics) {
              this.gpuMemoryMetricsInfo(val.Metrics['@odata.id']);
            } else {
              this.endLoader();
            }
          }
        }
      });
    },
    gpuMemoryEnvironmentMetricsInfo(url) {
      var memoryEnvironmentCollections = {};
      var gpuMemoryEnvironmentValues = {};
      this.$store
        .dispatch('gpu/gpuMemoryEnvironmentMetricsInfo', url)
        .then(() => {
          memoryEnvironmentCollections =
            this.$store.getters['gpu/getMemoryEnvironmentMetricsData'] || {};
          this.gpgpuMemoryEnvironmentMetricsInfo = [];
          gpuMemoryEnvironmentValues = {
            Id: this.getValidValue(memoryEnvironmentCollections.Id),
            Name: this.getValidValue(memoryEnvironmentCollections.Name),
            EnergyJoules: this.getValidValue(
              memoryEnvironmentCollections.EnergyJoules?.Reading,
            ),
            EnergykWhReading: this.getValidValue(
              memoryEnvironmentCollections.EnergykWh?.Reading,
            ),
            PowerWattsReading: this.getValidValue(
              memoryEnvironmentCollections.PowerWatts?.Reading,
            ),
            TemperatureCelsiusReading: this.getValidValue(
              memoryEnvironmentCollections.TemperatureCelsius?.Reading,
            ),
          };
          this.gpgpuMemoryEnvironmentMetricsInfo.push(
            gpuMemoryEnvironmentValues,
          );
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
    gpuMemoryMetricsInfo(url) {
      var memoryMetricsCollections = {};
      var gpuMemoryMetricsValues = {};
      this.$store
        .dispatch('gpu/gpuMemoryMetricsInfo', url)
        .then(() => {
          memoryMetricsCollections =
            this.$store.getters['gpu/getMemoryMetricsData'] || {};
          this.gpgpuMemoryMetricsInfo = [];
          gpuMemoryMetricsValues = {
            Id: this.getValidValue(memoryMetricsCollections.Id),
            Name: this.getValidValue(memoryMetricsCollections.Name),
            CorrectableECCErrorCount: this.getValidValue(
              memoryMetricsCollections?.LifeTime?.CorrectableECCErrorCount,
            ),
            UncorrectableECCErrorCount: this.getValidValue(
              memoryMetricsCollections?.LifeTime?.UncorrectableECCErrorCount,
            ),
            OperatingSpeedMHz: this.getValidValue(
              memoryMetricsCollections?.OperatingSpeedMHz,
            ),
          };
          this.gpgpuMemoryMetricsInfo.push(gpuMemoryMetricsValues);
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
    //Memory Tab END
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
