<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="storageVolumeFields"
      :items="storageVolumesInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storageVolumeFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.storageVolume.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.storageVolume.name'),
        },
        {
          key: 'blockSizeBytes',
          label: this.$t('pageSystemInventory.storageVolume.blockSizeBytes'),
        },
        {
          key: 'capacityBytes',
          label: this.$t('pageSystemInventory.storageVolume.capacityBytes'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.storageVolume.state'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.storageVolume.health'),
        },
      ],
    };
  },
  computed: {
    storageVolumesInfo() {
      return this.$store.getters['SystemStore/storageVolumesInfo'];
    },
  },
};
</script>
