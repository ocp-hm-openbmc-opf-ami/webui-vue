<template>
  <b-tabs active-nav-item-class="font-weight-bold" card content-class="xl-12">
    <b-tab :title="$t('gpgpu.baseboard.baseBoardInterfaceAssemblyTab')">
      <h3>
        {{
          $t('gpgpu.baseboard.baseBoardInterfaceBaseBoardAssemblyContentTitle')
        }}
      </h3>
      <b-table
        responsive="md"
        hover
        :fields="baseboard_infofields"
        :items="baseboard_info"
        :empty-text="$t('global.table.emptyMessage')"
        show-empty
        class="auto_scroll"
      ></b-table>
    </b-tab>
    <b-tab :title="$t('gpgpu.baseboard.baseBoardInterfaceSensorsTab')">
      <h3>
        {{
          $t('gpgpu.baseboard.baseBoardInterfaceChassisSensorsInfoContentTitle')
        }}
      </h3>
      <b-table
        responsive="md"
        hover
        :fields="baseboard_sensorfields"
        :items="baseboard_sensor"
        :empty-text="$t('global.table.emptyMessage')"
        show-empty
        class="auto_scroll"
      ></b-table>
    </b-tab>
  </b-tabs>
</template>
<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
export default {
  mixins: [BVToastMixin, LoadingBarMixin],
  props: {
    deviceInfo: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      baseboard_infofields: [
        'MemberId',
        'Name',
        'SerialNumber',
        'PartNumber',
        'ProductionDate',
        'Vendor',
        'Model',
        'PhysicalContext',
      ],
      baseboard_sensorfields: [
        'Name',
        'ReadingType',
        'ReadingUnits',
        'Reading',
      ],
      baseboard_info: [],
      baseboard_sensor: [],
      selectbaseboardAssemblyDevice: '',
      baseboardAssemblyOptions: [],
      //baseboard Chassis
      baseboardChassisOptions: [],
      baseboardChassisinfo: [],
      baseboardChassisSensorInfo: [],
      selectBaseBoardProcessorDevice: '',
      baseboardOptions: [],
      baseBoardAssemblyInfo: [],
    };
  },
  created() {
    this.chassisInfo = this.$store.getters['gpu/getGpgpuChassisData'];
    this.chassisInfo.length > 0 &&
      this.chassisInfo.forEach((val) => {
        var deviceName = val['@odata.id'].split('/').pop();
        if (
          deviceName.includes('HGX_Chassis') &&
          !deviceName.includes('ERoT') &&
          !deviceName.includes('IRoT')
        ) {
          this.baseboardChassisOptions.push(val);
        }
      });
    this.baseBoardOptionBind();
  },
  methods: {
    baseBoardOptionBind() {
      if (this.baseboardChassisOptions.length > 0) {
        this.baseboardChassisOptions.forEach((val) => {
          let baseBoardOptionsVal = {
            value: val,
            text: val['@odata.id'].split('/').pop(),
          };
          this.baseboardOptions.push(baseBoardOptionsVal);
          this.selectBaseBoardProcessorDevice = this.baseboardOptions[0].value;
        });
        this.baseBoardInfoChange(this.selectBaseBoardProcessorDevice);
      }
    },
    baseBoardInfoChange(selectedval) {
      this.startLoader();
      this.$store
        .dispatch('gpu/getBaseBoardInfo', selectedval['@odata.id'])
        .then(() => {
          this.baseBoardInfo = this.$store.getters['gpu/getBaseBoardInfo'];
          if (this.baseBoardInfo?.Assembly) {
            this.$store
              .dispatch(
                'gpu/getBaseBoardAssembly',
                this.baseBoardInfo.Assembly['@odata.id'],
              )
              .then(() => {
                const baseBoardAssembly =
                  this.$store.getters['gpu/getBaseBoardAssemblyInfo'];
                this.baseboard_info = baseBoardAssembly;
              })
              .finally(() => {});
          }
          if (this.baseBoardInfo?.Sensors) {
            this.$store
              .dispatch(
                'gpu/getBaseBoardSensor',
                this.baseBoardInfo.Sensors['@odata.id'],
              )
              .then(() => {
                const baseBoardSesors =
                  this.$store.getters['gpu/getBaseBoardSensorData'];
                this.baseboard_sensor = baseBoardSesors;
              })
              .catch(({ message }) => this.errorToast(message))
              .finally(() => {
                this.endLoader();
              });
          } else {
            this.endLoader();
          }
        })
        .catch(({ message }) => {
          this.endLoader();
          this.errorToast(message);
        });
    },
  },
};
</script>
