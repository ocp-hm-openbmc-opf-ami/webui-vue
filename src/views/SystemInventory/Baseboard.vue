<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="baseBoardFields"
      :items="baseBoardInfo"
      :empty-text="$t('global.table.emptyMessage')"
      head-variant="light"
    >
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseBoardFields: [
        {
          key: 'name',
          label: this.$t('pageSystemInventory.baseBoard.name'),
        },
        {
          key: 'locationIndicatorActive',
          label: this.$t(
            'pageSystemInventory.baseBoard.locationIndicatorActive',
          ),
          formatter: this.convertState,
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.baseBoard.model'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.baseBoard.state'),
          formatter: this.convertState,
        },
        {
          key: 'powerState',
          label: this.$t('pageSystemInventory.baseBoard.powerState'),
          formatter: this.convertState,
        },
        {
          key: 'assetTag',
          label: this.$t('pageSystemInventory.baseBoard.assetTag'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.baseBoard.manufacturer'),
        },
        {
          key: 'partNumber',
          label: this.$t('pageSystemInventory.baseBoard.partNumber'),
        },
        {
          key: 'serialNumber',
          label: this.$t('pageSystemInventory.baseBoard.serialNumber'),
        },
      ],
    };
  },
  computed: {
    baseBoardInfo() {
      return this.$store.getters['SystemStore/baseBoard'];
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
  },
};
</script>
