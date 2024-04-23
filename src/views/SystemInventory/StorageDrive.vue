<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="storageFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storageFields: [
        {
          key: 'name',
          label: this.$t('pageSystemInventory.storage.name'),
        },
        {
          key: 'serialNmuber',
          label: this.$t('pageSystemInventory.storage.serialNmuber'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.storage.manufacturer'),
        },
        {
          key: 'protocol',
          label: this.$t('pageSystemInventory.storage.protocol'),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.storage.model'),
        },
        {
          key: 'revision',
          label: this.$t('pageSystemInventory.storage.revision'),
        },
        {
          key: 'encryptionStatus',
          label: this.$t('pageSystemInventory.storage.encryptionStatus'),
        },
        {
          key: 'mediaType',
          label: this.$t('pageSystemInventory.storage.mediaType'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.storage.state'),
        },
      ],
    };
  },
};
</script>
