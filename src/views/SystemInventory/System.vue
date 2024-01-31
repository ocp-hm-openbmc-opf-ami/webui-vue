<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="systemFields"
      :items="systemInfo"
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
          key: 'name',
          label: this.$t('pageSystemInventory.system.name'),
          class: 'text-center',
        },
        {
          key: 'description',
          label: this.$t('pageSystemInventory.system.description'),
          class: 'text-center',
        },
        {
          key: 'indicatorLED',
          label: this.$t('pageSystemInventory.system.indicatorLED'),
          class: 'text-center',
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.system.manufacture'),
          class: 'text-center',
        },
        {
          key: 'powerState',
          label: this.$t('pageSystemInventory.system.powerState'),
          class: 'text-center',
        },
        {
          key: 'serialNumuber',
          label: this.$t('pageSystemInventory.system.serialNumuber'),
          class: 'text-center',
        },
        {
          key: 'partNumuber',
          label: this.$t('pageSystemInventory.system.partNumuber'),
          class: 'text-center',
        },
        {
          key: 'systemType',
          label: this.$t('pageSystemInventory.system.systemType'),
          class: 'text-center',
        },
        {
          key: 'assetTag',
          label: this.$t('pageSystemInventory.system.assetTag'),
          class: 'text-center',
        },
        {
          key: 'biosVersion',
          label: this.$t('pageSystemInventory.system.biosVersion'),
          class: 'text-center',
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.system.state'),
          class: 'text-center',
        },
      ],
    };
  },
  computed: {
    systemInfo() {
      return this.$store.getters['SystemStore/systems'];
    },
  },
};
</script>
