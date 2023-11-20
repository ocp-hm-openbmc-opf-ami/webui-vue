<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="processorFields"
      :items="ProcessorTabItems"
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
          key: 'Manufacturer',
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
          key: 'State',
          label: this.$t('pageSystemInventory.Processor.state'),
        },
      ],
    };
  },
  computed: {
    ProcessorInfo() {
      return this.$store.getters['SystemStore/processors'];
    },
    ProcessorTabItems() {
      // transform system tab data to table data
      return this.ProcessorInfo?.map((data) => {
        return {
          Id: data.Id,
          Name: data.Name,
          Manufacturer: data.Manufacturer,
          MaxSpeedMHz: data.MaxSpeedMHz,
          Model: data.Model,
          ProcessorArchitecture: data.ProcessorArchitecture,
          ProcessorType: data.ProcessorType,
          Socket: data.Socket,
          EffectiveFamily: data.EffectiveFamily,
          TotalCores: data.TotalCores,
          State: data.State,
        };
      });
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getProcessorsInfo');
  },
};
</script>
