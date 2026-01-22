<template>
  <div>
    <h3>{{ $t('powerShelf.powerSupplyMetrics') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="powerSupplyMetricsFields"
      :items="[powerSupplyMetrics]"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="mb-0 auto_scroll"
    ></b-table>
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  mixins: [BVToastMixin, LoadingBarMixin],
  props: {
    powerSupplyMetrics: {
      type: Object,
      default: () => ({}),
    },
    selectedDevice: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      powerSupplyMetricsFields: [
        { key: 'Id', label: this.$t('powerShelf.id') },
        { key: 'Name', label: this.$t('powerShelf.name') },
        {
          key: 'InputVoltage',
          label: this.$t('powerShelf.inputVoltage'),
        },
        {
          key: 'InputCurrentAmps',
          label: this.$t('powerShelf.inputCurrentAmps'),
        },
        {
          key: 'InputPowerWatts',
          label: this.$t('powerShelf.inputPowerWatts'),
        },
        {
          key: 'OutputCurrentAmps',
          label: this.$t('powerShelf.outputCurrentAmps'),
        },
        {
          key: 'TemperatureCelsius',
          label: this.$t('powerShelf.temperatureCelsius'),
        },
        {
          key: 'FanSpeedPercent',
          label: this.$t('powerShelf.fanSpeedPercent'),
        },
        { key: 'Health', label: this.$t('powerShelf.health') },
        { key: 'State', label: this.$t('powerShelf.state') },
      ],
    };
  },
  watch: {
    selectedDevice(newVal) {
      if (newVal) {
        this.loadMetrics(newVal);
      }
    },
  },
  mounted() {
    if (this.selectedDevice) {
      this.loadMetrics(this.selectedDevice);
    }
  },
  methods: {
    loadMetrics(deviceId) {
      const powerSupplyData =
        this.$store.getters['powerShelf/getPowerSupplyData'] || [];
      const selectedPS = powerSupplyData.find((ps) => ps.Id === deviceId);

      if (selectedPS?.Metrics) {
        this.startLoader();
        this.$store
          .dispatch(
            'powerShelf/getPowerSupplyMetrics',
            selectedPS.Metrics['@odata.id'],
          )
          .then(() => {
            const metricsData =
              this.$store.getters['powerShelf/getPowerSupplyMetricsData'] || {};
            console.log('metricsData', metricsData);
            //this.$emit('update:powerSupplyMetrics', {
            // eslint-disable-next-line vue/no-mutating-props
            this.powerSupplyMetrics = {
              Id: metricsData.Id || '',
              Name: metricsData.Name || '',
              InputVoltage: metricsData?.InputVoltage?.Reading || 'N/A',
              InputCurrentAmps: metricsData?.InputCurrentAmps?.Reading || 'N/A',
              InputPowerWatts: metricsData?.InputPowerWatts?.Reading || 'N/A',
              OutputCurrentAmps:
                metricsData?.RailCurrentAmps?.[0]?.Reading || 'N/A',
              TemperatureCelsius:
                metricsData?.TemperatureCelsius?.Reading || 'N/A',
              FanSpeedPercent: metricsData?.FanSpeedPercent?.Reading || 'N/A',
              Health: metricsData?.Status?.Health,
              State: metricsData?.Status?.State,
            };
          })
          .catch(({ message }) => this.errorToast(message))
          .finally(() => {
            this.endLoader();
          });
      }
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
</style>
