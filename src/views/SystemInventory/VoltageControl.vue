<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="voltageFields"
      :items="temperatureInfo"
      :empty-text="$t('global.table.emptyMessage')"
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
          formatter: this.convertState,
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
          formatter: this.convertReadingType,
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
    convertReadingType(value) {
      if (value === null || value === undefined) return '';
      else
        return this.$t(
          `pageSystemInventory.readingType.${value.toLowerCase()}`,
        );
    },
  },
};
</script>
