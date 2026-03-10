<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageEventFilter.pageDescription')" />
    <b-form novalidate @submit.prevent="handleSubmit">
      <div class="form-background p-3">
        <b-form-group
          class="m-0"
          :label="$t('pageEventFilter.sectionTitle')"
          label-class="sr-only"
          :disabled="loading"
        >
          <b-row>
            <b-col md="9" lg="8" xl="9">
              <b-form-group :label="$t('pageEventFilter.enableAllEvents')">
                <b-form-checkbox
                  v-model="checkAll"
                  data-test-id="checkAllEventFilter"
                  switch
                  :disabled="isButtonDisable"
                  @change="enableAllTheEvents"
                >
                  <span v-if="checkAll">{{ $t('global.status.enabled') }}</span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="9" lg="8" xl="9">
              <b-row>
                <b-col
                  v-for="(events, $index) in alertData"
                  v-show="events.isSupported"
                  :key="$index"
                  sm="6"
                  xl="4"
                >
                  <b-form-group :label="$t(events.eventName)">
                    <b-form-checkbox
                      v-model="events.enableStatus"
                      data-test-id="alert-input-enable"
                      switch
                      :disabled="isButtonDisable"
                    >
                      <span v-if="events.enableStatus">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
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
                      !$v.retryEventStatus.alertLimits.pattern
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
                      !$v.retryEventStatus.retryCount.pattern
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
                      !$v.retryEventStatus.timeInterval.pattern
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
        <b-row>
          <b-col xl="3">
            <b-form-group
              :label="$t('pageEventFilter.destinationType')"
              label-for="destinationType"
            >
              <b-form-select
                id="destination-type"
                v-model="destinationTypes"
                :options="destinationTypeOptions"
                :disabled="isButtonDisable"
                @change="changeDestinationType($event)"
              >
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </b-form>
  </b-container>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import IconSave from '@carbon/icons-vue/es/save/20';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { requiredIf } from 'vuelidate/lib/validators';

export default {
  name: 'EventFilterSettings',
  components: {
    PageTitle,
    IconSave,
  },
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  data() {
    return {
      alertData: this.$store.getters['eventFilter/getAlertData'],
      loading,
      localCheckAll: '',
      destinationTypes: '',
      destinationTypeOptions: [
        { value: 'SMTP', text: 'SMTP' },
        { value: 'SnmpTrap', text: 'SNMP Trap' },
        { value: 'Both', text: 'Both' },
      ],
      retryEventStatus: {
        retryEnableStatus: false,
        alertLimits: '',
        retryCount: '',
        timeInterval: '',
      },
    };
  },
  computed: {
    checkAll: {
      get() {
        return this.localCheckAll;
      },
      set(newValue) {
        this.localCheckAll = newValue;
      },
    },
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  watch: {
    // Watch for changes in localCheckAll and update the store
    localCheckAll(newValue) {
      this.$store.commit('eventFilter/setCheckAll', newValue);
    },
  },
  created() {
    this.eventFilterInit();
  },
  validations() {
    return {
      retryEventStatus: {
        alertLimits: {
          required: requiredIf(function () {
            if (this.retryEventStatus.retryEnableStatus) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.retryEventStatus.retryEnableStatus
              ? this.validateRange(val, 0, 100)
              : true;
          },
        },
        retryCount: {
          required: requiredIf(function () {
            if (this.retryEventStatus.retryEnableStatus) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.retryEventStatus.retryEnableStatus
              ? this.validateRange(val, 0, 10)
              : true;
          },
        },
        timeInterval: {
          required: requiredIf(function () {
            if (this.retryEventStatus.retryEnableStatus) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.retryEventStatus.retryEnableStatus
              ? this.validateRange(val, 0, 3600)
              : true;
          },
        },
      },
    };
  },
  methods: {
    eventFilterInit() {
      this.startLoader();
      this.$store.dispatch('eventFilter/getEventFilterData').finally(() => {
        this.endLoader();
        this.destinationTypes =
          this.$store.getters['eventFilter/getDestinationType'];
        this.retryEventStatus =
          this.$store.getters['eventFilter/getRetryValues'];
        this.localCheckAll = this.$store.getters['eventFilter/getCheckAll'];
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
        .dispatch('eventFilter/setEventFilterData', {
          properties: this.alertData,
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
    changeDestinationType() {
      this.$store
        .dispatch('eventFilter/saveDestinationType', this.destinationTypes)
        .then((message) => {
          this.successToast(message);
        })
        .catch(({ message }) => this.errorToast(message));
    },
    enableAllTheEvents(checkAll) {
      this.alertData.forEach((each) => {
        each.enableStatus = checkAll;
      });
      // Update localCheckAll when all events are enabled/disabled
      this.localCheckAll = checkAll;
    },
  },
};
</script>
<style scoped>
.mb20 {
  margin-bottom: 20px;
  margin-right: 10px;
}
.inline__block {
  display: inline-block;
}
</style>
