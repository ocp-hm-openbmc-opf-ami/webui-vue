<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="baseBoardFields"
      :items="baseBoardInfo"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseBoardFields: [
        {
          key: 'name',
          label: this.$t('pageSystemInventory.baseBoard.name'),
        },
        {
          key: 'indicatorLED',
          label: this.$t('pageSystemInventory.baseBoard.indicatorLED'),
        },
        {
          key: 'locationIndicatorActive',
          label: this.$t(
            'pageSystemInventory.baseBoard.locationIndicatorActive'
          ),
        },
        {
          key: 'model',
          label: this.$t('pageSystemInventory.baseBoard.model'),
        },
        {
          key: 'state',
          label: this.$t('pageSystemInventory.baseBoard.state'),
        },
        {
          key: 'powerState',
          label: this.$t('pageSystemInventory.baseBoard.powerState'),
        },
        {
          key: 'assetTag',
          label: this.$t('pageSystemInventory.baseBoard.assetTag'),
        },
        {
          key: 'manufacturer',
          label: this.$t('pageSystemInventory.baseBoard.manufacturer'),
        },
        {
          key: 'partNumber',
          label: this.$t('pageSystemInventory.baseBoard.partNumber'),
        },
        {
          key: 'serialNumber',
          label: this.$t('pageSystemInventory.baseBoard.serialNumber'),
        },
      ],
    };
  },
  computed: {
    baseBoardInfo() {
      return this.$store.getters['SystemStore/baseBoard'];
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getBaseBoardInfo');
  },
};
</script>
