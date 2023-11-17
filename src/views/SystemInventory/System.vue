<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="systemFields"
      head-variant="light"
      :items="systemTabItems()"
    />
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
          key: 'Manufacture',
          label: this.$t('pageSystemInventory.system.Manufacture'),
          class: 'text-center',
        },
        {
          key: 'PowerState',
          label: this.$t('pageSystemInventory.system.PowerState'),
          class: 'text-center',
        },
        {
          key: 'SerialNmuber',
          label: this.$t('pageSystemInventory.system.SerialNmuber'),
          class: 'text-center',
        },
        {
          key: 'PartNmuber',
          label: this.$t('pageSystemInventory.system.PartNmuber'),
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
          key: 'state',
          label: this.$t('pageSystemInventory.system.state'),
          class: 'text-center',
        },
      ],
    };
  },
  computed: {
    SystemInfo() {
      return this.$store.getters['SystemInventoryStore/getSystemsInfo'];
    },
  },
  created() {
    this.$store.dispatch('SystemInventoryStore/getSystemsInfo');
    console.log(
      this.$store.getters['SystemInventoryStore/systems'],
      'systemTabItems'
    );
  },
  methods: {
    systemTabItems() {
      console.log(
        this.$store.getters['SystemInventoryStore/systems'],
        'systemTabItems'
      );
    },
  },
  // systemTabItems() {
  //   // transform system tab data to table data
  //   return this.SystemInfo;
  //   // return {
  //   //   Name: data[index].Name,
  //   //   Description: data[index].Description,
  //   //   Model: data[index].Model,
  //   //   IndicatorLED: data[index].IndicatorLED,
  //   //   Manufacture: data[index].Manufacture,
  //   //   PowerState: data[index].PowerState,
  //   //   SerialNmuber: data[index].SerialNmuber,
  //   //   PartNmuber: data[index].PartNmuber,
  //   //   SystemType: data[index].SystemType,
  //   //   AssetTag: data[index].AssetTag,
  //   //   BiosVersion: data[index].BiosVersion,
  //   //   UUID: data[index].UUID,
  //   //   state: data[index].state,
  //   // };
  //   // });
  // },
};
</script>
