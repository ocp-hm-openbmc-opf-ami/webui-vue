<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="storageInfoFields"
      :items="storageInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storageInfoFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.storageInfo.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.storageInfo.name'),
        },
        {
          key: 'description',
          label: this.$t('pageSystemInventory.storageInfo.description'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.storageInfo.state'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.storageInfo.health'),
        },
      ],
    };
  },
  computed: {
    storageInfo() {
      return this.$store.getters['SystemStore/storageInfo'];
    },
  },
};
</script>
