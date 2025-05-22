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
                v-model="videoTriggerEvent.criticalTmpVolt"
                switch
              >
                <span v-if="videoTriggerEvent.criticalTmpVolt">
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
                v-model="videoTriggerEvent.nonCriticalTmpVolt"
                switch
              >
                <span v-if="videoTriggerEvent.nonCriticalTmpVolt">
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
                v-model="videoTriggerEvent.nonRecovTmpVolt"
                switch
              >
                <span v-if="videoTriggerEvent.nonRecovTmpVolt">
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
                v-model="videoTriggerEvent.fanstatechanged"
                switch
              >
                <span v-if="videoTriggerEvent.fanstatechanged">
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
                v-model="videoTriggerEvent.lPCReset"
                switch
              >
                <span v-if="videoTriggerEvent.lPCReset">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              :label="$t('pageVideo.preEventVideoRecord')"
              label-for="password"
            >
              <b-form-checkbox
                id="preEventVideoRecord"
                v-model="videoTriggerEvent.preEventVideoRec"
                switch
              >
                <span v-if="videoTriggerEvent.preEventVideoRec">
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
              :label="$t('pageVideo.videoTriggerSettings.dateAndTime')"
              label-for="password"
            >
              <b-form-checkbox
                id="dateAndTime"
                v-model="videoTriggerEvent.dateandTime"
                switch
              >
                <span v-if="videoTriggerEvent.dateandTime">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <div v-if="videoTriggerEvent.dateandTime">
          <b-row>
            <b-col sm="4">
              <b-form-group
                :label="$t('pageFireWall.firewallSettings.modal.startDate')"
                label-for="startDate"
              >
                <b-input-group class="box-shadow-0">
                  <b-form-input
                    id="startDate"
                    v-model="videoTriggerEvent.Date"
                    data-test-id="dateTime-input-startDate"
                    class="form-control-with-button"
                    :state="getValidationState($v.videoTriggerEvent.Date)"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.videoTriggerEvent.Date.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template
                      v-if="
                        $v.videoTriggerEvent.Date.required &&
                        !$v.videoTriggerEvent.Date.minDate
                      "
                    >
                      {{
                        $t('pageFirmware.form.updateFirmware.dateValidation')
                      }}
                    </template>
                    <template
                      v-if="
                        $v.videoTriggerEvent.Date.required &&
                        $v.videoTriggerEvent.Date.minDate &&
                        !$v.videoTriggerEvent.Date.pattern
                      "
                    >
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                  <b-form-datepicker
                    v-model="videoTriggerEvent.Date"
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
            <b-col sm="4">
              <b-form-group
                :label="$t('pageFireWall.firewallSettings.modal.startTime')"
                label-for="startTime"
              >
                <b-form-input
                  id="startTime"
                  v-model="videoTriggerEvent.Time"
                  data-test-id="dateTime-input-startTime"
                  :state="getValidationState($v.videoTriggerEvent.Time)"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoTriggerEvent.Time.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoTriggerEvent.Time.required &&
                      !$v.videoTriggerEvent.Time.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                  <template
                    v-if="
                      $v.videoTriggerEvent.Time.required &&
                      $v.videoTriggerEvent.Time.pattern &&
                      !$v.videoTriggerEvent.Time.minTime
                    "
                  >
                    {{ $t('pageFirmware.form.updateFirmware.timeValidation') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <!-- <div v-if="videoTriggerEvent.preEventVideoRec">
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
        </div> -->
        <b-row>
          <b-col sm="6">
            <b-btn
              variant="primary"
              type="submit"
              data-test-id="videoTrigger-button-saveSettings"
              @click="onOk"
            >
              <icon-save />
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
import IconSave from '@carbon/icons-vue/es/save/20';
const isoDateRegex = /^([12]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const isoTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

export default {
  name: 'Videotrigger',
  components: { IconCalendar, IconSave },
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  data() {
    return {
      locale: this.$store.getters['global/languagePreference'],
      videoTriggerEvent: {
        criticalTmpVolt: true,
        nonCriticalTmpVolt: true,
        nonRecovTmpVolt: true,
        fanstatechanged: true,
        watchdogTimer: true,
        chassisPowerOn: true,
        chassisPowerOff: true,
        chassisReset: true,
        lPCReset: true,
        preEventVideoRec: true,
        precrash: true,
        preReset: true,
        dateandTime: true,
        Date: '',
        Time: '',
      },
    };
  },
  computed: {
    ...mapState('autoVideo', ['autoVideoRecordFeature']),
    firmwareDateTime() {
      return this.$store.getters['firmware/getFirmwareBmcDateTime'];
    },
  },
  watch: {
    autoVideoRecordFeature() {
      this.initVideoTriggerSettings();
    },
  },
  validations() {
    return {
      videoTriggerEvent: {
        Date: {
          required: requiredIf(function () {
            if (this.videoTriggerEvent.dateandTime) {
              return true;
            }
          }),
          minDate: () => {
            let date = this.firmwareDateTime?.slice(0, 10);
            if (
              this.videoTriggerEvent.dateandTime &&
              this.videoTriggerEvent.Date < this.firmwareDateTime?.slice(0, 10)
            ) {
              return date < this.videoTriggerEvent.Date;
            } else {
              return true;
            }
          },
          pattern: helpers.regex('pattern', isoDateRegex),
        },
        Time: {
          required: requiredIf(function () {
            if (this.videoTriggerEvent.dateandTime) {
              return true;
            }
          }),
          minTime: () => {
            let time = this.firmwareDateTime?.slice(11, 19);
            if (
              this.videoTriggerEvent.dateandTime &&
              this.videoTriggerEvent.Date ===
                this.firmwareDateTime?.slice(0, 10)
            ) {
              return time < this.videoTriggerEvent.Time;
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
      this.startLoader();
      this.$store
        .dispatch('autoVideo/getVideoTriggerSettings')
        .then(() => {
          const config =
            this.$store.getters['autoVideo/getVideoTriggerValues'] || {};
          this.videoTriggerEvent = {
            criticalTmpVolt:
              config.TriggerEvents.criticalTmpVolt == 0 ? false : true,
            nonCriticalTmpVolt:
              config.TriggerEvents.nonCriticalTmpVolt == 0 ? false : true,
            nonRecovTmpVolt:
              config.TriggerEvents.nonRecovTmpVolt == 0 ? false : true,
            fanstatechanged:
              config.TriggerEvents.fanstatechanged == 0 ? false : true,
            watchdogTimer:
              config.TriggerEvents.watchdogTimer == 0 ? false : true,
            chassisPowerOn:
              config.TriggerEvents.chassisPowerOn == 0 ? false : true,
            chassisPowerOff:
              config.TriggerEvents.chassisPowerOff == 0 ? false : true,
            chassisReset: config.TriggerEvents.chassisReset == 0 ? false : true,
            lPCReset: config.TriggerEvents.lPCReset == 0 ? false : true,
            dateandTime: config.TriggerEvents.dateandTime == 0 ? false : true,
            preEventVideoRec:
              config.TriggerEvents.preEventVideoRec == 0 ? false : true,
            Date: config.Date,
            Time: config.Time,
          };
        })
        .finally(() => {
          this.endLoader();
        });
    },
    onOk() {
      this.minValidationStatus().then(() => {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        let params = {};
        params = {
          TriggerEvents: {
            criticalTmpVolt: this.videoTriggerEvent.criticalTmpVolt ? 1 : 0,
            nonCriticalTmpVolt: this.videoTriggerEvent.nonCriticalTmpVolt
              ? 1
              : 0,
            nonRecovTmpVolt: this.videoTriggerEvent.nonRecovTmpVolt ? 1 : 0,
            fanstatechanged: this.videoTriggerEvent.fanstatechanged ? 1 : 0,
            watchdogTimer: this.videoTriggerEvent.watchdogTimer ? 1 : 0,
            chassisPowerOn: this.videoTriggerEvent.chassisPowerOn ? 1 : 0,
            chassisPowerOff: this.videoTriggerEvent.chassisPowerOff ? 1 : 0,
            chassisReset: this.videoTriggerEvent.chassisReset ? 1 : 0,
            lPCReset: this.videoTriggerEvent.lPCReset ? 1 : 0,
            dateandTime: this.videoTriggerEvent.dateandTime ? 1 : 0,
            preEventVideoRec: this.videoTriggerEvent.preEventVideoRec ? 1 : 0,
          },
        };

        if (this.videoTriggerEvent.dateandTime) {
          params.Date = this.videoTriggerEvent.Date;
          params.Time = this.videoTriggerEvent.Time;
        }

        this.startLoader();
        this.$store
          .dispatch('autoVideo/setVideoTriggerSettings', params)
          .then((success) => {
            this.successToast(success);
            this.initVideoTriggerSettings();
          })
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      });
    },
    minValidationStatus() {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('firmware/getActiveBmcFirmware')
          .then(() => {
            let timeValueBmc = this.firmwareDateTime;
            if (
              this.firmwareDateTime?.slice(0, 10) ===
                this.videoTriggerEvent.Date &&
              timeValueBmc?.slice(11, 19) >= this.videoTriggerEvent.Time
            ) {
              this.$v.$touch();
            }
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
</script>
<style scoped>
.box-shadow-0 {
  box-shadow: none;
}
</style>
