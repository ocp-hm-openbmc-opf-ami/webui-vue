<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageEventFilter.pageDescription')" />
    <b-form novalidate @submit.prevent="handleSubmit">
      <div class="p-3">
        <b-form-group
          class="m-0"
          :label="$t('pageEventFilter.sectionTitle')"
          label-class="sr-only"
          :disabled="loading"
        >
          <span class="mb20 inline__block">
            {{ $t('pageEventFilter.retryLabelSettings') }}
          </span>
          <span class="inline__block">
            <b-form-checkbox
              v-model="retryEventStatus.retryEnableStatus"
              data-test-id="alert-input-enable"
              switch
              :disabled="isButtonDisable"
            >
            </b-form-checkbox>
          </span>
          <!-- <b-row>
            <b-col md="9" lg="8" xl="9">
              <b-form-group :label="$t('pageEventFilter.retryEvent')">
              </b-form-group>
            </b-col>
          </b-row> -->
          <b-row v-if="retryEventStatus.retryEnableStatus">
            <b-col lg="3">
              <b-form-group
                :label="$t('pageEventFilter.alertLimits')"
                label-for="alertLimits"
              >
                <b-form-input
                  id="alertLimits"
                  v-model="retryEventStatus.alertLimits"
                  type="text"
                  data-test-id="userManagement-input-alertLimits"
                  aria-describedby="alertLimits-help-block"
                  :state="getValidationState($v.retryEventStatus.alertLimits)"
                  @blur="$v.retryEventStatus.alertLimits.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.retryEventStatus.alertLimits.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.retryEventStatus.alertLimits.required &&
                      !$v.retryEventStatus.alertLimits.range
                    "
                  >
                    {{ $t('pageEventFilter.form.maxAlertLimitRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col lg="3">
              <b-form-group
                :label="$t('pageEventFilter.retryCount')"
                label-for="retryCount"
              >
                <b-form-input
                  id="retryCount"
                  v-model="retryEventStatus.retryCount"
                  type="text"
                  data-test-id="userManagement-input-retryCount"
                  aria-describedby="retryCount-help-block"
                  :state="getValidationState($v.retryEventStatus.retryCount)"
                  @blur="$v.retryEventStatus.retryCount.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.retryEventStatus.retryCount.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.retryEventStatus.retryCount.required &&
                      !$v.retryEventStatus.retryCount.range
                    "
                  >
                    {{ $t('pageEventFilter.form.maxRetryCountRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <!-- </b-row> -->
            <!-- <b-row v-if="retryEnableStatus"> -->
            <b-col lg="3">
              <b-form-group
                :label="$t('pageEventFilter.timeInterval')"
                label-for="timeInterval"
              >
                <b-form-input
                  id="timeInterval"
                  v-model="retryEventStatus.timeInterval"
                  type="text"
                  data-test-id="userManagement-input-timeInterval"
                  aria-describedby="timeInterval-help-block"
                  :state="getValidationState($v.retryEventStatus.timeInterval)"
                  @blur="$v.retryEventStatus.timeInterval.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.retryEventStatus.timeInterval.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.retryEventStatus.timeInterval.required &&
                      !$v.retryEventStatus.timeInterval.range
                    "
                  >
                    {{ $t('pageEventFilter.form.maxTimeIntervalRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form-group>
        <b-row class="mb-3">
          <b-col>
            <b-btn
              variant="primary"
              type="submit"
              data-test-id="eventFilter-button-saveSettings"
              :disabled="loading || isButtonDisable"
            >
              <icon-save />
              {{ $t('global.action.save') }}
            </b-btn>
          </b-col>
        </b-row>
      </div>
    </b-form>

    <div class="table-section">
      <b-table
        responsive
        hover
        :busy="loading"
        :fields="fields"
        :items="filters"
        :per-page="perPage"
        :current-page="currentPage"
        show-empty
        :empty-text="$t('global.table.emptyMessage')"
      >
        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle mr-2"></b-spinner>
            <strong>{{ $t('global.status.loading') }}</strong>
          </div>
        </template>

        <template #cell(SensorType)="data">
          <span>{{ getSensorTypeDisplay(data.item.SensorType) }}</span>
        </template>

        <template #cell(SensorName)="data">
          <span>
            {{
              getSensorNameDisplay(data.item.SensorType, data.item.SensorName)
            }}
          </span>
        </template>

        <template #cell(EvtFilterAction)="data">
          <span>{{ getEvtFilterActionText(data.item.EvtFilterAction) }}</span>
        </template>

        <template #cell(actions)="data">
          <table-row-action
            v-if="data.item.uri"
            :value="data.item"
            :title="$t('pageEventFilter.editEventFilter')"
            :enabled="!isButtonDisabled"
            @click-table-action="onEditFilter(data.item)"
          >
            <template #icon>
              <icon-edit />
            </template>
          </table-row-action>
          <table-row-action
            v-if="data.item.uri"
            :value="data.item"
            :title="$t('pageEventFilter.deleteEventFilter')"
            :enabled="!isButtonDisabled"
            @click-table-action="onDeleteFilter(data.item)"
          >
            <template #icon>
              <icon-trashcan />
            </template>
          </table-row-action>
        </template>
      </b-table>

      <b-row>
        <b-col>
          <b-pagination
            v-model="currentPage"
            :total-rows="filters.length"
            :per-page="perPage"
            aria-controls="event-filter-table"
            first-number
            last-number
          ></b-pagination>
        </b-col>
      </b-row>
    </div>

    <b-modal
      id="event-filter-modal"
      :title="modalTitle"
      size="lg"
      @hidden="resetModal"
      @ok="handleModalOk"
    >
      <b-form>
        <b-row>
          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventFilterTableEntry')"
            label-for="event-filter-entry"
          >
            <b-form-input
              id="event-filter-entry"
              v-model.number="form.EventFilterTableEntry"
              type="number"
              min="1"
              max="40"
              readonly
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.FilterConfig')"
            label-for="filter-config"
          >
            <b-form-select
              id="filter-config"
              v-model.number="form.FilterConfig"
              :options="filterConfigOptions"
              :state="getFieldState('FilterConfig')"
              @change="touchField('FilterConfig')"
            ></b-form-select>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('FilterConfig') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EvtFilterAction')"
            label-for="evt-filter-action"
          >
            <b-form-select
              id="evt-filter-action"
              v-model.number="form.EvtFilterAction"
              :options="evtFilterActionOptions"
              :state="getFieldState('EvtFilterAction')"
              @change="touchField('EvtFilterAction')"
            ></b-form-select>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EvtFilterAction') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.AlertPolicyNum')"
            label-for="alert-policy-num"
          >
            <b-form-input
              id="alert-policy-num"
              v-model.number="form.AlertPolicyNum"
              type="number"
              min="0"
              max="127"
              :state="getFieldState('AlertPolicyNum')"
              @input="touchField('AlertPolicyNum')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('AlertPolicyNum') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventSeverity')"
            label-for="event-severity"
          >
            <b-form-select
              id="event-severity"
              v-model="form.EventSeverity"
              :options="eventSeverityOptions"
              :state="getFieldState('EventSeverity')"
              @change="touchField('EventSeverity')"
            ></b-form-select>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventSeverity') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.GenIDByte1')"
            label-for="gen-id-byte1"
          >
            <b-form-input
              id="gen-id-byte1"
              v-model.number="form.GenIDByte1"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('GenIDByte1')"
              @input="touchField('GenIDByte1')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('GenIDByte1') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.GenIDByte2')"
            label-for="gen-id-byte2"
          >
            <b-form-input
              id="gen-id-byte2"
              v-model.number="form.GenIDByte2"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('GenIDByte2')"
              @input="touchField('GenIDByte2')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('GenIDByte2') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.SensorType')"
            label-for="sensor-type"
          >
            <b-form-select
              id="sensor-type"
              v-model="selectedSensorType"
              :options="sensorTypeOptions"
              @change="onSensorTypeChange"
            ></b-form-select>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.SensorName')"
            label-for="sensor-name"
          >
            <b-form-select
              id="sensor-name"
              v-model="selectedSensorName"
              :options="sensorNameOptions"
              @change="onSensorNameChange"
            ></b-form-select>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventTrigger')"
            label-for="event-trigger"
          >
            <b-form-input
              id="event-trigger"
              v-model.number="form.EventTrigger"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventTrigger')"
              @input="touchField('EventTrigger')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventTrigger') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData1OffsetMask')"
            label-for="event-data1-offset-mask"
          >
            <b-form-input
              id="event-data1-offset-mask"
              v-model.number="form.EventData1OffsetMask"
              type="number"
              min="0"
              max="65535"
              :state="getFieldState('EventData1OffsetMask')"
              @input="touchField('EventData1OffsetMask')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData1OffsetMask') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData1ANDMask')"
            label-for="event-data1-and-mask"
          >
            <b-form-input
              id="event-data1-and-mask"
              v-model.number="form.EventData1ANDMask"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData1ANDMask')"
              @input="touchField('EventData1ANDMask')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData1ANDMask') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData1Cmp1')"
            label-for="event-data1-cmp1"
          >
            <b-form-input
              id="event-data1-cmp1"
              v-model.number="form.EventData1Cmp1"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData1Cmp1')"
              @input="touchField('EventData1Cmp1')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData1Cmp1') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData1Cmp2')"
            label-for="event-data1-cmp2"
          >
            <b-form-input
              id="event-data1-cmp2"
              v-model.number="form.EventData1Cmp2"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData1Cmp2')"
              @input="touchField('EventData1Cmp2')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData1Cmp2') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData2ANDMask')"
            label-for="event-data2-and-mask"
          >
            <b-form-input
              id="event-data2-and-mask"
              v-model.number="form.EventData2ANDMask"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData2ANDMask')"
              @input="touchField('EventData2ANDMask')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData2ANDMask') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData2Cmp1')"
            label-for="event-data2-cmp1"
          >
            <b-form-input
              id="event-data2-cmp1"
              v-model.number="form.EventData2Cmp1"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData2Cmp1')"
              @input="touchField('EventData2Cmp1')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData2Cmp1') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData2Cmp2')"
            label-for="event-data2-cmp2"
          >
            <b-form-input
              id="event-data2-cmp2"
              v-model.number="form.EventData2Cmp2"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData2Cmp2')"
              @input="touchField('EventData2Cmp2')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData2Cmp2') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData3ANDMask')"
            label-for="event-data3-and-mask"
          >
            <b-form-input
              id="event-data3-and-mask"
              v-model.number="form.EventData3ANDMask"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData3ANDMask')"
              @input="touchField('EventData3ANDMask')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData3ANDMask') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData3Cmp1')"
            label-for="event-data3-cmp1"
          >
            <b-form-input
              id="event-data3-cmp1"
              v-model.number="form.EventData3Cmp1"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData3Cmp1')"
              @input="touchField('EventData3Cmp1')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData3Cmp1') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            class="col-12 col-md-6"
            :label="$t('pageEventFilter.EventData3Cmp2')"
            label-for="event-data3-cmp2"
          >
            <b-form-input
              id="event-data3-cmp2"
              v-model.number="form.EventData3Cmp2"
              type="number"
              min="0"
              max="255"
              :state="getFieldState('EventData3Cmp2')"
              @input="touchField('EventData3Cmp2')"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              {{ getFieldError('EventData3Cmp2') }}
            </b-form-invalid-feedback>
          </b-form-group>
        </b-row>
      </b-form>

      <template #modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          {{ $t('global.action.cancel') }}
        </b-button>
        <b-button variant="primary" @click="ok()">
          <icon-save class="mr-1" />
          {{ $t('global.action.save') }}
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import { mapGetters } from 'vuex';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { requiredIf } from 'vuelidate/lib/validators';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconSave from '@carbon/icons-vue/es/save/20';
import { privilegesId } from '@/store/modules/GlobalStore';

export default {
  name: 'EventFilterTable',
  components: {
    PageTitle,
    TableRowAction,
    IconEdit,
    IconTrashcan,
    IconSave,
  },
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  data() {
    return {
      retryEventStatus: {
        retryEnableStatus: false,
        alertLimits: '',
        retryCount: '',
        timeInterval: '',
      },
      currentPage: 1,
      perPage: 15,
      modalTitle: this.$t('pageEventFilter.editEventFilter'),
      currentItem: null,
      showValidation: false,
      validationErrors: {},
      selectedSensorType: '',
      selectedSensorName: '',
      form: {
        EventFilterTableEntry: 1,
        FilterConfig: 0,
        EvtFilterAction: 0,
        AlertPolicyNum: 0,
        EventSeverity: 'Critical',
        GenIDByte1: 0,
        GenIDByte2: 0,
        SensorType: '',
        SensorName: '',
        EventTrigger: 0,
        EventData1OffsetMask: 0,
        EventData1ANDMask: 0,
        EventData1Cmp1: 0,
        EventData1Cmp2: 0,
        EventData2ANDMask: 0,
        EventData2Cmp1: 0,
        EventData2Cmp2: 0,
        EventData3ANDMask: 0,
        EventData3Cmp1: 0,
        EventData3Cmp2: 0,
      },
      fields: [
        {
          key: 'EventFilterTableEntry',
          label: this.$t('pageEventFilter.EventFilterTableEntry'),
          sortable: true,
        },
        {
          key: 'id',
          label: this.$t('pageEventFilter.Id'),
          sortable: true,
        },
        {
          key: 'FilterConfig',
          label: this.$t('pageEventFilter.FilterConfig'),
          sortable: true,
        },
        {
          key: 'EvtFilterAction',
          label: this.$t('pageEventFilter.EvtFilterAction'),
          sortable: true,
        },
        {
          key: 'AlertPolicyNum',
          label: this.$t('pageEventFilter.AlertPolicyNum'),
          sortable: true,
        },
        {
          key: 'EventSeverity',
          label: this.$t('pageEventFilter.EventSeverity'),
          sortable: true,
        },
        {
          key: 'SensorType',
          label: this.$t('pageEventFilter.SensorType'),
          sortable: true,
        },
        {
          key: 'SensorName',
          label: this.$t('pageEventFilter.SensorName'),
          sortable: true,
        },
        {
          key: 'actions',
          label: this.$t('pageEventFilter.actions'),
          class: 'text-right',
        },
      ],
      eventSeverityOptions: [
        { value: 'Information', text: 'Information' },
        { value: 'OK', text: 'OK' },
        { value: 'Warning', text: 'Warning' },
        { value: 'Critical', text: 'Critical' },
        { value: 'All', text: 'All' },
      ],
      evtFilterActionOptions: [
        { value: 0, text: 'None' },
        { value: 2, text: 'Power Down' },
        { value: 4, text: 'Reset' },
        { value: 8, text: 'Power Cycle' },
        { value: 17, text: 'OEM Action' },
      ],
      filterConfigOptions: [
        { value: 0, text: '0' },
        { value: 64, text: '64' },
        { value: 128, text: '128' },
        { value: 192, text: '192' },
      ],
    };
  },
  computed: {
    ...mapGetters('eventFilter', [
      'filters',
      'loading',
      'sensorTypeOptions',
      'sensorNameOptionsByType',
      'resolveSensorTypeByValue',
      'resolveSensorNameByValue',
      'list4Defaults',
    ]),
    ...mapGetters('global', ['userPrivilege']),
    sensorNameOptions() {
      return this.sensorNameOptionsByType(this.selectedSensorType);
    },
    isButtonDisabled() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  async created() {
    this.eventFilterInit();
    await this.loadData();
  },
  validations() {
    return {
      retryEventStatus: {
        alertLimits: {
          required: requiredIf(function () {
            return this.retryEventStatus.retryEnableStatus;
          }),
          range: function (val) {
            return this.retryEventStatus.retryEnableStatus
              ? this.validateRange(Number(val), 0, 100)
              : true;
          },
        },
        retryCount: {
          required: requiredIf(function () {
            return this.retryEventStatus.retryEnableStatus;
          }),
          range: function (val) {
            return this.retryEventStatus.retryEnableStatus
              ? this.validateRange(Number(val), 0, 10)
              : true;
          },
        },
        timeInterval: {
          required: requiredIf(function () {
            return this.retryEventStatus.retryEnableStatus;
          }),
          range: function (val) {
            return this.retryEventStatus.retryEnableStatus
              ? this.validateRange(Number(val), 0, 3600)
              : true;
          },
        },
      },
    };
  },
  methods: {
    eventFilterInit() {
      this.$store.dispatch('eventFilter/fetchRetryValues').finally(() => {
        this.retryEventStatus =
          this.$store.getters['eventFilter/getRetryValues'];
      });
    },
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.startLoader();
      const retryEventStatusValue = {};
      retryEventStatusValue.RetryEnable =
        this.retryEventStatus.retryEnableStatus;
      if (this.retryEventStatus.retryCount !== '') {
        retryEventStatusValue.RetryCountLimit = parseInt(
          this.retryEventStatus.retryCount,
        );
      }
      if (this.retryEventStatus.timeInterval !== '') {
        retryEventStatusValue.RetryTimeInterval = parseInt(
          this.retryEventStatus.timeInterval,
        );
      }
      if (this.retryEventStatus.alertLimits !== '') {
        retryEventStatusValue.PendingAlertsLimit = parseInt(
          this.retryEventStatus.alertLimits,
        );
      }
      this.$store
        .dispatch('eventFilter/setRetryValues', {
          retryEventStatusValue,
        })
        .then((success) => {
          this.successToast(success);
          this.eventFilterInit();
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.endLoader();
        });
    },
    async loadData() {
      this.startLoader();
      try {
        await this.$store.dispatch('eventFilter/getAllFilters');
        this.applyList4Defaults();
      } catch (error) {
        this.errorToast(this.$t('pageEventFilter.toast.errorEventFilterMsg'));
      } finally {
        this.endLoader();
      }
    },

    applyList4Defaults() {
      const resolvedSensorType = this.resolveSensorTypeByValue(
        this.list4Defaults.SensorType,
      );
      this.selectedSensorType = this.sensorTypeOptions.some(
        (option) => option.value === resolvedSensorType,
      )
        ? resolvedSensorType
        : this.sensorTypeOptions[0]?.value || '';
      this.selectedSensorName = this.resolveSensorNameByValue(
        this.selectedSensorType,
        this.list4Defaults.SensorName,
      );
      this.form.EventSeverity = this.list4Defaults.EventSeverity;
      this.form.SensorType = this.selectedSensorType;
      this.form.SensorName = this.selectedSensorName;
    },

    getSensorTypeDisplay(sensorType) {
      const value = this.resolveSensorTypeByValue(sensorType);
      return value || 'All Sensor Types';
    },

    getSensorNameDisplay(sensorType, sensorName) {
      const value = this.resolveSensorNameByValue(sensorType, sensorName);
      return value === 'ALL' ? '' : value;
    },

    getEvtFilterActionText(actionValue) {
      const option = this.evtFilterActionOptions.find(
        (item) => item.value === actionValue,
      );
      return option ? option.text : actionValue;
    },

    onSensorTypeChange(value) {
      this.selectedSensorType = value || this.sensorTypeOptions[0]?.value || '';
      this.selectedSensorName = '';
      this.form.SensorType = this.selectedSensorType;
      this.form.SensorName = this.selectedSensorName;
    },

    onSensorNameChange(value) {
      this.selectedSensorName = value && value !== 'ALL' ? value : '';
      this.form.SensorType = this.selectedSensorType;
      this.form.SensorName = this.selectedSensorName;
    },

    onEditFilter(item) {
      this.currentItem = item;
      this.modalTitle = this.$t('pageEventFilter.editEventFilter');

      const resolvedSensorType = this.resolveSensorTypeByValue(item.SensorType);
      const resolvedSensorName = this.resolveSensorNameByValue(
        resolvedSensorType,
        item.SensorName,
      );

      this.selectedSensorType = resolvedSensorType;
      this.selectedSensorName = resolvedSensorName;

      this.form = {
        EventFilterTableEntry: item.EventFilterTableEntry,
        FilterConfig: item.FilterConfig,
        EvtFilterAction: item.EvtFilterAction,
        AlertPolicyNum: item.AlertPolicyNum,
        EventSeverity: item.EventSeverity || this.list4Defaults.EventSeverity,
        GenIDByte1: item.GenIDByte1,
        GenIDByte2: item.GenIDByte2,
        SensorType: resolvedSensorType,
        SensorName: resolvedSensorName,
        EventTrigger: item.EventTrigger,
        EventData1OffsetMask: item.EventData1OffsetMask,
        EventData1ANDMask: item.EventData1ANDMask,
        EventData1Cmp1: item.EventData1Cmp1,
        EventData1Cmp2: item.EventData1Cmp2,
        EventData2ANDMask: item.EventData2ANDMask,
        EventData2Cmp1: item.EventData2Cmp1,
        EventData2Cmp2: item.EventData2Cmp2,
        EventData3ANDMask: item.EventData3ANDMask,
        EventData3Cmp1: item.EventData3Cmp1,
        EventData3Cmp2: item.EventData3Cmp2,
      };
      this.$bvModal.show('event-filter-modal');
    },

    async onDeleteFilter(item) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageEventFilter.modal.deleteConfirmMessage', {
            index: item.id || item.index,
          }),
          {
            title: this.$t('pageEventFilter.modal.deleteConfirmTitle'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
            okVariant: 'danger',
          },
        )
        .then(async (confirmed) => {
          if (!confirmed) return;

          this.startLoader();
          try {
            const message = await this.$store.dispatch(
              'eventFilter/deleteFilter',
              item.uri,
            );
            this.successToast(message);
          } catch (error) {
            this.errorToast(error.message);
          } finally {
            this.endLoader();
          }
        });
    },

    async handleModalOk(bvModalEvent) {
      bvModalEvent.preventDefault();

      const isValid = this.validateForm();
      if (!isValid) {
        return;
      }

      this.startLoader();
      try {
        const message = await this.$store.dispatch('eventFilter/updateFilter', {
          uri: this.currentItem.uri,
          data: this.form,
        });
        this.successToast(message);
        this.$bvModal.hide('event-filter-modal');
      } catch (error) {
        this.errorToast(error.message);
      } finally {
        this.endLoader();
      }
    },

    validateRange(value, min, max) {
      return Number.isFinite(value) && value >= min && value <= max;
    },

    validateAllowedValues(value, allowedValues) {
      return allowedValues.includes(value);
    },

    getValidationChecks() {
      return [
        {
          key: 'FilterConfig',
          valid: this.validateAllowedValues(
            this.form.FilterConfig,
            [0, 64, 128, 192],
          ),
          error: this.$t('pageEventFilter.validation.FilterConfig'),
        },
        {
          key: 'EvtFilterAction',
          valid: this.validateRange(this.form.EvtFilterAction, 0, 127),
          error: this.$t('pageEventFilter.validation.EvtFilterAction'),
        },
        {
          key: 'AlertPolicyNum',
          valid: this.validateRange(this.form.AlertPolicyNum, 0, 127),
          error: this.$t('pageEventFilter.validation.AlertPolicyNum'),
        },
        {
          key: 'EventSeverity',
          valid: this.validateAllowedValues(this.form.EventSeverity, [
            'Information',
            'OK',
            'Warning',
            'Critical',
            'All',
          ]),
          error: this.$t('pageEventFilter.validation.EventSeverity'),
        },
        {
          key: 'GenIDByte1',
          valid: this.validateRange(this.form.GenIDByte1, 0, 255),
          error: this.$t('pageEventFilter.validation.GenIDByte1'),
        },
        {
          key: 'GenIDByte2',
          valid: this.validateRange(this.form.GenIDByte2, 0, 255),
          error: this.$t('pageEventFilter.validation.GenIDByte2'),
        },
        {
          key: 'EventTrigger',
          valid: this.validateRange(this.form.EventTrigger, 0, 255),
          error: this.$t('pageEventFilter.validation.EventTrigger'),
        },
        {
          key: 'EventData1OffsetMask',
          valid: this.validateRange(this.form.EventData1OffsetMask, 0, 65535),
          error: this.$t('pageEventFilter.validation.EventData1OffsetMask'),
        },
        {
          key: 'EventData1ANDMask',
          valid: this.validateRange(this.form.EventData1ANDMask, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData1ANDMask'),
        },
        {
          key: 'EventData1Cmp1',
          valid: this.validateRange(this.form.EventData1Cmp1, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData1Cmp1'),
        },
        {
          key: 'EventData1Cmp2',
          valid: this.validateRange(this.form.EventData1Cmp2, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData1Cmp2'),
        },
        {
          key: 'EventData2ANDMask',
          valid: this.validateRange(this.form.EventData2ANDMask, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData2ANDMask'),
        },
        {
          key: 'EventData2Cmp1',
          valid: this.validateRange(this.form.EventData2Cmp1, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData2Cmp1'),
        },
        {
          key: 'EventData2Cmp2',
          valid: this.validateRange(this.form.EventData2Cmp2, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData2Cmp2'),
        },
        {
          key: 'EventData3ANDMask',
          valid: this.validateRange(this.form.EventData3ANDMask, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData3ANDMask'),
        },
        {
          key: 'EventData3Cmp1',
          valid: this.validateRange(this.form.EventData3Cmp1, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData3Cmp1'),
        },
        {
          key: 'EventData3Cmp2',
          valid: this.validateRange(this.form.EventData3Cmp2, 0, 255),
          error: this.$t('pageEventFilter.validation.EventData3Cmp2'),
        },
      ];
    },

    touchField(field) {
      this.showValidation = true;
      const check = this.getValidationChecks().find(
        (item) => item.key === field,
      );
      if (!check) return;

      if (check.valid) {
        this.$delete(this.validationErrors, field);
      } else {
        this.$set(this.validationErrors, field, check.error);
      }
    },

    getFieldState(field) {
      if (!this.showValidation && !this.validationErrors[field]) {
        return null;
      }
      return this.validationErrors[field] ? false : true;
    },

    getFieldError(field) {
      return this.validationErrors[field] || '';
    },

    validateForm() {
      this.showValidation = true;
      const errors = {};
      this.getValidationChecks().forEach((item) => {
        if (!item.valid) {
          errors[item.key] = item.error;
        }
      });
      this.validationErrors = errors;
      return Object.keys(this.validationErrors).length === 0;
    },

    resetModal() {
      this.currentItem = null;
      this.showValidation = false;
      this.validationErrors = {};
      this.form = {
        EventFilterTableEntry: 1,
        FilterConfig: 0,
        EvtFilterAction: 0,
        AlertPolicyNum: 0,
        EventSeverity: this.list4Defaults.EventSeverity,
        GenIDByte1: 0,
        GenIDByte2: 0,
        SensorType: this.resolveSensorTypeByValue(
          this.list4Defaults.SensorType,
        ),
        SensorName: this.resolveSensorNameByValue(
          this.list4Defaults.SensorType,
          this.list4Defaults.SensorName,
        ),
        EventTrigger: 0,
        EventData1OffsetMask: 0,
        EventData1ANDMask: 0,
        EventData1Cmp1: 0,
        EventData1Cmp2: 0,
        EventData2ANDMask: 0,
        EventData2Cmp1: 0,
        EventData2Cmp2: 0,
        EventData3ANDMask: 0,
        EventData3Cmp1: 0,
        EventData3Cmp2: 0,
      };
      this.selectedSensorType = this.form.SensorType;
      this.selectedSensorName = this.form.SensorName;
    },
  },
};
</script>

<style lang="scss" scoped>
.mb20 {
  margin-bottom: 20px;
  margin-right: 10px;
}
.inline__block {
  display: inline-block;
}
.table-section {
  background: var(--background-color);
  border-radius: 4px;
  border: 1px solid var(--border-color);

  th {
    background: var(--table-header-bg);
    color: var(--table-header-color);
    font-weight: 600;
    border-bottom: 2px solid var(--border-color);
  }

  td {
    vertical-align: middle;
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
