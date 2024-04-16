<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="voltageFields"
      :items="temperatureInfo"
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
          key: 'state',
          label: this.$t('pageSystemInventory.voltage.state'),
        },
        {
          key: 'readingUnits',
          label: this.$t('pageSystemInventory.voltage.readingUnits'),
        },
        {
          key: 'reading',
          label: this.$t('pageSystemInventory.voltage.reading'),
        },
        {
          key: 'readingRangeMin',
          label: this.$t('pageSystemInventory.voltage.minReadingRange'),
        },
        {
          key: 'readingRangeMax',
          label: this.$t('pageSystemInventory.voltage.maxReadingRange'),
        },
        {
          key: 'readingType',
          label: this.$t('pageSystemInventory.voltage.readingType'),
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
  computed: {
    temperatureInfo() {
      return this.$store.getters['SystemStore/voltage'];
    },
  },
};
</script>
