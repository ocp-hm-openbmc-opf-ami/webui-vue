<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="simpleStorageFields"
      :items="simpleStorageInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      simpleStorageFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.simpleStorage.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.simpleStorage.name'),
        },
        {
          key: 'uefiDevicePath',
          label: this.$t('pageSystemInventory.simpleStorage.uefiDevicePath'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.simpleStorage.state'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.simpleStorage.health'),
        },
      ],
    };
  },
  computed: {
    simpleStorageInfo() {
      return this.$store.getters['SystemStore/simpleStorageInfo'];
    },
  },
};
</script>
