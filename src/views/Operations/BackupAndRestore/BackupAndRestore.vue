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
          <b-tab :title="$t('pageBackupAndRestore.backup')">
            <backup></backup>
          </b-tab>
          <b-tab :title="$t('pageBackupAndRestore.restore')">
            <restore></restore>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
    <!-- <div class="form-background p-5">
      <b-row>
        <b-col cols="10">
          <b-form-checkbox id="asdServer" switch>
            <span> Disable </span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-col>
        <input type="file" />
      </b-row>
    </div> -->
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import backup from './Backup.vue';
import restore from './Restore.vue';
export default {
  components: {
    PageTitle,
    backup,
    restore,
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
};
</script>
