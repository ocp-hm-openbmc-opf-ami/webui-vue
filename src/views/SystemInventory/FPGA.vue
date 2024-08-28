<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="processorFpgaFields"
      :items="processorFpgaInfo"
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
        },
      ],
    };
  },
  computed: {
    processorFpgaInfo() {
      return this.$store.getters['SystemStore/fpga'];
    },
  },
};
</script>
