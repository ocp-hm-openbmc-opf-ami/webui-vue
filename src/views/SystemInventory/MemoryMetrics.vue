<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="MetricsFields"
      :items="memoryMetricsInfo"
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
        },
        {
          key: 'temperature',
          label: this.$t('pageSystemInventory.memoryMetrics.temperature'),
        },
        {
          key: 'dataLossDetected',
          label: this.$t('pageSystemInventory.memoryMetrics.dataLossDetected'),
        },
        {
          key: 'lastShutdownSuccess',
          label: this.$t(
            'pageSystemInventory.memoryMetrics.lastShutdownSuccess',
          ),
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
};
</script>
