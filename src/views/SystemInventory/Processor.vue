<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="processorFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      processorFields: [
        {
          key: 'Id',
          label: this.$t('pageSystemInventory.Processor.Id'),
        },
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.Processor.Name'),
        },
        {
          key: 'Manufacture',
          label: this.$t('pageSystemInventory.Processor.Manufacture'),
        },
        {
          key: 'MaxSpeedMHz',
          label: this.$t('pageSystemInventory.Processor.MaxSpeedMHz'),
        },
        {
          key: 'Model',
          label: this.$t('pageSystemInventory.Processor.Model'),
        },
        {
          key: 'ProcessorArchitecture',
          label: this.$t('pageSystemInventory.Processor.ProcessorArchitecture'),
        },
        {
          key: 'ProcessorType',
          label: this.$t('pageSystemInventory.Processor.ProcessorType'),
        },
        {
          key: 'Socket',
          label: this.$t('pageSystemInventory.Processor.Socket'),
        },
        {
          key: 'EffectiveFamily',
          label: this.$t('pageSystemInventory.Processor.EffectiveFamily'),
        },
        {
          key: 'TotalCores',
          label: this.$t('pageSystemInventory.Processor.TotalCores'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.Processor.state'),
        },
      ],
    };
  },
  created() {
    this.$store.dispatch('SystemStore/getProcessorsInfo');
  },
  methods: {
    SystemInfo() {
      const ProcessorsInfo = this.$store.getters[
        'SystemInventoryStore/getProcessorsInfo'
      ];
      console.log('getProcessorsInfo', ProcessorsInfo);
    },
  },
};
</script>
