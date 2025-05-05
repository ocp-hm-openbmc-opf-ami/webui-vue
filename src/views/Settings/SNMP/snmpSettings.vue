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
      <b-row>
        <b-col class="text-right">
          <b-button
            variant="primary"
            class="mr-2"
            data-test-id="alertDestination-button-sendTestTrap"
            @click="sendTestTrap"
          >
            {{ $t('pageSnmp.sendTestTrap') }}
          </b-button>
          <b-button
            variant="primary"
            data-test-id="snmp-button-addSubscrition"
            @click="initModalSNMP(null)"
          >
            <icon-add />
            {{ $t('pageSnmp.addSubscrition') }}
          </b-button>
        </b-col>
      </b-row>
      <!-- Tabs with card integration -->
      <b-card no-body>
        <b-tabs
          v-model="tabIndex"
          active-nav-item-class="font-weight-bold"
          card
          content-class="mt-3"
        >
          <b-tab :title="$t('pageSnmp.snmpSubscription')">
            <snmpSubscription
              :init-modal-s-n-m-p="initModalSNMP"
            ></snmpSubscription>
          </b-tab>
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
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import ModalSnmp from './ModalSnmp.vue';
import LicensecheckMixin from '@/components/Mixins/LicensecheckMixin';

import BVToastMixin from '@/components/Mixins/BVToastMixin';
import snmpSubscription from './snmpSubscription.vue';
import snmpCommunityString from './snmpCommunityString.vue';
export default {
  name: 'SnmpSettings',
  components: {
    PageTitle,
    IconAdd,
    ModalSnmp,
    snmpSubscription,
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
  created() {
    this.startLoader();
    Promise.all([
      this.$store.dispatch('snmp/getSubscriptions'),
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
    saveSnmpTrap({ isNewTrap, SnmpTrap }) {
      this.startLoader();
      if (isNewTrap) {
        this.$store
          .dispatch('snmp/createSubscriptions', SnmpTrap)
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      } else {
        this.$store
          .dispatch('snmp/saveSnmpv3Subscriptions', SnmpTrap)
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      }
    },
    sendTestTrap() {
      this.startLoader();
      this.$store
        .dispatch('snmp/sendTestTrap')
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
