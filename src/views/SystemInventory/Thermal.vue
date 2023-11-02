<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="ThermalFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ThermalFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.Thermal.Name'),
        },
        {
          key: 'SensorNumber',
          label: this.$t('pageSystemInventory.Thermal.SensorNumber'),
        },
        {
          key: 'PhysicalContext',
          label: this.$t('pageSystemInventory.Thermal.PhysicalContext'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.Thermal.State'),
        },
        {
          key: 'ReadingRPM',
          label: this.$t('pageSystemInventory.Thermal.ReadingRPM'),
        },
        {
          key: 'MinReadingRange',
          label: this.$t('pageSystemInventory.Thermal.MinReadingRange'),
        },
        {
          key: 'MaxReadingRange',
          label: this.$t('pageSystemInventory.Thermal.MaxReadingRange'),
        },
        {
          key: 'UpperThresholdFatal',
          label: this.$t('pageSystemInventory.Thermal.UpperThresholdFatal'),
        },
        {
          key: 'UpperThresholdCritical',
          label: this.$t('pageSystemInventory.Thermal.UpperThresholdCritical'),
        },
        {
          key: 'UpperThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.Thermal.UpperThresholdNonCritical'
          ),
        },
        {
          key: 'LowerThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.Thermal.LowerThresholdNonCritical'
          ),
        },
        {
          key: 'LowerThresholdCritical',
          label: this.$t('pageSystemInventory.Thermal.LowerThresholdCritical'),
        },
        {
          key: 'LowerThresholdFatal',
          label: this.$t('pageSystemInventory.Thermal.LowerThresholdFatal'),
        },
      ],
    };
  },
};
</script>
