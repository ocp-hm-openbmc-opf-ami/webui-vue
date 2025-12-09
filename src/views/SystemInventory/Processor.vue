<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="processorFields"
      :items="processorInfo"
      :empty-text="$t('global.table.emptyMessage')"
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
      processorFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.processor.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.processor.name'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.processor.manufacture'),
        },
        {
          key: 'maxSpeedMHz',
          label: this.$t('pageSystemInventory.processor.maxSpeedMHz'),
        },
        {
          key: 'OperatingSpeedMHz',
          label: this.$t('pageSystemInventory.processor.operatingSpeedMHz'),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.processor.model'),
        },
        {
          key: 'processorArchitecture',
          label: this.$t('pageSystemInventory.processor.processorArchitecture'),
        },
        {
          key: 'processorType',
          label: this.$t('pageSystemInventory.processor.processorType'),
        },
        {
          key: 'socket',
          label: this.$t('pageSystemInventory.processor.socket'),
        },
        {
          key: 'serialNumber',
          label: this.$t('pageSystemInventory.processor.serialNumuber'),
        },
        {
          key: 'partNumber',
          label: this.$t('pageSystemInventory.processor.partNumuber'),
        },
        {
          key: 'instructionSet',
          label: this.$t('pageSystemInventory.processor.instructionSet'),
        },
        {
          key: 'version',
          label: this.$t('pageSystemInventory.processor.version'),
        },
        {
          key: 'totalCores',
          label: this.$t('pageSystemInventory.processor.totalCores'),
        },
        {
          key: 'totalEnabledCores',
          label: this.$t('pageSystemInventory.processor.totalEnabledCores'),
        },
        {
          key: 'totalThreads',
          label: this.$t('pageSystemInventory.processor.totalThreads'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.processor.health'),
          formatter: this.dataFormatter,
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.processor.state'),
          formatter: this.convertState,
        },
      ],
    };
  },
  computed: {
    processorInfo() {
      return this.$store.getters['SystemStore/processors'];
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
