<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="storageControllerFields"
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
          key: 'memberId',
          label: this.$t('pageSystemInventory.storageController.memberId'),
        },
        {
          key: 'name',
          label: this.$t('pageSystemInventory.storageController.name'),
        },
        {
          key: 'serialNmuber',
          label: this.$t('pageSystemInventory.storageController.serialNmuber'),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.storageController.model'),
        },
        {
          key: 'firmwareVersion',
          label: this.$t(
            'pageSystemInventory.storageController.firmwareVersion',
          ),
        },
        {
          key: 'speedGbs',
          label: this.$t('pageSystemInventory.storageController.speedGbs'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.storageController.state'),
        },
      ],
    };
  },
};
</script>
