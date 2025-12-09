<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="processorFpgaFields"
      :items="processorFpgaInfo"
      :empty-text="$t('global.table.emptyMessage')"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      processorFpgaFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.processorFPGA.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.processorFPGA.name'),
        },
        {
          key: 'firmwareId',
          label: this.$t('pageSystemInventory.processorFPGA.firmwareId'),
        },
        {
          key: 'firmwareManufacturer',
          label: this.$t(
            'pageSystemInventory.processorFPGA.firmwareManufacturer',
          ),
        },
        {
          key: 'fpgaType',
          label: this.$t('pageSystemInventory.processorFPGA.fpgaType'),
        },
        {
          key: 'interfaceType',
          label: this.$t('pageSystemInventory.processorFPGA.interfaceType'),
        },
        {
          key: 'fpgaModel',
          label: this.$t('pageSystemInventory.processorFPGA.model'),
        },
        {
          key: 'pcieVirtualFunctions',
          label: this.$t(
            'pageSystemInventory.processorFPGA.pcieVirtualFunctions',
          ),
        },
        {
          key: 'programmableFromHost',
          label: this.$t(
            'pageSystemInventory.processorFPGA.programmableFromHost',
          ),
          formatter: this.convertState,
        },
      ],
    };
  },
  computed: {
    processorFpgaInfo() {
      return this.$store.getters['SystemStore/fpga'];
    },
  },
  methods: {
    convertState(value) {
      if (value === null || value === undefined) return '';
      const valueType = typeof value;
      let status = value;
      switch (valueType) {
        case 'string':
          status = this.$t(`global.status.${value.toLowerCase()}`);
          break;
        case 'boolean':
          status = this.$t(`global.status.${String(value).toLowerCase()}`);
          break;
        default:
          return String(value);
      }
      if (status !== value) return status;
      else return value;
    },
  },
};
</script>
