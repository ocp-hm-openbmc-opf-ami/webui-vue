<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="align-items-end">
      <b-col xl="4">
        <search
          :placeholder="$t('pageSessions.table.searchSessions')"
          data-test-id="sessions-input-searchSessions"
          @change-search="onChangeSearchInput"
          @clear-search="onClearSearchInput"
        />
      </b-col>
      <b-col xl="2">
        <table-cell-count
          :filtered-items-count="filteredRows"
          :total-number-of-cells="items.length"
        ></table-cell-count>
      </b-col>
      <b-col xl="6">
        <div class="text-right mb10">
          <b-button
            variant="primary"
            :disabled="items.length <= 0"
            class="mr10"
            @click="initFlushAllModal()"
          >
            {{ $t('pageFireWall.firewallSettings.flushAll') }}
          </b-button>
          <b-button
            variant="primary"
            :disabled="items.length >= 64"
            @click="initFireWallModal()"
          >
            <icon-add />
            {{ $t('pageFireWall.firewallSettings.addNewRule') }}
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="12">
        <b-table
          responsive="md"
          hover
          :fields="fields"
          :items="items"
          :empty-text="$t('global.table.emptyMessage')"
          :filter="searchFilter"
          :per-page="perPage"
          :current-page="currentPage"
          show-empty
          @filtered="onFiltered"
        >
          <template #cell(actions)="{ item }">
            <table-row-action
              v-for="(action, actionIndex) in item.actions"
              :key="actionIndex"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              @click-table-action="onTableRowAction(item)"
            >
              <template #icon>
                <icon-trashcan />
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
          aria-controls="table-session-logs"
        />
      </b-col>
    </b-row>
    <modal-add-firewall-rules
      :modal-success="isModalSuccess"
      @addNewRulesOk="onModalAddNewRulesOk"
      @closeAddModal="iscloseAddModal"
    />
    <modal-flash-all-firewall @flushaAllOk="onModalFlushAllOk" />
  </b-container>
</template>
<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import TableRowAction from '@/components/Global/TableRowAction';
import PageTitle from '@/components/Global/PageTitle';
import ModalAddFirewallRules from './ModalAddFirewallRules.vue';
import ModalFlashAllFirewall from './ModalFlashAllFirewall.vue';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import Search from '@/components/Global/Search';
import TableCellCount from '@/components/Global/TableCellCount';
import SearchFilterMixin, {
  searchFilter,
} from '@/components/Mixins/SearchFilterMixin';
import BVPaginationMixin, {
  currentPage,
  perPage,
  itemsPerPageOptions,
} from '@/components/Mixins/BVPaginationMixin';
import { mapState } from 'vuex';

export default {
  components: {
    IconAdd,
    IconTrashcan,
    ModalAddFirewallRules,
    TableRowAction,
    PageTitle,
    ModalFlashAllFirewall,
    Search,
    TableCellCount,
  },
  mixins: [LoadingBarMixin, BVToastMixin, SearchFilterMixin, BVPaginationMixin],
  data() {
    return {
      fields: [
        {
          key: 'StartSourceIPAddress',
          label: 'Start IP',
          class: 'text-center',
        },
        {
          key: 'EndSourceIPAddress',
          label: 'End IP',
          class: 'text-center',
        },
        {
          key: 'StartPort',
          label: 'Start Port',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'EndPort',
          label: 'End Port',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'SourceMACAddress',
          label: 'MAC Address',
          class: 'text-center',
        },
        {
          key: 'Protocol',
          label: 'Protocol',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'StartTime',
          label: 'Start Duration',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'EndTime',
          label: 'End Duration',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'PreLoad',
          label: 'PreLoad',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'Target',
          label: 'Target',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'NetworkType',
          label: 'Network Type',
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'actions',
          label: '',
          class: 'text-center',
        },
      ],
      FirewallRules: [],
      items: [],
      loading,
      currentPage: currentPage,
      itemsPerPageOptions: itemsPerPageOptions,
      perPage: perPage,
      searchTotalFilteredRows: 0,
      searchFilter: searchFilter,
      isModalSuccess: false,
    };
  },
  computed: {
    ...mapState('fireWall', ['FireWallData']),
    filteredRows() {
      return this.searchFilter
        ? this.searchTotalFilteredRows
        : this.items.length;
    },
  },
  watch: {
    FireWallData() {
      this.firewallruleslist();
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('fireWall/getFireWallData').finally(() => {
      this.endLoader();
    });
  },
  methods: {
    initFireWallModal() {
      this.$bvModal.show('modal-add-firewall');
    },
    initFlushAllModal() {
      this.$bvModal.show('modal-flashall-firewall');
    },
    onTableRowAction(rowItem) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageFireWall.firewallSettings.modal.deleteConfirmMessage'),
          {
            title: this.$tc(
              'pageFireWall.firewallSettings.modal.deleteFireWall'
            ),
            okTitle: this.$tc(
              'pageFireWall.firewallSettings.modal.deleteFireWall'
            ),
            cancelTitle: this.$t('global.action.cancel'),
          }
        )
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.startLoader();
            let deleteRowVal = {};
            if (rowItem.StartSourceIPAddress != '-') {
              deleteRowVal.StartSourceIPAddress =
                rowItem.StartSourceIPAddress != '-'
                  ? rowItem.StartSourceIPAddress
                  : '';
            }
            if (rowItem.EndSourceIPAddress != '-') {
              deleteRowVal.EndSourceIPAddress =
                rowItem.EndSourceIPAddress != '-'
                  ? rowItem.EndSourceIPAddress
                  : '';
            }
            if (rowItem.Target != '-') {
              deleteRowVal.Target = rowItem.target != '-' ? rowItem.Target : '';
            }
            if (rowItem.Protocol != '-') {
              deleteRowVal.Protocol =
                rowItem.Protocol != '-' ? rowItem.Protocol : '';
            }
            if (rowItem.StartPort != '-') {
              deleteRowVal.StartPort =
                rowItem.StartPort != '-' ? rowItem.StartPort : '';
            }
            if (rowItem.SourceMACAddress != '-') {
              deleteRowVal.SourceMACAddress =
                rowItem.SourceMACAddress != '-' ? rowItem.SourceMACAddress : '';
            }
            if (rowItem.EndPort != '-') {
              deleteRowVal.EndPort =
                rowItem.EndPort != '-' ? rowItem.EndPort : '';
            }
            if (rowItem.StartTime != '-') {
              deleteRowVal.StartTime =
                rowItem.StartTime != '-'
                  ? rowItem.StartTime.replace(' ', 'T')
                  : '';
            }
            if (rowItem.EndTime != '-') {
              deleteRowVal.EndTime =
                rowItem.EndTime != '-' ? rowItem.EndTime.replace(' ', 'T') : '';
            }
            if (rowItem.Control != '-') {
              deleteRowVal.Control =
                rowItem.Control != '-' ? rowItem.Control : '';
            }
            if (rowItem.PreLoad != '-') {
              deleteRowVal.PreLoad =
                rowItem.PreLoad != '-' ? rowItem.PreLoad : '';
            }
            let deleteval = {};
            Object.assign(deleteval, deleteRowVal);
            this.$store
              .dispatch('fireWall/deleteFireWallRules', deleteval)
              .then((success) => this.successToast(success))
              .catch(({ message }) => this.errorToast(message))
              .finally(() => this.endLoader());
          }
        });
    },
    onModalAddNewRulesOk(addnewrules) {
      this.startLoader();
      this.$store
        .dispatch('fireWall/setFireWallData', addnewrules)
        .then((success) => {
          this.successToast(success);
          this.isModalSuccess = true;
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    onModalFlushAllOk(flushAllval) {
      this.startLoader();
      this.$store
        .dispatch('fireWall/deleteFlushAll', flushAllval)
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    firewallruleslist() {
      this.FirewallRules = this.$store.getters['fireWall/getFireWallAllData'];
      this.items = [];
      this.FirewallRules.data.FirewallRules.IPv4Rules.forEach((val) => {
        for (let key of Object.keys(val)) {
          if (val[key] === '') {
            val[key] = '-';
          }
        }
        if (val.StartPort == undefined || val.EndPort == undefined) {
          val.StartPort = '-';
          val.EndPort = '-';
        }
        val.EndTime = val.EndTime.replace(/T/g, ' ');
        val.StartTime = val.StartTime.replace(/T/g, ' ');
        val.NetworkType = 'IPv4';
        val.actions = [
          {
            value: this.$t('global.action.delete'),
            title: this.$t('global.action.delete'),
            enabled: true,
          },
        ];
        this.items.push(val);
      });
      this.FirewallRules.data.FirewallRules.IPv6Rules.forEach((val) => {
        for (let key of Object.keys(val)) {
          if (val[key] === '') {
            val[key] = '-';
          }
        }
        if (val.StartPort == undefined || val.EndPort == undefined) {
          val.StartPort = '-';
          val.EndPort = '-';
        }
        val.EndTime = val.EndTime.replace(/T/g, ' ');
        val.StartTime = val.StartTime.replace(/T/g, ' ');
        val.NetworkType = 'IPv6';
        val.actions = [
          {
            value: this.$t('global.action.delete'),
            title: this.$t('global.action.delete'),
            enabled: true,
          },
        ];
        this.items.push(val);
      });
    },
    onChangeSearchInput(event) {
      this.searchFilter = event;
    },
    onFiltered(filteredItems) {
      this.searchTotalFilteredRows = filteredItems.length;
    },
    iscloseAddModal(val) {
      this.isModalSuccess = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.mb10 {
  margin: 0 0 10px 0;
}
.mr10 {
  margin: 0 10px 0 0;
}
@media (max-width: 300px) {
  .mb10 {
    margin: 0 0 10px 0 !important;
  }
  .mr10 {
    margin: 0 0 10px 0 !important;
  }
}
</style>
