<template>
  <div>
    <page-section>
      <b-card-group deck>
        <b-card>
          <template #header>
            <p class="font-weight-bold m-0">
              {{ $t('pageFirmware.form.updateFirmware.applyTime') }}
            </p>
          </template>
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="$t('pageFirmware.form.updateFirmware.applyTime')"
                label-for="applyTimeMode"
              >
                <b-form-select
                  id="applyTimeMode"
                  v-model="form.applyTimeMode"
                  class="input"
                  :options="applyTimeModeOptions"
                  data-test-id="applyTimeMode-option"
                  :state="getValidationState($v.form.applyTimeMode)"
                  @change="applyTimeModeChange"
                ></b-form-select>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.applyTimeMode.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col
              v-if="
                form.applyTimeMode == 'AtMaintenanceWindowStart' ||
                form.applyTimeMode == 'InMaintenanceWindowOnReset'
              "
              sm="6"
            >
              <b-form-group
                :label="
                  $t(
                    'pageFirmware.form.updateFirmware.maintenanceWindowDurationInSeconds',
                  )
                "
                label-for="timeSlot"
              >
                <b-form-input
                  id="timeSlot"
                  v-model="form.timeSlot"
                  type="text"
                  :state="getValidationState($v.form.timeSlot)"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.timeSlot.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.form.timeSlot.required && !$v.form.timeSlot.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row
            v-if="
              form.applyTimeMode == 'AtMaintenanceWindowStart' ||
              form.applyTimeMode == 'InMaintenanceWindowOnReset'
            "
          >
            <b-col sm="6">
              <b-form-group
                :label="
                  $t(
                    'pageFirmware.form.updateFirmware.maintenanceWindowStartDate',
                  )
                "
                label-for="startDate"
              >
                <b-input-group class="box-shadow-0">
                  <b-form-input
                    id="startDate"
                    v-model="form.endDate"
                    data-test-id="dateTime-input-endDate"
                    class="form-control-with-button"
                    :state="getValidationState($v.form.endDate)"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.endDate.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template
                      v-if="
                        $v.form.endDate.required && !$v.form.endDate.minDate
                      "
                    >
                      {{
                        $t('pageFirmware.form.updateFirmware.dateValidation')
                      }}
                    </template>
                    <template
                      v-if="
                        $v.form.endDate.required &&
                        $v.form.endDate.minDate &&
                        !$v.form.endDate.pattern
                      "
                    >
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                  <b-form-datepicker
                    v-model="form.endDate"
                    class="btn-datepicker btn-icon-only"
                    button-only
                    right
                    :min="firmwareDateTime"
                    :hide-header="true"
                    :locale="locale"
                    :label-help="
                      $t('global.calendar.useCursorKeysToNavigateCalendarDates')
                    "
                    :title="$t('global.calendar.selectDate')"
                    button-variant="link"
                    aria-controls="input-start-date"
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
            <b-col sm="6">
              <b-form-group
                :label="
                  $t(
                    'pageFirmware.form.updateFirmware.maintenanceWindowStartTime',
                  )
                "
                label-for="endTime"
              >
                <b-form-input
                  id="endTime"
                  v-model="form.endTime"
                  data-test-id="dateTime-input-endTime"
                  :state="getValidationState($v.form.endTime)"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.endTime.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="$v.form.endTime.required && !$v.form.endTime.pattern"
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                  <template
                    v-if="
                      $v.form.endTime.required &&
                      $v.form.endTime.pattern &&
                      !$v.form.endTime.minTime
                    "
                  >
                    {{ $t('pageFirmware.form.updateFirmware.timeValidation') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-card-group>
    </page-section>
  </div>
</template>

<script>
import { required, requiredIf, helpers } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import PageSection from '@/components/Global/PageSection';
import IconCalendar from '@carbon/icons-vue/es/calendar/20';

const isoDateRegex = /^([12]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const isoTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

export default {
  components: { PageSection, IconCalendar },
  mixins: [VuelidateMixin],
  props: {
    currentBmcTimeValue: {
      type: String,
      required: true,
    },
    setApplyTimeStatus: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      locale: this.$store.getters['global/languagePreference'],
      sectionTitle: 'Apply TIme',
      applyTimeModeOptions: [
        {
          text: this.$t('pageFirmware.form.updateFirmware.immediate'),
          value: 'Immediate',
        },
        {
          text: this.$t('pageFirmware.form.updateFirmware.onReset'),
          value: 'OnReset',
        },
        {
          text: this.$t(
            'pageFirmware.form.updateFirmware.atMaintenanceWindowStart',
          ),
          value: 'AtMaintenanceWindowStart',
        },
        {
          text: this.$t(
            'pageFirmware.form.updateFirmware.inMaintenanceWindowOnReset',
          ),
          value: 'InMaintenanceWindowOnReset',
        },
      ],
      form: {
        applyTimeMode: '',
        endDate: '',
        endTime: '',
        timeSlot: '',
      },
      applyTimeSetValueStatus: {},
    };
  },
  computed: {
    firmwareDateTime() {
      return this.$store.getters['firmware/getFirmwareBmcDateTime'];
    },
  },
  watch: {
    currentBmcTimeValue(val) {
      this.firmwareDateTime;
      if (
        (this.form.applyTimeMode == 'AtMaintenanceWindowStart' ||
          this.form.applyTimeMode == 'InMaintenanceWindowOnReset') &&
        this.firmwareDateTime?.slice(0, 10) === this.form.endDate &&
        val?.slice(11, 19) >= this.form.endTime
      ) {
        this.$v.$touch();
        this.$emit('validationSuccess', true);
      }
    },
    form: {
      handler() {
        this.emitIfValid();
      },
      deep: true,
    },
    setApplyTimeStatus(val) {
      this.applyTimeSetValueStatus = val;
      this.initChanges();
    },
  },
  created() {
    this.initChanges();
  },
  validations() {
    return {
      form: {
        applyTimeMode: {
          required,
        },
        timeSlot: {
          required: requiredIf(function () {
            if (
              this.form.applyTimeMode == 'AtMaintenanceWindowStart' ||
              this.form.applyTimeMode == 'InMaintenanceWindowOnReset'
            ) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.secondsValueValidation(val);
          },
        },
        endDate: {
          required: requiredIf(function () {
            if (
              this.form.applyTimeMode == 'AtMaintenanceWindowStart' ||
              this.form.applyTimeMode == 'InMaintenanceWindowOnReset'
            ) {
              return true;
            }
          }),
          minDate: () => {
            let date = this.firmwareDateTime?.slice(0, 10);
            if (this.form.endDate < this.firmwareDateTime?.slice(0, 10)) {
              return date < this.form.endDate;
            } else {
              return true;
            }
          },
          pattern: helpers.regex('pattern', isoDateRegex),
        },
        endTime: {
          required: requiredIf(function () {
            if (
              this.form.applyTimeMode == 'AtMaintenanceWindowStart' ||
              this.form.applyTimeMode == 'InMaintenanceWindowOnReset'
            ) {
              return true;
            }
          }),
          minTime: () => {
            let time = this.firmwareDateTime?.slice(11, 19);
            if (this.firmwareDateTime?.slice(0, 10) === this.form.endDate) {
              return time < this.form.endTime;
            } else {
              return true;
            }
          },
          pattern: helpers.regex('pattern', isoTimeRegex),
        },
      },
    };
  },
  methods: {
    secondsValueValidation(value) {
      if (
        (this.form.applyTimeMode == 'AtMaintenanceWindowStart' ||
          this.form.applyTimeMode == 'InMaintenanceWindowOnReset') &&
        (!(parseInt(value) > 0 && parseInt(value) <= 9999) ||
          !/^[1-9][0-9]*$/.test(value))
      ) {
        return false;
      } else {
        return true;
      }
    },
    applyTimeModeChange() {
      if (
        this.form.applyTimeMode == 'AtMaintenanceWindowStart' ||
        this.form.applyTimeMode == 'InMaintenanceWindowOnReset'
      ) {
        this.minValidationStatus();
        this.$v.$touch();
        this.$emit('validationSuccess', true);
        this.$emit('applyTimeForm', this.form);
      } else {
        this.$emit('validationSuccess', false);
        this.$emit('applyTimeForm', this.form);
      }
      this.emitIfValid();
    },
    emitIfValid() {
      if (
        (this.$v.$invalid &&
          this.form.applyTimeMode == 'AtMaintenanceWindowStart') ||
        this.form.applyTimeMode == 'InMaintenanceWindowOnReset'
      ) {
        this.$emit('validationSuccess', this.$v.$invalid);
      } else {
        this.$emit('validationSuccess', false);
        this.$emit('applyTimeForm', this.form);
      }
    },
    minValidationStatus() {
      this.$store.dispatch('firmware/getActiveBmcFirmware').then(() => {
        this.firmwareDateTime;
      });
    },
    initChanges() {
      this.applyTimeSetValueStatus =
        this.$store.getters['firmware/getApplyTimeSetValue'];
      let dateTimeValue = this.applyTimeSetValueStatus.endDateTime;
      let dateElement =
        dateTimeValue != undefined && dateTimeValue != ''
          ? dateTimeValue.split('T')
          : '';
      let timeElement =
        dateElement != '' ? dateElement[1].split('+').shift() : '';
      this.form.endDate = dateElement != '' ? dateElement[0] : '';
      this.form.endTime = timeElement;
      this.form.applyTimeMode = this.applyTimeSetValueStatus.applyTimeMode;
      this.form.timeSlot = this.applyTimeSetValueStatus.timeSlot;
      this.applyTimeModeChange();
    },
  },
};
</script>
<style scoped>
.box-shadow-0 {
  box-shadow: none;
}
</style>
