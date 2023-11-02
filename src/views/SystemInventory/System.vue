<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="systemFields"
      head-variant="light"
    />
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
        },
        {
          key: 'Description',
          label: this.$t('pageSystemInventory.system.Description'),
        },
        {
          key: 'IndicatorLED',
          label: this.$t('pageSystemInventory.system.IndicatorLED'),
        },
        {
          key: 'Manufacture',
          label: this.$t('pageSystemInventory.system.Manufacture'),
        },
        {
          key: 'PowerState',
          label: this.$t('pageSystemInventory.system.PowerState'),
        },
        {
          key: 'SerialNmuber',
          label: this.$t('pageSystemInventory.system.SerialNmuber'),
        },
        {
          key: 'PartNmuber',
          label: this.$t('pageSystemInventory.system.PartNmuber'),
        },
        {
          key: 'SystemType',
          label: this.$t('pageSystemInventory.system.SystemType'),
        },
        {
          key: 'AssetTag',
          label: this.$t('pageSystemInventory.system.AssetTag'),
        },
        {
          key: 'BiosVersion',
          label: this.$t('pageSystemInventory.system.BiosVersion'),
        },
        {
          key: 'UUID',
          label: this.$t('pageSystemInventory.system.UUID'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.system.state'),
        },
      ],
    };
  },
};
</script>
