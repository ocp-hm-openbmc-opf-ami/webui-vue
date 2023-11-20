<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="NetworkInterfacesIpv6Fields"
      :items="NetworkinterfacesIpv6TabItems"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      NetworkInterfacesIpv6Fields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.NetworkInterfaces.Name'),
        },
        {
          key: 'Index',
          label: this.$t('pageSystemInventory.NetworkInterfaceIPv6.Index'),
        },
        {
          key: 'Address',
          label: this.$t('pageSystemInventory.NetworkInterfaceIPv6.Address'),
        },
        {
          key: 'PrefixLength',
          label: this.$t(
            'pageSystemInventory.NetworkInterfaceIPv6.PrefixLength'
          ),
        },
        {
          key: 'Scope',
          label: this.$t(
            'pageSystemInventory.NetworkInterfaceIPv6.AddressOrigin'
          ),
        },
      ],
    };
  },
  computed: {
    NetworkinterfacesIpv6Info() {
      return this.$store.getters[
        'SystemStore/basebordInfoNetworkInterfacesIpv6'
      ];
    },
    NetworkinterfacesIpv6TabItems() {
      // transform system tab data to table data
      return this.NetworkinterfacesIpv6Info?.map((data) => {
        return {
          Address: data.Address,
          PrefixLength: data.PrefixLength,
          Scope:
            data.AddressOrigin == 'SLAAC'
              ? 'Global'
              : data.AddressOrigin == 'LinkLocal'
              ? 'LinkLocal'
              : '',
          Index: data.Index,
          Name: data.Name,
        };
      });
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getBasebordInfoNetworkInterfacesIpv6');
  },
  methods: {
    SystemInfo() {
      const BasebordInfoNetworkInterfacesIpv6 = this.$store.getters[
        'SystemInventoryStore/getBasebordInfoNetworkInterfacesIpv6'
      ];
      console.log('network', BasebordInfoNetworkInterfacesIpv6);
    },
  },
};
</script>
