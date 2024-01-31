<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="memoryControllerFields"
      :items="memoryControllerInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      memoryControllerFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.memoryController.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.memoryController.name'),
        },
        {
          key: 'capacityMiB',
          label: this.$t('pageSystemInventory.memoryController.capacityMiB'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.memoryController.manufacturer'),
        },
        {
          key: 'serialNumuber',
          label: this.$t('pageSystemInventory.memoryController.serialNumuber'),
        },
        {
          key: 'partNumuber',
          label: this.$t('pageSystemInventory.memoryController.partNumuber'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.memoryController.state'),
        },
        {
          key: 'operatingSpeedMhz',
          label: this.$t(
            'pageSystemInventory.memoryController.operatingSpeedMhz'
          ),
        },
        {
          key: 'memoryType',
          label: this.$t('pageSystemInventory.memoryController.memoryType'),
        },
        {
          key: 'allowedSpeedsMHz',
          label: this.$t(
            'pageSystemInventory.memoryController.allowedSpeedsMHz'
          ),
        },
        {
          key: 'serviceLabel',
          label: this.$t('pageSystemInventory.memoryController.serviceLabel'),
        },
      ],
    };
  },
  computed: {
    memoryControllerInfo() {
      return this.$store.getters['SystemStore/memoryController'];
    },
  },
};
</script>
