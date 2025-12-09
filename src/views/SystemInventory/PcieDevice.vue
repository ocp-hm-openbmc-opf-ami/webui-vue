<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="pcieDeviceFields"
      :empty-text="$t('global.table.emptyMessage')"
      :items="pcieDeviceInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
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
          key: 'assetTag',
          label: this.$t('pageSystemInventory.pcieDevice.assetTag'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.pcieDevice.state'),
          formatter: this.convertState,
        },
      ],
    };
  },
  computed: {
    pcieDeviceInfo() {
      return this.$store.getters['SystemStore/pcieDevice'];
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
