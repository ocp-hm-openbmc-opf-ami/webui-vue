<template>
  <b-container fluid="xl">
    <page-title />
    <h3>{{ $t('pageSbmrLogs.bootProgressCodeLogs') }}</h3>
    <b-row class="align-items-start">
      <b-col sm="8" xl="6" class="d-sm-flex align-items-end mb-4">
        <search
          data-test-id="sbmrLogs-input-searchLogs"
          :placeholder="$t('pageSbmrLogs.table.searchLogs')"
          @change-search="onChangeSearchInput"
          @clear-search="onClearSearchInput"
        />
        <div class="ml-sm-4">
          <table-cell-count
            :filtered-items-count="filteredRows"
            :total-number-of-cells="allLogs.length"
            :is-search-active="!!searchFilter"
          ></table-cell-count>
        </div>
      </b-col>
      <b-col sm="8" md="7" xl="6">
        <table-date-filter
          data-test-id="sbmrLogs-filter-date"
          @change="onChangeDateTimeFilter"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="12" class="text-right">
        <b-button
          data-test-id="sbmrLogs-button-deleteAll"
          variant="link"
          :disabled="allLogs.length === 0 || isButtonDisable"
          @click="deleteAllLogs"
        >
          <icon-delete /> {{ $t('global.action.deleteAll') }}
        </b-button>
        <b-button
          data-test-id="sbmrLogs-button-exportAll"
          variant="primary"
          :disabled="allLogs.length === 0 || isButtonDisable"
          :download="exportFileNameByDate()"
          :href="href"
        >
          <icon-export /> {{ $t('pageSbmrLogs.button.exportAll') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <table-toolbar
          ref="toolbar"
          :selected-items-count="selectedRows.length"
          @clear-selected="clearSelectedRows($refs.table)"
        >
          <template #toolbar-buttons>
            <table-toolbar-export
              :data="batchExportData"
              :file-name="exportFileNameByDate()"
            />
          </template>
        </table-toolbar>
        <b-table
          id="table-post-code-logs"
          ref="table"
          data-test-id="sbmrLogs-table"
          responsive="md"
          selectable
          no-select-on-click
          sort-icon-left
          hover
          no-sort-reset
          sort-desc
          show-empty
          sort-by="id"
          :fields="fields"
          :items="searchableDisplayLogs"
          :empty-text="$t('global.table.emptyMessage')"
          :empty-filtered-text="$t('global.table.emptySearchMessage')"
          :per-page="perPage"
          :current-page="currentPage"
          :filter="searchFilter"
          :filter-function="customTableFilter"
          :busy="isBusy"
          @filtered="onFiltered"
          @row-selected="onRowSelected($event, searchableDisplayLogs.length)"
        >
          <!-- Checkbox column -->
          <template #head(checkbox)>
            <b-form-checkbox
              v-model="tableHeaderCheckboxModel"
              :disabled="isButtonDisable"
              data-test-id="sbmrLogs-checkbox-selectAll"
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
              :data-test-id="`sbmrLogs-checkbox-selectRow-${row.index}`"
              @change="toggleSelectRow($refs.table, row.index)"
            >
              <span class="sr-only">{{ $t('global.table.selectItem') }}</span>
            </b-form-checkbox>
          </template>
          <!-- Date column -->
          <template #cell(date)="{ value }">
            <p class="mb-0">{{ value | formatDate }}</p>
            <p class="mb-0">{{ value | formatTime }}</p>
          </template>

          <!-- Actions column -->
          <template #cell(actions)="row">
            <table-row-action
              v-for="(action, index) in row.item.actions"
              :key="index"
              :value="action.value"
              :title="action.title"
              :enabled="action.enabled"
              :row-data="row.item"
              :btn-icon-only="true"
              :export-name="exportFileNameByDate(action.value)"
              :download-location="row.item.uri"
              :download-in-new-tab="true"
              :show-button="false"
            >
              <template #icon>
                <icon-export v-if="action.value === 'export'" />
                <icon-download v-if="action.value === 'download'" />
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
            data-test-id="sbmrLogs-select-itemsPerPage"
            :options="itemsPerPageOptions"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-pagination
          v-model="currentPage"
          data-test-id="sbmrLogs-pagination"
          first-number
          last-number
          :per-page="perPage"
          :total-rows="getTotalRowCount(filteredRows)"
          aria-controls="table-post-code-logs"
          :limit="limit"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import IconDelete from '@carbon/icons-vue/es/trash-can/20';
import IconDownload from '@carbon/icons-vue/es/download/20';
import IconExport from '@carbon/icons-vue/es/document--export/20';
import { omit } from 'lodash';
import PageTitle from '@/components/Global/PageTitle';
import Search from '@/components/Global/Search';
import TableCellCount from '@/components/Global/TableCellCount';
import TableDateFilter from '@/components/Global/TableDateFilter';
import TableRowAction from '@/components/Global/TableRowAction';
import TableToolbar from '@/components/Global/TableToolbar';
import TableToolbarExport from '@/components/Global/TableToolbarExport';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import TableFilterMixin from '@/components/Mixins/TableFilterMixin';
import BVPaginationMixin, {
  currentPage,
  perPage,
  limit,
} from '@/components/Mixins/BVPaginationMixin';
import BVTableSelectableMixin, {
  selectedRows,
  tableHeaderCheckboxModel,
  tableHeaderCheckboxIndeterminate,
} from '@/components/Mixins/BVTableSelectableMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import TableSortMixin from '@/components/Mixins/TableSortMixin';
import TableRowExpandMixin from '@/components/Mixins/TableRowExpandMixin';
import SearchFilterMixin, {
  searchFilter,
} from '@/components/Mixins/SearchFilterMixin';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  components: {
    IconDelete,
    IconExport,
    IconDownload,
    PageTitle,
    Search,
    TableCellCount,
    TableRowAction,
    TableToolbar,
    TableToolbarExport,
    TableDateFilter,
  },
  mixins: [
    BVPaginationMixin,
    BVTableSelectableMixin,
    BVToastMixin,
    LoadingBarMixin,
    TableFilterMixin,
    TableSortMixin,
    TableRowExpandMixin,
    SearchFilterMixin,
  ],
  beforeRouteLeave(to, from, next) {
    // Hide loader if the user navigates to another page
    // before request is fulfilled.
    this.hideLoader();
    next();
  },
  data() {
    const fields = [
      {
        key: 'checkbox',
        sortable: false,
      },
      {
        key: 'date',
        label: this.$t('pageSbmrLogs.table.created'),
        sortable: true,
      },
      {
        key: 'timeStampOffset',
        label: this.$t('pageSbmrLogs.table.timeStampOffset'),
      },
      {
        key: 'bootCount',
        label: this.$t('pageSbmrLogs.table.bootCount'),
      },
      {
        key: 'postCode',
        label: this.$t('pageSbmrLogs.table.postCode'),
      },
    ];

    // Conditionally add postCodeString column based on environment variable
    if (process.env.VUE_APP_ONETREE_ARM_SBMR_ENABLED === 'true') {
      fields.push({
        key: 'postCodeString',
        label: this.$t('pageSbmrLogs.table.postCodeString'),
      });
    }

    fields.push({
      key: 'actions',
      label: '',
      tdClass: 'text-right text-nowrap',
    });

    return {
      isBusy: true,
      fields: fields,
      activeFilters: [],
      currentPage: currentPage,
      filterStartDate: null,
      filterEndDate: null,
      perPage: perPage,
      limit: limit,
      searchFilter: searchFilter,
      searchTotalFilteredRows: null,
      selectedRows: selectedRows,
      tableHeaderCheckboxModel: tableHeaderCheckboxModel,
      tableHeaderCheckboxIndeterminate: tableHeaderCheckboxIndeterminate,
    };
  },
  computed: {
    href() {
      const data = this.exportAllLogsString();
      const blob = new Blob([data], { type: 'application/json' });
      return URL.createObjectURL(blob); // Create a Blob URL for download
    },
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
    filteredRows() {
      return this.searchTotalFilteredRows !== null
        ? this.searchTotalFilteredRows
        : this.filteredLogs.length;
    },
    allLogs() {
      return this.$store.getters['sbmrCodeLogs/allPostCodes'].map(
        (postCodes) => {
          return {
            ...postCodes,
            actions: [
              {
                value: 'export',
                title: this.$t('pageSbmrLogs.action.exportLogs'),
                enabled: !this.isButtonDisable,
              },
              {
                value: 'download',
                title: this.$t('pageSbmrLogs.action.downloadDetails'),
                enabled: !this.isButtonDisable,
              },
            ],
          };
        },
      );
    },
    batchExportData() {
      return this.selectedRows.map((row) => omit(row, 'actions'));
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
    searchableDisplayLogs() {
      return this.filteredLogs.map((log) => ({
        ...log,
        _searchableText: [
          this.$options.filters.formatDate(log.date),
          this.$options.filters.formatTime(log.date),
          log.timeStampOffset,
          log.bootCount,
          log.postCode,
          log.postCodeString,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      }));
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('sbmrCodeLogs/getPostCodesLogData').finally(() => {
      this.endLoader();
      this.isBusy = false;
    });
  },
  methods: {
    deleteAllLogs() {
      this.$bvModal
        .msgBoxConfirm(this.$t('pageEventLogs.modal.deleteAllMessage'), {
          title: this.$t('pageEventLogs.modal.deleteAllTitle'),
          okTitle: this.$t('global.action.delete'),
          okVariant: 'danger',
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.$store
              .dispatch('sbmrCodeLogs/deleteAllPostCodeLogs', this.allLogs)
              .then((message) => this.successToast(message))
              .catch(({ message }) => this.errorToast(message));
          }
        });
    },
    exportAllLogsString() {
      const allPostLogData = this.$store.getters['sbmrCodeLogs/allPostCodes'];
      return JSON.stringify(allPostLogData, null, 2);
    },
    onFilterChange({ activeFilters }) {
      this.activeFilters = activeFilters;
    },
    onChangeDateTimeFilter({ fromDate, toDate }) {
      this.filterStartDate = fromDate;
      this.filterEndDate = toDate;
    },
    onFiltered(filteredItems) {
      if (this.searchFilter) {
        this.searchTotalFilteredRows = filteredItems.length;
      }
    },
    onClearSearchInput() {
      this.searchFilter = null;
      this.searchTotalFilteredRows = null;
    },
    // Create export file name based on date and action
    exportFileNameByDate(value) {
      let date = new Date();
      date =
        date.toISOString().slice(0, 10) +
        '_' +
        date.toString().split(':').join('-').split(' ')[4];
      let fileName;
      if (value === 'download') {
        fileName = this.$t('pageSbmrLogs.downloadFilePrefix');
      } else if (value === 'export') {
        fileName = this.$t('pageSbmrLogs.exportFilePrefix');
      } else {
        fileName = this.$t('pageSbmrLogs.allExportFilePrefix');
      }
      return fileName + date;
    },
  },
};
</script>
