<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="align-items-start">
      <b-col sm="8" xl="6" class="d-sm-flex align-items-end mb-4">
        <search
          :placeholder="$t('pageEventLogs.table.searchLogs')"
          data-test-id="eventLogs-input-searchLogs"
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
      <b-col sm="8" md="7" xl="6">
        <table-date-filter @change="onChangeDateTimeFilter" />
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-right">
        <table-filter :filters="tableFilters" @filter-change="onFilterChange" />
        <b-button
          variant="link"
          :disabled="allLogs.length === 0"
          @click="deleteAllLogs"
        >
          <icon-delete /> {{ $t('global.action.deleteAll') }}
        </b-button>
        <b-button
          variant="primary"
          :class="{ disabled: allLogs.length === 0 }"
          :download="exportFileNameByDate()"
          :href="href"
        >
          <icon-export /> {{ $t('global.action.exportAll') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <table-toolbar
          ref="toolbar"
          :selected-items-count="selectedRows.length"
          :actions="batchActions"
          @clear-selected="clearSelectedRows($refs.table)"
          @batch-action="onBatchAction"
        >
          <template #toolbar-buttons>
            <b-button v-if="!hideToggle" variant="primary" @click="resolveLogs">
              {{ $t('pageEventLogs.resolve') }}
            </b-button>
            <b-button
              v-if="!hideToggle"
              variant="primary"
              @click="unresolveLogs"
            >
              {{ $t('pageEventLogs.unresolve') }}
            </b-button>
            <table-toolbar-export
              :data="batchExportData"
              :file-name="exportFileNameByDate()"
            />
          </template>
        </table-toolbar>
        <b-table
          id="table-event-logs"
          ref="table"
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
          :items="filteredLogs"
          :sort-compare="onSortCompare"
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
              data-test-id="eventLogs-checkbox-selectAll"
              :indeterminate="tableHeaderCheckboxIndeterminate"
              @change="onChangeHeaderCheckbox($refs.table)"
            >
              <span class="sr-only">{{ $t('global.table.selectAll') }}</span>
            </b-form-checkbox>
          </template>
          <template #cell(checkbox)="row">
            <b-form-checkbox
              v-model="row.rowSelected"
              :data-test-id="`eventLogs-checkbox-selectRow-${row.index}`"
              @change="toggleSelectRow($refs.table, row.index)"
            >
              <span class="sr-only">{{ $t('global.table.selectItem') }}</span>
            </b-form-checkbox>
          </template>

          <!-- Expand chevron icon -->
          <template #cell(expandRow)="row">
            <b-button
              variant="link"
              :aria-label="expandRowLabel"
              :title="expandRowLabel"
              class="btn-icon-only"
              @click="toggleRowDetails(row)"
            >
              <icon-chevron />
            </b-button>
          </template>

          <template #row-details="{ item }">
            <b-container fluid>
              <b-row>
                <b-col>
                  <dl>
                    <!-- Name -->
                    <dt>{{ $t('pageEventLogs.table.name') }}:</dt>
                    <dd>{{ dataFormatter(item.name) }}</dd>
                  </dl>
                  <dl>
                    <!-- Type -->
                    <dt>{{ $t('pageEventLogs.table.type') }}:</dt>
                    <dd>{{ dataFormatter(item.type) }}</dd>
                  </dl>
                </b-col>
                <b-col>
                  <dl>
                    <!-- Modified date -->
                    <dt>{{ $t('pageEventLogs.table.modifiedDate') }}:</dt>
                    <dd v-if="item.modifiedDate">
                      {{ item.modifiedDate | formatDate }}
                      {{ item.modifiedDate | formatTime }}
                    </dd>
                    <dd v-else>--</dd>
                  </dl>
                </b-col>
                <b-col class="text-nowrap">
                  <b-button
                    class="btn btn-secondary float-right"
                    :href="item.additionalDataUri"
                    target="_blank"
                  >
                    <icon-download />{{ $t('pageEventLogs.additionalDataUri') }}
                  </b-button>
                </b-col>
              </b-row>
            </b-container>
          </template>

          <!-- Severity column -->
          <template #cell(severity)="{ value }">
            <status-icon v-if="value" :status="statusIcon(value)" />
            <span v-if="value === 'OK'">
              {{ $t('global.action.ok') }}
            </span>
            <span v-else-if="value === 'Warning'">
              {{ $t('global.action.warning') }}
            </span>
            <span v-else-if="value === 'Critical'">
              {{ $t('global.action.critical') }}
            </span>
            <span v-else>
              {{ value }}
            </span>
          </template>
          <!-- Date column -->
          <template #cell(date)="{ value }">
            <p class="mb-0">{{ value | formatDate }}</p>
            <p class="mb-0">{{ value | formatTime }}</p>
          </template>

          <!-- Status column -->
          <template #cell(status)="row">
            <b-form-checkbox
              v-model="row.item.status"
              name="switch"
              switch
              @change="changelogStatus(row.item)"
            >
              <span v-if="row.item.status">
                {{ $t('pageEventLogs.resolved') }}
              </span>
              <span v-else> {{ $t('pageEventLogs.unresolved') }} </span>
            </b-form-checkbox>
          </template>
          <template #cell(filterByStatus)="{ value }">
            {{ value }}
          </template>

          <!-- Actions column -->
          <template #cell(actions)="row">
            <table-row-action
              v-for="(action, index) in row.item.actions"
              :key="index"
              :value="action.value"
              :title="action.title"
              :row-data="row.item"
              :export-name="exportFileNameByDate('export')"
              :data-test-id="`eventLogs-button-deleteRow-${row.index}`"
              @click-table-action="onTableRowAction($event, row.item)"
            >
              <template #icon>
                <icon-export v-if="action.value === 'export'" />
                <icon-trashcan v-if="action.value === 'delete'" />
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
  </b-container>
</template>

<script>
import IconDelete from '@carbon/icons-vue/es/trash-can/20';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconExport from '@carbon/icons-vue/es/document--export/20';
import IconChevron from '@carbon/icons-vue/es/chevron--down/20';
import IconDownload from '@carbon/icons-vue/es/download/20';
import { omit } from 'lodash';

import PageTitle from '@/components/Global/PageTitle';
import StatusIcon from '@/components/Global/StatusIcon';
import Search from '@/components/Global/Search';
import TableCellCount from '@/components/Global/TableCellCount';
import TableDateFilter from '@/components/Global/TableDateFilter';
import TableFilter from '@/components/Global/TableFilter';
import TableRowAction from '@/components/Global/TableRowAction';
import TableToolbar from '@/components/Global/TableToolbar';
import TableToolbarExport from '@/components/Global/TableToolbarExport';

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
import TableSortMixin from '@/components/Mixins/TableSortMixin';
import TableRowExpandMixin from '@/components/Mixins/TableRowExpandMixin';
import SearchFilterMixin, {
  searchFilter,
} from '@/components/Mixins/SearchFilterMixin';

export default {
  components: {
    IconDelete,
    IconExport,
    IconTrashcan,
    IconChevron,
    IconDownload,
    PageTitle,
    Search,
    StatusIcon,
    TableCellCount,
    TableFilter,
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
    DataFormatterMixin,
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
    return {
      isBusy: true,
      fields: [
        {
          key: 'expandRow',
          label: '',
          tdClass: 'table-row-expand',
        },
        {
          key: 'checkbox',
          sortable: false,
        },
        {
          key: 'id',
          label: this.$t('pageEventLogs.table.id'),
          sortable: true,
        },
        {
          key: 'severity',
          label: this.$t('pageEventLogs.table.severity'),
          sortable: true,
          tdClass: 'text-nowrap',
        },
        {
          key: 'date',
          label: this.$t('pageEventLogs.table.date'),
          sortable: true,
          tdClass: 'text-nowrap',
        },
        {
          key: 'description',
          label: this.$t('pageEventLogs.table.description'),
          tdClass: 'text-break',
        },
        process.env.VUE_APP_EVENT_LOGS_TOGGLE_BUTTON_DISABLED === 'true'
          ? {}
          : {
              key: 'status',
              label: this.$t('pageEventLogs.table.status'),
            },
        {
          key: 'actions',
          sortable: false,
          label: '',
          tdClass: 'text-right text-nowrap',
        },
      ],
      tableFilters:
        process.env.VUE_APP_EVENT_LOGS_TOGGLE_BUTTON_DISABLED === 'true'
          ? [
              {
                key: 'severity',
                label: this.$t('pageEventLogs.table.severity'),
                values: [
                  this.$t('global.action.ok'),
                  this.$t('global.action.warning'),
                  this.$t('global.action.critical'),
                ],
              },
            ]
          : [
              {
                key: 'severity',
                label: this.$t('pageEventLogs.table.severity'),
                values: [
                  this.$t('global.action.ok'),
                  this.$t('global.action.warning'),
                  this.$t('global.action.critical'),
                ],
              },
              {
                key: 'filterByStatus',
                label: this.$t('pageEventLogs.table.status'),
                values: [
                  this.$t('pageEventLogs.resolved'),
                  this.$t('pageEventLogs.unresolved'),
                ],
              },
            ],
      activeFilters: [],
      batchActions:
        process.env.VUE_APP_EVENT_LOGS_DELETE_BUTTON_DISABLED === 'true'
          ? []
          : [
              {
                value: 'delete',
                label: this.$t('global.action.delete'),
              },
            ],
      currentPage: currentPage,
      filterStartDate: null,
      filterEndDate: null,
      perPage: perPage,
      searchFilter: searchFilter,
      searchTotalFilteredRows: 0,
      selectedRows: selectedRows,
      tableHeaderCheckboxModel: tableHeaderCheckboxModel,
      tableHeaderCheckboxIndeterminate: tableHeaderCheckboxIndeterminate,
      hideToggle:
        process.env.VUE_APP_EVENT_LOGS_TOGGLE_BUTTON_DISABLED === 'true',
      hideDelete:
        process.env.VUE_APP_EVENT_LOGS_DELETE_BUTTON_DISABLED === 'true',
    };
  },
  computed: {
    href() {
      return `data:text/json;charset=utf-8,${this.exportAllLogs()}`;
    },
    filteredRows() {
      return this.searchFilter
        ? this.searchTotalFilteredRows
        : this.filteredLogs.length;
    },
    allLogs() {
      return this.$store.getters['eventLog/allEvents'].map((event) => {
        return {
          ...event,
          actions: this.hideDelete
            ? [
                {
                  value: 'export',
                  title: this.$t('global.action.export'),
                },
              ]
            : [
                {
                  value: 'export',
                  title: this.$t('global.action.export'),
                },
                {
                  value: 'delete',
                  title: this.$t('global.action.delete'),
                },
              ],
        };
      });
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
  },
  created() {
    this.startLoader();
    this.$store.dispatch('eventLog/getEventLogData').finally(() => {
      this.endLoader();
      this.isBusy = false;
    });
  },
  methods: {
    changelogStatus(row) {
      this.$store
        .dispatch('eventLog/updateEventLogStatus', {
          uri: row.uri,
          status: row.status,
        })
        .then((success) => {
          this.successToast(success);
        })
        .catch(({ message }) => this.errorToast(message));
    },
    deleteAllLogs() {
      this.$bvModal
        .msgBoxConfirm(this.$t('pageEventLogs.modal.deleteAllMessage'), {
          title: this.$t('pageEventLogs.modal.deleteAllTitle'),
          okTitle: this.$t('global.action.delete'),
          okVariant: 'danger',
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'cancel',
        })
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.$store
              .dispatch('eventLog/deleteAllEventLogs', this.allLogs)
              .then((message) => this.successToast(message))
              .catch(({ message }) => this.errorToast(message));
          }
        });
    },
    deleteLogs(uris) {
      this.$store
        .dispatch('eventLog/deleteEventLogs', uris)
        .then((messages) => {
          messages.forEach(({ type, message }) => {
            if (type === 'success') {
              this.successToast(message);
            } else if (type === 'error') {
              this.errorToast(message);
            }
          });
        });
    },
    exportAllLogs() {
      {
        return this.$store.getters['eventLog/allEvents'].map((eventLogs) => {
          const allEventLogsString = JSON.stringify(eventLogs);
          return allEventLogsString;
        });
      }
    },
    onFilterChange({ activeFilters }) {
      this.activeFilters = activeFilters;
    },
    onSortCompare(a, b, key) {
      if (key === 'severity') {
        return this.sortStatus(a, b, key);
      }
    },
    onTableRowAction(action, { uri }) {
      if (action === 'delete') {
        this.$bvModal
          .msgBoxConfirm(this.$tc('pageEventLogs.modal.deleteMessage'), {
            title: this.$tc('pageEventLogs.modal.deleteTitle'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'cancel',
          })
          .then((deleteConfirmed) => {
            if (deleteConfirmed) this.deleteLogs([uri]);
          });
      }
    },
    onBatchAction(action) {
      if (action === 'delete') {
        const uris = this.selectedRows.map((row) => row.uri);
        this.$bvModal
          .msgBoxConfirm(
            this.$tc(
              'pageEventLogs.modal.deleteMessage',
              this.selectedRows.length,
            ),
            {
              title: this.$tc(
                'pageEventLogs.modal.deleteTitle',
                this.selectedRows.length,
              ),
              okTitle: this.$t('global.action.delete'),
              cancelTitle: this.$t('global.action.cancel'),
              autoFocusButton: 'cancel',
            },
          )
          .then((deleteConfirmed) => {
            if (deleteConfirmed) {
              if (this.selectedRows.length === this.allLogs.length) {
                this.$store
                  .dispatch(
                    'eventLog/deleteAllEventLogs',
                    this.selectedRows.length,
                  )
                  .then(() => {
                    this.successToast(
                      this.$tc(
                        'pageEventLogs.toast.successDelete',
                        uris.length,
                      ),
                    );
                  })
                  .catch(({ message }) => this.errorToast(message));
              } else {
                this.deleteLogs(uris);
              }
            }
          });
      }
    },
    onChangeDateTimeFilter({ fromDate, toDate }) {
      this.filterStartDate = fromDate;
      this.filterEndDate = toDate;
    },
    onFiltered(filteredItems) {
      this.searchTotalFilteredRows = filteredItems.length;
    },
    // Create export file name based on date
    exportFileNameByDate(value) {
      let date = new Date();
      date =
        date.toISOString().slice(0, 10) +
        '_' +
        date.toString().split(':').join('-').split(' ')[4];
      let fileName;
      if (value === 'export') {
        fileName = 'event_log_';
      } else {
        fileName = 'all_event_logs_';
      }
      return fileName + date;
    },
    resolveLogs() {
      this.$store
        .dispatch('eventLog/resolveEventLogs', this.selectedRows)
        .then((messages) => {
          messages.forEach(({ type, message }) => {
            if (type === 'success') {
              this.successToast(message);
            } else if (type === 'error') {
              this.errorToast(message);
            }
          });
        });
    },
    unresolveLogs() {
      this.$store
        .dispatch('eventLog/unresolveEventLogs', this.selectedRows)
        .then((messages) => {
          messages.forEach(({ type, message }) => {
            if (type === 'success') {
              this.successToast(message);
            } else if (type === 'error') {
              this.errorToast(message);
            }
          });
        });
    },
  },
};
</script>
