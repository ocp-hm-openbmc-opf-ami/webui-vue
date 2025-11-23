<template>
  <b-container fluid="xl">
    <page-title />
    <div v-if="isKvmDisabled">
      <b-alert show variant="warning">{{
        $t('pageKvm.kvmAccessRestricted')
      }}</b-alert>
    </div>
    <div v-if="!LicenseState(licenseName)">
      <b-alert show variant="warning"
        >{{ $t('license.licenseExpired') }}
        <a href="#/settings/license">{{
          $t('license.licensePageLink')
        }}</a></b-alert
      >
    </div>
    <div v-else>
      <div v-if="!kvmServiceEnabledAccess">
        <b-alert show variant="warning">{{
          $t('pageKvm.disabledKVMService')
        }}</b-alert>
      </div>
      <div v-else-if="!isKvmDisabled" class="terminal-container">
        <kvm-console :is-full-window="true" />
      </div>
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import KvmConsole from './KvmConsole';
import { mapState } from 'vuex';
import { privilegesId } from '@/store/modules/GlobalStore';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LicensecheckMixin from '@/components/Mixins/LicensecheckMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import { mapGetters } from 'vuex';

export default {
  name: 'Kvm',
  components: { PageTitle, KvmConsole },
  mixins: [LicensecheckMixin, LoadingBarMixin, BVToastMixin],
  data() {
    return {
      loading,
      licenseName: 'KVM',
    };
  },
  computed: {
    ...mapState('global', ['kvmServiceEnabledAccess']),
    ...mapGetters('global', ['userPrivilege']),
    isKvmDisabled() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('global/getSystemInfo');
    this.$store.dispatch('kvm/getData').finally(() => this.endLoader());
  },
};
</script>

<style scoped>
.terminal-container {
  width: 100%;
}
</style>
