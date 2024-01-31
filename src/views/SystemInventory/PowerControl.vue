<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="powerControlFields"
      :items="powerInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      powerControlFields: [
        {
          key: 'name',
          label: this.$t('pageSystemInventory.power.name'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.power.manufacturer'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.power.model'),
        },
        {
          key: 'plugType',
          label: this.$t('pageSystemInventory.power.plugType'),
        },
        {
          key: 'powerCapacityWatts',
          label: this.$t('pageSystemInventory.power.powerCapacityWatts'),
        },
        {
          key: 'PowerSupplyType',
          label: this.$t('pageSystemInventory.power.PowerSupplyType'),
        },
        {
          key: 'SerialNumber',
          label: this.$t('pageSystemInventory.power.SerialNumber'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.power.state'),
        },
      ],
    };
  },
  computed: {
    powerInfo() {
      return this.$store.getters['SystemStore/power'];
    },
  },
};
</script>
