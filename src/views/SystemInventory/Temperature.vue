<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="TemperatureFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      TemperatureFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.temperature.Name'),
        },
        {
          key: 'SensorNumber',
          label: this.$t('pageSystemInventory.temperature.SensorNumber'),
        },
        {
          key: 'PhysicalContext',
          label: this.$t('pageSystemInventory.temperature.PhysicalContext'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.temperature.State'),
        },
        {
          key: 'ReadingRPM',
          label: this.$t('pageSystemInventory.temperature.ReadingCelsius'),
        },
        {
          key: 'UpperThresholdFatal',
          label: this.$t('pageSystemInventory.temperature.UpperThresholdFatal'),
        },
        {
          key: 'UpperThresholdCritical',
          label: this.$t(
            'pageSystemInventory.temperature.UpperThresholdCritical'
          ),
        },
        {
          key: 'UpperThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.temperature.UpperThresholdNonCritical'
          ),
        },
        {
          key: 'LowerThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.temperature.LowerThresholdNonCritical'
          ),
        },
        {
          key: 'LowerThresholdCritical',
          label: this.$t(
            'pageSystemInventory.temperature.LowerThresholdCritical'
          ),
        },
        {
          key: 'LowerThresholdFatal',
          label: this.$t('pageSystemInventory.temperature.LowerThresholdFatal'),
        },
      ],
    };
  },
};
</script>
