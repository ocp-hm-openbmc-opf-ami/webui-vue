<template>
  <b-container fluid="xl">
    <page-title />
    <!-- Tabs with card integration -->
    <b-card no-body>
      <b-tabs
        v-model="tabIndex"
        active-nav-item-class="font-weight-bold"
        card
        content-class="mt-3"
      >
        <b-tab :title="$t('pageBackupAndRestore.backup')">
          <backup></backup>
        </b-tab>
        <b-tab :title="$t('pageBackupAndRestore.restore')">
          <restore></restore>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import backup from './Backup.vue';
import restore from './Restore.vue';
export default {
  components: {
    PageTitle,
    backup,
    restore,
  },
  mixins: [LoadingBarMixin],
  data() {
    return {
      tabIndex: 0,
    };
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('backupAndRestore/getBackupConfig')
      .catch(({ message }) => this.errorToast(message))
      .finally(() => this.endLoader());
  },
};
</script>
