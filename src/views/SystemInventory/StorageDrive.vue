<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="storageDriveFields"
      :items="storageDrivesInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storageDriveFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.storageDrive.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.storageDrive.name'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.storageDrive.manufacturer'),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.storageDrive.model'),
        },
        {
          key: 'mediaType',
          label: this.$t('pageSystemInventory.storageDrive.mediaType'),
        },
        {
          key: 'serialNumber',
          label: this.$t('pageSystemInventory.storageDrive.serialNumber'),
        },
        {
          key: 'protocol',
          label: this.$t('pageSystemInventory.storageDrive.protocol'),
        },
        {
          key: 'blockSizeBytes',
          label: this.$t('pageSystemInventory.storageDrive.blockSizeBytes'),
        },
        {
          key: 'capacityBytes',
          label: this.$t('pageSystemInventory.storageDrive.capacityBytes'),
        },
        {
          key: 'encryptionAbility',
          label: this.$t('pageSystemInventory.storageDrive.encryptionAbility'),
        },
        {
          key: 'revision',
          label: this.$t('pageSystemInventory.storageDrive.revision'),
        },
        {
          key: 'readyToRemove',
          label: this.$t('pageSystemInventory.storageDrive.readyToRemove'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.storageDrive.state'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.storageDrive.health'),
        },
      ],
    };
  },
  computed: {
    storageDrivesInfo() {
      return this.$store.getters['SystemStore/storageDrivesInfo'];
    },
  },
};
</script>
