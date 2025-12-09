<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="MetricsFields"
      :items="memoryMetricsInfo"
      :empty-text="$t('global.table.emptyMessage')"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      MetricsFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.memoryMetrics.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.memoryMetrics.name'),
        },
        {
          key: 'bandwidthPercent',
          label: this.$t('pageSystemInventory.memoryMetrics.bandwidthPercent'),
        },
        {
          key: 'blockSizeBytes',
          label: this.$t('pageSystemInventory.memoryMetrics.blockSizeBytes'),
        },
        {
          key: 'blocBlocksWrittenksRead',
          label: this.$t(
            'pageSystemInventory.memoryMetrics.blocBlocksWrittenksRead',
          ),
        },
        {
          key: 'blocksRead',
          label: this.$t('pageSystemInventory.memoryMetrics.blocksRead'),
        },
        {
          key: 'addressParityError',
          label: this.$t(
            'pageSystemInventory.memoryMetrics.addressParityError',
          ),
        },
        {
          key: 'correctableECCError',
          label: this.$t(
            'pageSystemInventory.memoryMetrics.correctableECCError',
          ),
          formatter: this.convertState,
        },
        {
          key: 'temperature',
          label: this.$t('pageSystemInventory.memoryMetrics.temperature'),
          formatter: this.convertState,
        },
        {
          key: 'dataLossDetected',
          label: this.$t('pageSystemInventory.memoryMetrics.dataLossDetected'),
          formatter: this.convertState,
        },
        {
          key: 'lastShutdownSuccess',
          label: this.$t(
            'pageSystemInventory.memoryMetrics.lastShutdownSuccess',
          ),
          formatter: this.convertState,
        },
        {
          key: 'performanceDegraded',
          label: this.$t(
            'pageSystemInventory.memoryMetrics.performanceDegraded',
          ),
        },
        {
          key: 'predictedMediaLifeLeftPercent',
          label: this.$t(
            'pageSystemInventory.memoryMetrics.predictedMediaLifeLeftPercent',
          ),
        },
        {
          key: 'remainingSpareBlockPercentage',
          label: this.$t(
            'pageSystemInventory.memoryMetrics.remainingSpareBlockPercentage',
          ),
        },
        {
          key: 'operatingSpeedMHz',
          label: this.$t('pageSystemInventory.memoryMetrics.operatingSpeedMHz'),
        },
      ],
    };
  },
  computed: {
    memoryMetricsInfo() {
      return this.$store.getters['SystemStore/memoryMetrics'];
    },
  },
  methods: {
    convertState(value) {
      if (value === null || value === undefined) return '';
      const valueType = typeof value;
      let status = value;
      switch (valueType) {
        case 'string':
          status = this.$t(`global.status.${value.toLowerCase()}`);
          break;
        case 'boolean':
          status = this.$t(`global.status.${String(value).toLowerCase()}`);
          break;
        default:
          return String(value);
      }
      if (status !== value) return status;
      else return value;
    },
  },
};
</script>
