<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="temperatureFields"
      :items="temperatureInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      temperatureFields: [
        {
          key: 'name',
          label: this.$t('pageSystemInventory.temperature.name'),
        },
        {
          key: 'physicalContext',
          label: this.$t('pageSystemInventory.temperature.physicalContext'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.temperature.state'),
        },
        {
          key: 'readingUnits',
          label: this.$t('pageSystemInventory.temperature.readingUnits'),
        },
        {
          key: 'reading',
          label: this.$t('pageSystemInventory.temperature.reading'),
        },
        {
          key: 'readingRangeMin',
          label: this.$t('pageSystemInventory.temperature.minReadingRange'),
        },
        {
          key: 'readingRangeMax',
          label: this.$t('pageSystemInventory.temperature.maxReadingRange'),
        },
        {
          key: 'readingType',
          label: this.$t('pageSystemInventory.temperature.readingType'),
        },
        {
          key: 'upperThresholdFatal',
          label: this.$t('pageSystemInventory.temperature.upperThresholdFatal'),
        },
        {
          key: 'upperThresholdCritical',
          label: this.$t(
            'pageSystemInventory.temperature.upperThresholdCritical'
          ),
        },
        {
          key: 'lowerThresholdCritical',
          label: this.$t(
            'pageSystemInventory.temperature.lowerThresholdCritical'
          ),
        },
        {
          key: 'lowerThresholdFatal',
          label: this.$t('pageSystemInventory.temperature.lowerThresholdFatal'),
        },
      ],
    };
  },
  computed: {
    temperatureInfo() {
      return this.$store.getters['SystemStore/temperature'];
    },
  },
};
</script>
