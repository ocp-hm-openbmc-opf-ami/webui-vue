<template>
  <div>
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
    <h3>
      {{ $t('gpgpu.gpgpuInterfaceMemoryChassisContentTitle') }}
    </h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuChassisinfofields"
      :items="gpgpuChassisinfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="auto_scroll"
    ></b-table>
    <h3>
      {{ $t('gpgpu.gpgpuInterfaceMemoryPcieDevicesContentTitle') }}
    </h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuProcessorSystemInterfaceInfofields"
      :items="gpgpuProcessorSystemInterfaceInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="auto_scroll"
    ></b-table>
    <h3>
      {{ $t('gpgpu.gpgpuInterfaceProcessorPcieFunctionContentTitle') }}
    </h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuChassisPCIeInfofields"
      :items="gpgpuChassisPCIeInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="auto_scroll"
    ></b-table>
    <h3>
      {{ $t('gpgpu.gpgpuInterfaceMemorySensorsInfoContentTitle') }}
    </h3>
    <b-table
      responsive="md"
      hover
      :fields="gpgpuChassisSensorInfofields"
      :items="gpgpuChassisSensorInfo"
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
      gpgpuChassisinfofields: [
        'Id',
        'Name',
        'ChassisType',
        'HeightMm',
        'DepthMm',
        'WidthMm',
        'PowerState',
        'LocationIndicatorActive',
        'Manufacturer',
        'SKU',
        'SerialNumber',
        'Health',
        'HealthRollup',
        'State',
        'UUID',
        'Model',
        'PartNumber',
      ],
      gpgpuChassisPCIeInfofields: [
        'Id',
        'Name',
        'DeviceId',
        'FunctionId',
        'SubsystemId',
        'SubsystemVendorId',
        'VendorId',
      ],
      gpgpuChassisSensorInfofields: [
        'Id',
        'Name',
        'Reading',
        'ReadingRangeMax',
        'ReadingType',
        'ReadingUnits',
        'health',
        'state',
      ],
      gpgpuProcessorSystemInterfaceInfofields: [
        'Id',
        'Name',
        'LanesInUse',
        'MaxLanes',
        'MaxPCIeType',
        'PCIeType',
        'PartNumber',
        'SerialNumber',
        'UUID',
        'Model',
        'Manufacturer',
      ],
      //gpgpu Chassis
      gpgpu_chassic_info: [],
      gpgpuChassisOptions: [],
      gpgpuChassisinfo: [],
      gpgpuChassisPCIeInfo: [],
      gpgpuChassisSensorInfo: [],
      gpgpuProcessorSystemInterfaceInfo: [],
      selectgpgpuChassisDevice: '',
      gpgpuOptions: [],
      chassisInfo: [],
    };
  },
  created() {
    this.chassisInfo = this.$store.getters['gpu/getGpgpuChassisData'];
    this.chassisInfo.forEach((val) => {
      var deviceName = val['@odata.id'].split('/').pop();
      if (
        deviceName.includes('GPU') &&
        !deviceName.includes('ERoT') &&
        !deviceName.includes('IRoT')
      ) {
        this.gpgpuOptions.push(val);
        //Chassis Tab
        this.gpgpuChassisOptionBind();
      }
    });
  },
  methods: {
    //GPGPU Chassis
    gpgpuChassisOptionBind() {
      this.gpgpuChassisOptions = [];
      this.selectgpgpuChassisDevice = [];
      let gpgpuOptionsVal = {};
      if (this.gpgpuOptions.length > 0) {
        this.gpgpuOptions.forEach((val) => {
          gpgpuOptionsVal = {
            value: val,
            text: val['@odata.id'].split('/').pop(),
          };
          this.gpgpuChassisOptions.push(gpgpuOptionsVal);
          this.selectgpgpuChassisDevice = this.gpgpuChassisOptions[0].value;
        });
        this.gpgpuChassisInfoChange(this.selectgpgpuChassisDevice);
      }
    },
    gpgpuChassisInfoChange(selectedval) {
      this.gpgpuProcessorSystemInterfaceInfo = [];
      this.gpgpuChassisPCIeInfo = [];
      var gpuChassisInfo = {};
      this.startLoader();
      this.$store
        .dispatch('gpu/gpgpuChassisInfoSelected', selectedval['@odata.id'])
        .then(() => {
          gpuChassisInfo =
            this.$store.getters['gpu/getgpuChassisSelectedInfo'] || {};
          let gpgpu_Chassis_info = {
            Id: this.getValidValue(gpuChassisInfo?.Id),
            Name: this.getValidValue(gpuChassisInfo?.Name),
            ChassisType: this.getValidValue(gpuChassisInfo?.ChassisType),
            HeightMm: this.getValidValue(gpuChassisInfo?.HeightMm),
            DepthMm: this.getValidValue(gpuChassisInfo?.DepthMm),
            WidthMm: this.getValidValue(gpuChassisInfo?.WidthMm),
            PowerState: this.getValidValue(gpuChassisInfo?.PowerState),
            LocationIndicatorActive: this.getValidValue(
              gpuChassisInfo?.LocationIndicatorActive,
            ),
            Manufacturer: this.getValidValue(gpuChassisInfo?.Manufacturer),
            SKU: this.getValidValue(gpuChassisInfo?.SKU),
            SerialNumber: this.getValidValue(gpuChassisInfo?.SerialNumber),
            Health: this.getValidValue(gpuChassisInfo?.Status.Health),
            HealthRollup: this.getValidValue(
              gpuChassisInfo?.Status.HealthRollup,
            ),
            State: this.getValidValue(gpuChassisInfo?.Status.State),
            UUID: this.getValidValue(gpuChassisInfo?.UUID),
            Model: this.getValidValue(gpuChassisInfo?.Model),
            PartNumber: this.getValidValue(gpuChassisInfo?.PartNumber),
          };
          this.gpgpuChassisinfo = [];
          this.gpgpuChassisinfo.push(gpgpu_Chassis_info);
          if (gpuChassisInfo?.PCIeDevices) {
            this.gpgpuPCIeDevicesInit(gpuChassisInfo?.PCIeDevices);
          }
          if (gpuChassisInfo?.Sensors) {
            this.gpuChassisSensorsInfo(gpuChassisInfo?.Sensors);
          } else {
            this.endLoader();
          }
        })
        .catch(({ message }) => {
          this.endLoader();
          this.errorToast(message);
        })
        .finally(() => {});
    },
    gpgpuPCIeDevicesInit(uri) {
      var getGpuPCIeInfo = {};
      this.$store
        .dispatch('gpu/getGPUPCIeData', uri)
        .then(() => {
          getGpuPCIeInfo = this.$store.getters['gpu/getGpuPCIeData'] || {};

          //Gpu Tab System Interface Tabel
          getGpuPCIeInfo.gpufPCIeFunctionCollection.forEach((val) => {
            const gpufPCIeFunctionValues = {
              Id: this.getValidValue(val.Id),
              Name: this.getValidValue(val.Name),
              LanesInUse: this.getValidValue(val.PCIeInterface?.LanesInUse),
              MaxLanes: this.getValidValue(val.PCIeInterface?.MaxLanes),
              MaxPCIeType: this.getValidValue(val.PCIeInterface?.MaxPCIeType),
              PCIeType: this.getValidValue(val.PCIeInterface?.PCIeType),
              PartNumber: this.getValidValue(val.PartNumber),
              SerialNumber: this.getValidValue(val.SerialNumber),
              UUID: this.getValidValue(val.UUID),
              Model: this.getValidValue(val.Model),
              Manufacturer: this.getValidValue(val.Manufacturer),
            };
            this.gpgpuProcessorSystemInterfaceInfo = [];
            this.gpgpuChassisPCIeInfo = [];
            this.gpgpuProcessorSystemInterfaceInfo.push(gpufPCIeFunctionValues);
          });
          //Chasis Tab PCIe Device Tabel
          getGpuPCIeInfo.pcieFunctionsDevicesValues.forEach((val) => {
            const gpufPCIeDeviceValues = {
              Id: this.getValidValue(val.Id),
              Name: this.getValidValue(val.Name),
              DeviceId: this.getValidValue(val.DeviceId),
              FunctionId: this.getValidValue(val.FunctionId),
              SubsystemId: this.getValidValue(val.SubsystemId),
              SubsystemVendorId: this.getValidValue(val.SubsystemVendorId),
              VendorId: this.getValidValue(val.VendorId),
            };
            this.gpgpuChassisPCIeInfo.push(gpufPCIeDeviceValues);
          });
        })
        .finally(() => {});
    },
    gpuChassisSensorsInfo(uri) {
      this.gpgpuChassisSensorInfo = [];
      var gpuSensorData = {};
      this.$store
        .dispatch('gpu/getgpuChassisSensors', uri)
        .then(() => {
          gpuSensorData = this.$store.getters['gpu/getGpuChassisSensorData'];
          this.gpgpuChassisSensorInfo = gpuSensorData;
        })
        .finally(() => {
          this.endLoader();
        });
    },
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
