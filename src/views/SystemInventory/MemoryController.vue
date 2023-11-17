<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="MemoryControllerFields"
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
          key: 'SerialNmuber',
          label: this.$t('pageSystemInventory.MemoryController.SerialNmuber'),
        },
        {
          key: 'PartNmuber',
          label: this.$t('pageSystemInventory.MemoryController.PartNmuber'),
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
  created() {
    this.$store.dispatch('SystemStore/getMemoryControllersInfo');
  },
  methods: {
    SystemInfo() {
      const MicroCntrollersInfo = this.$store.getters[
        'SystemInventoryStore/getMemoryControllersInfo'
      ];
      console.log('MicroCntrollersInfo', MicroCntrollersInfo);
    },
  },
};
</script>
