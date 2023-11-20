<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="NetworkInterfacesFields"
      :items="NetworkinterfacesTabItems"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      NetworkInterfacesFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.NetworkInterfaces.Name'),
        },
        {
          key: 'MACAddress',
          label: this.$t('pageSystemInventory.NetworkInterfaces.MACAddress'),
        },
        {
          key: 'InterfaceEnabled',
          label: this.$t(
            'pageSystemInventory.NetworkInterfaces.InterfaceEnabled'
          ),
        },
        {
          key: 'IPv4Addresses',
          label: this.$t('pageSystemInventory.NetworkInterfaces.IPv4Addresses'),
        },
        {
          key: 'HostName',
          label: this.$t('pageSystemInventory.NetworkInterfaces.HostName'),
        },
        {
          key: 'FullDuplex',
          label: this.$t('pageSystemInventory.NetworkInterfaces.FullDuplex'),
        },
        {
          key: 'PermanentMACAddress',
          label: this.$t(
            'pageSystemInventory.NetworkInterfaces.PermanentMACAddress'
          ),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.NetworkInterfaces.State'),
        },
      ],
    };
  },
  computed: {
    NetworkinterfacesInfo() {
      return this.$store.getters['SystemStore/basebordInfoNetworkinterfaces'];
    },
    NetworkinterfacesTabItems() {
      // transform system tab data to table data
      return this.NetworkinterfacesInfo?.map((data) => {
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
