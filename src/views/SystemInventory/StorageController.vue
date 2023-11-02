<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="StorageControllerFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      StorageControllerFields: [
        {
          key: 'MemberId',
          label: this.$t('pageSystemInventory.StorageController.MemberId'),
        },
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.StorageController.Name'),
        },
        {
          key: 'SerialNmuber',
          label: this.$t('pageSystemInventory.StorageController.SerialNmuber'),
        },
        {
          key: 'Model',
          label: this.$t('pageSystemInventory.StorageController.Model'),
        },
        {
          key: 'FirmwareVersion',
          label: this.$t(
            'pageSystemInventory.StorageController.FirmwareVersion'
          ),
        },
        {
          key: 'SpeedGbs',
          label: this.$t('pageSystemInventory.StorageController.SpeedGbs'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.StorageController.State'),
        },
      ],
    };
  },
};
</script>
