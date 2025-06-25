<template>
  <b-container fluid="xl">
    <div>
      <b-row>
        <b-col class="text-right mb-3">
          <b-button
            variant="primary"
            class="mr-2"
            data-test-id="snmp-button-addCommunityString"
            :disabled="isButtonDisable"
            @click="initModalCommunityString(null)"
          >
            <icon-add />
            {{ $t('pageSnmp.addCommunityString') }}
          </b-button>
        </b-col>
      </b-row>
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
                    @click="deleteCommunityString(item)"
                  />
                </template>
              </table-row-action>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </div>
    <modal-community-string
      :community-string-data="snmpcommunityData"
      @ok="updateCommunityData"
      @hidden="snmpcommunityData = null"
    />
  </b-container>
</template>

<script>
import TableRowAction from '@/components/Global/TableRowAction';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import ModalCommunityString from './ModalCommunityString.vue';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  name: 'SnmpSubscription',
  components: {
    TableRowAction,
    IconTrashcan,
    IconEdit,
    ModalCommunityString,
    IconAdd,
  },
  mixins: [LoadingBarMixin, BVToastMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      snmpcommunityData: null,
      fields: [
        {
          key: 'Sino',
          label: this.$t('pageSnmp.table.sino'),
        },
        {
          key: 'communityProfile',
          label: this.$t('pageSnmp.table.communityProfile'),
        },
        {
          key: 'communityString',
          label: this.$t('pageSnmp.table.communityString'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'readWritePermission',
          label: this.$t('pageSnmp.table.readWritePermission'),
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
      return this.$store.getters['snmp/snmpCommunityString'].map((log) => {
        return {
          ...log,
          actions: [
            {
              value: 'edit',
              title: this.$t('pageUserManagement.editUser'),
            },
            {
              value: 'delete',
              title: this.$tc('pageSnmp.table.delete'),
            },
          ],
        };
      });
    },
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  methods: {
    initModalCommunityString(data) {
      this.snmpcommunityData = data;
      this.$bvModal.show('modal-community-string');
    },
    updateCommunityData({ isNewString, SnmpCommunity }) {
      this.startLoader();
      if (isNewString) {
        this.$store
          .dispatch('snmp/createCommunityString', SnmpCommunity)
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      } else {
        this.$store
          .dispatch('snmp/updateCommunityString', SnmpCommunity)
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      }
    },
    deleteCommunityString(row) {
      this.startLoader();
      this.$store
        .dispatch('snmp/deleteCommunityString', row)
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    onTableRowAction(action, row) {
      switch (action) {
        case 'edit':
          console.log('edit', row);
          this.initModalCommunityString(row);
          break;
        case 'delete':
          break;
        default:
          break;
      }
    },
  },
};
</script>
