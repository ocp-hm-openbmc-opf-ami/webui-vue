<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="StorageFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      StorageFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.Storage.Name'),
        },
        {
          key: 'SerialNmuber',
          label: this.$t('pageSystemInventory.Storage.SerialNmuber'),
        },
        {
          key: 'Manufacturer',
          label: this.$t('pageSystemInventory.Storage.Manufacturer'),
        },
        {
          key: 'Protocol',
          label: this.$t('pageSystemInventory.Storage.Protocol'),
        },
        {
          key: 'Model',
          label: this.$t('pageSystemInventory.Storage.Model'),
        },
        {
          key: 'Revision',
          label: this.$t('pageSystemInventory.Storage.Revision'),
        },
        {
          key: 'EncryptionStatus',
          label: this.$t('pageSystemInventory.Storage.EncryptionStatus'),
        },
        {
          key: 'MediaType',
          label: this.$t('pageSystemInventory.Storage.MediaType'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.Storage.State'),
        },
      ],
    };
  },
};
</script>
