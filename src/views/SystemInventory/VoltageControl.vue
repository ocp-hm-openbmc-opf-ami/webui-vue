<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="VoltageFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      VoltageFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.Voltage.Name'),
        },
        {
          key: 'SensorNumber',
          label: this.$t('pageSystemInventory.Voltage.SensorNumber'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.Voltage.State'),
        },
        {
          key: 'MinReadingRange',
          label: this.$t('pageSystemInventory.Voltage.MinReadingRange'),
        },
        {
          key: 'MaxReadingRange',
          label: this.$t('pageSystemInventory.Voltage.MaxReadingRange'),
        },
        {
          key: 'UpperThresholdFatal',
          label: this.$t('pageSystemInventory.Voltage.UpperThresholdFatal'),
        },
        {
          key: 'UpperThresholdCritical',
          label: this.$t('pageSystemInventory.Voltage.UpperThresholdCritical'),
        },
        {
          key: 'UpperThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.Voltage.UpperThresholdNonCritical'
          ),
        },
        {
          key: 'LowerThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.Voltage.LowerThresholdNonCritical'
          ),
        },
        {
          key: 'LowerThresholdCritical',
          label: this.$t('pageSystemInventory.Voltage.LowerThresholdCritical'),
        },
        {
          key: 'LowerThresholdFatal',
          label: this.$t('pageSystemInventory.Voltage.LowerThresholdFatal'),
        },
      ],
    };
  },
};
</script>
