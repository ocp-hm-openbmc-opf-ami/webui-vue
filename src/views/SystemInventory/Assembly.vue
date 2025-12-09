<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :empty-text="$t('global.table.emptyMessage')"
      :fields="assemblyFields"
      :items="memoryAssemblyInfo"
      head-variant="light"
    >
      <!-- Health -->
      <template #cell(health)="{ value }">
        <status-icon :status="statusIcon(value)" />
        {{ value }}
      </template>
    </b-table>
  </div>
</template>

<script>
import StatusIcon from '@/components/Global/StatusIcon';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
export default {
  components: { StatusIcon },
  mixins: [DataFormatterMixin],
  data() {
    return {
      assemblyFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.memoryAssembly.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.memoryAssembly.name'),
        },
        {
          key: 'binaryDataURI',
          label: this.$t('pageSystemInventory.memoryAssembly.binaryDataURI'),
        },
        {
          key: 'description',
          label: this.$t('pageSystemInventory.memoryAssembly.description'),
        },
        {
          key: 'engineeringChangeLevel',
          label: this.$t(
            'pageSystemInventory.memoryAssembly.engineeringChangeLevel',
          ),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.memoryAssembly.model'),
        },
        {
          key: 'partNumber',
          label: this.$t('pageSystemInventory.memoryAssembly.partNumber'),
        },
        {
          key: 'sku',
          label: this.$t('pageSystemInventory.memoryAssembly.sku'),
        },
        {
          key: 'serialNumber',
          label: this.$t('pageSystemInventory.memoryAssembly.serialNumber'),
        },
        {
          key: 'sparePartNumber',
          label: this.$t('pageSystemInventory.memoryAssembly.sparePartNumber'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.memoryAssembly.health'),
          formatter: this.dataFormatter,
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.memoryAssembly.state'),
          formatter: this.convertState,
        },
        {
          key: 'vendor',
          label: this.$t('pageSystemInventory.memoryAssembly.vendor'),
        },
        {
          key: 'version',
          label: this.$t('pageSystemInventory.memoryAssembly.version'),
        },
      ],
    };
  },
  computed: {
    memoryAssemblyInfo() {
      return this.$store.getters['SystemStore/memoryAssembly'];
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
