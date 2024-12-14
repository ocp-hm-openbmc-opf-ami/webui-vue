<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="powerControlFields"
      :items="powerInfo"
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
          key: 'model',
          label: this.$t('pageSystemInventory.power.model'),
        },
        {
          key: 'efficiencyPercent',
          label: this.$t('pageSystemInventory.power.efficiencyPercent'),
        },
        {
          key: 'firmwareVersion',
          label: this.$t('pageSystemInventory.power.firmwareVersion'),
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
          key: 'partNumber',
          label: this.$t('pageSystemInventory.power.partNumber'),
        },
        {
          key: 'sparePartNumber',
          label: this.$t('pageSystemInventory.power.sparePartNumber'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.power.health'),
          formatter: this.dataFormatter,
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
