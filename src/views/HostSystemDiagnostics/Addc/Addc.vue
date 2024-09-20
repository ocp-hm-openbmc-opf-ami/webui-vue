<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageAddc.pageDescription')" />
    <div class="form-background p-3">
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageAddc.errorRecoveryMode.errorRecoveryModeTitle')"
            label-for="errorRecoveryModeTitle"
          >
            <b-form-radio-group v-model="form.recoveryMode" stacked>
              <b-form-row>
                <b-form-radio
                  value="None"
                  data-test-id="ncsi-autoFailOverMode"
                  class="mr-2"
                >
                  {{ $t('pageAddc.errorRecoveryMode.none') }}
                </b-form-radio>
                <b-form-radio
                  value="WarmReset"
                  data-test-id="ncsi-manualSwitchMode"
                  class="mr-2"
                >
                  {{ $t('pageAddc.errorRecoveryMode.warmReset') }}
                </b-form-radio>
                <b-form-radio
                  value="ColdReset"
                  data-test-id="ncsi-autoFailOverMode"
                  class="mr-2"
                >
                  {{ $t('pageAddc.errorRecoveryMode.coldReset') }}
                </b-form-radio>
              </b-form-row>
            </b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="8" md="6" xl="12">
          <b-form-group>
            <b-form-row>
              <b-form-checkbox v-model="form.harvestUCode">
                {{ $t('pageAddc.harvestUcode') }}
              </b-form-checkbox>
              <b-form-checkbox v-model="form.harvestPPIN" class="ml-3">
                {{ $t('pageAddc.harvestPpin') }}
              </b-form-checkbox>
            </b-form-row>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="form.mcaPollingEn">
            {{ $t('pageAddc.mcaPolling') }}
          </b-form-checkbox>
        </b-col>
        <b-row>
          <b-col sm="6" md="3">
            <label for="periodInput">{{ $t('pageAddc.period') }}</label>
          </b-col>
          <b-col>
            <b-form-input
              id="periodInput"
              v-model="form.mcaPollingPeriod"
              type="text"
              class="form-control"
              style="width: 120px"
              :disabled="!form.mcaPollingEn"
              :state="getValidationState($v.form.mcaPollingPeriod)"
              data-test-id="input-mcaPollingPeriod"
              @input="$v.form.mcaPollingPeriod.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.mcaPollingPeriod.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.mcaPollingPeriod.required &&
                  !$v.form.mcaPollingPeriod.pattern
                "
              >
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="form.dramCeccPollingEn">
            {{ $t('pageAddc.dramCeccPolling') }}
          </b-form-checkbox>
        </b-col>
        <b-row class="align-items-center">
          <b-col sm="6" md="3">
            <label for="periodInput">{{ $t('pageAddc.period') }}</label>
          </b-col>
          <b-col>
            <b-form-input
              id="periodInput"
              v-model="form.dramCeccPollingPeriod"
              type="text"
              class="form-control"
              style="width: 120px"
              :disabled="!form.dramCeccPollingEn"
              :state="getValidationState($v.form.dramCeccPollingPeriod)"
              data-test-id="input-dramCeccPollingPeriod"
              @input="$v.form.dramCeccPollingPeriod.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.dramCeccPollingPeriod.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.dramCeccPollingPeriod.required &&
                  !$v.form.dramCeccPollingPeriod.pattern
                "
              >
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="form.pcieAerPollingEn">
            {{ $t('pageAddc.PCIeAerPolling') }}
          </b-form-checkbox>
        </b-col>
        <b-row>
          <b-col sm="6" md="3">
            <label for="periodInput">{{ $t('pageAddc.period') }}</label>
          </b-col>
          <b-col>
            <b-form-input
              id="periodInput"
              v-model="form.pcieAerPollingPeriod"
              type="text"
              class="form-control"
              style="width: 120px"
              :disabled="!form.pcieAerPollingEn"
              :state="getValidationState($v.form.pcieAerPollingPeriod)"
              data-test-id="input-pcieAerPollingPeriod"
              @input="$v.form.pcieAerPollingPeriod.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.pcieAerPollingPeriod.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.pcieAerPollingPeriod.required &&
                  !$v.form.pcieAerPollingPeriod.pattern
                "
              >
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-row>
      <b-row class="mt-3 p-3">
        <b-row>
          <b-col sm="6" md="3">
            <label for="periodInput">{{ $t('pageAddc.retry') }}</label>
          </b-col>

          <b-col>
            <b-form-group>
              <b-form-input
                id="retry"
                v-model="form.retry"
                :state="getValidationState($v.form.retry)"
                data-test-id="input-retry"
                class="form-control"
                style="width: 120px"
                @input="$v.form.retry.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.retry.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template
                  v-if="$v.form.retry.required && !$v.form.retry.pattern"
                >
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col sm="6" md="3">
            <b-button type="submit" variant="primary" @click="onOk">
              {{ $t('global.action.save') }}
            </b-button>
          </b-col>
        </b-row>
      </b-row>
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
      </b-row>
      <b-row>
        <b-col xl="12">
          <b-table
            id="table-AutonomousCrashDump"
            responsive="md"
            no-select-on-click
            hover
            :fields="fields"
            :items="items"
            show-empty
            :empty-text="$t('global.table.emptyMessage')"
            :filter="searchFilter"
            :per-page="perPage"
            :current-page="currentPage"
            @filtered="onFiltered"
          >
            <template #cell(actions)="{ item }">
              <icon-download
                :href="item.AdditionalDataURI"
                target="_blank"
                :title="$t('pageAddc.downloadTitle')"
                @click="logEntriesDownload(item)"
              ></icon-download>
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
      <!-- <b-row>
        <b-col xl="12">
          <b-button type="submit" variant="primary" @click="onClearLog">
            {{ $t('pageAddc.clearlog') }}
          </b-button>
        </b-col>
      </b-row> -->
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { mapState } from 'vuex';
import { required, requiredIf } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import IconDownload from '@carbon/icons-vue/es/download/20';
import SearchFilterMixin, {
  searchFilter,
} from '@/components/Mixins/SearchFilterMixin';
import BVPaginationMixin, {
  currentPage,
  perPage,
} from '@/components/Mixins/BVPaginationMixin';
import Search from '@/components/Global/Search';
import TableCellCount from '@/components/Global/TableCellCount';
export default {
  components: {
    PageTitle,
    IconDownload,
    Search,
    TableCellCount,
  },
  mixins: [
    LoadingBarMixin,
    BVToastMixin,
    VuelidateMixin,
    SearchFilterMixin,
    BVPaginationMixin,
  ],
  data() {
    return {
      fields: [
        {
          key: 'Id',
          label: this.$t('pageAddc.table.id'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'AdditionalDataURI',
          label: this.$t('pageAddc.table.fileName'),
          sortable: true,
          class: 'text-center',
        },
        {
          key: 'Created',
          label: this.$t('pageAddc.table.fileInformation'),
          class: 'text-center',
        },
        {
          key: 'actions',
          label: '',
          class: 'text-center',
        },
      ],
      form: {
        recoveryMode: '',
        harvestUCode: '',
        harvestPPIN: '',
        mcaPollingEn: '',
        mcaPollingPeriod: '',
        dramCeccPollingEn: '',
        dramCeccPollingPeriod: '',
        pcieAerPollingEn: '',
        pcieAerPollingPeriod: '',
        retry: '',
      },
      items: [],
      currentPage: currentPage,
      perPage: perPage,
      searchTotalFilteredRows: 0,
      searchFilter: searchFilter,
    };
  },
  computed: {
    ...mapState('addc', ['addcData', 'entriesDownload']),
    filteredRows() {
      return this.searchFilter
        ? this.searchTotalFilteredRows
        : this.items.length;
    },
  },
  watch: {
    addcData() {
      this.initADDCConfiguration();
    },
    entriesDownload() {
      this.initADDCDownload();
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('addc/getADDCData').finally(() => {
      this.endLoader();
    });
  },
  validations() {
    return {
      form: {
        mcaPollingPeriod: {
          required: requiredIf(function (form) {
            if (form.mcaPollingEn) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.mcaPollingPeriodValidation(val);
          },
        },
        dramCeccPollingPeriod: {
          required: requiredIf(function (form) {
            if (form.dramCeccPollingEn) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.dramCeccPollingPeriodValidation(val);
          },
        },
        pcieAerPollingPeriod: {
          required: requiredIf(function (form) {
            if (form.pcieAerPollingEn) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.pcieAerPollingPeriodValidation(val);
          },
        },
        retry: {
          required,
          pattern: function (val) {
            return this.retryValidation(val);
          },
        },
      },
    };
  },
  methods: {
    initADDCConfiguration() {
      const config =
        this.$store.getters['addc/getADDCAllData']?.Oem?.Ami?.Configuration ||
        {};
      this.form = {
        recoveryMode: config.RecoverMode,
        harvestUCode: config.HarvestUCode,
        harvestPPIN: config.HarvestPPIN,
        mcaPollingEn: config.McaPollingEn,
        mcaPollingPeriod: config.McaPollingPeriod,
        dramCeccPollingEn: config.DramCeccPollingEn,
        dramCeccPollingPeriod: config.DramCeccPollingPeriod,
        pcieAerPollingEn: config.PcieAerPollingEn,
        pcieAerPollingPeriod: config.PcieAerPollingPeriod,
        retry: config.Retry,
      };
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const addcSetValue = {};

      addcSetValue.HarvestPPIN = this.form.harvestPPIN;
      addcSetValue.HarvestUCode = this.form.harvestUCode;
      addcSetValue.McaPollingEn = this.form.mcaPollingEn;
      addcSetValue.PcieAerPollingEn = this.form.pcieAerPollingEn;
      addcSetValue.DramCeccPollingEn = this.form.dramCeccPollingEn;
      addcSetValue.RecoverMode = this.form.recoveryMode;
      if (this.form.dramCeccPollingEn) {
        addcSetValue.DramCeccPollingPeriod = parseInt(
          this.form.dramCeccPollingPeriod,
        );
      }
      if (this.form.mcaPollingEn) {
        addcSetValue.McaPollingPeriod = parseInt(this.form.mcaPollingPeriod);
      }
      if (this.form.pcieAerPollingEn) {
        addcSetValue.PcieAerPollingPeriod = parseInt(
          this.form.pcieAerPollingPeriod,
        );
      }
      addcSetValue.Retry = parseInt(this.form.retry);
      this.startLoader();
      this.$store
        .dispatch('addc/setADDCConfiguration', addcSetValue)
        .then((success) => {
          this.successToast(success);
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.endLoader();
        });
    },
    initADDCDownload() {
      this.getEntriesDownload = '';
      this.items = [];
      this.getEntriesDownload = this.$store.getters['addc/getEntries'];
      this.items = this.getEntriesDownload;
    },
    mcaPollingPeriodValidation(value) {
      return this.validatePollingPeriod(value, this.form.mcaPollingEn);
    },
    dramCeccPollingPeriodValidation(value) {
      return this.validatePollingPeriod(value, this.form.dramCeccPollingEn);
    },
    pcieAerPollingPeriodValidation(value) {
      return this.validatePollingPeriod(value, this.form.pcieAerPollingEn);
    },
    retryValidation(value) {
      if (
        !(parseInt(value) > 0 && parseInt(value) < 100) ||
        !/^[1-9][0-9]*$/.test(value)
      ) {
        return false;
      } else {
        return true;
      }
    },
    logEntriesDownload(val) {
      const uri =
        '/redfish/v1/Systems/system/LogServices/Crashdump/Entries/' +
        val.Id +
        '/' +
        val.AdditionalDataURI;
      this.$store
        .dispatch('addc/logEntriesDownload', uri)
        .catch(({ message }) => {
          this.errorToast(message);
        });
    },
    onClearLog() {
      this.$bvModal
        .msgBoxConfirm(this.$t('pageAddc.clickConfirmDeletion'), {
          title: this.$tc('pageAddc.clearlog'),
          okTitle: this.$tc('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'cancel',
        })
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.startLoader();
            this.$store
              .dispatch('addc/addcClearLog')
              .then((success) => {
                this.successToast(success);
              })
              .catch(({ message }) => {
                this.errorToast(message);
              })
              .finally(() => {
                this.endLoader();
              });
          }
        });
    },
    onFiltered(filteredItems) {
      this.searchTotalFilteredRows = filteredItems.length;
    },
    onChangeSearchInput(event) {
      this.searchFilter = event;
    },
    validatePollingPeriod(value, isEnabled) {
      if (
        isEnabled != false &&
        (!(parseInt(value) > 0 && parseInt(value) < 100) ||
          !/^[1-9][0-9]*$/.test(value))
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.mb10 {
  margin: 0 0 10px 0;
}
@media (max-width: 300px) {
  .mb10 {
    margin: 0 0 10px 0 !important;
  }
}
</style>
