<template>
  <div>
    <b-row>
      <b-col sm="3">
        <b-form-group
          :label="$t('gpgpu.fpga.fpgaDevices')"
          label-for="fpgaProcessor"
        >
          <b-form-select
            id="fpgaProcessor"
            v-model="selectfpgaProcessorDevice"
            :options="fpgaProcessorOptions"
            data-test-id="fpgaProcessor-option"
            @change="fpgaProcessorDeviceInfoChange"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <h3>{{ $t('gpgpu.fpga.fpgaInterfaceFpgaContentTitle') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="fpgainfofields"
      :items="fpga_info"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
    ></b-table>
    <h3>{{ $t('gpgpu.fpga.fpgaInterfaceProcessorPortContentTitle') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="fpgaPortInfofields"
      :items="fpgaPortInfo"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="mb-0 auto_scroll"
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
    processorInfo: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fpgainfofields: [
        'Id',
        'Name',
        'Version',
        'Updateable',
        'HealthRollup',
        'State',
      ],
      fpgaPortInfofields: [
        'Id',
        'Name',
        'CurrentSpeedGbps',
        'ActiveWidth',
        'MetricsId',
        'MetricsName',
        'PCIeErrorsNAKSentCount',
        'PCIeErrorsL0ToRecoveryCount',
        'PCIeErrorsReplayCount',
        'PCIeErrorsNonFatalErrorCount',
        'PCIeErrorsReplayRolloverCount',
        'PCIeErrorsNAKReceivedCount',
        'PCIeErrorsCorrectableErrorCount',
        'PCIeErrorsFatalErrorCount',
      ],
      fpga_info: [],
      //fpga Info
      fpgainfo: [],
      fpgaPortInfo: [],
      selectfpgaProcessorDevice: '',
      fpgaProcessorOptions: [],
      fpgaOptions: [],
      fpgaProcessoeDevicseInfo: [],
      activeTab: 'fpgaProcessorTab',
      fpgaProcessorInfo: [],
    };
  },
  watch: {
    processorInfo(val) {
      if (this.fpgaProcessorInfo.length <= 0) {
        this.fpgaProcessorInfo = val;
      }
    },
    fpgaProcessorInfo(val) {
      this.fpgaProcessorOptionBind(val);
    },
  },
  created() {
    this.fpgaProcessorInfo = this.$store.getters['gpu/getFpgaProcessorData'];
  },
  methods: {
    //DropDown Change action
    fpgaProcessorDeviceInfoChange(selectedval) {
      this.startLoader();
      this.fpgaPortInit(selectedval);
      this.fpgaInventoryInt(selectedval);
    },
    fpgaProcessorOptionBind(val) {
      this.fpgaProcessorOptions = [];
      this.fpgaPortInfo = [];
      let fpgaOptionsVal = {};
      this.selectfpgaProcessorDevice = '';
      this.fpgaProcessoeDevicseInfo = [];
      this.fpgaProcessoeDevicseInfo = val;
      if (this.fpgaProcessoeDevicseInfo.length > 0) {
        this.fpgaProcessoeDevicseInfo.forEach((val) => {
          if (this.fpgaProcessoeDevicseInfo.length > 0) {
            fpgaOptionsVal = {
              value: val.Id,
              text: val.Id,
            };
            this.fpgaProcessorOptions.push(fpgaOptionsVal);
            this.selectfpgaProcessorDevice = this.fpgaProcessorOptions[0].value;
          }
        });
        this.fpgaProcessorDeviceInfoChange(this.selectfpgaProcessorDevice);
      }
    },

    //Processor START
    fpgaInventoryInt(selectedval) {
      this.fpga_info = [];
      var fpgaInfovalue = {};
      const fpgaFirmwareinfo =
        this.$store.getters['firmware/getFpgaFirmwareinfo'];
      const FwVersion = 'FW_' + selectedval;
      fpgaFirmwareinfo &&
        fpgaFirmwareinfo.forEach((val) => {
          if (FwVersion == val.Id) {
            fpgaInfovalue = {
              Id: this.getValidValue(val.Id),
              Name: this.getValidValue(val.Name),
              Version: this.getValidValue(val.Version),
              Updateable: this.getValidValue(val.Updateable),
              HealthRollup: this.getValidValue(val.Status.HealthRollup),
              State: this.getValidValue(val.Status.HealthRollup),
            };
            this.fpga_info.push(fpgaInfovalue);
          }
        });
    },
    fpgaPortInit(selectedval) {
      this.fpgaPortInfo = [];
      var metricsCollection = {};
      var getfpgaPortData = {};
      this.fpgaProcessoeDevicseInfo.forEach((val) => {
        if (selectedval == val.Id) {
          if (val.Ports) {
            this.$store
              .dispatch('gpu/getFpgaPortData', val.Ports['@odata.id'])
              .then(() => {
                metricsCollection = {};
                getfpgaPortData = this.$store.getters['gpu/getfpgaPortData'];
                getfpgaPortData.fpgaMetricsCollection.forEach((val) => {
                  metricsCollection = {
                    MetricsId: this.getValidValue(val.Id),
                    MetricsName: this.getValidValue(val.Name),
                    PCIeErrorsCorrectableErrorCount: this.getValidValue(
                      val.PCIeErrors.CorrectableErrorCount,
                    ),
                    PCIeErrorsFatalErrorCount: this.getValidValue(
                      val.PCIeErrors.FatalErrorCount,
                    ),
                    PCIeErrorsL0ToRecoveryCount: this.getValidValue(
                      val.PCIeErrors.L0ToRecoveryCount,
                    ),
                    PCIeErrorsNAKReceivedCount: this.getValidValue(
                      val.PCIeErrors.NAKReceivedCount,
                    ),
                    PCIeErrorsNAKSentCount: this.getValidValue(
                      val.PCIeErrors.NAKSentCount,
                    ),
                    PCIeErrorsNonFatalErrorCount: this.getValidValue(
                      val.PCIeErrors.NonFatalErrorCount,
                    ),
                    PCIeErrorsReplayCount: this.getValidValue(
                      val.PCIeErrors.ReplayCount,
                    ),
                    PCIeErrorsReplayRolloverCount: this.getValidValue(
                      val.PCIeErrors.ReplayRolloverCount,
                    ),
                  };
                });
                getfpgaPortData.fpgaPortHostCollection.forEach((val) => {
                  metricsCollection.Id = val.Id;
                  (metricsCollection.Name = val.Name),
                    (metricsCollection.ActiveWidth = val.ActiveWidth),
                    (metricsCollection.CurrentSpeedGbps = val.CurrentSpeedGbps);
                });
                this.fpgaPortInfo.push(metricsCollection);
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

    //Processor END
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
