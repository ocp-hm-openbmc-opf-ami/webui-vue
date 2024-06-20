<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
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
        },
      ],
    };
  },
  computed: {
    networkInterfacesInfo() {
      return this.$store.getters['SystemStore/basebordInfoNetworkinterfaces'];
    },
  },
};
</script>
