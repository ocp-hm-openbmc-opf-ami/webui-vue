<template>
  <b-container fluid="xl">
    <page-title />
    <div>
      <!-- Tabs with card integration -->
      <b-card no-body>
        <b-tabs
          v-model="tabIndex"
          active-nav-item-class="font-weight-bold"
          card
          content-class="mt-3"
        >
          <b-tab :title="$t('pageNodeManager.powerStatistics')"
            ><power-statistics></power-statistics>
          </b-tab>
          <b-tab :title="$t('pageNodeManager.nmConfiguration')"
            ><n-m-configuration></n-m-configuration>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import NMConfiguration from './NMConfiguration.vue';
import PowerStatistics from './PowerStatistics.vue';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
export default {
  name: 'NodeManager',
  components: { PageTitle, NMConfiguration, PowerStatistics },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      tabIndex: 0,
    };
  },
  created() {
    this.startLoader();
    Promise.all([
      this.$store.dispatch('nmConfiguration/getNodeManagerPolicies'),
      this.$store.dispatch('nmConfiguration/getPowerStatistics'),
    ])
      .finally(() => {
        this.endLoader();
      })
      .catch(({ message }) => this.errorToast(message));
  },
};
</script>
