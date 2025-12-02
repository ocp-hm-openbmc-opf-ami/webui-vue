<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="align-items-end">
      <b-col xl="4">
        <search
          :placeholder="$t('pageFireWall.table.searchFirewallRule')"
          data-test-id="sessions-input-searchSessions"
          @change-search="onChangeSearchInput"
          @clear-search="onClearSearchInput"
        />
      </b-col>
      <b-col xl="2">
        <table-cell-count
          :filtered-items-count="filteredRows"
          :total-number-of-cells="totalNumberCells"
        ></table-cell-count>
      </b-col>
      <b-col xl="6">
        <div class="text-right mb10">
          <b-button
            variant="primary"
            class="mr10"
            :disabled="
              activeTabValue === 'Ipv4'
                ? itemsIpv4.length <= 1
                : itemsIpv6.length <= 1
            "
            data-test-id="firewall-input-reorderRules"
            @click="initReorderRules()"
          >
            <icon-save />
            {{ $t('pageFireWall.firewallSettings.reorderRules') }}
          </b-button>
          <b-button
            variant="primary"
            :disabled="itemsIpv4.length <= 0 && itemsIpv6.length <= 0"
            class="mr10"
            data-test-id="firewall-input-flushAll"
            @click="initFlushAllModal()"
          >
            <icon-trashcan />
            {{ $t('pageFireWall.firewallSettings.flushAll') }}
          </b-button>
          <b-button
            variant="primary"
            :disabled="itemsIpv4.length >= 128 || isButtonDisable"
            data-test-id="firewall-input-addNewRule"
            @click="initFireWallModal()"
          >
            <icon-add />
            {{ $t('pageFireWall.firewallSettings.addNewRule') }}
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-card no-body>
      <b-tabs
        active-nav-item-class="font-weight-bold"
        card
        content-class="xl-12"
      >
        <b-tab
          :title="$t('pageFireWall.table.ipv4')"
          @click="activeTab('Ipv4')"
        >
          <draggable-paginated-table
            :fields="fields"
            :items="filteredItemsIpv4"
            :current-page.sync="currentPageIpv4"
            :per-page.sync="perPageIpv4"
            :limit="limit"
            :items-per-page-options="itemsPerPageOptions"
            :total-rows="filteredItemsIpv4.length"
            :drag-options="dragOptions"
            :empty-message="$t('global.table.emptyMessage')"
            :items-per-page-label="$t('global.table.itemsPerPage')"
            ipversion="IPv4"
            data-test-id="firewall-input-reorderDraggable"
            @drag-end="onDragEnd"
            @table-row-action="onTableRowAction"
          />
        </b-tab>
        <b-tab
          :title="$t('pageFireWall.table.ipv6')"
          @click="activeTab('Ipv6')"
        >
          <draggable-paginated-table
            :fields="fields"
            :items="filteredItemsIpv6"
            :current-page.sync="currentPageIpv6"
            :per-page.sync="perPageIpv6"
            :limit="limit"
            :items-per-page-options="itemsPerPageOptions"
            :total-rows="filteredItemsIpv6.length"
            :drag-options="dragOptions"
            :empty-message="$t('global.table.emptyMessage')"
            :items-per-page-label="$t('global.table.itemsPerPage')"
            ipversion="IPv6"
            @drag-end="onDragEnd"
            @table-row-action="onTableRowAction"
          />
        </b-tab>
      </b-tabs>
    </b-card>

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
import IconSave from '@carbon/icons-vue/es/save/20';
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
  limit,
} from '@/components/Mixins/BVPaginationMixin';
import { mapState } from 'vuex';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
import DraggablePaginatedTable from '@/components/Global/DraggablePaginatedTable.vue';
import _ from 'lodash';

export default {
  components: {
    IconAdd,
    IconTrashcan,
    IconSave,
    ModalAddFirewallRules,
    PageTitle,
    ModalFlashAllFirewall,
    Search,
    TableCellCount,
    DraggablePaginatedTable,
  },
  mixins: [LoadingBarMixin, BVToastMixin, SearchFilterMixin, BVPaginationMixin],
  data() {
    return {
      fields: [
        {
          key: 'StartSourceIPAddress',
          label: this.$t('pageFireWall.table.startIP'),
          class: 'text-center',
        },
        {
          key: 'EndSourceIPAddress',
          label: this.$t('pageFireWall.table.endIP'),
          class: 'text-center',
        },
        {
          key: 'StartPort',
          label: this.$t('pageFireWall.table.startPort'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'EndPort',
          label: this.$t('pageFireWall.table.endPort'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'SourceMACAddress',
          label: this.$t('pageFireWall.table.macAddress'),
          class: 'text-center',
        },
        {
          key: 'Protocol',
          label: this.$t('pageFireWall.table.protocol'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'StartTime',
          label: this.$t('pageFireWall.table.startDuration'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'EndTime',
          label: this.$t('pageFireWall.table.endDuration'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'PreLoad',
          label: this.$t('pageFireWall.table.preLoad'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'Target',
          label: this.$t('pageFireWall.table.target'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'IPVersion',
          label: this.$t('pageFireWall.firewallSettings.modal.ipVersion'),
          sortable: true,
          class: 'text-center',
        },
      ],
      FirewallRules: [],
      itemsIpv4: [],
      itemsIpv6: [],
      loading,
      // Separate pagination for IPv4 and IPv6
      currentPageIpv4: 1,
      perPageIpv4: 10,
      currentPageIpv6: 1,
      perPageIpv6: 10,
      limit: limit,
      searchTotalFilteredRows: 0,
      searchTotalIPv6FilteredRows: 0,
      searchFilter: searchFilter,
      isModalSuccess: false,
      filteredItemsIpv4: [],
      filteredItemsIpv6: [],
      activeTabValue: 'Ipv4',
    };
  },
  computed: {
    ...mapState('fireWall', ['FireWallData']),
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege === privilegesId.readOnly;
    },
    filteredRows() {
      if (this.activeTabValue === 'Ipv6') {
        return this.searchFilter
          ? this.searchTotalIPv6FilteredRows
          : this.itemsIpv6.length;
      } else {
        return this.searchFilter
          ? this.searchTotalFilteredRows
          : this.itemsIpv4.length;
      }
    },
    totalNumberCells() {
      if (this.activeTabValue === 'Ipv6') {
        return this.itemsIpv6.length;
      } else {
        return this.itemsIpv4.length;
      }
    },
    dragOptions() {
      return {
        animation: 200,
        ghostClass: 'ghost',
        chosenClass: 'chosen',
        dragClass: 'drag',
      };
    },
  },
  watch: {
    FireWallData() {
      this.firewallruleslist();
    },
    searchFilter(newVal) {
      this.updateFilteredItemsIpv4(newVal);
      this.updateFilteredItemsIpv6(newVal);
    },
    // Add a watcher for items to update filteredItems when items change
    itemsIpv4: {
      immediate: true,
      handler() {
        this.updateFilteredItemsIpv4(this.searchFilter);
      },
    },
    itemsIpv6: {
      immediate: true,
      handler() {
        this.updateFilteredItemsIpv6(this.searchFilter);
      },
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('fireWall/getFireWallData').finally(() => {
      this.endLoader();
      this.activeTab('Ipv4');
    });
  },
  methods: {
    getDraggableProps() {
      return {
        attrs: {
          class: this.$refs.firewallTable
            ? this.$refs.firewallTable.tbodyClass
            : '',
        },
      };
    },
    onDragEnd(evt) {
      // Determine which table triggered the event by checking evt.from.dataset.ipversion
      const ipVersion = evt.from.dataset.ipversion;
      let arr, page, perPage;
      if (ipVersion === 'IPv6') {
        arr = [...this.itemsIpv6];
        page = this.currentPageIpv6;
        perPage = this.perPageIpv6;
      } else {
        arr = [...this.itemsIpv4];
        page = this.currentPageIpv4;
        perPage = this.perPageIpv4;
      }
      if (evt.newIndex !== evt.oldIndex) {
        const startIndex = (page - 1) * perPage;
        const actualOldIndex = startIndex + evt.oldIndex;
        const actualNewIndex = startIndex + evt.newIndex;
        const movedItem = arr.splice(actualOldIndex, 1)[0];
        arr.splice(actualNewIndex, 0, movedItem);
        if (ipVersion === 'IPv6') {
          this.itemsIpv6 = arr;
          this.updateFilteredItemsIpv6(this.searchFilter);
        } else {
          this.itemsIpv4 = arr;
          this.updateFilteredItemsIpv4(this.searchFilter);
        }
      }
    },
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
              'pageFireWall.firewallSettings.modal.deleteFireWall',
            ),
            okTitle: this.$tc(
              'pageFireWall.firewallSettings.modal.deleteFireWall',
            ),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          },
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
            if (rowItem.IPVersion != '-') {
              deleteRowVal.IPVersion =
                rowItem.IPVersion != '-' ? rowItem.IPVersion : '';
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
      this.itemsIpv4 = [];
      this.itemsIpv6 = [];
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
        val.IPVersion = 'IPv4';
        val.actions = [
          {
            value: this.$t('global.action.delete'),
            title: this.$t('global.action.delete'),
            enabled: true,
          },
        ];
        this.itemsIpv4.push(val);
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
        val.IPVersion = 'IPv6';
        val.actions = [
          {
            value: this.$t('global.action.delete'),
            title: this.$t('global.action.delete'),
            enabled: true,
          },
        ];
        this.itemsIpv6.push(val);
      });
    },
    updateFilteredItemsIpv4(searchTerm) {
      if (!searchTerm) {
        this.filteredItemsIpv4 = [...this.itemsIpv4];
        this.searchTotalFilteredRows = this.itemsIpv4.length;
        return;
      }

      const term = searchTerm.toLowerCase();
      this.filteredItemsIpv4 = this.itemsIpv4.filter((item) => {
        return Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(term),
        );
      });

      this.searchTotalFilteredRows = this.filteredItemsIpv4.length;
      // Reset to first page when filtering
      this.currentPage = 1;
    },
    updateFilteredItemsIpv6(searchTerm) {
      if (!searchTerm) {
        this.filteredItemsIpv6 = [...this.itemsIpv6];
        return;
      }
      const term = searchTerm.toLowerCase();
      this.filteredItemsIpv6 = this.itemsIpv6.filter((item) => {
        return Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(term),
        );
      });
      this.searchTotalIPv6FilteredRows = this.filteredItemsIpv6.length;
      this.currentPageIpv6 = 1;
    },
    // Update the onChangeSearchInput method
    onChangeSearchInput(event) {
      this.searchFilter = event;
    },
    iscloseAddModal(val) {
      this.isModalSuccess = val;
    },
    initReorderRules() {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageFireWall.firewallSettings.reorderConfirmMessage'),
          {
            title: this.$tc('pageFireWall.firewallSettings.reorderRules'),
            okTitle: this.$tc('global.action.ok'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          },
        )
        .then((reorderConfirmed) => {
          if (reorderConfirmed) {
            let addReorderRules = {};
            if (this.activeTabValue === 'Ipv6' && this.itemsIpv6.length > 1) {
              addReorderRules.IPv6Rules = _.cloneDeep(this.itemsIpv6);
              addReorderRules.IPv6Rules.forEach((val) => {
                delete val.actions;
                val.EndPort === '-' ? delete val.EndPort : val.EndPort;

                val.StartPort === '-' ? delete val.StartPort : val.StartPort;

                val.SourceMACAddress === '-'
                  ? delete val.SourceMACAddress
                  : val.SourceMACAddress;

                val.EndTime === '-'
                  ? delete val.EndTime
                  : (val.EndTime = val.EndTime.replace(' ', 'T'));
                val.StartTime === '-'
                  ? delete val.StartTime
                  : (val.StartTime = val.StartTime.replace(' ', 'T'));

                val.EndSourceIPAddress === '-'
                  ? delete val.EndSourceIPAddress
                  : val.EndSourceIPAddress;

                val.StartSourceIPAddress === '-'
                  ? delete val.StartSourceIPAddress
                  : val.StartSourceIPAddress;
                val.Protocol === '-' ? delete val.Protocol : val.Protocol;
              });
            }
            if (this.activeTabValue === 'Ipv4' && this.itemsIpv4.length > 1) {
              addReorderRules.IPv4Rules = _.cloneDeep(this.itemsIpv4);
              addReorderRules.IPv4Rules.forEach((val) => {
                delete val.actions;
                val.EndPort === '-' ? delete val.EndPort : val.EndPort;
                val.StartPort === '-' ? delete val.StartPort : val.StartPort;

                val.SourceMACAddress === '-'
                  ? delete val.SourceMACAddress
                  : val.SourceMACAddress;

                val.EndTime === '-'
                  ? delete val.EndTime
                  : (val.EndTime = val.EndTime.replace(' ', 'T'));

                val.StartTime === '-'
                  ? delete val.StartTime
                  : (val.StartTime = val.StartTime.replace(' ', 'T'));

                val.EndSourceIPAddress === '-'
                  ? delete val.EndSourceIPAddress
                  : val.EndSourceIPAddress;

                val.StartSourceIPAddress === '-'
                  ? delete val.StartSourceIPAddress
                  : val.StartSourceIPAddress;
                val.Protocol === '-' ? delete val.Protocol : val.Protocol;
              });
            }
            this.startLoader();
            this.$store
              .dispatch('fireWall/setReorderRules', addReorderRules)
              .then((success) => {
                this.successToast(success);
              })
              .catch(({ message }) => this.errorToast(message))
              .finally(() => this.endLoader());
          }
        });
    },
    activeTab(val) {
      this.activeTabValue = val;
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
.table-container {
  position: relative;
}
// Style for draggable rows
.draggable-row {
  cursor: move;
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
