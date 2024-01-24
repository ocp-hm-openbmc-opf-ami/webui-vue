<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="systemFields"
      :items="SystemInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      systemFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.system.Name'),
          class: 'text-center',
        },
        {
          key: 'Description',
          label: this.$t('pageSystemInventory.system.Description'),
          class: 'text-center',
        },
        {
          key: 'IndicatorLED',
          label: this.$t('pageSystemInventory.system.IndicatorLED'),
          class: 'text-center',
        },
        {
          key: 'Manufacturer',
          label: this.$t('pageSystemInventory.system.Manufacture'),
          class: 'text-center',
        },
        {
          key: 'PowerState',
          label: this.$t('pageSystemInventory.system.PowerState'),
          class: 'text-center',
        },
        {
          key: 'SerialNumuber',
          label: this.$t('pageSystemInventory.system.SerialNumuber'),
          class: 'text-center',
        },
        {
          key: 'PartNumuber',
          label: this.$t('pageSystemInventory.system.PartNumuber'),
          class: 'text-center',
        },
        {
          key: 'SystemType',
          label: this.$t('pageSystemInventory.system.SystemType'),
          class: 'text-center',
        },
        {
          key: 'AssetTag',
          label: this.$t('pageSystemInventory.system.AssetTag'),
          class: 'text-center',
        },
        {
          key: 'BiosVersion',
          label: this.$t('pageSystemInventory.system.BiosVersion'),
          class: 'text-center',
        },
        {
          key: 'UUID',
          label: this.$t('pageSystemInventory.system.UUID'),
          class: 'text-center',
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.system.state'),
          class: 'text-center',
        },
      ],
    };
  },
  computed: {
    SystemInfo() {
      return this.$store.getters['SystemStore/systems'];
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getSystemsInfo');
  },
};
</script>
