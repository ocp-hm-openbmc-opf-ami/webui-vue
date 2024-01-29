<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="voltageFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      voltageFields: [
        {
          key: 'name',
          label: this.$t('pageSystemInventory.voltage.name'),
        },
        {
          key: 'sensorNumber',
          label: this.$t('pageSystemInventory.voltage.sensorNumber'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.voltage.state'),
        },
        {
          key: 'minReadingRange',
          label: this.$t('pageSystemInventory.voltage.minReadingRange'),
        },
        {
          key: 'maxReadingRange',
          label: this.$t('pageSystemInventory.voltage.maxReadingRange'),
        },
        {
          key: 'upperThresholdFatal',
          label: this.$t('pageSystemInventory.voltage.upperThresholdFatal'),
        },
        {
          key: 'upperThresholdCritical',
          label: this.$t('pageSystemInventory.voltage.upperThresholdCritical'),
        },
        {
          key: 'upperThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.voltage.upperThresholdNonCritical'
          ),
        },
        {
          key: 'lowerThresholdNonCritical',
          label: this.$t(
            'pageSystemInventory.voltage.lowerThresholdNonCritical'
          ),
        },
        {
          key: 'lowerThresholdCritical',
          label: this.$t('pageSystemInventory.voltage.lowerThresholdCritical'),
        },
        {
          key: 'lowerThresholdFatal',
          label: this.$t('pageSystemInventory.voltage.lowerThresholdFatal'),
        },
      ],
    };
  },
};
</script>
