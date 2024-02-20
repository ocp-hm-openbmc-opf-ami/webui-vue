<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col xl="9" class="text-right">
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
                  :data-test-id="`userManagement-tableRowAction-edit-${index}`"
                />
                <icon-trashcan
                  v-if="action.value === 'delete'"
                  :data-test-id="`userManagement-tableRowAction-delete-${index}`"
                  @click="deleteSnmp(item)"
                />
              </template>
            </table-row-action>
          </template>
        </b-table>
      </b-col>
    </b-row>
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
  mixins: [LoadingBarMixin, BVToastMixin],
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
          key: 'actions',
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
    };
  },
  computed: {
    allConnections() {
      return this.$store.getters['snmp/allSubscriptions'].map((log) => {
        return {
          ...log,
          actions: [
            // {
            //   value: 'edit',
            //   title: this.$t('pageUserManagement.editUser'),
            // },
            {
              value: 'delete',
              title: this.$tc('pageUserManagement.deleteUser'),
            },
          ],
        };
      });
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('snmp/getSubscriptions').finally(() => {
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
      console.log(row.Id);
      this.$store
        .dispatch('snmp/deleteSNMPTrap', row.Id)
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
