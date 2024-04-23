<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="thermalFields"
      :items="thermalFanInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      thermalFields: [
        {
          key: 'name',
          label: this.$t('pageSystemInventory.thermal.name'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.thermal.state'),
        },
        {
          key: 'readingRPM',
          label: this.$t('pageSystemInventory.thermal.readingRPM'),
        },
        {
          key: 'minReadingRange',
          label: this.$t('pageSystemInventory.thermal.minReadingRange'),
        },
        {
          key: 'maxReadingRange',
          label: this.$t('pageSystemInventory.thermal.maxReadingRange'),
        },
      ],
    };
  },
  computed: {
    thermalFanInfo() {
      return this.$store.getters['SystemStore/fans'];
    },
  },
};
</script>
