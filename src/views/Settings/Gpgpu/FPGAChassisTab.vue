<template>
  <div>
    <b-row>
      <b-col sm="3">
        <b-form-group
          :label="$t('gpgpu.fpga.fpgaDevices')"
          label-for="fpgaProcessor"
        >
          <b-form-select
            id="fpgaChassis"
            v-model="selectfpgaChassisDevice"
            :options="fpgaChassisOptions"
            data-test-id="fpgaChassis-option"
            @change="gpgpuChassisInfoChange"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <h3>{{ $t('gpgpu.fpga.fpgaInterfaceChassisContentTitle') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="fpgaChassisinfofields"
      :items="fpgaChassisinfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
    ></b-table>
    <h3>{{ $t('gpgpu.fpga.fpgaInterfaceSensorsInfoContentTitle') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="fpgaChassisSensorInfofields"
      :items="fpgaChassisSensorInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
    ></b-table>
  </div>
</template>
<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';

export default {
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  props: {
    deviceInfo: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fpgaChassisinfofields: [
        'Id',
        'Name',
        'Manufacturer',
        'ChassisType',
        'ProcessorType',
        'Health',
        'HealthRollup',
        'State',
        'LocationIndicatorActive',
        'Manufacturer',
        'SKU',
      ],
      fpgaChassisSensorInfofields: [
        'id',
        'name',
        'physicalContext',
        'health',
        'state',
        'currentValue',
        'lowerCaution',
        'upperCaution',
        'lowerCritical',
        'upperCritical',
        'units',
      ],
      //fpga Chassis
      fpgaChassisOptions: [],
      fpgaChassisinfo: [],
      fpgaChassisSensorInfo: [],
      selectfpgaChassisDevice: '',
      fpgaOptions: [],
      fpgaProcessoeDevicseInfo: [],
    };
  },
  created() {
    this.chassisInfo = this.$store.getters['gpu/getGpgpuChassisData'];
    this.chassisInfo.length > 0 &&
      this.chassisInfo.forEach((val) => {
        var deviceName = val['@odata.id'].split('/').pop();
        if (
          deviceName.includes('FPGA') &&
          !deviceName.includes('ERoT') &&
          !deviceName.includes('IRoT')
        ) {
          this.fpgaOptions.push(val);
          //Chassis Tab
        }
      });
    this.fpgaChassisOptionBind();
  },
  methods: {
    //DropDown Change action
    gpgpuChassisInfoChange(selectedval) {
      this.fpgaChassisInfoChange(selectedval);
    },
    //fpga Info
    fpgaChassisOptionBind() {
      if (this.fpgaOptions.length > 0) {
        this.fpgaOptions.forEach((val) => {
          let fpgaOptionsVal = {
            value: val,
            text: val['@odata.id'].split('/').pop(),
          };
          this.fpgaChassisOptions.push(fpgaOptionsVal);
          this.selectfpgaChassisDevice = this.fpgaChassisOptions[0].value;
        });
        this.fpgaChassisInfoChange(this.selectfpgaChassisDevice);
      }
    },
    //Chassis Tab Start
    fpgaChassisInfoChange(selectedval) {
      var fpgaChassisData = {};
      this.fpgaChassisSensorInfo = [];
      this.fpgaChassisinfo = [];
      this.startLoader();
      this.$store
        .dispatch('gpu/getFpgaInfo', selectedval['@odata.id'])
        .then(() => {
          const fpgaVal = this.$store.getters['gpu/getFpgaInfoData'];
          fpgaChassisData = {
            Id: this.getValidValue(fpgaVal.Id),
            Name: this.getValidValue(fpgaVal.Name),
            ChassisType: this.getValidValue(fpgaVal.ChassisType),
            ProcessorType: this.getValidValue(fpgaVal.ProcessorType),
            Health: this.getValidValue(fpgaVal.Status.Health),
            State: this.getValidValue(fpgaVal.Status.State),
            HealthRollup: this.getValidValue(fpgaVal.Status.HealthRollup),
            SKU: this.getValidValue(fpgaVal.SKU),
            LocationIndicatorActive: this.getValidValue(
              fpgaVal.LocationIndicatorActive,
            ),
            Manufacturer: this.getValidValue(fpgaVal.Manufacturer),
          };
          this.fpgaChassisinfo = [];
          this.fpgaChassisinfo.push(fpgaChassisData);
          if (fpgaVal.Sensors) {
            this.fpgaSensorInfoChange(fpgaVal.Sensors);
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

    fpgaSensorInfoChange(sensorUrl) {
      this.fpgaChassisSensorInfo = [];
      this.$store
        .dispatch('gpu/getFpgaSensors', sensorUrl)
        .then(() => {
          const fpgaSensorData = this.$store.getters['gpu/getFpgaSensorData'];
          this.fpgaChassisSensorInfo = fpgaSensorData;
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
    //Chassis Tab End
  },
};
</script>
<style lang="scss">
.auto_scroll {
  overflow: auto;
  box-shadow: 4px 6px 12px 0 rgba(0, 0, 0, 0.3);
  background-color: white;
}
.table_auto {
  margin-bottom: 20px;
}
</style>
