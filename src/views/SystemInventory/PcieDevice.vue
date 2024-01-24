<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="PCIEDeviceFields"
      :items="pcieDeviceInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      PCIEDeviceFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.PCIEDevice.Name'),
        },
        {
          key: 'Description',
          label: this.$t('pageSystemInventory.PCIEDevice.Description'),
        },
        {
          key: 'Manufacturer',
          label: this.$t('pageSystemInventory.PCIEDevice.Manufacturer'),
        },
        {
          key: 'AssetTag',
          label: this.$t('pageSystemInventory.PCIEDevice.AssetTag'),
        },
        {
          key: 'DeviceType',
          label: this.$t('pageSystemInventory.PCIEDevice.DeviceType'),
        },
        {
          key: 'FrmwareVersion',
          label: this.$t('pageSystemInventory.PCIEDevice.FrmwareVersion'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.PCIEDevice.State'),
        },
      ],
    };
  },
  computed: {
    pcieDeviceInfo() {
      return this.$store.getters['SystemStore/pcieDevice'];
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getPcieDeviceInfo');
  },
};
</script>
