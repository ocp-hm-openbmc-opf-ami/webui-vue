<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="thermalFields"
      :items="thermalFanInfo"
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
      thermalFields: [
        {
          key: 'name',
          label: this.$t('pageSystemInventory.thermal.name'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.thermal.health'),
          formatter: this.dataFormatter,
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.thermal.state'),
          formatter: this.convertState,
        },
        {
          key: 'readingRPM',
          label: this.$t('pageSystemInventory.thermal.readingRPM'),
        },
        {
          key: 'minReadingRange',
          label: this.$t('pageSystemInventory.thermal.minReadingRange'),
        },
        {
          key: 'maxReadingRange',
          label: this.$t('pageSystemInventory.thermal.maxReadingRange'),
        },
      ],
    };
  },
  computed: {
    thermalFanInfo() {
      return this.$store.getters['SystemStore/fans'];
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
