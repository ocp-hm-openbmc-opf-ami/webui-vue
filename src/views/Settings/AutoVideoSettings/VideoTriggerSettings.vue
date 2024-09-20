<template>
  <b-container fluid="xl">
    <b-row>
      <b-col xl="9">
        <b-row>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.critical')"
              label-for="password"
            >
              <b-form-checkbox
                id="critical"
                v-model="videoTriggerEvent.critical"
                switch
              >
                <span v-if="videoTriggerEvent.critical">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.nonCritical')"
              label-for="password"
            >
              <b-form-checkbox
                id="nonCritical"
                v-model="videoTriggerEvent.nonCritical"
                switch
              >
                <span v-if="videoTriggerEvent.nonCritical">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.nonRecoverable')"
              label-for="password"
            >
              <b-form-checkbox
                id="nonRecoverable"
                v-model="videoTriggerEvent.nonRecoverable"
                switch
              >
                <span v-if="videoTriggerEvent.nonRecoverable">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.fanStateChanged')"
              label-for="password"
            >
              <b-form-checkbox
                id="fanStateChanged"
                v-model="videoTriggerEvent.fanStateChanged"
                switch
              >
                <span v-if="videoTriggerEvent.fanStateChanged">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.watchdogTimer')"
              label-for="password"
            >
              <b-form-checkbox
                id="watchdogTimer"
                v-model="videoTriggerEvent.watchdogTimer"
                switch
              >
                <span v-if="videoTriggerEvent.watchdogTimer">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.chassisPowerOn')"
              label-for="password"
            >
              <b-form-checkbox
                id="chassisPowerOn"
                v-model="videoTriggerEvent.chassisPowerOn"
                switch
              >
                <span v-if="videoTriggerEvent.chassisPowerOn">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.chassisPowerOff')"
              label-for="password"
            >
              <b-form-checkbox
                id="chassisPowerOff"
                v-model="videoTriggerEvent.chassisPowerOff"
                switch
              >
                <span v-if="videoTriggerEvent.chassisPowerOff">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.chassisReset')"
              label-for="password"
            >
              <b-form-checkbox
                id="chassisReset"
                v-model="videoTriggerEvent.chassisReset"
                switch
              >
                <span v-if="videoTriggerEvent.chassisReset">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.LPCReset')"
              label-for="password"
            >
              <b-form-checkbox
                id="lpcReset"
                v-model="videoTriggerEvent.lpcReset"
                switch
              >
                <span v-if="videoTriggerEvent.lpcReset">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.videoTriggerSettings.dateAndTime')"
              label-for="password"
            >
              <b-form-checkbox
                id="dateAndTime"
                v-model="videoTriggerEvent.dateAndTime"
                switch
              >
                <span v-if="videoTriggerEvent.dateAndTime">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.preEventVideoRecord')"
              label-for="password"
            >
              <b-form-checkbox
                id="preEventVideoRecord"
                v-model="videoTriggerEvent.preEventVideoRecord"
                switch
              >
                <span v-if="videoTriggerEvent.preEventVideoRecord">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <div v-if="videoTriggerEvent.dateAndTime">
          <b-row>
            <b-col sm="4">
              <b-form-group
                :label="$t('pageFireWall.firewallSettings.modal.startDate')"
                label-for="startDate"
              >
                <b-input-group class="box-shadow-0">
                  <b-form-input
                    id="startDate"
                    v-model="videoTriggerEvent.startDate"
                    data-test-id="dateTime-input-startDate"
                    class="form-control-with-button"
                    :state="getValidationState($v.videoTriggerEvent.startDate)"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.videoTriggerEvent.startDate.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template
                      v-if="
                        $v.videoTriggerEvent.startDate.required &&
                        !$v.videoTriggerEvent.startDate.minDate
                      "
                    >
                      {{
                        $t('pageFirmware.form.updateFirmware.dateValidation')
                      }}
                    </template>
                    <template
                      v-if="
                        $v.videoTriggerEvent.startDate.required &&
                        $v.videoTriggerEvent.startDate.minDate &&
                        !$v.videoTriggerEvent.startDate.pattern
                      "
                    >
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                  <b-form-datepicker
                    v-model="videoTriggerEvent.startDate"
                    class="btn-datepicker btn-icon-only"
                    button-only
                    right
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
            <b-col sm="4">
              <b-form-group
                :label="$t('pageFireWall.firewallSettings.modal.startTime')"
                label-for="startTime"
              >
                <b-form-input
                  id="startTime"
                  v-model="videoTriggerEvent.startTime"
                  data-test-id="dateTime-input-startTime"
                  :state="getValidationState($v.videoTriggerEvent.startTime)"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoTriggerEvent.startTime.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoTriggerEvent.startTime.required &&
                      !$v.videoTriggerEvent.startTime.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                  <template
                    v-if="
                      $v.videoTriggerEvent.startTime.required &&
                      $v.videoTriggerEvent.startTime.pattern &&
                      !$v.videoTriggerEvent.startTime.minTime
                    "
                  >
                    {{ $t('pageFirmware.form.updateFirmware.timeValidation') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <div v-if="videoTriggerEvent.preEventVideoRecord">
          <b-form-group
            :label="$t('pageVideo.videoTriggerSettings.crashReset')"
            label-for="password"
          ></b-form-group>
          <b-row>
            <b-col sm="4">
              <b-form-group
                :label="$t('pageVideo.videoTriggerSettings.precrash')"
                label-for="password"
              >
                <b-form-checkbox
                  id="precrash"
                  v-model="videoTriggerEvent.precrash"
                  switch
                >
                  <span v-if="videoTriggerEvent.precrash">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group
                :label="$t('pageVideo.videoTriggerSettings.preReset')"
                label-for="password"
              >
                <b-form-checkbox
                  id="preReset"
                  v-model="videoTriggerEvent.preReset"
                  switch
                >
                  <span v-if="videoTriggerEvent.preReset">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <b-row>
          <b-col sm="6">
            <b-btn
              variant="primary"
              type="submit"
              data-test-id="videoTrigger-button-saveSettings"
              @click="onOk"
            >
              {{ $t('global.action.save') }}
            </b-btn>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconCalendar from '@carbon/icons-vue/es/calendar/20';
import { requiredIf, helpers } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { mapState } from 'vuex';
const isoDateRegex = /^([12]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const isoTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export default {
  name: 'Videotrigger',
  components: { IconCalendar },
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  data() {
    return {
      locale: this.$store.getters['global/languagePreference'],
      videoTriggerEvent: {
        critical: true,
        nonCritical: true,
        nonRecoverable: true,
        fanStateChanged: true,
        watchdogTimer: true,
        chassisPowerOn: true,
        chassisPowerOff: true,
        chassisReset: true,
        lpcReset: true,
        preEventVideoRecord: true,
        precrash: true,
        preReset: true,
        dateAndTime: true,
        startDate: '',
        startTime: '',
      },
    };
  },
  computed: {
    ...mapState('autoVideo', ['videoTriggervalues']),
    firmwareDateTime() {
      return this.$store.getters['firmware/getFirmwareBmcDateTime'];
    },
  },
  watch: {
    videoTriggervalues() {
      this.initVideoTriggerSettings();
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('autoVideo/getvideoTriggerSettings').finally(() => {
      this.endLoader();
    });
  },
  validations() {
    return {
      videoTriggerEvent: {
        startDate: {
          required: requiredIf(function () {
            if (this.videoTriggerEvent.dateAndTime) {
              return true;
            }
          }),
          minDate: () => {
            let date = this.firmwareDateTime?.slice(0, 10);
            if (
              this.videoTriggerEvent.dateAndTime &&
              this.videoTriggerEvent.startDate <
                this.firmwareDateTime?.slice(0, 10)
            ) {
              return date < this.videoTriggerEvent.startDate;
            } else {
              return true;
            }
          },
          pattern: helpers.regex('pattern', isoDateRegex),
        },
        startTime: {
          required: requiredIf(function () {
            if (this.videoTriggerEvent.dateAndTime) {
              return true;
            }
          }),
          minTime: () => {
            let time = this.firmwareDateTime?.slice(11, 19);
            if (
              this.videoTriggerEvent.dateAndTime &&
              this.videoTriggerEvent.startDate <
                this.firmwareDateTime?.slice(0, 10)
            ) {
              return time < this.videoTriggerEvent.startTime;
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
    initVideoTriggerSettings() {
      const config =
        this.$store.getters['autoVideo/getVideoTriggervalues'] || {};

      let dateTimeValue = config.date_time_to_record;
      let dateElement =
        dateTimeValue != undefined && dateTimeValue != ''
          ? dateTimeValue.split('T')
          : '';
      let timeElement =
        dateElement != '' ? dateElement[1].split('+').shift() : '';
      this.videoTriggerEvent = {
        critical: config.critical_events_enable,
        nonCritical: config.non_critical_events_enable,
        nonRecoverable: config.non_recoverable_events_enable,
        fanStateChanged: config.fan_state_events_enable,
        watchdogTimer: config.watchdog_events_enable,
        chassisPowerOn: config.chassis_power_on_events_enable,
        chassisPowerOff: config.chassis_power_off_events_enable,
        chassisReset: config.chassis_reset_events_enable,
        lpcReset: config.lpc_reset_events_enable,
        dateAndTime: config.critical_events_enable,
        preEventVideoRecord: config.pre_event_video,
        startDate: dateElement != '' ? dateElement[0] : '',
        startTime: timeElement.slice(0, 5),
      };
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
    },
  },
};
</script>
<style scoped>
.box-shadow-0 {
  box-shadow: none;
}
</style>
