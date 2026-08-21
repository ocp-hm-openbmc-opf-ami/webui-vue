<template>
  <b-container fluid="xl">
    <div v-if="showSensor">
      <page-title />
      <b-row class="align-items-end">
        <b-col sm="6" md="5" xl="4">
          <search
            :placeholder="$t('pageSensors.searchForSensors')"
            :disabled="!isSearchFilterReady"
            data-test-id="sensors-input-searchForSensors"
            @change-search="onChangeSearchInput"
            @clear-search="onClearSearchInput"
          />
        </b-col>
        <b-col sm="3" md="3" xl="2">
          <table-cell-count
            :filtered-items-count="filteredRows"
            :total-number-of-cells="totalSensorsCount"
          ></table-cell-count>
        </b-col>
        <b-col sm="3" md="4" xl="6" class="text-right">
          <table-filter
            :filters="tableFilters"
            :disabled="!isSearchFilterReady"
            @filter-change="onFilterChange"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col xl="12">
          <table-toolbar
            ref="toolbar"
            :selected-items-count="selectedRows.length"
            @clear-selected="clearSelectedRows($refs.table)"
          >
            <template #toolbar-buttons>
              <table-toolbar-export
                :data="selectedRows"
                :file-name="exportFileNameByDate()"
              />
            </template>
          </table-toolbar>
          <b-table
            id="table-sensors"
            ref="table"
            responsive="md"
            selectable
            no-select-on-click
            sort-icon-left
            hover
            no-sort-reset
            sticky-header="75vh"
            sort-by="status"
            show-empty
            :no-border-collapse="true"
            :items="filteredSensors"
            :fields="fields"
            :sort-desc="true"
            :sort-compare="sortCompare"
            :filter="searchFilter"
            :per-page="perPage"
            :current-page="currentPage"
            :empty-text="$t('global.table.emptyMessage')"
            :empty-filtered-text="$t('global.table.emptySearchMessage')"
            :busy="isBusy"
            :tbody-tr-class="rowClass"
            @filtered="onFiltered"
            @row-selected="onRowSelected($event, filteredSensors.length)"
          >
            <!-- Checkbox column -->
            <template #head(checkbox)>
              <b-form-checkbox
                v-model="tableHeaderCheckboxModel"
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
                @change="toggleSelectRow($refs.table, row.index)"
              >
                <span class="sr-only">{{ $t('global.table.selectItem') }}</span>
              </b-form-checkbox>
            </template>
            <!-- Sensor State column -->
            <template #cell(state)="{ value }">
              <span v-if="value === 'Enabled'">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else-if="value === 'Disabled'">
                {{ $t('global.status.disabled') }}
              </span>
            </template>
            <template #cell(status)="{ value }">
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
            <template #cell(currentValue)="data">
              {{ data.value }} {{ data.item.units }}
            </template>
            <template #cell(lowerCaution)="data">
              {{ data.value }} {{ data.item.units }}
            </template>
            <template #cell(upperCaution)="data">
              {{ data.value }} {{ data.item.units }}
            </template>
            <template #cell(lowerCritical)="data">
              {{ data.value }} {{ data.item.units }}
            </template>
            <template #cell(upperCritical)="data">
              {{ data.value }} {{ data.item.units }}
            </template>
            <template #cell(upperFatal)="data">
              {{ data.value }} {{ data.item.units }}
            </template>
            <template #cell(lowerFatal)="data">
              {{ data.value }} {{ data.item.units }}
            </template>
            <template #cell(actions)="{ item }">
              <div class="allign-icons">
                <svg
                  v-if="historyViewSensors.includes(item.name) && item.id"
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                  xmlns="http://www.w3.org/2000/svg"
                  class="svg_graph"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  @click="onRowclick(item)"
                >
                  <title>
                    {{ $t('pageSensors.sensorThreshold.modal.sesnorHistory') }}
                  </title>
                  <path d="M8 10H16V12H8zM8 6H20V8H8zM8 2H20V4H8z"></path>
                  <path
                    d="M4.7111,28l5.6312-9.9961,7.4341,6.49A2,2,0,0,0,20.86,23.96l6.9707-10.4034-1.6622-1.1132-7,10.4472-.07.1035-7.4345-6.4907a2.0032,2.0032,0,0,0-3.0806.5308L4,25.1826V2H2V28a2.0023,2.0023,0,0,0,2,2H30V28Z"
                  ></path>
                </svg>
                <icon-edit
                  v-if="item.thresholdsId != null"
                  class="svg_graph"
                  :title="
                    $t('pageSensors.sensorThreshold.modal.sensorThresholds')
                  "
                  :enabled="!isButtonDisable"
                  @click="initModalSensorThresholdModal(item)"
                />
                <span
                  v-if="!item.id && item.thresholdsId == null"
                  style="margin-left: 8px"
                  >-</span
                >
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
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
              :options="itemsPerPageOptionsByLoad"
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
            aria-controls="table-sensors"
            :limit="limit"
          />
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <sensor-graph
        :sensor-graph-data="itemData"
        :options="options"
        :type="type"
        @backSensorPage="isBackSensorPage"
      />
    </div>
    <modal-sensor-threshold
      :modal-sensor-threshold="modalSensorThresholdValue"
      :modal-success="isModalSuccess"
      @setSensorThresholdOk="isSetSensorThresholdUpdateValue"
      @closeAddModal="iscloseAddModal"
    ></modal-sensor-threshold>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import Search from '@/components/Global/Search';
import StatusIcon from '@/components/Global/StatusIcon';
import TableFilter from '@/components/Global/TableFilter';
import TableToolbar from '@/components/Global/TableToolbar';
import TableToolbarExport from '@/components/Global/TableToolbarExport';
import TableCellCount from '@/components/Global/TableCellCount';
import SensorGraph from './SensorGraph.vue';
import BVTableSelectableMixin, {
  selectedRows,
  tableHeaderCheckboxModel,
  tableHeaderCheckboxIndeterminate,
} from '@/components/Mixins/BVTableSelectableMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import TableFilterMixin from '@/components/Mixins/TableFilterMixin';
import BVPaginationMixin, {
  currentPage,
  perPage,
  limit,
} from '@/components/Mixins/BVPaginationMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import TableSortMixin from '@/components/Mixins/TableSortMixin';
import SearchFilterMixin, {
  searchFilter,
} from '@/components/Mixins/SearchFilterMixin';
import ModalSensorThreshold from './ModalSensorThreshold.vue';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

export default {
  name: 'Sensors',
  components: {
    PageTitle,
    Search,
    StatusIcon,
    TableCellCount,
    TableFilter,
    TableToolbar,
    TableToolbarExport,
    SensorGraph,
    ModalSensorThreshold,
    IconEdit,
  },
  mixins: [
    BVPaginationMixin,
    TableFilterMixin,
    BVTableSelectableMixin,
    LoadingBarMixin,
    DataFormatterMixin,
    TableSortMixin,
    SearchFilterMixin,
    BVToastMixin,
  ],
  beforeRouteLeave(to, from, next) {
    this.stopBackgroundPreloading();
    this.$store.dispatch('sensors/setSensorGraphRefresh', true);
    this.hideLoader();
    next();
  },
  data() {
    return {
      isBusy: true,
      fields: [
        {
          key: 'checkbox',
          sortable: false,
          label: '',
        },
        {
          key: 'name',
          sortable: true,
          label: this.$t('pageSensors.table.name'),
        },
        {
          key: 'state',
          sortable: true,
          label: this.$t('pageSensors.table.state'),
        },
        {
          key: 'status',
          sortable: true,
          label: this.$t('pageSensors.table.status'),
          tdClass: 'text-nowrap',
        },
        {
          key: 'lowerCritical',
          formatter: this.dataFormatter,
          label: this.$t('pageSensors.table.lowerCritical'),
        },
        {
          key: 'lowerCaution',
          formatter: this.dataFormatter,
          label: this.$t('pageSensors.table.lowerWarning'),
        },

        {
          key: 'currentValue',
          formatter: this.dataFormatter,
          label: this.$t('pageSensors.table.currentValue'),
        },
        {
          key: 'upperCaution',
          formatter: this.dataFormatter,
          label: this.$t('pageSensors.table.upperWarning'),
        },
        {
          key: 'upperCritical',
          formatter: this.dataFormatter,
          label: this.$t('pageSensors.table.upperCritical'),
        },
        {
          key: 'upperFatal',
          formatter: this.dataFormatter,
          label: this.$t('pageSensors.table.upperFatal'),
        },
        {
          key: 'lowerFatal',
          formatter: this.dataFormatter,
          label: this.$t('pageSensors.table.lowerFatal'),
        },
        {
          key: 'actions',
          label: '',
          class: 'text-center',
        },
      ],
      tableFilters: [
        {
          key: 'filterByStatus',
          label: this.$t('pageSensors.table.status'),
          values: [
            this.$t('global.action.ok'),
            this.$t('global.action.warning'),
            this.$t('global.action.critical'),
          ],
        },
        {
          key: 'filterByState',
          label: this.$t('pageSensors.table.state'),
          values: [
            this.$t('global.status.enabled'),
            this.$t('global.status.disabled'),
          ],
        },
      ],
      activeFilters: [],
      searchFilter: searchFilter,
      searchTotalFilteredRows: 0,
      currentPage: currentPage,
      perPage: perPage,
      limit: limit,
      selectedRows: selectedRows,
      tableHeaderCheckboxModel: tableHeaderCheckboxModel,
      tableHeaderCheckboxIndeterminate: tableHeaderCheckboxIndeterminate,
      options: {
        defaults: {
          borderColor: '#ce3a2f',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            boxWidth: 25,
            displayColors: false,
            callbacks: {
              title: function (TooltipItem) {
                return TooltipItem[0].label;
              },
              label: function (TooltipItem) {
                return TooltipItem.parsed.y;
              },
            },
            intersect: false,
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Timestamp',
            },
            defaults: {
              borderColor: 'red',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Values',
            },
          },
        },
        elements: {
          line: {
            borderColor: '#cf4132',
            borderWidth: 2,
          },
          point: {
            radius: 0,
          },
        },
      },
      type: 'line',
      itemData: {},
      historyViewSensors: [
        'AverageCupsIndex',
        'System Airflow',
        'AverageHostCpuUtilization',
        'AverageHostMemoryBandwidthUtilization',
        'AverageHostPciBandwidthUtilization',
        'CupsIndex',
        'HostCpuUtilization',
        'HostMemoryBandwidthUtilization',
        'HostPciBandwidthUtilization',
        'PSU2 Input Power',
        'PSU2 Output Power',
        'Cpu Power Average CPU2',
        'PSU1 Input Power',
        'PSU1 Output Power',
        'Platform Power Average CPU1',
        'Platform Power Average CPU2',
        'Dimm Power Average CPU1',
        'Dimm Power Average CPU2',
        'Cpu Power Average CPU1',
      ],
      modalSensorThresholdValue: {},
      isModalSuccess: false,
      sensorBatchSize: 20,
      backgroundBatchSize: 10,
      isPreloadingAllSensors: false,
      batchLoadPromises: {},
      isPageActive: true,
      preloadSessionId: 0,
    };
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    ...mapGetters('sensors', ['totalSensors', 'hasMoreSensors']),
    isButtonDisable() {
      return this.userPrivilege === privilegesId.readOnly;
    },
    allSensors() {
      return this.$store.getters['sensors/sensors'].map((sensor) => {
        return {
          ...sensor,
          filterByStatus: this.getFilterByStatus(sensor.status),
          filterByState: this.getFilterByState(sensor.state),
        };
      });
    },
    showSensor() {
      return this.$store.getters['sensors/sensorGraphRefreshGet'];
    },
    totalSensorsCount() {
      return this.totalSensors || this.allSensors.length;
    },
    itemsPerPageOptionsByLoad() {
      return this.itemsPerPageOptions;
    },
    isSearchFilterReady() {
      return !this.hasMoreSensors && !this.isPreloadingAllSensors;
    },
    filteredRows() {
      return this.searchFilter
        ? this.searchTotalFilteredRows
        : this.filteredSensors.length;
    },
    filteredSensors() {
      return this.getFilteredTableData(this.allSensors, this.activeFilters);
    },
  },
  watch: {
    currentPage() {
      this.ensurePageDataReady();
    },
    perPage(newValue) {
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      }
      if (newValue === 0) {
        this.preloadAllSensorsInBackground();
      } else {
        this.ensurePageDataReady();
      }
    },
  },
  created() {
    if (this.showSensor) {
      this.initSensorLoad();
    }
  },
  beforeDestroy() {
    this.stopBackgroundPreloading();
  },
  methods: {
    stopBackgroundPreloading() {
      this.isPageActive = false;
      this.preloadSessionId += 1;
      this.isPreloadingAllSensors = false;
    },
    startPreloadSession() {
      this.isPageActive = true;
      this.preloadSessionId += 1;
      return this.preloadSessionId;
    },
    isSessionActive(sessionId) {
      return (
        this.isPageActive &&
        this.showSensor &&
        sessionId === this.preloadSessionId
      );
    },
    async loadSensorsByBatch({
      sessionId = this.preloadSessionId,
      batchSize = this.sensorBatchSize,
      requiredRows = Infinity,
    } = {}) {
      if (!this.isSessionActive(sessionId)) return;

      while (
        this.hasMoreSensors &&
        this.allSensors.length < requiredRows &&
        this.isSessionActive(sessionId)
      ) {
        await this.fetchNextBatch(sessionId, batchSize);
      }
    },
    isHistorySensorRow(item) {
      return (
        this.historyViewSensors.includes(item?.name) && item.id != undefined
      );
    },
    async initSensorLoad() {
      const sessionId = this.startPreloadSession();
      this.startLoader();
      this.isBusy = true;

      await this.$store
        .dispatch('sensors/getAllSensors', { batchSize: this.sensorBatchSize })
        .finally(() => {
          this.endLoader();
          this.isBusy = false;
        });

      if (!this.isSessionActive(sessionId)) return;
      this.preloadAllSensorsInBackground(sessionId);
    },
    async fetchNextBatch(sessionId, count = this.sensorBatchSize) {
      if (!this.isSessionActive(sessionId)) return [];
      const requestKey = String(sessionId);
      if (this.batchLoadPromises[requestKey]) {
        return this.batchLoadPromises[requestKey];
      }
      this.batchLoadPromises[requestKey] = this.$store
        .dispatch('sensors/fetchNextSensorsBatch', {
          count,
        })
        .finally(() => {
          this.$delete(this.batchLoadPromises, requestKey);
        });
      return this.batchLoadPromises[requestKey];
    },
    async preloadAllSensorsInBackground(sessionId = this.preloadSessionId) {
      if (
        this.isPreloadingAllSensors ||
        !this.hasMoreSensors ||
        !this.isSessionActive(sessionId)
      ) {
        return;
      }
      this.isPreloadingAllSensors = true;
      try {
        await this.loadSensorsByBatch({
          sessionId,
          batchSize: this.backgroundBatchSize,
        });
      } finally {
        if (sessionId === this.preloadSessionId) {
          this.isPreloadingAllSensors = false;
        }
      }
    },
    async ensurePageDataReady() {
      if (this.perPage === 0) return;
      const sessionId = this.preloadSessionId;
      await this.loadSensorsByBatch({
        sessionId,
        batchSize: this.sensorBatchSize,
        requiredRows: this.currentPage * this.perPage,
      });
    },
    sortCompare(a, b, key) {
      if (key === 'status') {
        return this.sortStatus(a, b, key);
      }
    },
    onFilterChange({ activeFilters }) {
      if (!this.isSearchFilterReady) return;
      this.activeFilters = activeFilters;
      this.currentPage = 1;
    },
    onFiltered(filteredItems) {
      this.searchTotalFilteredRows = filteredItems.length;
    },
    onChangeSearchInput(event) {
      if (!this.isSearchFilterReady) return;
      this.searchFilter = event;
      this.currentPage = 1;
    },
    exportFileNameByDate() {
      // Create export file name based on date
      let date = new Date();
      date =
        date.toISOString().slice(0, 10) +
        '_' +
        date.toString().split(':').join('-').split(' ')[4];
      return this.$t('pageSensors.exportFilePrefix') + date;
    },
    onRowclick(item) {
      if (!this.isHistorySensorRow(item)) return;
      this.stopBackgroundPreloading();
      this.itemData = item;
      this.$store.dispatch('sensors/setSensorGraphRefresh', false);
    },
    isBackSensorPage() {
      this.$store.dispatch('sensors/setSensorGraphRefresh', true);
      this.searchFilter = null;
      this.isBusy = false;
      this.tableHeaderCheckboxModel = false;
      this.tableHeaderCheckboxIndeterminate = false;
      const sessionId = this.startPreloadSession();
      this.preloadAllSensorsInBackground(sessionId);
    },
    rowClass(item) {
      return this.isHistorySensorRow(item) ? 'row_class' : null;
    },
    initModalSensorThresholdModal(val) {
      this.modalSensorThresholdValue = {};
      this.modalSensorThresholdValue = val;
      this.$bvModal.show('modal-sensor-threshold');
    },
    isSetSensorThresholdUpdateValue(val) {
      const thresholdsUrlId = this.modalSensorThresholdValue.thresholdsId;
      const sensorUri = this.modalSensorThresholdValue.sensorUri;
      this.$store
        .dispatch('sensors/setSensorThresholdValue', {
          val,
          thresholdsUrlId,
        })
        .then((success) => {
          this.successToast(success);
          this.isModalSuccess = true;
          this.$store
            .dispatch('sensors/refreshSingleSensor', sensorUri)
            .catch(() => {});
        })
        .catch(({ message }) => this.errorToast(message));
    },
    iscloseAddModal(val) {
      this.isModalSuccess = val;
    },
    getFilterByStatus(status) {
      switch (status) {
        case 'OK':
          return this.$t('global.action.ok');
        case 'Warning':
          return this.$t('global.action.warning');
        case 'Critical':
          return this.$t('global.action.critical');
        default:
          return this.$t('global.action.na');
      }
    },
    getFilterByState(state) {
      switch (state) {
        case 'Enabled':
          return this.$t('global.status.enabled');
        case 'Disabled':
          return this.$t('global.status.disabled');
        default:
          return this.$t('global.action.na');
      }
    },
  },
};
</script>
<style>
.name_air {
  color: #416f89;
  cursor: pointer;
}
.row_class {
  cursor: pointer;
}
.svg_graph {
  fill: #416f89 !important;
  height: 20px !important;
  width: 25px !important;
  cursor: pointer;
}
.m10 {
  margin-right: 10px;
}
.allign-icons {
  display: flex;
}
</style>
