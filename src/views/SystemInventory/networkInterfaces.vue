<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="NetworkInterfacesFields"
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
};
</script>
