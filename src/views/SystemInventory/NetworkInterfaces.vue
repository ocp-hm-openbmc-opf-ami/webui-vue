<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="networkInterfacesFields"
      :items="networkInterfacesTabItems"
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
          key: 'name',
          label: this.$t('pageSystemInventory.networkInterfaces.name'),
        },
        {
          key: 'mACAddress',
          label: this.$t('pageSystemInventory.networkInterfaces.mACAddress'),
        },
        {
          key: 'interfaceEnabled',
          label: this.$t(
            'pageSystemInventory.networkInterfaces.interfaceEnabled'
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
          key: 'fullDuplex',
          label: this.$t('pageSystemInventory.networkInterfaces.fullDuplex'),
        },
        {
          key: 'permanentMACAddress',
          label: this.$t(
            'pageSystemInventory.networkInterfaces.permanentMACAddress'
          ),
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
    networkInterfacesTabItems() {
      // transform system tab data to table data
      return this.networkInterfacesInfo?.map((data) => {
        return {
          Name: data.Name,
          MACAddress: data.MACAddress,
          InterfaceEnabled: data.InterfaceEnabled,
          IPv4Addresses: data.IPv4Addresses,
          HostName: data.HostName,
          FullDuplex: data.FullDuplex,
          PermanentMACAddress: data.PermanentMACAddress,
          State: data.State,
        };
      });
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getBasebordInfoNetworkinterfaces');
  },
};
</script>
