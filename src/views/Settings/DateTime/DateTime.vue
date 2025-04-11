<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col md="8" xl="6">
        <alert variant="info" class="mb-4">
          <span>
            {{ $t('pageDateTime.alert.message', { timeZoneName }) }}
            <b-link to="/profile-settings">
              {{ $t('pageDateTime.alert.link') }}</b-link
            >
          </span>
        </alert>
      </b-col>
    </b-row>
    <page-section>
      <b-row>
        <b-col lg="3">
          <dl>
            <dt>{{ $t('pageDateTime.form.date') }}</dt>
            <dd v-if="bmcTime">{{ bmcTime | formatDate }}</dd>
            <dd v-else>--</dd>
          </dl>
        </b-col>
        <b-col lg="3">
          <dl>
            <dt>{{ $t('pageDateTime.form.time.label') }}</dt>
            <dd v-if="bmcTime">{{ bmcTime | formatTime }}</dd>
            <dd v-else>--</dd>
          </dl>
        </b-col>
      </b-row>
    </page-section>
    <page-section :section-title="$t('pageDateTime.configureSettings')">
      <b-form novalidate @submit.prevent="submitForm">
        <b-form-group
          label="Configure date and time"
          :disabled="loading"
          label-sr-only
        >
          <b-row class="mt-3 ml-3">
            <b-col xl="6">
              <b-form-group
                :label="$t('pageDateTime.form.timezone')"
                label-for="timeZone"
              >
                <v-select
                  v-model="form.ntp.timeZoneName"
                  :options="timeZoneOptions"
                  placeholder="Select an option"
                  class="select-timeZone"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-radio
            v-model="form.configurationSelected"
            value="manual"
            data-test-id="dateTime-radio-configureManual"
          >
            {{ $t('pageDateTime.form.manual') }}
          </b-form-radio>
          <b-row class="mt-3 ml-3">
            <b-col sm="6" lg="4" xl="3">
              <b-form-group
                :label="$t('pageDateTime.form.date')"
                label-for="input-manual-date"
              >
                <b-form-text id="date-format-help">YYYY-MM-DD</b-form-text>
                <b-input-group>
                  <b-form-input
                    id="input-manual-date"
                    v-model="form.manual.date"
                    :state="getValidationState($v.form.manual.date)"
                    :disabled="ntpOptionSelected"
                    data-test-id="dateTime-input-manualDate"
                    class="form-control-with-button"
                    @blur="$v.form.manual.date.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <div v-if="!$v.form.manual.date.pattern">
                      {{ $t('global.form.invalidFormat') }}
                    </div>
                    <div v-if="!$v.form.manual.date.required">
                      {{ $t('global.form.fieldRequired') }}
                    </div>
                  </b-form-invalid-feedback>
                  <b-form-datepicker
                    v-model="form.manual.date"
                    class="btn-datepicker btn-icon-only"
                    button-only
                    right
                    :hide-header="true"
                    :locale="locale"
                    :min="dateMin"
                    :max="dateMax"
                    :label-help="
                      $t('global.calendar.useCursorKeysToNavigateCalendarDates')
                    "
                    :title="$t('global.calendar.selectDate')"
                    :disabled="ntpOptionSelected"
                    button-variant="link"
                    aria-controls="input-manual-date"
                  >
                    <template #button-content>
                      <icon-calendar />
                      <span class="sr-only">
                        {{ $t('global.calendar.selectDate') }}
                      </span>
                    </template>
                  </b-form-datepicker>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col sm="6" lg="4" xl="3">
              <b-form-group
                :label="$t('pageDateTime.form.time.timezone', { timezone })"
                label-for="input-manual-time"
              >
                <b-form-text id="time-format-help">HH:MM</b-form-text>
                <b-input-group>
                  <b-form-input
                    id="input-manual-time"
                    v-model="form.manual.time"
                    :state="getValidationState($v.form.manual.time)"
                    :disabled="ntpOptionSelected"
                    data-test-id="dateTime-input-manualTime"
                    @blur="$v.form.manual.time.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <div v-if="!$v.form.manual.time.pattern">
                      {{ $t('global.form.invalidFormat') }}
                    </div>
                    <div v-if="!$v.form.manual.time.required">
                      {{ $t('global.form.fieldRequired') }}
                    </div>
                  </b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-radio
            v-model="form.configurationSelected"
            value="ntp"
            data-test-id="dateTime-radio-configureNTP"
          >
            NTP
          </b-form-radio>
          <b-row class="mt-3 ml-3">
            <b-col sm="6" lg="4" xl="3">
              <b-form-group
                :label="$t('pageDateTime.form.ntpServers.server1')"
                label-for="input-ntp-1"
              >
                <b-input-group>
                  <b-form-input
                    id="input-ntp-1"
                    v-model="form.ntp.firstAddress"
                    :state="getValidationState($v.form.ntp.firstAddress)"
                    :disabled="manualOptionSelected"
                    data-test-id="dateTime-input-ntpServer1"
                    @input="$v.form.ntp.firstAddress.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.ntp.firstAddress.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template v-if="!$v.form.ntp.firstAddress.pattern">
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col sm="6" lg="4" xl="3">
              <b-form-group
                :label="$t('pageDateTime.form.ntpServers.server2')"
                label-for="input-ntp-2"
              >
                <b-input-group>
                  <b-form-input
                    id="input-ntp-2"
                    v-model="form.ntp.secondAddress"
                    :state="getValidationState($v.form.ntp.secondAddress)"
                    :disabled="manualOptionSelected"
                    data-test-id="dateTime-input-ntpServer2"
                    @input="$v.form.ntp.secondAddress.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.ntp.secondAddress.pattern">
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col sm="6" lg="4" xl="3">
              <b-form-group
                :label="$t('pageDateTime.form.ntpServers.server3')"
                label-for="input-ntp-3"
              >
                <b-input-group>
                  <b-form-input
                    id="input-ntp-3"
                    v-model="form.ntp.thirdAddress"
                    :state="getValidationState($v.form.ntp.thirdAddress)"
                    :disabled="manualOptionSelected"
                    data-test-id="dateTime-input-ntpServer3"
                    @input="$v.form.ntp.thirdAddress.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.ntp.thirdAddress.pattern">
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-button
            variant="primary"
            type="submit"
            data-test-id="dateTime-button-saveSettings"
          >
            {{ $t('global.action.save') }}
          </b-button>
        </b-form-group>
      </b-form>
    </page-section>
  </b-container>
</template>

<script>
import Alert from '@/components/Global/Alert';
import IconCalendar from '@carbon/icons-vue/es/calendar/20';
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';

import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import LocalTimezoneLabelMixin from '@/components/Mixins/LocalTimezoneLabelMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import timezone from '@/locales/time-zone.json';
import { mapState } from 'vuex';
import { requiredIf, helpers } from 'vuelidate/lib/validators';

const isoDateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
const isoTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export default {
  name: 'DateTime',
  components: { Alert, IconCalendar, PageTitle, PageSection },
  mixins: [
    BVToastMixin,
    LoadingBarMixin,
    LocalTimezoneLabelMixin,
    VuelidateMixin,
  ],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      locale: this.$store.getters['global/languagePreference'],
      form: {
        configurationSelected: 'manual',
        manual: {
          date: '',
          time: '',
        },
        ntp: {
          firstAddress: '',
          secondAddress: '',
          thirdAddress: '',
          timeZoneName: this.$store.getters['global/timeZone'],
        },
      },
      loading,
      timeZoneOptions: this.combinedUniqueTimeZoneOptions(),
      dateMin: '1970-01-02',
      dateMax: '2038-01-18',
    };
  },
  validations() {
    return {
      form: {
        manual: {
          date: {
            required: requiredIf(function () {
              return this.form.configurationSelected === 'manual';
            }),
            pattern: helpers.regex('pattern', isoDateRegex),
          },
          time: {
            required: requiredIf(function () {
              return this.form.configurationSelected === 'manual';
            }),
            pattern: helpers.regex('pattern', isoTimeRegex),
          },
        },
        ntp: {
          firstAddress: {
            required: requiredIf(function () {
              return this.form.configurationSelected === 'ntp';
            }),
            pattern: function (val) {
              return this.ntpServerValidation(val);
            },
          },
          secondAddress: {
            pattern: function (val) {
              return this.ntpServerValidation(val);
            },
          },
          thirdAddress: {
            pattern: function (val) {
              return this.ntpServerValidation(val);
            },
          },
        },
      },
    };
  },
  computed: {
    ...mapState('dateTime', ['ntpServers', 'isNtpProtocolEnabled']),
    bmcTime() {
      return this.$store.getters['global/bmcTime'];
    },
    timeZoneOffset() {
      return this.$store.getters['global/timeZone'];
    },
    ntpOptionSelected() {
      return this.form.configurationSelected === 'ntp';
    },
    manualOptionSelected() {
      return this.form.configurationSelected === 'manual';
    },
    isUtcDisplay() {
      return this.$store.getters['global/isUtcDisplay'];
    },
    timezone() {
      if (this.isUtcDisplay) {
        return this.$options.filters.shortTzOffset(this.timeZoneName);
      }
      return this.localOffset();
    },
    timeZoneName() {
      return this.$store.getters['global/timeZone'];
    },
  },
  watch: {
    ntpServers() {
      this.setNtpValues();
    },
    manualDate() {
      this.emitChange();
    },
    bmcTime() {
      this.form.manual.date = this.$options.filters.formatDate(
        this.$store.getters['global/bmcTime'],
      );
      this.form.manual.time = this.$options.filters
        .formatTime(this.$store.getters['global/bmcTime'])
        .slice(0, 5);
    },
    timeZoneOffset(newVal) {
      this.form.ntp.timeZoneName = newVal;
    },
  },
  created() {
    this.startLoader();
    this.setNtpValues();
    Promise.all([
      this.$store.dispatch('global/getBmcTime'),
      this.$store.dispatch('dateTime/getNtpData'),
    ]).finally(() => this.endLoader());
  },
  methods: {
    combinedUniqueTimeZoneOptions() {
      const combinedUniqueTimeZone = [
        ...new Set([
          ...Intl.supportedValuesOf('timeZone'),
          ...timezone.missingTimeZones,
        ]),
      ].sort();
      return combinedUniqueTimeZone;
    },
    emitChange() {
      if (this.$v.$invalid) return;
      this.$v.$reset(); //reset to re-validate on blur
      this.$emit('change', {
        manualDate: this.manualDate ? new Date(this.manualDate) : null,
      });
    },
    setNtpValues() {
      this.form.configurationSelected = this.isNtpProtocolEnabled
        ? 'ntp'
        : 'manual';
      [
        this.form.ntp.firstAddress = '',
        this.form.ntp.secondAddress = '',
        this.form.ntp.thirdAddress = '',
      ] = [this.ntpServers[0], this.ntpServers[1], this.ntpServers[2]];
    },
    submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.startLoader();

      let dateTimeForm = {};
      let isNTPEnabled = this.form.configurationSelected === 'ntp';
      dateTimeForm.TimeZoneName = this.form.ntp.timeZoneName;
      if (!isNTPEnabled) {
        const isUtcDisplay = this.$store.getters['global/isUtcDisplay'];
        let date;

        dateTimeForm.ntpProtocolEnabled = false;

        if (isUtcDisplay) {
          // Create UTC Date
          date = this.getUtcDate(this.form.manual.date, this.form.manual.time);
          dateTimeForm.updatedDateTime = date.toISOString().split('.')[0];
        } else {
          // Create local Date
          date = new Date(`${this.form.manual.date} ${this.form.manual.time}`);
          let options = {
            timeZone: this.form.ntp.timeZoneName,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          };
          dateTimeForm.updatedDateTime = new Intl.DateTimeFormat(
            'en-CA',
            options,
          )
            .format(date)
            .replace(', ', 'T');
        }
      } else {
        dateTimeForm.ntpProtocolEnabled = true;

        const ntpArray = [
          this.form.ntp.firstAddress,
          this.form.ntp.secondAddress,
          this.form.ntp.thirdAddress,
        ];

        // Filter the ntpArray to remove empty strings,
        // per Redfish spec there should be no empty strings or null on the ntp array.
        const ntpArrayFiltered = ntpArray.filter((x) => x);

        dateTimeForm.ntpServersArray = [...ntpArrayFiltered];

        [this.ntpServers[0], this.ntpServers[1], this.ntpServers[2]] = [
          ...dateTimeForm.ntpServersArray,
        ];

        this.setNtpValues();
      }

      this.$store
        .dispatch('dateTime/updateDateTime', dateTimeForm)
        .then((success) => {
          this.successToast(success);
          if (!isNTPEnabled) return;
          // Shift address up if second address is empty
          // to avoid refreshing after delay when updating NTP
          if (!this.form.ntp.secondAddress && this.form.ntp.thirdAddress) {
            this.form.ntp.secondAddress = this.form.ntp.thirdAddress;
            this.form.ntp.thirdAddress = '';
          }
        })
        .then(() => {
          setTimeout(() => {
            this.$store.dispatch('global/getBmcTime');
            this.$store.dispatch('dateTime/getNtpData');
          }, 5000);
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.$v.form.$reset();
          this.endLoader();
        });
    },
    getUtcDate(date, time) {
      // Split user input string values to create
      // a UTC Date object
      const datesArray = date.split('-');
      const timeArray = time.split(':');
      let utcDate = Date.UTC(
        datesArray[0], // User input year
        //UTC expects zero-index month value 0-11 (January-December)
        //for reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC#Parameters
        parseInt(datesArray[1]) - 1, // User input month
        datesArray[2], // User input day
        timeArray[0], // User input hour
        timeArray[1], // User input minute
      );
      return new Date(utcDate);
    },
    ntpServerValidation(value) {
      if (
        !/^$/gi.test(value) &&
        (!(
          /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))(.*\.)?.*\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/gi.test(
            value,
          ) ||
          /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/gi.test(
            value,
          )
        ) ||
          String(value).charAt(0) == '0' ||
          '#255.255.255.0#0.24.56.4#255.255.255.255#'.indexOf(
            '#' + value + '#',
          ) > -1 ||
          !/^([a-z0-9\\S\\_\\-\\.\\:]+)$/.test(value))
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.b-form-datepicker {
  z-index: 1;
}
</style>
