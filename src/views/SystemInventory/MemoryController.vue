<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="MemoryControllerFields"
      :items="MemoryControllerInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      MemoryControllerFields: [
        {
          key: 'Id',
          label: this.$t('pageSystemInventory.MemoryController.Id'),
        },
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.MemoryController.Name'),
        },
        {
          key: 'CapacityMiB',
          label: this.$t('pageSystemInventory.MemoryController.CapacityMiB'),
        },
        {
          key: 'Manufacturer',
          label: this.$t('pageSystemInventory.MemoryController.Manufacturer'),
        },
        {
          key: 'SerialNumuber',
          label: this.$t('pageSystemInventory.MemoryController.SerialNumuber'),
        },
        {
          key: 'PartNumuber',
          label: this.$t('pageSystemInventory.MemoryController.PartNumuber'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.MemoryController.State'),
        },
        {
          key: 'OperatingSpeedMhz',
          label: this.$t(
            'pageSystemInventory.MemoryController.OperatingSpeedMhz'
          ),
        },
        {
          key: 'MemoryType',
          label: this.$t('pageSystemInventory.MemoryController.MemoryType'),
        },
        {
          key: 'Description',
          label: this.$t('pageSystemInventory.MemoryController.Description'),
        },
        {
          key: 'AllowedSpeedsMHz',
          label: this.$t(
            'pageSystemInventory.MemoryController.AllowedSpeedsMHz'
          ),
        },
        {
          key: 'ServiceLabel',
          label: this.$t('pageSystemInventory.MemoryController.ServiceLabel'),
        },
      ],
    };
  },
  computed: {
    MemoryControllerInfo() {
      return this.$store.getters['SystemStore/memoryController'];
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getMemoryControllersInfo');
  },
};
</script>
