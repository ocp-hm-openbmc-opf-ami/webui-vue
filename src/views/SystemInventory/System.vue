<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="systemFields"
      :items="systemTabItems"
      head-variant="light"
    ></b-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      systemFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.system.Name'),
          class: 'text-center',
        },
        {
          key: 'Description',
          label: this.$t('pageSystemInventory.system.Description'),
          class: 'text-center',
        },
        {
          key: 'IndicatorLED',
          label: this.$t('pageSystemInventory.system.IndicatorLED'),
          class: 'text-center',
        },
        {
          key: 'Manufacturer',
          label: this.$t('pageSystemInventory.system.Manufacture'),
          class: 'text-center',
        },
        {
          key: 'PowerState',
          label: this.$t('pageSystemInventory.system.PowerState'),
          class: 'text-center',
        },
        {
          key: 'SerialNumuber',
          label: this.$t('pageSystemInventory.system.SerialNumuber'),
          class: 'text-center',
        },
        {
          key: 'PartNumuber',
          label: this.$t('pageSystemInventory.system.PartNumuber'),
          class: 'text-center',
        },
        {
          key: 'SystemType',
          label: this.$t('pageSystemInventory.system.SystemType'),
          class: 'text-center',
        },
        {
          key: 'AssetTag',
          label: this.$t('pageSystemInventory.system.AssetTag'),
          class: 'text-center',
        },
        {
          key: 'BiosVersion',
          label: this.$t('pageSystemInventory.system.BiosVersion'),
          class: 'text-center',
        },
        {
          key: 'UUID',
          label: this.$t('pageSystemInventory.system.UUID'),
          class: 'text-center',
        },
        {
          key: 'State',
          label: this.$t('pageSystemInventory.system.state'),
          class: 'text-center',
        },
      ],
    };
  },
  computed: {
    SystemInfo() {
      return this.$store.getters['SystemStore/systems'];
    },
    systemTabItems() {
      // transform system tab data to table data
      return this.SystemInfo?.map((data) => {
        // console.log('datasystem', data.Name, index);
        return {
          Name: data.Name,
          Description: data.Description,
          Model: data.Model,
          IndicatorLED: data.IndicatorLED,
          Manufacturer: data.Manufacturer,
          PowerState: data.PowerState,
          SerialNumuber: data.SerialNumber,
          PartNumuber: data.PartNumber,
          SystemType: data.SystemType,
          AssetTag: data.AssetTag,
          BiosVersion: data.BiosVersion,
          UUID: data.UUID,
          State: data.State,
        };
      });
    },
  },
  created() {
    this.$store.dispatch('SystemStore/getSystemsInfo');
  },
};
</script>
