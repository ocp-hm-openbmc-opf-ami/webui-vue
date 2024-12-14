<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="memoryControllerFields"
      :items="memoryControllerInfo"
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
      memoryControllerFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.memoryController.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.memoryController.name'),
        },
        {
          key: 'capacityMiB',
          label: this.$t('pageSystemInventory.memoryController.capacityMiB'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.memoryController.manufacturer'),
        },
        {
          key: 'serialNumuber',
          label: this.$t('pageSystemInventory.memoryController.serialNumuber'),
        },
        {
          key: 'partNumuber',
          label: this.$t('pageSystemInventory.memoryController.partNumuber'),
        },
        {
          key: 'sparePartNumber',
          label: this.$t(
            'pageSystemInventory.memoryController.sparePartNumber',
          ),
        },
        {
          key: 'baseModuleType',
          label: this.$t('pageSystemInventory.memoryController.baseModuleType'),
        },
        {
          key: 'busWidthBits',
          label: this.$t('pageSystemInventory.memoryController.busWidthBits'),
        },
        {
          key: 'dataWidthBits',
          label: this.$t('pageSystemInventory.memoryController.dataWidthBits'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.memoryController.health'),
          formatter: this.dataFormatter,
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.memoryController.state'),
        },
        {
          key: 'operatingSpeedMhz',
          label: this.$t(
            'pageSystemInventory.memoryController.operatingSpeedMhz',
          ),
        },
        {
          key: 'memoryType',
          label: this.$t('pageSystemInventory.memoryController.memoryType'),
        },
        {
          key: 'allowedSpeedsMHz',
          label: this.$t(
            'pageSystemInventory.memoryController.allowedSpeedsMHz',
          ),
        },
        {
          key: 'serviceLabel',
          label: this.$t('pageSystemInventory.memoryController.serviceLabel'),
        },
      ],
    };
  },
  computed: {
    memoryControllerInfo() {
      return this.$store.getters['SystemStore/memoryController'];
    },
  },
};
</script>
