<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="temperatureFields"
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
          formatter: this.convertState,
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
          formatter: this.convertReadingType,
        },
        {
          key: 'upperThresholdFatal',
          label: this.$t('pageSystemInventory.temperature.upperThresholdFatal'),
        },
        {
          key: 'upperThresholdCritical',
          label: this.$t(
            'pageSystemInventory.temperature.upperThresholdCritical',
          ),
        },
        {
          key: 'lowerThresholdCritical',
          label: this.$t(
            'pageSystemInventory.temperature.lowerThresholdCritical',
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
