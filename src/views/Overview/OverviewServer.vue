<template>
  <overview-card
    :title="$t('pageOverview.serverInformation')"
    :to="`/hardware-status/inventory`"
  >
    <b-row class="mt-3">
      <b-col sm="6">
        <dl>
          <dt>{{ $t('pageOverview.model') }}</dt>
          <dd>{{ dataFormatter(serverModel) }}</dd>
          <dt>{{ $t('pageOverview.serialNumber') }}</dt>
          <dd>{{ dataFormatter(serverSerialNumber) }}</dd>
        </dl>
      </b-col>
      <b-col sm="6">
        <dl>
          <dt>{{ $t('pageOverview.serverManufacturer') }}</dt>
          <dd>{{ dataFormatter(serverManufacturer) }}</dd>
        </dl>
      </b-col>
    </b-row>
  </overview-card>
</template>

<script>
import OverviewCard from './OverviewCard';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import { mapGetters } from 'vuex';

export default {
  name: 'Server',
  components: {
    OverviewCard,
  },
  mixins: [DataFormatterMixin],
  computed: {
    ...mapGetters('dashboard', ['serverInfo']),
    serverModel() {
      return this.serverInfo?.model;
    },
    serverSerialNumber() {
      return this.serverInfo?.serialNumber;
    },
    serverManufacturer() {
      return this.serverInfo?.manufacturer;
    },
  },
  created() {
    this.$store.dispatch('dashboard/fetchDashboardData').finally(() => {
      this.$root.$emit('overview-server-complete');
    });
  },
};
</script>
