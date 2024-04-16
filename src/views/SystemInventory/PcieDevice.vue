<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="pcieDeviceFields"
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
          key: 'state',
          label: this.$t('pageSystemInventory.pcieDevice.state'),
        },
      ],
    };
  },
  computed: {
    pcieDeviceInfo() {
      return this.$store.getters['SystemStore/pcieDevice'];
    },
  },
};
</script>
