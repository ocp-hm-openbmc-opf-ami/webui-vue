<template>
  <div>
    <h3>{{ $t('powerShelf.powerSupplyInfo') }}</h3>
    <b-table
      responsive="md"
      hover
      :fields="powerSupplyInfoFields"
      :items="[powerSupplyInfo]"
      :empty-text="$t('global.table.emptyMessage')"
      show-empty
      class="auto_scroll"
    ></b-table>
  </div>
</template>

<script>
export default {
  props: {
    powerSupplyInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      powerSupplyInfoFields: [
        { key: 'Id', label: this.$t('powerShelf.id') },
        { key: 'Name', label: this.$t('powerShelf.name') },
        { key: 'Model', label: this.$t('powerShelf.model') },
        { key: 'Manufacturer', label: this.$t('powerShelf.manufacturer') },
        { key: 'PartNumber', label: this.$t('powerShelf.partNumber') },
        { key: 'SerialNumber', label: this.$t('powerShelf.serialNumber') },
        {
          key: 'PowerSupplyType',
          label: this.$t('powerShelf.powerSupplyType'),
        },
        { key: 'Health', label: this.$t('powerShelf.health') },
        { key: 'State', label: this.$t('powerShelf.state') },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.auto_scroll {
  overflow: auto;
  box-shadow: 4px 6px 12px 0 rgba(0, 0, 0, 0.3);
  background-color: white;
}
</style>
