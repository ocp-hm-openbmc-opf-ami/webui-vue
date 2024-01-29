<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="temperatureFields"
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
          key: 'sensorNumber',
          label: this.$t('pageSystemInventory.temperature.sensorNumber'),
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
          key: 'readingRPM',
          label: this.$t('pageSystemInventory.temperature.readingCelsius'),
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
          key: 'upperThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.temperature.upperThresholdNonCritical'
          ),
        },
        {
          key: 'lowerThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.temperature.lowerThresholdNonCritical'
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
};
</script>
