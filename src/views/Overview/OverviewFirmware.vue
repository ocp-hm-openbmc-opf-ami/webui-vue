<template>
  <overview-card
    :title="$t('pageOverview.firmwareInformation')"
    :to="`/operations/firmware`"
  >
    <b-row class="mt-3">
      <b-col sm="6">
        <dl>
          <dt>{{ $t('pageOverview.runningVersion') }}</dt>
          <dd>{{ dataFormatter(runningVersion) }}</dd>
          <dd v-if="runningVersion != '--'" class="mb-0">
            ({{ bmcActiveFirmwareId }})
          </dd>
          <dt>{{ $t('pageOverview.backupVersion') }}</dt>
          <dd>{{ dataFormatter(backupVersion) }}</dd>
        </dl>
      </b-col>
      <b-col sm="6">
        <dl>
          <dt>{{ $t('pageOverview.firmwareVersion') }}</dt>
          <dd>{{ dataFormatter(firmwareVersion) }}</dd>
        </dl>
      </b-col>
    </b-row>
  </overview-card>
</template>

<script>
import OverviewCard from './OverviewCard';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import { mapState } from 'vuex';

export default {
  name: 'Firmware',
  components: {
    OverviewCard,
  },
  mixins: [DataFormatterMixin],
  computed: {
    ...mapState({
      server: (state) => state.system.systems[0],
      backupBmcFirmware() {
        return this.$store.getters['firmware/backupBmcFirmware'];
      },
      backupVersion() {
        return this.backupBmcFirmware?.version;
      },
      activeBmcFirmware() {
        return this.$store.getters[`firmware/activeBmcFirmware`];
      },
      firmwareVersion() {
        return this.server?.firmwareVersion;
      },
      runningVersion() {
        return this.activeBmcFirmware?.version || '--';
      },
      bmcActiveFirmwareId() {
        return this.$t(
          this.$store.getters['firmware/getBmcActiveFirmwareId'] === 'bmc_bkup'
            ? 'pageFirmware.runningImageBootedFromBackup'
            : 'pageFirmware.runningImageBootedFromActive',
        );
      },
    }),
  },
  created() {
    Promise.all([
      this.$store.dispatch('firmware/getFirmwareInformation'),
      this.$store.dispatch('system/getSystem'),
    ]).finally(() => {
      this.$root.$emit('overview-firmware-complete');
    });
  },
};
</script>
