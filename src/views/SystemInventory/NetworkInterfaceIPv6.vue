<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="networkInterfacesIpv6Fields"
      :items="networkinterfacesIpv6Info"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      networkInterfacesIpv6Fields: [
        {
          key: 'address',
          label: this.$t('pageSystemInventory.networkInterfaceIPv6.address'),
        },
        {
          key: 'prefixLength',
          label: this.$t(
            'pageSystemInventory.networkInterfaceIPv6.prefixLength'
          ),
        },
        {
          key: 'scope',
          label: this.$t(
            'pageSystemInventory.networkInterfaceIPv6.addressOrigin'
          ),
        },
      ],
    };
  },
  computed: {
    networkinterfacesIpv6Info() {
      return this.$store.getters[
        'SystemStore/basebordInfoNetworkInterfacesIpv6'
      ];
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getBasebordInfoNetworkInterfacesIpv6');
  },
};
</script>
