<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="processorFields"
      :items="processorInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      processorFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.processor.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.processor.name'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.processor.manufacture'),
        },
        {
          key: 'maxSpeedMHz',
          label: this.$t('pageSystemInventory.processor.maxSpeedMHz'),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.processor.model'),
        },
        {
          key: 'processorArchitecture',
          label: this.$t('pageSystemInventory.processor.processorArchitecture'),
        },
        {
          key: 'processorType',
          label: this.$t('pageSystemInventory.processor.processorType'),
        },
        {
          key: 'socket',
          label: this.$t('pageSystemInventory.processor.socket'),
        },
        {
          key: 'totalCores',
          label: this.$t('pageSystemInventory.processor.totalCores'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.processor.state'),
        },
      ],
    };
  },
  computed: {
    processorInfo() {
      return this.$store.getters['SystemStore/processors'];
    },
  },
};
</script>
