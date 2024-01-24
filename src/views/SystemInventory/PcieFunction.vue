<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="PCIEFunctionFields"
      :items="pcieFunctionInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      PCIEFunctionFields: [
        {
          key: 'Id',
          label: this.$t('pageSystemInventory.PCIEFunction.Id'),
        },
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.PCIEFunction.Name'),
        },
        {
          key: 'DeviceLinked',
          label: this.$t('pageSystemInventory.PCIEFunction.DeviceLinked'),
        },
        {
          key: 'DeviceClass',
          label: this.$t('pageSystemInventory.PCIEFunction.DeviceClass'),
        },
        {
          key: 'ClassCode',
          label: this.$t('pageSystemInventory.PCIEFunction.ClassCode'),
        },
        {
          key: 'DeviceId',
          label: this.$t('pageSystemInventory.PCIEFunction.DeviceId'),
        },
        {
          key: 'VendorId',
          label: this.$t('pageSystemInventory.PCIEFunction.VendorId'),
        },
        {
          key: 'FunctionId',
          label: this.$t('pageSystemInventory.PCIEFunction.FunctionId'),
        },
        {
          key: 'RevisionId',
          label: this.$t('pageSystemInventory.PCIEFunction.RevisionId'),
        },
        {
          key: 'SubSystemVendorId',
          label: this.$t('pageSystemInventory.PCIEFunction.SubSystemVendorId'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.PCIEFunction.State'),
        },
      ],
    };
  },
  computed: {
    pcieFunctionInfo() {
      return this.$store.getters['SystemStore/pcieFunction'];
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getPcieFunctionInfo');
  },
};
</script>
