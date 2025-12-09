<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="systemFields"
      :items="systemInfo"
      head-variant="light"
    >
    </b-table>
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
          formatter: this.convertState,
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
          formatter: this.convertState,
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
          formatter: this.convertSystemType,
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
          formatter: this.convertState,
        },
      ],
    };
  },
  computed: {
    systemInfo() {
      return this.$store.getters['SystemStore/systems'];
    },
  },
  methods: {
    convertState(value) {
      if (value === null || value === undefined) return '';
      const valueType = typeof value;
      let status = value;
      switch (valueType) {
        case 'string':
          status = this.$t(`global.status.${value.toLowerCase()}`);
          break;
        case 'boolean':
          status = this.$t(`global.status.${String(value).toLowerCase()}`);
          break;
        default:
          return String(value);
      }
      if (status !== value) return status;
      else return value;
    },
    convertSystemType(value) {
      // Enum values : Physical and Composed
      if (value === null || value === undefined)
        return this.$t(global.action.na);
      const key = String(value).toLowerCase();
      const translated = this.$t(`pageSystemInventory.system.${key}`);
      return translated || String(value);
    },
  },
};
</script>
