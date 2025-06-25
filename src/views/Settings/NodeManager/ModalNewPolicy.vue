<template>
  <b-modal id="modal-new-policy" ref="modal" @hidden="resetForm">
    <template #modal-title>
      <template v-if="policiesData">
        {{ $t('pageNodeManager.modal.createNewPolicy') }}
      </template>
      <template v-else>
        {{ $t('pageNodeManager.modal.editPolicy') }}
      </template>
    </template>
    <b-form id="form-new-policy" novalidate @submit.prevent="handleSubmit">
      <b-container>
        <b-row>
          <b-col>
            <b-form-group
              :label="$t('pageNodeManager.modal.domain')"
              label-for="domain"
            >
              <b-form-select
                id="domain"
                v-model="form.domain"
                :options="domainTypes"
                :disabled="!policiesData"
                data-test-id="newpolicy-input-domain"
                :state="getValidationState($v.form.domain)"
                @input="$v.form.domain.$touch()"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>
                    {{ $t('global.form.selectAnOption') }}
                  </b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.domain.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.policyId')"
              label-for="policyId"
            >
              <b-form-text id="newpolicy-help-block" class="text-wrap">
                {{ $t('pageNodeManager.modal.policyIdHelpTest') }}
                <br />
                {{ $t('pageNodeManager.modal.policyIdHelpTest1') }}
              </b-form-text>
              <b-form-input
                id="policyId"
                v-model="form.policyId"
                :disabled="!policiesData"
                type="text"
                data-test-id="newpolicy-input-policyId"
                aria-describedby="policyId-help-block"
                :state="getValidationState($v.form.policyId)"
                @input="$v.form.policyId.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.policyId.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.form.policyId.pattern">
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.componentId')"
              label-for="componentId"
            >
              <b-form-text id="newpolicy-help-block" class="text-wrap">
                {{ $t('pageNodeManager.modal.componentIdHelpTest') }}
                <br />
                {{ $t('pageNodeManager.modal.componentIdHelpTest1') }}
              </b-form-text>
              <b-form-input
                id="componentId"
                v-model="form.componentId"
                type="number"
                data-test-id="newpolicy-input-componentId"
                aria-describedby="componentId-help-block"
                :state="getValidationState($v.form.componentId)"
                @input="$v.form.componentId.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.componentId.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.form.componentId.pattern">
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.policyLimit')"
              label-for="policyLimit"
            >
              <b-form-text id="newpolicy-help-block" class="text-wrap">
                {{ $t('pageNodeManager.modal.policyLimitHelpTest') }}
              </b-form-text>
              <b-form-input
                id="policyLimit"
                v-model="form.policyLimit"
                type="number"
                data-test-id="newpolicy-input-policyLimit"
                aria-describedby="policyLimit-help-block"
                :state="getValidationState($v.form.policyLimit)"
                @input="$v.form.policyLimit.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.policyLimit.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.form.policyLimit.pattern">
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.limitException')"
              label-for="limitException"
            >
              <b-form-select
                id="limitException"
                v-model="form.limitException"
                :options="LimitExceptionType"
                data-test-id="newpolicy-input-limitException"
                aria-describedby="limitException-help-block"
                :state="getValidationState($v.form.limitException)"
                @input="$v.form.limitException.$touch()"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>
                    {{ $t('global.form.selectAnOption') }}
                  </b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.limitException.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.state')"
              label-for="state"
            >
              <b-form-select
                id="state"
                v-model="form.state"
                :options="statusType"
                :disabled="!policiesData"
                data-test-id="newpolicy-input-state"
                aria-describedby="state-help-block"
                :state="getValidationState($v.form.state)"
                @input="$v.form.state.$touch()"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>
                    {{ $t('global.form.selectAnOption') }}
                  </b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.state.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              :label="$t('pageNodeManager.modal.policyCorrectionTime')"
              label-for="policyCorrectionTime"
            >
              <b-form-text id="newpolicy-help-block" class="text-wrap">
                {{ $t('pageNodeManager.modal.correctionTimeHelpTest') }}
              </b-form-text>
              <b-form-input
                id="policyCorrectionTime"
                v-model="form.policyCorrectionTime"
                type="number"
                :disabled="form.domain === 'CPUPerformance'"
                data-test-id="newpolicy-input-policyCorrectionTime"
                aria-describedby="policyCorrectionTime-help-block"
                :state="getValidationState($v.form.policyCorrectionTime)"
                @input="$v.form.policyCorrectionTime.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.policyCorrectionTime.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.form.policyCorrectionTime.pattern">
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.statisticsReportingPeriod')"
              label-for="statisticsReportingPeriod"
            >
              <b-form-text id="newpolicy-help-block" class="text-wrap">
                {{
                  $t('pageNodeManager.modal.statisticsReportingPeriodHelpTest')
                }}
              </b-form-text>
              <b-form-input
                id="statisticsReportingPeriod"
                v-model="form.statisticsReportingPeriod"
                type="text"
                data-test-id="newpolicy-input-statisticsReportingPeriod"
                aria-describedby="statisticsReportingPeriod-help-block"
                :state="getValidationState($v.form.statisticsReportingPeriod)"
                @input="$v.form.statisticsReportingPeriod.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.statisticsReportingPeriod.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template
                  v-else-if="!$v.form.statisticsReportingPeriod.pattern"
                >
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.triggerLimit')"
              label-for="triggerLimit"
            >
              <b-form-text id="newpolicy-help-block" class="text-wrap">
                {{ $t('pageNodeManager.modal.triggerLimitHelpTest') }}
              </b-form-text>
              <b-form-input
                id="triggerLimit"
                v-model="form.triggerLimit"
                type="number"
                data-test-id="newpolicy-input-triggerLimit"
                aria-describedby="triggerLimit-help-block"
                :state="getValidationState($v.form.triggerLimit)"
                @input="$v.form.triggerLimit.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.triggerLimit.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.form.triggerLimit.pattern">
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.triggerType')"
              label-for="triggerType"
            >
              <b-form-select
                id="triggerType"
                v-model="form.triggerType"
                :options="filteredTriggerTypeOptions"
                :disabled="!policiesData"
                data-test-id="newpolicy-input-triggerType"
                aria-describedby="triggerType-help-block"
                :state="getValidationState($v.form.triggerType)"
                @input="$v.form.triggerType.$touch()"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>
                    {{ $t('global.form.selectAnOption') }}
                  </b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.triggerType.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.powerCorrectionType')"
              label-for="powerCorrectionType"
            >
              <b-form-select
                id="powerCorrectionType"
                v-model="form.powerCorrectionType"
                :options="PowerCorrectionTypeOptions"
                data-test-id="newpolicy-input-powerCorrectionType"
                aria-describedby="powerCorrectionType-help-block"
                :state="getValidationState($v.form.powerCorrectionType)"
                @input="$v.form.powerCorrectionType.$touch()"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>
                    {{ $t('global.form.selectAnOption') }}
                  </b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.powerCorrectionType.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.modal.policyStorage')"
              label-for="policyStorage"
            >
              <b-form-select
                id="policyStorage"
                v-model="form.policyStorage"
                :options="policyStorageType"
                data-test-id="newpolicy-input-policyStorage"
                aria-describedby="policyStorage-help-block"
                :state="getValidationState($v.form.policyStorage)"
                @input="$v.form.policyStorage.$touch()"
              >
                <template #first>
                  <b-form-select-option :value="null" disabled>
                    {{ $t('global.form.selectAnOption') }}
                  </b-form-select-option>
                </template>
              </b-form-select>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.policyStorage.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-form>
    <template #modal-footer="{ cancel }">
      <b-button
        variant="secondary"
        data-test-id="newpolicy-button-cancel"
        @click="cancel()"
      >
        <icon-cancel />
        {{ $t('global.action.cancel') }}
      </b-button>
      <b-button
        form="form-user"
        data-test-id="newpolicy-button-submit"
        type="submit"
        variant="primary"
        @click="onOk"
      >
        <template v-if="policiesData">
          <icon-add />
          {{ $t('pageNodeManager.createNewPolicy') }}
        </template>
        <template v-else>
          <icon-save />
          {{ $t('global.action.save') }}
        </template>
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import IconSave from '@carbon/icons-vue/es/save/20';
import IconCancel from '@carbon/icons-vue/es/rule--cancelled/20';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
export default {
  components: {
    IconSave,
    IconCancel,
    IconAdd,
  },
  mixins: [VuelidateMixin],
  props: {
    policies: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      statusType: [
        {
          value: 'Enabled',
          text: this.$t('pageNodeManager.modal.enable'),
        },
        { value: 'Disabled', text: this.$t('pageNodeManager.modal.disable') },
      ],
      triggerTypeOptions: [
        {
          value: 'AlwaysOn',
          text: this.$t('pageNodeManager.modal.alwaysOn'),
        },
        {
          value: 'InletTemperature',
          text: this.$t('pageNodeManager.modal.inletTemperature'),
        },
        {
          value: 'CPUUtilization',
          text: this.$t('pageNodeManager.modal.cpuUtilization'),
        },
        {
          value: 'HostReset',
          text: this.$t('pageNodeManager.modal.hostReset'),
        },
        {
          value: 'SMBAlertInterrupt',
          text: this.$t('pageNodeManager.modal.smbAlertInterrupt'),
        },
      ],
      policyStorageType: [
        {
          value: 'Persistent',
          text: this.$t('pageNodeManager.modal.persistent'),
        },
        {
          value: 'Volatile',
          text: this.$t('pageNodeManager.modal.volatile'),
        },
      ],
      PowerCorrectionTypeOptions: [
        {
          value: 'Auto',
          text: this.$t('pageNodeManager.modal.auto'),
        },
        {
          value: 'NonAgressive',
          text: this.$t('pageNodeManager.modal.nonAgressive'),
        },
        {
          value: 'Aggressive',
          text: this.$t('pageNodeManager.modal.aggressive'),
        },
      ],
      LimitExceptionType: [
        {
          value: 'NoAction',
          text: this.$t('pageNodeManager.modal.noAction'),
        },
        {
          value: 'HardPowerOff',
          text: this.$t('pageNodeManager.modal.hardPowerOff'),
        },
        {
          value: 'LogEventOnly',
          text: this.$t('pageNodeManager.modal.logEventOnly'),
        },
        {
          value: 'Oem',
          text: this.$t('pageNodeManager.modal.oem'),
        },
      ],
      form: {
        domain: null,
        policyId: '',
        componentId: '',
        policyLimit: '',
        limitException: null,
        state: null,
        policyCorrectionTime: '',
        statisticsReportingPeriod: '',
        triggerLimit: '',
        triggerType: null,
        powerCorrectionType: null,
        policyStorage: null,
      },
    };
  },
  computed: {
    policiesData() {
      return this.policies ? false : true;
    },
    filteredTriggerTypeOptions() {
      switch (this.form.domain) {
        case 'ACTotalPlatformPower':
        case 'CPUSubsystem':
        case 'DCTotalPlatformPower':
          return this.triggerTypeOptions;
        case 'MemorySubsystem':
        case 'PCIe':
          return this.triggerTypeOptions.filter((option) =>
            [
              'AlwaysOn',
              'InletTemperature',
              'HostReset',
              'SMBAlertInterrupt',
            ].includes(option.value),
          );
        case 'CPUPerformance':
          return this.triggerTypeOptions.filter((option) =>
            ['AlwaysOn', 'InletTemperature'].includes(option.value),
          );
        case 'HWProtection':
          return this.triggerTypeOptions.filter((option) =>
            ['AlwaysOn'].includes(option.value),
          );
        default:
          return this.triggerTypeOptions;
      }
    },
    policyLimitsRange() {
      return this.$store.getters['nmConfiguration/modeManagerCapabilities'];
    },
    domainTypes() {
      if (this.policiesData === true) {
        return [
          {
            value: 'ACTotalPlatformPower',
            text: this.$t('pageNodeManager.modal.acTotalPlatformPower'),
          },
          {
            value: 'CPUSubsystem',
            text: this.$t('pageNodeManager.modal.cpuSubsystem'),
          },
          {
            value: 'MemorySubsystem',
            text: this.$t('pageNodeManager.modal.memorySubsystem'),
          },
          {
            value: 'DCTotalPlatformPower',
            text: this.$t('pageNodeManager.modal.dcTotalPlatformPower'),
          },
          {
            value: 'PCIe',
            text: this.$t('pageNodeManager.modal.pcie'),
          },
        ];
      } else {
        return [
          {
            value: 'ACTotalPlatformPower',
            text: this.$t('pageNodeManager.modal.acTotalPlatformPower'),
          },
          {
            value: 'CPUSubsystem',
            text: this.$t('pageNodeManager.modal.cpuSubsystem'),
          },
          {
            value: 'MemorySubsystem',
            text: this.$t('pageNodeManager.modal.memorySubsystem'),
          },
          {
            value: 'CPUPerformance',
            text: this.$t('pageNodeManager.modal.cpuPerformance'),
          },
          {
            value: 'DCTotalPlatformPower',
            text: this.$t('pageNodeManager.modal.dcTotalPlatformPower'),
          },
          {
            value: 'HWProtection',
            text: this.$t('pageNodeManager.modal.hwProtection'),
          },
          {
            value: 'PCIe',
            text: this.$t('pageNodeManager.modal.pcie'),
          },
        ];
      }
    },
  },
  watch: {
    policies: function (value) {
      if (value === null) return;
      this.form.domain = value.domain;
      this.form.policyId = value.policyId;
      this.form.componentId = value.componentId;
      this.form.policyLimit = value.policyLimit;
      this.form.limitException = value.limitException;
      this.form.state = value.state;
      this.form.policyCorrectionTime = value.policyCorrectionTime;
      this.form.statisticsReportingPeriod = value.statisticsReportingPeriod;
      this.form.triggerLimit = value.triggerLimit;
      this.form.triggerType = value.triggerType;
      this.form.powerCorrectionType = value.powerCorrectionType;
      this.form.policyStorage = value.policyStorage;
    },
  },
  validations() {
    return {
      form: {
        domain: {
          required,
        },
        policyId: {
          required,
          pattern: (val) => this.policyIDValidation(val),
        },
        componentId: {
          required,
          pattern: (val) => this.componentIdValidation(val),
        },
        policyLimit: {
          required,
          pattern: (val) => this.policyLimitValidation(val),
        },
        limitException: {
          required,
        },
        state: {
          required,
        },
        policyCorrectionTime: {
          required: (value) =>
            this.form.domain !== 'CPUPerformance' ? !!value : true,
          pattern: (val) =>
            this.form.domain !== 'CPUPerformance'
              ? this.policyCorrectionTimeValidation(val)
              : true,
        },
        statisticsReportingPeriod: {
          required,
          pattern: (val) => this.statisticsReportingPeriodValidation(val),
        },
        triggerLimit: {
          required,
          pattern: (val) => this.tiggerLimitValidation(val),
        },
        triggerType: {
          required,
        },
        powerCorrectionType: {
          required,
        },
        policyStorage: {
          required,
        },
      },
    };
  },
  methods: {
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },
    resetForm() {
      this.form.domain = null;
      this.form.policyId = '';
      this.form.componentId = '';
      this.form.policyLimit = '';
      this.form.limitException = null;
      this.form.state = null;
      this.form.policyCorrectionTime = '';
      this.form.statisticsReportingPeriod = '';
      this.form.triggerLimit = '';
      this.form.triggerType = null;
      this.form.powerCorrectionType = null;
      this.form.policyStorage = null;
      this.$v.$reset();
      this.$emit('hidden');
    },
    handleSubmit() {
      let newPolicyData = {};

      if (this.policiesData) {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        newPolicyData.domain = this.form.domain;
        newPolicyData.policyId = this.form.policyId;
        newPolicyData.componentId = Number(this.form.componentId);
        newPolicyData.policyLimit = Number(this.form.policyLimit);
        newPolicyData.limitException = this.form.limitException;
        newPolicyData.state = this.form.state;
        newPolicyData.policyCorrectionTime = Number(
          this.form.policyCorrectionTime,
        );
        newPolicyData.statisticsReportingPeriod =
          this.form.statisticsReportingPeriod;
        newPolicyData.triggerLimit = Number(this.form.triggerLimit);
        newPolicyData.triggerType = this.form.triggerType;
        newPolicyData.powerCorrectionType = this.form.powerCorrectionType;
        newPolicyData.policyStorage = this.form.policyStorage;
      } else {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        if (this.$v.form.domain.$dirty) {
          newPolicyData.domain = this.form.domain;
        }
        if (this.$v.form.policyId.$dirty) {
          newPolicyData.policyId = this.form.policyId;
        }
        if (this.$v.form.componentId.$dirty) {
          newPolicyData.componentId = Number(this.form.componentId);
        }
        if (this.$v.form.policyLimit.$dirty) {
          newPolicyData.policyLimit = Number(this.form.policyLimit);
        }
        if (this.$v.form.limitException.$dirty) {
          newPolicyData.limitException = this.form.limitException;
        }
        if (this.$v.form.state.$dirty) {
          newPolicyData.state = this.form.state;
        }
        if (this.$v.form.policyCorrectionTime.$dirty) {
          newPolicyData.policyCorrectionTime = Number(
            this.form.policyCorrectionTime,
          );
        }
        if (this.$v.form.statisticsReportingPeriod.$dirty) {
          newPolicyData.statisticsReportingPeriod =
            this.form.statisticsReportingPeriod;
        }
        if (this.$v.form.triggerLimit.$dirty) {
          newPolicyData.triggerLimit = Number(this.form.triggerLimit);
        }
        if (this.$v.form.triggerType.$dirty) {
          newPolicyData.triggerType = this.form.triggerType;
        }
        if (this.$v.form.powerCorrectionType.$dirty) {
          newPolicyData.powerCorrectionType = this.form.powerCorrectionType;
        }
        if (this.$v.form.policyStorage.$dirty) {
          newPolicyData.policyStorage = this.form.policyStorage;
        }
        if (Object.entries(newPolicyData).length === 1) {
          this.closeModal();
          return;
        }
      }

      this.$emit('ok', { isNewPolicy: this.policiesData, newPolicyData });
      this.closeModal();
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    componentIdValidation(val) {
      if (!/^(25[0-5]|2[0-4][0-9]|1?[0-9]?[0-9])$/.test(val)) {
        return false;
      }
      return true;
    },
    policyIDValidation(val) {
      if (
        !/^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]|[a-zA-Z_][a-zA-Z0-9_]*)$/.test(
          val,
        )
      ) {
        return false;
      }
      return true;
    },
    policyLimitValidation(val) {
      // Extract min and max from policyLimitsRange based on selected domain
      const selectedDomain = this.form.domain;
      const limits = this.policyLimitsRange.find(
        (limit) => limit.domain === selectedDomain,
      );

      if (!limits) {
        console.error('No limits found for the selected domain.');
        return false; // or handle accordingly
      }

      const minLimit = parseFloat(limits.capMinimum); // Assuming capMinimum holds the minimum value
      const maxLimit = parseFloat(limits.capMaximum); // Assuming capMaximum holds the maximum value

      // Constructing a regex pattern for range validation
      const regexPattern = new RegExp(
        `^(${minLimit}|[1-9][0-9]{0,3}|[1-2][0-9]{4}|3[01][0-9]{3}|32[0-6][0-9]{2}|327[0-5][0-9]|3276[0-${maxLimit.toString().slice(-1)}]?)$`,
      );

      // Test value against dynamically created regex
      if (!new RegExp(regexPattern).test(val)) {
        return false;
      }

      // Additional numeric validation to ensure it falls within the min and max limits
      const numericValue = parseFloat(val);
      if (numericValue < minLimit || numericValue > maxLimit) {
        return false;
      }

      return true;
    },
    statisticsReportingPeriodValidation(val) {
      if (!/^(?:(?:[1-5]?[0-9]S)|(?:[1-5]?[0-9]M)|(?:1H))$/.test(val)) {
        return false;
      }
      return true;
    },
    policyCorrectionTimeValidation(val) {
      if (!/^(1000|[1-5]?\d{4}|60000)$/.test(val)) {
        return false;
      }
      return true;
    },
    tiggerLimitValidation(val) {
      if (
        !/^(6553[0-5]|655[0-2][0-9]|654[0-9]{2}|63[0-9]{3}|6[0-2][0-9]{3}|[1-5]?[0-9]{0,4})$/.test(
          val,
        )
      ) {
        return false;
      }
      return true;
    },
  },
};
</script>
