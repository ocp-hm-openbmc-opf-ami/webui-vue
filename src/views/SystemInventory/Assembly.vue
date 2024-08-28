<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="assemblyFields"
      :items="memoryAssemblyInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assemblyFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.memoryAssembly.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.memoryAssembly.name'),
        },
        {
          key: 'binaryDataURI',
          label: this.$t('pageSystemInventory.memoryAssembly.binaryDataURI'),
        },
        {
          key: 'description',
          label: this.$t('pageSystemInventory.memoryAssembly.description'),
        },
        {
          key: 'engineeringChangeLevel',
          label: this.$t(
            'pageSystemInventory.memoryAssembly.engineeringChangeLevel',
          ),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.memoryAssembly.model'),
        },
        {
          key: 'partNumber',
          label: this.$t('pageSystemInventory.memoryAssembly.partNumber'),
        },
        {
          key: 'sku',
          label: this.$t('pageSystemInventory.memoryAssembly.sku'),
        },
        {
          key: 'serialNumber',
          label: this.$t('pageSystemInventory.memoryAssembly.serialNumber'),
        },
        {
          key: 'sparePartNumber',
          label: this.$t('pageSystemInventory.memoryAssembly.sparePartNumber'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.memoryAssembly.state'),
        },
        {
          key: 'vendor',
          label: this.$t('pageSystemInventory.memoryAssembly.vendor'),
        },
        {
          key: 'version',
          label: this.$t('pageSystemInventory.memoryAssembly.version'),
        },
      ],
    };
  },
  computed: {
    memoryAssemblyInfo() {
      return this.$store.getters['SystemStore/memoryAssembly'];
    },
  },
};
</script>
