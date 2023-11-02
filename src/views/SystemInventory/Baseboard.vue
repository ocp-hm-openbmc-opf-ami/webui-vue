<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="BaseboardFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      BaseboardFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.BaseBoard.Name'),
        },
        {
          key: 'Description',
          label: this.$t('pageSystemInventory.BaseBoard.Description'),
        },
        {
          key: 'FrmwareVersion',
          label: this.$t('pageSystemInventory.BaseBoard.FrmwareVersion'),
        },
        {
          key: 'Model',
          label: this.$t('pageSystemInventory.BaseBoard.Model'),
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.BaseBoard.State'),
        },
        {
          key: 'PowerState',
          label: this.$t('pageSystemInventory.BaseBoard.PowerState'),
        },
      ],
    };
  },
};
</script>
