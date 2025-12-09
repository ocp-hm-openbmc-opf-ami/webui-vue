<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :empty-text="$t('global.table.emptyMessage')"
      :fields="networkInterfacesFields"
      :items="networkInterfacesInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      networkInterfacesFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.networkInterfaces.id'),
        },
        {
          key: 'mACAddress',
          label: this.$t('pageSystemInventory.networkInterfaces.mACAddress'),
        },
        {
          key: 'interfaceEnabled',
          label: this.$t(
            'pageSystemInventory.networkInterfaces.interfaceEnabled',
          ),
          formatter: this.convertState,
        },
        {
          key: 'iPv4Addresses',
          label: this.$t('pageSystemInventory.networkInterfaces.iPv4Addresses'),
        },
        {
          key: 'hostName',
          label: this.$t('pageSystemInventory.networkInterfaces.hostName'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.networkInterfaces.state'),
          formatter: this.convertState,
        },
      ],
    };
  },
  computed: {
    networkInterfacesInfo() {
      return this.$store.getters['SystemStore/basebordInfoNetworkinterfaces'];
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
