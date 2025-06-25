<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="align-items-start">
      <b-col sm="8" xl="6" class="d-sm-flex align-items-end mb-4">
        <search
          :placeholder="$t('videoLog.table.searchLogs')"
          data-test-id="videoLog-input-searchLogs"
          @change-search="onChangeSearchInput"
          @clear-search="onClearSearchInput"
        />
        <div class="ml-sm-4">
          <table-cell-count
            :filtered-items-count="filteredRows"
            :total-number-of-cells="allLogs.length"
          ></table-cell-count>
        </div>
      </b-col>
      <!-- <b-col sm="8" md="7" xl="6">
        <table-date-filter @change="onChangeDateTimeFilter" />
      </b-col> -->
    </b-row>
    <b-row>
      <b-col>
        <table-toolbar
          ref="toolbar"
          :selected-items-count="selectedRows.length"
          @clear-selected="clearSelectedRows($refs.table)"
        >
          <template #toolbar-buttons>
            <b-button variant="primary" @click="onBatchAction">
              {{ $t('global.action.delete') }}
            </b-button>
          </template>
        </table-toolbar>
        <b-table
          id="table-video-logs"
          ref="table"
          responsive="md"
          selectable
          no-select-on-click
          sort-icon-left
          hover
          no-sort-reset
          show-empty
          :fields="fields"
          :items="filteredLogs"
          :empty-text="$t('global.table.emptyMessage')"
          :empty-filtered-text="$t('global.table.emptySearchMessage')"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="searchFilter"
          :busy="isBusy"
          @filtered="onFiltered"
          @row-selected="onRowSelected($event, filteredLogs.length)"
        >
          <!-- Checkbox column -->
          <template #head(checkbox)>
            <b-form-checkbox
              v-model="tableHeaderCheckboxModel"
              data-test-id="videoLog-checkbox-selectAll"
              :disabled="isButtonDisable"
              :indeterminate="tableHeaderCheckboxIndeterminate"
              @change="onChangeHeaderCheckbox($refs.table)"
            >
              <span class="sr-only">{{ $t('global.table.selectAll') }}</span>
            </b-form-checkbox>
          </template>
          <template #cell(checkbox)="row">
            <b-form-checkbox
              v-model="row.rowSelected"
              :disabled="isButtonDisable"
              :data-test-id="`videoLog-checkbox-selectRow-${row.index}`"
              @change="toggleSelectRow($refs.table, row.index)"
            >
              <span class="sr-only">{{ $t('global.table.selectItem') }}</span>
            </b-form-checkbox>
          </template>
          <!-- Date column -->
          <template #cell(date)="{ value }">
            <p class="mb-0">{{ value.replace(/[TZ]/g, ' ').slice(0, 19) }}</p>
          </template>
          <template #cell(actions)="{ item }">
            <table-row-action
              v-for="(action, index) in item.actions"
              :key="index"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              :row-data="item"
              @click-table-action="onTableRowAction($event, item)"
            >
              <template #icon>
                <icon-download
                  v-if="action.value === 'download'"
                  class="mr10 cursor"
                  @click="onDownloadlick(item)"
                ></icon-download>
                <icon-trashcan
                  v-if="action.value === 'delete'"
                  class="cursor"
                  @click="onDeleteclick(item)"
                ></icon-trashcan>
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
          aria-controls="table-video-logs"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';

import PageTitle from '@/components/Global/PageTitle';
import Search from '@/components/Global/Search';
import TableCellCount from '@/components/Global/TableCellCount';
// import TableDateFilter from '@/components/Global/TableDateFilter';
import TableToolbar from '@/components/Global/TableToolbar';
import IconDownload from '@carbon/icons-vue/es/download/20';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import TableFilterMixin from '@/components/Mixins/TableFilterMixin';
import BVPaginationMixin, {
  currentPage,
  perPage,
} from '@/components/Mixins/BVPaginationMixin';
import BVTableSelectableMixin, {
  selectedRows,
  tableHeaderCheckboxModel,
  tableHeaderCheckboxIndeterminate,
} from '@/components/Mixins/BVTableSelectableMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import SearchFilterMixin, {
  searchFilter,
} from '@/components/Mixins/SearchFilterMixin';
import { mapState } from 'vuex';
import TableRowAction from '@/components/Global/TableRowAction';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  components: {
    IconTrashcan,
    PageTitle,
    Search,
    TableCellCount,
    TableToolbar,
    // TableDateFilter,
    IconDownload,
    TableRowAction,
  },
  mixins: [
    BVPaginationMixin,
    BVTableSelectableMixin,
    BVToastMixin,
    LoadingBarMixin,
    TableFilterMixin,
    DataFormatterMixin,
    SearchFilterMixin,
  ],
  data() {
    return {
      isBusy: true,
      fields: [
        {
          key: 'checkbox',
          sortable: false,
        },
        {
          key: 'file',
          label: this.$t('videoLog.table.fileName'),
          tdClass: 'text-break',
        },
        {
          key: 'actions',
          sortable: false,
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
      activeFilters: [],
      currentPage: currentPage,
      filterStartDate: null,
      filterEndDate: null,
      perPage: perPage,
      searchFilter: searchFilter,
      searchTotalFilteredRows: 0,
      selectedRows: selectedRows,
      tableHeaderCheckboxModel: tableHeaderCheckboxModel,
      tableHeaderCheckboxIndeterminate: tableHeaderCheckboxIndeterminate,
    };
  },
  computed: {
    ...mapState('videoLog', ['allVideoLogs']),
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
    filteredRows() {
      return this.searchFilter
        ? this.searchTotalFilteredRows
        : this.filteredLogs.length;
    },
    allLogs() {
      return this.$store.getters['videoLog/getAllVideoLogs'].map((event) => {
        return {
          ...event,
          actions: [
            {
              value: 'download',
              title: this.$t('videoLog.table.downloadTitle'),
            },
            {
              value: 'delete',
              enabled: !this.isButtonDisable,
              title: this.$tc('pageNodeManager.table.delete'),
            },
          ],
        };
      });
    },
    filteredLogsByDate() {
      return this.getFilteredTableDataByDate(
        this.allLogs,
        this.filterStartDate,
        this.filterEndDate,
      );
    },
    filteredLogs() {
      return this.getFilteredTableData(
        this.filteredLogsByDate,
        this.activeFilters,
      );
    },
  },
  watch: {
    allVideoLogs() {
      this.allLogs;
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('videoLog/getVideoLogData')
      .finally(() => {
        this.endLoader();
        this.isBusy = false;
      })
      .catch(({ message }) => {
        this.errorToast(message);
      });
  },
  methods: {
    onTableRowAction(action) {
      switch (action) {
        case 'download':
          break;
        case 'delete':
          break;
        default:
          break;
      }
    },
    onDeleteclick(val) {
      this.$bvModal
        .msgBoxConfirm(this.$tc('videoLog.modal.deleteMessage', val.length), {
          title: this.$tc('videoLog.modal.deleteTitle', val.length),
          okTitle: this.$t('global.action.delete'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'cancel',
        })
        .then((deleteConfirmed) => {
          this.startLoader();
          if (deleteConfirmed) {
            this.deleteVideoLogs([val.file]);
          }
        });
    },

    onChangeDateTimeFilter({ fromDate, toDate }) {
      this.filterStartDate = fromDate;
      this.filterEndDate = toDate;
    },
    onFiltered(filteredItems) {
      this.searchTotalFilteredRows = filteredItems.length;
    },
    onDownloadlick(val) {
      this.startLoader();
      const uri =
        '/redfish/v1/Managers/bmc/Oem/Ami/AutoVideoSettings/VideoLogs/' +
        val.file;
      this.$store
        .dispatch('videoLog/videoLogDownload', uri)
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.endLoader();
        });
    },
    //multiple video log delete
    onBatchAction() {
      const uris = this.selectedRows.map((row) => row.file);
      this.$bvModal
        .msgBoxConfirm(
          this.$tc('videoLog.modal.deleteMessage', this.selectedRows.length),
          {
            title: this.$tc(
              'videoLog.modal.deleteTitle',
              this.selectedRows.length,
            ),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'cancel',
          },
        )
        .then((deleteConfirmed) => {
          this.startLoader();
          if (deleteConfirmed) {
            this.deleteVideoLogs(uris);
          }
        });
    },
    deleteVideoLogs(uris) {
      uris.forEach((uri, index) => {
        uris[index] =
          '/redfish/v1/Managers/bmc/Oem/Ami/AutoVideoSettings/VideoLogs/' + uri;
      });
      this.$store
        .dispatch('videoLog/deletevideoLog', uris)
        .then(() => {
          this.successToast(
            this.$tc('videoLog.toast.successVideoLogCleared', uris),
          );
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.endLoader();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.mr10 {
  margin: 0 10px 0 0;
}
.cursor {
  cursor: pointer;
}
@media (max-width: 300px) {
  .mr10 {
    margin: 0 10px 0 0 !important;
  }
}
</style>
