<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="MemoryControllerFields"
      :items="MemoryControllerTabItems"
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
    MemoryControllerTabItems() {
      // transform system tab data to table data
      return this.MemoryControllerInfo?.map((data) => {
        // console.log('memory', data.Manufacturer, index);
        return {
          Id: data.Id,
          Name: data.Name,
          CapacityMiB: data.CapacityMiB,
          Manufacturer: data.Manufacturer,
          SerialNumuber: data.SerialNumuber,
          PartNumuber: data.PartNumuber,
          State: data.State,
          OperatingSpeedMhz: data.OperatingSpeedMhz,
          MemoryType: data.MemoryType,
          Description: data.Description,
          AllowedSpeedsMHz: data.AllowedSpeedsMHz,
          ServiceLabel: data.ServiceLabel,
        };
      });
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getMemoryControllersInfo');
  },
};
</script>
