<template>
  <div>
    <b-table
      responsive="md"
      hover
      sticky-header
      :fields="powercontrolFields"
      head-variant="light"
    ></b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      powercontrolFields: [
        {
          key: 'Name',
          label: this.$t('pageSystemInventory.Power.Name'),
        },
        {
          key: 'AverageConsumedWatts',
          label: this.$t('pageSystemInventory.Power.AverageConsumedWatts'),
        },
        {
          key: 'MaxConsumedWatts',
          label: this.$t('pageSystemInventory.Power.MaxConsumedWatts'),
        },
        {
          key: 'MinConsumedWatts',
          label: this.$t('pageSystemInventory.Power.MinConsumedWatts'),
        },
        {
          key: 'IntervalInMinutes',
          label: this.$t('pageSystemInventory.Power.IntervalInMinutes'),
        },
        {
          key: 'LimitInWatts',
          label: this.$t('pageSystemInventory.Power.LimitInWatts'),
        },
        {
          key: 'LimitException',
          label: this.$t('pageSystemInventory.Power.LimitException'),
        },
      ],
    };
  },
};
</script>
