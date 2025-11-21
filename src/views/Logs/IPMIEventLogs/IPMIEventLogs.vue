<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="align-items-start">
      <b-col sm="8" xl="6" class="d-sm-flex align-items-end mb-4">
        <search
          :placeholder="$t('pageIpmiEventLogs.table.searchLogs')"
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
          :disabled="allLogs.length === 0 || isButtonDisable"
          @click="deleteAllLogs"
        >
          <icon-delete /> {{ $t('global.action.deleteAll') }}
        </b-button>
        <b-button
          variant="primary"
          :disabled="allLogs.length === 0 || isButtonDisable"
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
              {{ $t('pageIpmiEventLogs.resolve') }}
            </b-button>
            <b-button
              v-if="!hideToggle"
              variant="primary"
              @click="unresolveLogs"
            >
              {{ $t('pageIpmiEventLogs.unresolve') }}
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
                    <dt>{{ $t('pageIpmiEventLogs.table.name') }}:</dt>
                    <dd>{{ dataFormatter(item.name) }}</dd>
                  </dl>
                  <dl>
                    <!-- Type -->
                    <dt>{{ $t('pageIpmiEventLogs.table.type') }}:</dt>
                    <dd>{{ dataFormatter(item.type) }}</dd>
                  </dl>
                </b-col>
                <b-col>
                  <dl>
                    <!-- Modified date -->
                    <dt>{{ $t('pageIpmiEventLogs.table.modifiedDate') }}:</dt>
                    <dd v-if="item.modifiedDate">
                      {{ item.modifiedDate | formatDate }}
                      {{ item.modifiedDate | formatTime }}
                    </dd>
                    <dd v-else>--</dd>
                  </dl>
                </b-col>
                <b-col class="text-nowrap">
                  <b-button
                    v-if="item.additionalDataUri"
                    :disabled="isButtonDisable"
                    @click="downloadEntry(item.additionalDataUri)"
                  >
                    <icon-download />{{
                      $t('pageIpmiEventLogs.additionalDataUri')
                    }}
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
              :disabled="isButtonDisable"
              @change="changelogStatus(row.item)"
            >
              <span v-if="row.item.status">
                {{ $t('pageIpmiEventLogs.resolved') }}
              </span>
              <span v-else> {{ $t('pageIpmiEventLogs.unresolved') }} </span>
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
              :enabled="action.enabled"
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
          :limit="limit"
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
  limit,
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
import i18n from '@/i18n';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

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
          label: this.$t('pageIpmiEventLogs.table.id'),
          sortable: true,
        },
        {
          key: 'severity',
          label: this.$t('pageIpmiEventLogs.table.severity'),
          sortable: true,
          tdClass: 'text-nowrap',
        },
        {
          key: 'date',
          label: this.$t('pageIpmiEventLogs.table.date'),
          sortable: true,
          tdClass: 'text-nowrap',
        },
        {
          key: 'description',
          label: this.$t('pageIpmiEventLogs.table.description'),
          tdClass: 'text-break',
        },
        process.env.VUE_APP_EVENT_LOGS_TOGGLE_BUTTON_DISABLED === 'true'
          ? {}
          : {
              key: 'status',
              label: this.$t('pageIpmiEventLogs.table.status'),
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
                label: this.$t('pageIpmiEventLogs.table.severity'),
                values: [
                  this.$t('global.action.ok'),
                  this.$t('global.action.warning'),
                  this.$t('global.action.critical'),
                  this.$t('global.action.na'),
                ],
              },
            ]
          : [
              {
                key: 'severity',
                label: this.$t('pageIpmiEventLogs.table.severity'),
                values: [
                  this.$t('global.action.ok'),
                  this.$t('global.action.warning'),
                  this.$t('global.action.critical'),
                  this.$t('global.action.na'),
                ],
              },
              {
                key: 'filterByStatus',
                label: this.$t('pageIpmiEventLogs.table.status'),
                values: [
                  this.$t('pageIpmiEventLogs.resolved'),
                  this.$t('pageIpmiEventLogs.unresolved'),
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
      limit: limit,
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
      const data = this.exportAllLogs();
      const blob = new Blob([data], { type: 'application/json' });
      return URL.createObjectURL(blob); // Create a Blob URL for download
    },
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
      return this.$store.getters['ipmiEventLog/allEvents'].map((event) => {
        return {
          ...event,
          actions: this.hideDelete
            ? [
                {
                  value: 'export',
                  title: this.$t('global.action.export'),
                  enabled: !this.isButtonDisable,
                },
              ]
            : [
                {
                  value: 'export',
                  title: this.$t('global.action.export'),
                  enabled: !this.isButtonDisable,
                },
                {
                  value: 'delete',
                  title: this.$t('global.action.delete'),
                  enabled: !this.isButtonDisable,
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
    this.$store.dispatch('ipmiEventLog/getEventLogData').finally(() => {
      this.endLoader();
      this.isBusy = false;
    });
  },
  methods: {
    downloadEntry(uri) {
      let filename = uri?.split('LogServices/')?.[1].concat('.log');
      filename.replace(RegExp('/', 'g'), '_');
      this.$store
        .dispatch('ipmiEventLog/downloadEntry', uri)
        .then((blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .then(() => {
          this.successToast(
            i18n.t('pageIpmiEventLogs.toast.successDownloadEventEntry'),
          );
        })
        .catch(({ message }) => this.errorToast(message));
    },
    changelogStatus(row) {
      this.$store
        .dispatch('ipmiEventLog/updateEventLogStatus', {
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
        .msgBoxConfirm(this.$t('pageIpmiEventLogs.modal.deleteAllMessage'), {
          title: this.$t('pageIpmiEventLogs.modal.deleteAllTitle'),
          okTitle: this.$t('global.action.delete'),
          okVariant: 'danger',
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'cancel',
        })
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.$store
              .dispatch('ipmiEventLog/deleteAllEventLogs', this.allLogs)
              .then((message) => this.successToast(message))
              .catch(({ message }) => this.errorToast(message));
          }
        });
    },
    deleteLogs(uris) {
      this.$store
        .dispatch('ipmiEventLog/deleteEventLogs', uris)
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
      const allLogsData = this.$store.getters['ipmiEventLog/allEvents'];
      return JSON.stringify(allLogsData, null, 2); // Pretty print with indentation
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
          .msgBoxConfirm(this.$tc('pageIpmiEventLogs.modal.deleteMessage'), {
            title: this.$tc('pageIpmiEventLogs.modal.deleteTitle'),
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
              'pageIpmiEventLogs.modal.deleteMessage',
              this.selectedRows.length,
            ),
            {
              title: this.$tc(
                'pageIpmiEventLogs.modal.deleteTitle',
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
                    'ipmiEventLog/deleteAllEventLogs',
                    this.selectedRows.length,
                  )
                  .then(() => {
                    this.successToast(
                      this.$tc(
                        'pageIpmiEventLogs.toast.successDelete',
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
        .dispatch('ipmiEventLog/resolveEventLogs', this.selectedRows)
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
        .dispatch('ipmiEventLog/unresolveEventLogs', this.selectedRows)
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
