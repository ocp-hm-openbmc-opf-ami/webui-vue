<template>
  <b-modal
    id="modal-add-firewall"
    ref="modal"
    :title="$t('pageFireWall.firewallSettings.modal.addFirewallSettings')"
    @hidden="resetForm"
  >
    <b-form id="form-addFirewallRules" @submit.prevent="handleSubmit">
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.protocol')"
            label-for="protocol"
          >
            <b-form-select
              id="protocol"
              v-model="form.protocol"
              class="input"
              :options="protocolOptions"
              data-test-id="protocol-option"
              :state="getValidationState($v.form.protocol)"
              ><template #first>
                <b-form-select-option :value="valuedefault" disabled>
                  {{ $t('global.form.selectAnOption') }}
                </b-form-select-option>
              </template></b-form-select
            >
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.protocol.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.target')"
            label-for="target"
          >
            <b-form-select
              id="target"
              v-model="form.target"
              class="input"
              :options="targetOptions"
              data-test-id="target-option"
              :state="getValidationState($v.form.target)"
              ><template #first>
                <b-form-select-option :value="valuedefault" disabled>
                  {{ $t('global.form.selectAnOption') }}
                </b-form-select-option>
              </template></b-form-select
            >
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.target.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.portStart')"
            label-for="portStart"
          >
            <b-form-input
              id="portStart"
              v-model="form.portStart"
              type="text"
              :state="getValidationState($v.form.portStart)"
              :disabled="form.protocol == 'ALL'"
              @input="$v.form.portStart.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.portStart.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-if="!$v.form.portStart.pattern">
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.portEnd')"
            label-for="portEnd"
          >
            <b-form-input
              id="portEnd"
              v-model="form.portEnd"
              type="text"
              :state="getValidationState($v.form.portEnd)"
              :disabled="form.protocol == 'ALL'"
              @input="$v.form.portEnd.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.portEnd.pattern">
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.ipStart')"
            label-for="ipStart"
          >
            <b-form-input
              id="ipStart"
              v-model="form.ipStart"
              type="text"
              :state="getValidationState($v.form.ipStart)"
              @input="$v.form.ipStart.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.ipStart.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-if="!$v.form.ipStart.pattern">
                {{ $t('pageFireWall.firewallSettings.modal.invalidIPAddress') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.ipEnd')"
            label-for="ipEnd"
          >
            <b-form-input
              id="ipEnd"
              v-model="form.ipEnd"
              type="text"
              :state="getValidationState($v.form.ipEnd)"
              @input="$v.form.ipEnd.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.ipEnd.pattern">
                {{ $t('pageFireWall.firewallSettings.modal.invalidIPAddress') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.sourceMacAddress')"
            label-for="sourceMacAddress"
          >
            <b-form-input
              id="sourceMacAddress"
              v-model="form.sourceMacAddress"
              type="text"
              :state="getValidationState($v.form.sourceMacAddress)"
              @input="$v.form.sourceMacAddress.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.sourceMacAddress.pattern">
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.startDate')"
            label-for="startDate"
          >
            <b-input-group class="box-shadow-0">
              <b-form-input
                id="startDate"
                v-model="form.startDate"
                :state="getValidationState($v.form.startDate)"
                data-test-id="dateTime-input-startDate"
                class="form-control-with-button"
                @blur="$v.form.startDate.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.startDate.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
              </b-form-invalid-feedback>
              <b-form-datepicker
                v-model="form.startDate"
                class="btn-datepicker btn-icon-only"
                button-only
                right
                :min="new Date()"
                :max="form.endDate"
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
            :label="$t('pageFireWall.firewallSettings.modal.startTime')"
            label-for="startTime"
          >
            <b-form-input
              id="startTime"
              v-model="form.startTime"
              :state="getValidationState($v.form.startTime)"
              data-test-id="dateTime-input-startTime"
              @blur="$v.form.startTime.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.startTime.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="$v.form.startTime.required && !$v.form.startTime.pattern"
              >
                {{
                  $t(
                    'pageFireWall.firewallSettings.modal.endTimeCanNotBeEqualToStartTime',
                  )
                }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.modal.endDate')"
            label-for="endDate"
          >
            <b-input-group class="box-shadow-0">
              <b-form-input
                id="endDate"
                v-model="form.endDate"
                :state="getValidationState($v.form.endDate)"
                data-test-id="dateTime-input-endDate"
                class="form-control-with-button"
                @blur="$v.form.endDate.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.endDate.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template
                  v-if="$v.form.endDate.required && !$v.form.endDate.minDate"
                >
                  {{
                    $t(
                      'pageFireWall.firewallSettings.modal.endDateCanNotBeLessThanStartDate',
                    )
                  }}
                </template>
              </b-form-invalid-feedback>
              <b-form-datepicker
                v-model="form.endDate"
                class="btn-datepicker btn-icon-only"
                button-only
                right
                :min="form.startDate == '' ? new Date() : form.startDate"
                :hide-header="true"
                :locale="locale"
                :label-help="
                  $t('global.calendar.useCursorKeysToNavigateCalendarDates')
                "
                :title="$t('global.calendar.selectDate')"
                button-variant="link"
                aria-controls="input-end-date"
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
            :label="$t('pageFireWall.firewallSettings.modal.endTime')"
            label-for="endTime"
          >
            <b-form-input
              id="endTime"
              v-model="form.endTime"
              :state="getValidationState($v.form.endTime)"
              data-test-id="dateTime-input-endTime"
              @blur="$v.form.endTime.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.endTime.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="$v.form.endTime.required && !$v.form.endTime.minTime"
              >
                {{
                  $t(
                    'pageFireWall.firewallSettings.modal.endTimeCanNotBeEqualToStartTime',
                  )
                }}
              </template>
              <template
                v-if="
                  $v.form.endTime.required &&
                  $v.form.endTime.minTime &&
                  !$v.form.endTime.pattern
                "
              >
                {{
                  $t(
                    'pageFireWall.firewallSettings.modal.endTimeCanNotBeEqualToStartTime',
                  )
                }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <template #modal-footer="{ cancel }">
      <b-button variant="secondary" @click="cancel()">
        {{ $t('global.action.cancel') }}
      </b-button>
      <b-button form="form-ipv6" type="submit" variant="primary" @click="onOk">
        {{ $t('global.action.add') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import IconCalendar from '@carbon/icons-vue/es/calendar/20';
import { required, requiredIf, helpers } from 'vuelidate/lib/validators';

const isoTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export default {
  components: { IconCalendar },
  mixins: [VuelidateMixin],
  props: {
    modalSuccess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      locale: this.$store.getters['global/languagePreference'],
      valuedefault: '',
      form: {
        ipEnd: '',
        ipStart: '',
        portEnd: '',
        portStart: '',
        sourceMacAddress: '',
        protocol: '',
        startTime: '',
        startDate: '',
        endTime: '',
        endDate: '',
        target: '',
      },
      protocolOptions: [
        {
          text: this.$t('pageFireWall.firewallSettings.modal.tcp'),
          value: 'TCP',
        },
        {
          text: this.$t('pageFireWall.firewallSettings.modal.udp'),
          value: 'UDP',
        },
        {
          text: this.$t('pageFireWall.firewallSettings.modal.all'),
          value: 'ALL',
        },
      ],
      targetOptions: [
        {
          text: this.$t('pageFireWall.firewallSettings.modal.accept'),
          value: 'ACCEPT',
        },
        {
          text: this.$t('pageFireWall.firewallSettings.modal.drop'),
          value: 'DROP',
        },
      ],
      value: '',
      context: null,
    };
  },
  watch: {
    modalSuccess: function (value) {
      if (value === true) {
        this.closeModal();
      }
    },
  },
  validations() {
    return {
      form: {
        target: {
          required,
        },
        protocol: {
          required: requiredIf(function (form) {
            if (form.portStart != '' || form.portEnd != '') {
              return true;
            }
          }),
        },
        ipStart: {
          required: requiredIf(function (form) {
            if (form.ipEnd != '') {
              return true;
            }
          }),
          pattern: function (val) {
            return this.ipStartValidation(val);
          },
        },
        ipEnd: {
          pattern: function (val) {
            return this.ipEndValidation(val);
          },
        },
        portStart: {
          required: requiredIf(function (form) {
            if (
              form.portEnd != '' ||
              form.protocol == 'TCP' ||
              form.protocol == 'UDP'
            ) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.portStartValidation(val);
          },
        },
        portEnd: {
          pattern: function (val) {
            return this.portEndValidation(val);
          },
        },
        sourceMacAddress: {
          pattern: function (val) {
            return this.sourceMacAddressValidation(val);
          },
        },
        startTime: {
          required: requiredIf(function (form) {
            if (form.endTime != '' || form.startDate != '') {
              return true;
            }
          }),
          pattern: helpers.regex('pattern', isoTimeRegex),
        },
        endTime: {
          required: requiredIf(function (form) {
            if (form.startTime != '') {
              return true;
            }
          }),
          minTime: () => {
            if (
              this.form.startTime != '' &&
              this.form.endTime != '' &&
              this.form.startTime >= this.form.endTime &&
              this.form.endDate == this.form.startDate
            ) {
              return this.form.endTime > this.form.startTime;
            } else {
              return true;
            }
          },
          pattern: helpers.regex('pattern', isoTimeRegex),
        },
        startDate: {
          required: requiredIf(function (form) {
            if (form.endDate != '' || form.startTime != '') {
              return true;
            }
          }),
        },
        endDate: {
          required: requiredIf(function (form) {
            if (form.startDate != '') {
              return true;
            }
          }),
          minDate: () => {
            if (this.form.startDate != '' && this.form.endDate != '') {
              return (
                new Date(this.form.endDate) >= new Date(this.form.startDate)
              );
            } else {
              return true;
            }
          },
        },
      },
    };
  },
  methods: {
    resetForm() {
      this.$emit('closeAddModal', false);
      this.form.ipEnd = '';
      this.form.ipStart = '';
      this.form.portEnd = '';
      this.form.portStart = '';
      this.form.sourceMacAddress = '';
      this.form.protocol = '';
      this.form.startTime = '';
      this.form.startDate = '';
      this.form.endTime = '';
      this.form.endDate = '';
      this.form.target = '';
      this.$v.$reset();
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let startdateval = '',
        enddateval = '';
      let addallrules = {};
      let addrules = {};
      if (this.form.startDate != '') {
        startdateval = this.getUtcDate(
          this.form.startDate,
          this.form.startTime,
        );
        enddateval = this.getUtcDate(this.form.endDate, this.form.endTime);
      }
      if (
        this.form.portStart != '' &&
        (this.form.protocol === 'TCP' || this.form.protocol === 'UDP')
      ) {
        if (this.form.portStart != '') {
          addrules.StartPort = parseInt(this.form.portStart);
        }
        if (this.form.portEnd != '') {
          addrules.EndPort = parseInt(this.form.portEnd);
        }
      }

      if (this.form.protocol != '') {
        addrules.Protocol = this.form.protocol;
      }
      if (this.form.target != '') {
        addrules.Target = this.form.target;
      }
      if (this.form.ipStart != '') {
        addrules.StartSourceIPAddress = this.form.ipStart;
      }
      if (this.form.ipEnd != '') {
        addrules.EndSourceIPAddress = this.form.ipEnd;
      }
      if (this.form.sourceMacAddress != '') {
        addrules.SourceMACAddress = this.form.sourceMacAddress;
      }
      if (startdateval != '') {
        addrules.StartTime =
          startdateval != '' ? startdateval.toISOString().substring(0, 19) : '';
      }
      if (enddateval != '') {
        addrules.EndTime =
          enddateval != '' ? enddateval.toISOString().substring(0, 19) : '';
      }

      Object.assign(addallrules, addrules);
      this.$emit('addNewRulesOk', addallrules);
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
        this.resetForm();
      });
    },
    ipStartValidation(value) {
      if (
        (!/((^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$)|(^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$))/.test(
          value,
        ) ||
          /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
            value,
          ) ||
          String(value).charAt(0) == '0' ||
          '#255.255.255.0#0.24.56.4#255.255.255.255#'.indexOf(
            '#' + value + '#',
          ) > -1 ||
          value.trim() == '::') &&
        !/^(?=.{1,254}$)((?=[a-z0-9-]{1 ,63}\.)(xn--+)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/i.test(
          value,
        ) &&
        value.length != 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    ipEndValidation(value) {
      if (
        ((!/((^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$)|(^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$))/.test(
          value,
        ) ||
          /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
            value,
          ) ||
          (value != undefined &&
            value != null &&
            (String(value).charAt(0) == '0' ||
              '#255.255.255.0#0.24.56.4#255.255.255.255#'.indexOf(
                '#' + value + '#',
              ) > -1)) ||
          value.trim() == '::') &&
          !/^(?=.{1,254}$)((?=[a-z0-9-]{1 ,63}\.)(xn--+)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}$/i.test(
            value,
          ) &&
          value.length != 0) ||
        (value.length != 0 &&
          this.ipToInt(value) < this.ipToInt(this.form.ipStart))
      ) {
        return false;
      } else {
        return true;
      }
    },
    ipToInt(ip) {
      return ip
        .split('.')
        .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    },
    portStartValidation(value) {
      if (
        (value.length != '' &&
          !(parseInt(value) >= 0 && parseInt(value) <= 65535)) ||
        parseInt(value) == 80 ||
        !/^[0-9]*$/.test(value)
      ) {
        return false;
      } else {
        return true;
      }
    },
    portEndValidation(value) {
      if (
        value.length != '' &&
        (!(parseInt(value) >= 0 && parseInt(value) <= 65535) ||
          parseInt(value) < parseInt(this.form.portStart) ||
          value == 80 ||
          !/^[0-9]*$/.test(value))
      ) {
        return false;
      } else {
        return true;
      }
    },
    sourceMacAddressValidation(value) {
      if (
        value.length != '' &&
        !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})*$/.test(value)
      ) {
        return false;
      } else {
        return true;
      }
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
  },
};
</script>
<style scoped>
.box-shadow-0 {
  box-shadow: none;
}
</style>
