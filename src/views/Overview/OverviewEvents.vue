<template>
  <overview-card
    :disabled="criticalEvents === 0 || warningEvents === 0"
    :export-button="true"
    :file-name="exportFileNameByDate()"
    :title="$t('pageOverview.eventLogs')"
    :to="`/logs/event-logs`"
    @export-all="exportAll"
  >
    <b-row class="mt-3">
      <b-col sm="6">
        <dl>
          <dt>{{ $t('pageOverview.criticalEvents') }}</dt>
          <dd class="h3">
            {{ dataFormatter(criticalEvents.length) }}
            <status-icon status="danger" />
          </dd>
        </dl>
      </b-col>
      <b-col sm="6">
        <dl>
          <dt>{{ $t('pageOverview.warningEvents') }}</dt>
          <dd class="h3">
            {{ dataFormatter(warningEvents.length) }}
            <status-icon status="warning" />
          </dd>
        </dl>
      </b-col>
    </b-row>
  </overview-card>
</template>

<script>
import OverviewCard from './OverviewCard';
import StatusIcon from '@/components/Global/StatusIcon';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import { mapGetters } from 'vuex';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  name: 'Events',
  components: { OverviewCard, StatusIcon },
  mixins: [DataFormatterMixin, LoadingBarMixin],
  data() {
    return {
      eventLogData: [],
    };
  },
  computed: {
    ...mapGetters('dashboard', ['eventLogCounts']),
    criticalEvents() {
      // Return mock array with length for display
      return new Array(this.eventLogCounts.critical);
    },
    warningEvents() {
      // Return mock array with length for display
      return new Array(this.eventLogCounts.warning);
    },
  },
  created() {
    this.$store.dispatch('dashboard/fetchDashboardData').finally(() => {
      this.$root.$emit('overview-events-complete');
    });
  },
  methods: {
    exportFileNameByDate() {
      // Create export file name based on date
      let date = new Date();
      date =
        date.toISOString().slice(0, 10) +
        '_' +
        date.toString().split(':').join('-').split(' ')[4];
      let fileName = 'all_event_logs_';
      return fileName + date;
    },
    async exportAll() {
      this.startLoader();
      // Fetch event log data from store
      await this.$store.dispatch('eventLog/getEventLogData');
      // Get the latest event log data from store
      const eventLogData = this.$store.getters['eventLog/allEvents'];
      // Download as JSON file
      const dataStr = JSON.stringify(eventLogData);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.exportFileNameByDate() + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      // Optionally update local state if needed
      this.eventLogData = eventLogData;
      this.endLoader();
    },
  },
};
</script>

<style lang="scss" scoped>
.status-icon {
  vertical-align: text-top;
}
</style>
