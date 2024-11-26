<template>
  <b-container fluid="xl">
    <div class="form-background p-8">
      <b-row class="align-items-end">
        <b-col xl="4">
          <search
            :placeholder="$t('pageEventLogs.table.searchLogs')"
            data-test-id="eventLogs-input-searchLogs"
            @change-search="onChangeSearchInput"
            @clear-search="onClearSearchInput"
          />
        </b-col>
        <b-col xl="2">
          <table-cell-count
            :filtered-items-count="filteredRows"
            :total-number-of-cells="allNmPolicies.length"
          ></table-cell-count>
        </b-col>
        <b-col xl="6" class="text-right">
          <b-button
            variant="primary"
            class="mb-2"
            data-test-id="alertDestination-button-sendTestTrap"
            @click="initModalNewPolicy(null)"
          >
            {{ $t('pageNodeManager.createNewPolicy') }}
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table
            id="nm_configuration"
            ref="table"
            responsive="md"
            no-select-on-click
            hover
            show-empty
            :fields="fields"
            :items="allNmPolicies"
            :per-page="perPage"
            :current-page="currentPage"
            :filter="searchFilter"
            :empty-text="$t('global.table.emptyMessage')"
            @filtered="onFiltered"
            @row-selected="onRowSelected($event, allNmPolicies.length)"
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
                    @click="deletePolicy(item)"
                  />
                </template>
              </table-row-action>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <!-- Table pagination -->
      <b-row>
        <b-col sm="6">
          <b-form-group
            class="table-pagination-select"
            :label="$t('global.table.itemsPerPage')"
            label-for="pagination-items-per-page"
          >
            <b-form-select
              id="pagination-items-per-page"
              v-model="perPage"
              :options="itemsPerPageOptions"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-pagination
            v-model="currentPage"
            first-number
            last-number
            :per-page="perPage"
            :total-rows="getTotalRowCount(filteredRows)"
            aria-controls="table-event-logs"
          />
        </b-col>
      </b-row>
    </div>
    <modal-new-policy
      :policies="nmPolicies"
      @ok="saveNmPolicy"
      @hidden="nmPolicies = null"
    ></modal-new-policy>
  </b-container>
</template>
<script>
import ModalNewPolicy from './ModalNewPolicy.vue';
import TableRowAction from '@/components/Global/TableRowAction';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import TableFilterMixin from '@/components/Mixins/TableFilterMixin';
import BVPaginationMixin, {
  currentPage,
  perPage,
} from '@/components/Mixins/BVPaginationMixin';
import TableCellCount from '@/components/Global/TableCellCount';
import SearchFilterMixin, {
  searchFilter,
} from '@/components/Mixins/SearchFilterMixin';
import Search from '@/components/Global/Search';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
export default {
  name: 'NMConfiguration',
  components: {
    ModalNewPolicy,
    TableRowAction,
    IconTrashcan,
    IconEdit,
    TableCellCount,
    Search,
  },
  mixins: [
    BVPaginationMixin,
    TableFilterMixin,
    SearchFilterMixin,
    BVToastMixin,
    LoadingBarMixin,
  ],
  data() {
    return {
      fields: [
        {
          key: 'policyId',
          label: this.$t('pageNodeManager.table.policyId'),
        },
        {
          key: 'domain',
          label: this.$t('pageNodeManager.table.domain'),
        },
        {
          key: 'policyLimit',
          label: this.$t('pageNodeManager.table.policyLimit'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'policyCorrectionTime',
          label: this.$t('pageNodeManager.table.policyCorrectionTime'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'triggerLimit',
          label: this.$t('pageNodeManager.table.triggerLimit'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'triggerType',
          label: this.$t('pageNodeManager.table.triggerType'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'statisticsReportingPeriod',
          label: this.$t('pageNodeManager.table.statisticsReportingPeriod'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'state',
          label: this.$t('pageNodeManager.table.state'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'actions',
          label: this.$t('pageNodeManager.table.action'),
          tdClass: 'text-right text-nowrap',
        },
      ],
      nmPolicies: null,
      currentPage: currentPage,
      perPage: perPage,
      searchTotalFilteredRows: 0,
      searchFilter: searchFilter,
    };
  },
  computed: {
    allNmPolicies() {
      return this.$store.getters['nmConfiguration/nodeManagerPolicies'].map(
        (log) => {
          return {
            ...log,
            actions: [
              {
                value: 'edit',
                enabled:
                  log.domain === 'CPUPerformance' ? false : !log.defaultPolicy,
                title: this.$t('pageNodeManager.table.edit'),
              },
              {
                value: 'delete',
                enabled:
                  log.domain === 'CPUPerformance' ? false : !log.defaultPolicy,
                title: this.$tc('pageNodeManager.table.delete'),
              },
            ],
          };
        },
      );
    },
    filteredRows() {
      return this.searchFilter
        ? this.searchTotalFilteredRows
        : this.allNmPolicies.length;
    },
  },
  methods: {
    initModalNewPolicy(policies) {
      this.nmPolicies = policies;
      this.$bvModal.show('modal-new-policy');
    },
    onTableRowAction(action, row) {
      switch (action) {
        case 'edit':
          this.initModalNewPolicy(row);
          break;
        case 'delete':
          break;
        default:
          break;
      }
    },
    onFiltered(filteredItems) {
      this.searchTotalFilteredRows = filteredItems.length;
    },
    onChangeSearchInput(event) {
      this.searchFilter = event;
    },
    saveNmPolicy({ isNewPolicy, newPolicyData }) {
      if (isNewPolicy) {
        this.startLoader();
        this.$store
          .dispatch('nmConfiguration/createNewPolicy', newPolicyData)
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      } else {
        this.startLoader();
        this.$store
          .dispatch('nmConfiguration/updatePolicies', newPolicyData)
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      }
    },
    deletePolicy(row) {
      this.startLoader();
      this.$store
        .dispatch('nmConfiguration/deletePolicy', row.policyId)
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
