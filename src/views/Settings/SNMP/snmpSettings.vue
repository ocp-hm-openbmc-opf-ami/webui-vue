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
        <b-col xl="9" class="text-right">
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
            data-test-id="userManagement-button-addUser"
            @click="initModalSNMP(null)"
          >
            <icon-add />
            {{ $t('pageSnmp.addSubscrition') }}
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col xl="9">
          <b-table
            id="table-AutonomousCrashDump"
            ref="table"
            responsive="md"
            no-select-on-click
            hover
            show-empty
            :busy="isBusy"
            :fields="fields"
            :items="allConnections"
            :empty-text="$t('global.table.emptyMessage')"
            @row-selected="onRowSelected($event, allConnections.length)"
          >
            <template #cell(actions)="{ item }">
              <table-row-action
                v-for="(action, index) in item.actions"
                :key="index"
                :value="action.value"
                :enabled="action.enabled"
                :title="action.title"
                @click-table-action="onTableRowAction($event, item)"
              >
                <template #icon>
                  <icon-edit
                    v-if="action.value === 'edit'"
                    :data-test-id="`snmp-tableRowAction-edit-${index}`"
                  />
                  <icon-trashcan
                    v-if="action.value === 'delete'"
                    :data-test-id="`snmp-tableRowAction-delete-${index}`"
                    @click="deleteSnmp(item)"
                  />
                </template>
              </table-row-action>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </div>
    <!-- Modals -->
    <modal-snmp :snmp="snmpData" @ok="saveSnmpTrap" @hidden="snmpData = null" />
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import ModalSnmp from './ModalSnmp.vue';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LicensecheckMixin from '@/components/Mixins/LicensecheckMixin';

export default {
  name: 'SnmpSettings',
  components: {
    PageTitle,
    IconAdd,
    TableRowAction,
    IconTrashcan,
    IconEdit,
    ModalSnmp,
  },
  mixins: [LoadingBarMixin, BVToastMixin, LicensecheckMixin],
  data() {
    return {
      isBusy: true,
      snmpData: null,
      fields: [
        {
          key: 'Sino',
          label: this.$t('pageSnmp.table.sino'),
        },
        {
          key: 'destination',
          label: this.$t('pageSnmp.table.destination'),
        },
        {
          key: 'subscriptionType',
          label: this.$t('pageSnmp.table.subscriptionType'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'protocol',
          label: this.$t('pageSnmp.table.protocol'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'authenticationProtocol',
          label: this.$t('pageSnmp.table.authenticationProtocol'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'encryption',
          label: this.$t('pageSnmp.table.encryption'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'bmcUser',
          label: this.$t('pageSnmp.table.bmcUser'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'readOnlyPermission',
          label: this.$t('pageSnmp.table.readOnlyPermission'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
      licenseName: 'SNMP',
    };
  },
  computed: {
    allConnections() {
      return this.$store.getters['snmp/allSubscriptions'].map((log) => {
        return {
          ...log,
          actions:
            log.protocol === 'SNMPv3'
              ? [
                  {
                    value: 'edit',
                    title: this.$t('pageUserManagement.editUser'),
                  },
                  {
                    value: 'delete',
                    title: this.$tc('pageSnmp.table.delete'),
                  },
                ]
              : [
                  {
                    value: 'delete',
                    title: this.$tc('pageSnmp.table.delete'),
                  },
                ],
        };
      });
    },
  },
  created() {
    this.startLoader();
    Promise.all([
      this.$store.dispatch('snmp/getSubscriptions'),
      this.$store.dispatch('snmp/getBmcUsers'),
    ]).finally(() => {
      this.endLoader();
      this.isBusy = false;
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
    onTableRowAction(action, row) {
      switch (action) {
        case 'edit':
          this.initModalSNMP(row);
          break;
        case 'delete':
          break;
        default:
          break;
      }
    },
    deleteSnmp(row) {
      this.startLoader();
      this.$store
        .dispatch('snmp/deleteSNMPTrap', row.Id)
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
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
