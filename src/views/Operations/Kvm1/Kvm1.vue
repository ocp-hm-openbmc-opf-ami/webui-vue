<template>
  <b-container fluid="xl">
    <page-title />
    <access-denied-alert
      v-if="isKvmDisabled"
      :page-name="$t('appPageTitle.kvm1')"
    />
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
          $t('pageKvm1.disabledKVM1Service')
        }}</b-alert>
      </div>
      <div v-else-if="!isKvmDisabled" class="terminal-container">
        <kvm1-console :is-full-window="true" />
      </div>
    </div>
  </b-container>
</template>

<script>
import AccessDeniedAlert from '@/components/Global/AccessDeniedAlert';
import PageTitle from '@/components/Global/PageTitle';
import Kvm1Console from './Kvm1Console';
import { mapState } from 'vuex';
import { privilegesId } from '@/store/modules/GlobalStore';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LicensecheckMixin from '@/components/Mixins/LicensecheckMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import { mapGetters } from 'vuex';

export default {
  name: 'Kvm1',
  components: { AccessDeniedAlert, PageTitle, Kvm1Console },
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
    const dualKvmEnabeled = '/redfish/v1/Systems/system1';
    this.$store.dispatch('global/getSystemInfo', dualKvmEnabeled);
    this.$store.dispatch('kvm1/getData').finally(() => this.endLoader());
  },
};
</script>

<style scoped>
.terminal-container {
  width: 100%;
}
</style>
