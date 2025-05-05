<template>
  <b-container fluid="xl">
    <div>
      <b-row>
        <b-col>
          <b-table
            id="table-snmp-subscription"
            ref="table"
            responsive="md"
            no-select-on-click
            hover
            show-empty
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
  </b-container>
</template>

<script>
import TableRowAction from '@/components/Global/TableRowAction';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import LicensecheckMixin from '@/components/Mixins/LicensecheckMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

export default {
  name: 'SnmpSubscription',
  components: {
    TableRowAction,
    IconTrashcan,
    IconEdit,
  },
  mixins: [LoadingBarMixin, LicensecheckMixin, BVToastMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
    initModalSNMP: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
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
          key: 'communityString',
          label: this.$t('pageSnmp.table.communityString'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'bmcUser',
          label: this.$t('pageSnmp.table.bmcUser'),
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
            {
              value: 'delete',
              title: this.$tc('pageSnmp.table.delete'),
            },
          ],
        };
      });
    },
  },
  methods: {
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
  },
};
</script>
