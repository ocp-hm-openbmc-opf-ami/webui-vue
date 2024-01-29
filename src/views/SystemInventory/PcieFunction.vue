<template>
  <div>
    <div class="ml-sm-4">
      <table-cell-count
        :total-number-of-cells="pcieFunctionInfo.length"
      ></table-cell-count>
    </div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="pcieFunctionFields"
      :items="pcieFunctionInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
import TableCellCount from '@/components/Global/TableCellCount';

export default {
  components: { TableCellCount },
  data() {
    return {
      pcieFunctionFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.pcieFunction.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.pcieFunction.name'),
        },
        {
          key: 'deviceClass',
          label: this.$t('pageSystemInventory.pcieFunction.deviceClass'),
        },
        {
          key: 'classCode',
          label: this.$t('pageSystemInventory.pcieFunction.classCode'),
        },
        {
          key: 'deviceId',
          label: this.$t('pageSystemInventory.pcieFunction.deviceId'),
        },
        {
          key: 'vendorId',
          label: this.$t('pageSystemInventory.pcieFunction.vendorId'),
        },
        {
          key: 'functionId',
          label: this.$t('pageSystemInventory.pcieFunction.functionId'),
        },
        {
          key: 'functionType',
          label: this.$t('pageSystemInventory.pcieFunction.functionType'),
        },
        {
          key: 'revisionId',
          label: this.$t('pageSystemInventory.pcieFunction.revisionId'),
        },
        {
          key: 'subSystemVendorId',
          label: this.$t('pageSystemInventory.pcieFunction.subSystemVendorId'),
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
