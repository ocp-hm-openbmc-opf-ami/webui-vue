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
            :total-number-of-cells="allStatistics.length"
          ></table-cell-count>
        </b-col>
        <b-col xl="6" class="text-right">
          <b-button
            variant="primary"
            class="mb-2"
            data-test-id="alertDestination-button-sendTestTrap"
            @click="initModalSetCapability()"
          >
            <icon-add />
            {{ $t('pageNodeManager.setCapabilityModal.setCapabilityStr') }}
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table
            id="power_statistics"
            ref="table"
            responsive="md"
            no-select-on-click
            hover
            show-empty
            :fields="fields"
            :items="allStatistics"
            :per-page="perPage"
            :current-page="currentPage"
            :filter="searchFilter"
            :empty-text="$t('global.table.emptyMessage')"
            @filtered="onFiltered"
          ></b-table>
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
    <modal-set-capability
      :capabilities="nmCapabilities"
      @ok="saveDomainCapability"
      @hidden="nmCapabilities = null"
    ></modal-set-capability>
  </b-container>
</template>
<script>
import ModalSetCapability from './ModalSetCapability.vue';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
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
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
export default {
  name: 'PowerStatistics',
  components: {
    ModalSetCapability,
    TableCellCount,
    Search,
    IconAdd,
  },
  mixins: [
    LoadingBarMixin,
    BVPaginationMixin,
    TableFilterMixin,
    SearchFilterMixin,
    BVToastMixin,
  ],
  beforeRouteLeave(to, from, next) {
    // Hide loader if the user navigates to another page
    // before request is fulfilled.
    this.hideLoader();
    next();
  },
  data() {
    return {
      fields: [
        {
          key: 'domain',
          label: this.$t('pageNodeManager.powerStatisticsTable.domain'),
        },
        {
          key: 'type',
          label: this.$t('pageNodeManager.powerStatisticsTable.type'),
        },
        {
          key: 'current',
          label: this.$t('pageNodeManager.powerStatisticsTable.current'),
        },
        {
          key: 'average',
          label: this.$t('pageNodeManager.powerStatisticsTable.average'),
        },
        {
          key: 'maximum',
          label: this.$t('pageNodeManager.powerStatisticsTable.maximum'),
        },
        {
          key: 'minimum',
          label: this.$t('pageNodeManager.powerStatisticsTable.minimum'),
        },
      ],
      nmCapabilities: null,
      currentPage: currentPage,
      perPage: perPage,
      searchTotalFilteredRows: 0,
      searchFilter: searchFilter,
    };
  },
  computed: {
    allStatistics() {
      return this.$store.getters[
        'nmConfiguration/nodeManagerPowerStatistics'
      ].map((statistics) => {
        return {
          ...statistics,
        };
      });
    },
    filteredRows() {
      return this.searchFilter
        ? this.searchTotalFilteredRows
        : this.allStatistics.length;
    },
  },
  methods: {
    initModalSetCapability() {
      this.nmCapabilities =
        this.$store.getters['nmConfiguration/modeManagerCapabilities'];
      this.$bvModal.show('modal-set-capability');
    },
    onFiltered(filteredItems) {
      this.searchTotalFilteredRows = filteredItems.length;
    },
    onChangeSearchInput(event) {
      this.searchFilter = event;
    },
    saveDomainCapability({ domainCapabilityData }) {
      this.startLoader();
      this.$store
        .dispatch(
          'nmConfiguration/updateDomainCapability',
          domainCapabilityData,
        )
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
