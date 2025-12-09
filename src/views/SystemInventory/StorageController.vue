<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      show-empty
      :fields="storageControllerFields"
      :empty-text="$t('global.table.emptyMessage')"
      :items="storageControllersInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      storageControllerFields: [
        {
          key: 'id',
          label: this.$t('pageSystemInventory.storageController.id'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.storageController.name'),
        },
        {
          key: 'assetTag',
          label: this.$t('pageSystemInventory.storageController.assetTag'),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.storageController.model'),
        },
        {
          key: 'serialNumber',
          label: this.$t('pageSystemInventory.storageController.serialNumber'),
        },
        {
          key: 'firmwareVersion',
          label: this.$t(
            'pageSystemInventory.storageController.firmwareVersion',
          ),
        },
        {
          key: 'speedGbps',
          label: this.$t('pageSystemInventory.storageController.speedGbps'),
        },
        {
          key: 'supportedControllerProtocols',
          label: this.$t(
            'pageSystemInventory.storageController.supportedControllerProtocols',
          ),
        },
        {
          key: 'supportedDeviceProtocols',
          label: this.$t(
            'pageSystemInventory.storageController.supportedDeviceProtocols',
          ),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.storageController.state'),
        },
        {
          key: 'health',
          label: this.$t('pageSystemInventory.storageController.health'),
        },
      ],
    };
  },
  computed: {
    storageControllersInfo() {
      return this.$store.getters['SystemStore/storageControllersInfo'];
    },
  },
};
</script>
