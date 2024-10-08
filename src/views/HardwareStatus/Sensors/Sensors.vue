<template>
  <b-container fluid="xl">
    <div v-if="showSensor">
      <page-title />
      <b-row class="align-items-end">
        <b-col sm="6" md="5" xl="4">
          <search
            :placeholder="$t('pageSensors.searchForSensors')"
            data-test-id="sensors-input-searchForSensors"
            @change-search="onChangeSearchInput"
            @clear-search="onClearSearchInput"
          />
        </b-col>
        <b-col sm="3" md="3" xl="2">
          <table-cell-count
            :filtered-items-count="filteredRows"
            :total-number-of-cells="allSensors.length"
          ></table-cell-count>
        </b-col>
        <b-col sm="3" md="4" xl="6" class="text-right">
          <table-filter
            :filters="tableFilters"
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
                :indeterminate="tableHeaderCheckboxIndeterminate"
                @change="onChangeHeaderCheckbox($refs.table)"
              >
                <span class="sr-only">{{ $t('global.table.selectAll') }}</span>
              </b-form-checkbox>
            </template>
            <template #cell(checkbox)="row">
              <b-form-checkbox
                v-model="row.rowSelected"
                @change="toggleSelectRow($refs.table, row.index)"
              >
                <span class="sr-only">{{ $t('global.table.selectItem') }}</span>
              </b-form-checkbox>
            </template>
            <template #cell(status)="{ value }">
              <status-icon :status="statusIcon(value)" /> {{ value }}
            </template>
            <!-- Sensor State column -->
            <template #cell(filterByStatus)="{ value }">
              {{ value }}
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
            <template #cell(actions)="{ item }">
              <svg
                v-if="historyViewSensors.includes(item.name) && item.id"
                data-v-99969f6c=""
                focusable="false"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                class="svg_graph m10"
                viewBox="0 0 32 32"
                aria-hidden="true"
                @click="onRowclick(item)"
              >
                <title>
                  {{ $t('pageSensors.sensorThreshold.modal.sesnorHistory') }}
                </title>
                <path
                  data-v-99969f6c=""
                  d="M8 10H16V12H8zM8 6H20V8H8zM8 2H20V4H8z"
                ></path>
                <path
                  data-v-99969f6c=""
                  d="M4.7111,28l5.6312-9.9961,7.4341,6.49A2,2,0,0,0,20.86,23.96l6.9707-10.4034-1.6622-1.1132-7,10.4472-.07.1035-7.4345-6.4907a2.0032,2.0032,0,0,0-3.0806.5308L4,25.1826V2H2V28a2.0023,2.0023,0,0,0,2,2H30V28Z"
                ></path>
              </svg>
              <icon-edit
                v-if="item.thresholdsId != null"
                class="svg_graph"
                :title="
                  $t('pageSensors.sensorThreshold.modal.sensorThresholds')
                "
                @click="initModalSensorThresholdModal(item)"
              />
              <span
                v-if="
                  !historyViewSensors.includes(item.name) &&
                  !item.id &&
                  item.thresholdsId == null
                "
                >-</span
              >
            </template>
          </b-table>
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
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import TableSortMixin from '@/components/Mixins/TableSortMixin';
import SearchFilterMixin, {
  searchFilter,
} from '@/components/Mixins/SearchFilterMixin';
import ModalSensorThreshold from './ModalSensorThreshold.vue';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

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
    TableFilterMixin,
    BVTableSelectableMixin,
    LoadingBarMixin,
    DataFormatterMixin,
    TableSortMixin,
    SearchFilterMixin,
    BVToastMixin,
  ],
  beforeRouteLeave(to, from, next) {
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
          key: 'actions',
          label: '',
          class: 'text-center',
        },
      ],
      tableFilters: [
        {
          key: 'status',
          label: this.$t('pageSensors.table.status'),
          values: [
            this.$t('global.action.ok'),
            this.$t('global.action.warning'),
            this.$t('global.action.critical'),
          ],
        },
        {
          key: 'state',
          label: this.$t('pageSensors.table.state'),
          values: ['Enabled', 'Disabled'],
        },
      ],
      activeFilters: [],
      searchFilter: searchFilter,
      searchTotalFilteredRows: 0,
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
    };
  },
  computed: {
    allSensors() {
      return this.$store.getters['sensors/sensors'];
    },
    showSensor() {
      return this.$store.getters['sensors/sensorGraphRefreshGet'];
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
  created() {
    if (this.showSensor) {
      this.initSensorLoad();
    }
  },
  methods: {
    initSensorLoad() {
      this.startLoader();
      this.$store.dispatch('sensors/getAllSensors').finally(() => {
        this.endLoader();
        this.isBusy = false;
      });
    },
    sortCompare(a, b, key) {
      if (key === 'status') {
        return this.sortStatus(a, b, key);
      }
    },
    onFilterChange({ activeFilters }) {
      this.activeFilters = activeFilters;
    },
    onFiltered(filteredItems) {
      this.searchTotalFilteredRows = filteredItems.length;
    },
    onChangeSearchInput(event) {
      this.searchFilter = event;
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
      if (
        this.historyViewSensors.includes(item?.name) &&
        item.id != undefined
      ) {
        this.itemData = item;
        this.$store.dispatch('sensors/setSensorGraphRefresh', false);
      }
    },
    isBackSensorPage() {
      this.$store.dispatch('sensors/setSensorGraphRefresh', true);
      this.searchFilter = null;
      this.isBusy = false;
      this.tableHeaderCheckboxModel = false;
      this.tableHeaderCheckboxIndeterminate = false;
    },
    rowClass(item) {
      if (
        this.historyViewSensors.includes(item?.name) &&
        item.id != undefined
      ) {
        return 'row_class';
      }
    },
    initModalSensorThresholdModal(val) {
      this.modalSensorThresholdValue = {};
      this.modalSensorThresholdValue = val;
      this.$bvModal.show('modal-sensor-threshold');
    },
    isSetSensorThresholdUpdateValue(val) {
      const thresholdsUrlId = this.modalSensorThresholdValue.thresholdsId;
      this.$store
        .dispatch('sensors/setSensorThresholdValue', {
          val,
          thresholdsUrlId,
        })
        .then((success) => {
          this.successToast(success);
          this.isModalSuccess = true;
          this.initSensorLoad();
        })
        .catch(({ message }) => this.errorToast(message));
    },
    iscloseAddModal(val) {
      this.isModalSuccess = val;
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
</style>
