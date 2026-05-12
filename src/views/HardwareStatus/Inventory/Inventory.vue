<template>
  <b-container fluid="xl">
    <page-title />

    <!-- Service indicators -->
    <service-indicator />

    <!-- Quicklinks section -->
    <page-section :section-title="$t('pageInventory.quicklinkTitle')">
      <b-row class="w-75">
        <b-col v-for="column in quicklinkColumns" :key="column.id" xl="4">
          <div v-for="item in column" :key="item.id">
            <b-link
              v-if="item.id !== 'system' || isSystemInventoryEnabled"
              :href="item.href"
              :data-ref="item.dataRef"
              @click.prevent="scrollToOffset"
            >
              <jump-link /> {{ item.linkText }}
            </b-link>
          </div>
        </b-col>
      </b-row>
    </page-section>

    <!-- System table -->
    <table-system v-if="isSystemInventoryEnabled" ref="system" />

    <!-- BMC manager table -->
    <table-bmc-manager ref="bmc" />

    <!-- Chassis table -->
    <table-chassis ref="chassis" />
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import ServiceIndicator from './InventoryServiceIndicator';
import TableSystem from './InventoryTableSystem';
import TableBmcManager from './InventoryTableBmcManager';
import TableChassis from './InventoryTableChassis';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import JumpLink16 from '@carbon/icons-vue/es/jump-link/16';
import JumpLinkMixin from '@/components/Mixins/JumpLinkMixin';
import FeatureMixin from '@/components/Mixins/FeatureMixin';
import { chunk } from 'lodash';

export default {
  components: {
    PageTitle,
    ServiceIndicator,
    TableSystem,
    TableBmcManager,
    TableChassis,
    PageSection,
    JumpLink: JumpLink16,
  },
  mixins: [LoadingBarMixin, JumpLinkMixin, FeatureMixin],
  beforeRouteLeave(to, from, next) {
    // Hide loader if user navigates away from page
    // before requests complete
    this.hideLoader();
    next();
  },
  data() {
    return {
      links: [
        {
          id: 'system',
          dataRef: 'system',
          href: '#system',
          linkText: this.$t('pageInventory.system'),
        },
        {
          id: 'bmc',
          dataRef: 'bmc',
          href: '#bmc',
          linkText: this.$t('pageInventory.bmcManager'),
        },
        {
          id: 'chassis',
          dataRef: 'chassis',
          href: '#chassis',
          linkText: this.$t('pageInventory.chassis'),
        },
      ],
    };
  },
  computed: {
    quicklinkColumns() {
      // Chunk links array to 3 array's to display 3 items per column
      return chunk(this.links, 3);
    },
    isSystemInventoryEnabled() {
      return (
        process.env.VUE_APP_ONETREE_RTP_ENABLED === 'true' &&
        !this.isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')
      );
    },
  },
  created() {
    this.startLoader();
    const bmcManagerTablePromise = new Promise((resolve) => {
      this.$root.$on('hardware-status-bmc-manager-complete', () => resolve());
    });
    const chassisTablePromise = new Promise((resolve) => {
      this.$root.$on('hardware-status-chassis-complete', () => resolve());
    });
    const serviceIndicatorPromise = new Promise((resolve) => {
      this.$root.$on('hardware-status-service-complete', () => resolve());
    });
    let systemTablePromise = Promise.resolve();
    if (this.isSystemInventoryEnabled) {
      systemTablePromise = new Promise((resolve) => {
        this.$root.$on('hardware-status-system-complete', () => resolve());
      });
    }
    // Combine all child component Promises to indicate
    // when page data load complete
    Promise.all([
      bmcManagerTablePromise,
      chassisTablePromise,
      serviceIndicatorPromise,
      systemTablePromise,
    ]).finally(() => this.endLoader());
  },
};
</script>
