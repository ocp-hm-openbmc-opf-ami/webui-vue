<template>
  <div>
    <div class="ml-sm-4">
      <table-cell-count
        :total-number-of-cells="pcieDeviceInfo.length"
      ></table-cell-count>
    </div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="pcieDeviceFields"
      :items="pcieDeviceInfo"
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
      pcieDeviceFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.pcieDevice.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.pcieDevice.name'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.pcieDevice.manufacturer'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.pcieDevice.state'),
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
