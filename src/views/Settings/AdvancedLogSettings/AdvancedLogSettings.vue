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
          <b-tab :title="$t('advancedLogSettings.localLog')">
            <local-log :is-button-disable="isButtonDisable"></local-log>
          </b-tab>
          <b-tab :title="$t('advancedLogSettings.remoteLog')">
            <remote-log :is-button-disable="isButtonDisable"></remote-log>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>

<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import LocalLog from './LocalLog.vue';
import RemoteLog from './RemoteLog.vue';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  name: 'AdvancedLogSettings',
  components: { PageTitle, LocalLog, RemoteLog },
  mixins: [LoadingBarMixin],
  data() {
    return { tabIndex: 0 };
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      if (this.userPrivilege !== privilegesId.admin) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('advancedLog/getAdvancedLogsSettings').finally(() => {
      this.endLoader();
    });
  },
};
</script>

<style scoped>
.pagesection_margin {
  margin-bottom: 0;
}
</style>
