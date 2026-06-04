<template>
  <b-container fluid="xl">
    <page-title />
    <div v-if="!LicenseState(licenseName)">
      <b-alert show variant="warning"
        >{{ $t('license.licenseExpired') }}
        <a href="#/settings/license">{{
          $t('license.licensePageLink')
        }}</a></b-alert
      >
    </div>
    <div v-else>
      <!-- Tabs with card integration -->
      <b-card no-body>
        <b-tabs
          v-model="tabIndex"
          active-nav-item-class="font-weight-bold"
          card
          content-class="mt-3"
        >
          <b-tab :title="$t('pageSnmp.snmpCommunity')">
            <snmpCommunityString></snmpCommunityString>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
    <!-- Modals -->
    <modal-snmp :snmp="snmpData" @ok="saveSnmpTrap" @hidden="snmpData = null" />
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import ModalSnmp from './ModalSnmp.vue';
import LicensecheckMixin from '@/components/Mixins/LicensecheckMixin';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

import BVToastMixin from '@/components/Mixins/BVToastMixin';
import snmpCommunityString from './snmpCommunityString.vue';
export default {
  name: 'SnmpSettings',
  components: {
    PageTitle,
    ModalSnmp,
    snmpCommunityString,
  },
  mixins: [LoadingBarMixin, LicensecheckMixin, BVToastMixin],
  data() {
    return {
      tabIndex: 0,
      licenseName: 'SNMP',
      snmpData: null,
    };
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  created() {
    this.startLoader();
    Promise.all([
      this.$store.dispatch('snmp/getBmcUsers'),
      this.$store.dispatch('snmp/getSNMPProtocolStatus'),
    ]).finally(() => {
      this.endLoader();
    });
  },
  methods: {
    initModalSNMP(data) {
      this.snmpData = data;
      this.$bvModal.show('modal-snmp');
    },
  },
};
</script>
