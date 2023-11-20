<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="BaseboardFields"
      :items="BaseBoardTabItems"
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
          key: 'FirmwareVersion',
          label: this.$t('pageSystemInventory.BaseBoard.FirmwareVersion'),
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
  computed: {
    BaseBoardInfo() {
      return this.$store.getters['SystemStore/baseBoard'];
    },
    BaseBoardTabItems() {
      // transform system tab data to table data
      return this.BaseBoardInfo?.map((data, index) => {
        console.log('memory', data.Manufacturer, index);
        return {
          Name: data.Name,
          Description: data.Description,
          FirmwareVersion: data.FirmwareVersion,
          Model: data.Model,
          State: data.State,
          PowerState: data.PowerState,
        };
      });
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getBaseBoardInfo');
  },
};
</script>
