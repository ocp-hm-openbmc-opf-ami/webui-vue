<template>
  <b-modal
    id="modal-sensor-threshold"
    ref="modal"
    :title="$t('pageSensors.sensorThreshold.modal.sensorThresholds')"
    @hidden="resetForm"
    @show="initModal"
  >
    <b-form id="form-addSensorThreshold" @submit.prevent="handleSubmit">
      <b-row>
        <b-col v-if="form.upperFatal != undefined" sm="6">
          <b-form-group
            :label="$t('pageSensors.sensorThreshold.modal.upperFatal')"
            label-for="upperFatal"
          >
            <b-form-input
              id="upperFatal"
              v-model="form.upperFatal"
              type="text"
              :state="getValidationState($v.form.upperFatal)"
              @input="$v.form.upperFatal.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.upperFatal.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.upperFatal.required && !$v.form.upperFatal.pattern
                "
              >
                {{ upperFatalErrorMsg }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col v-if="form.upperCritical != undefined" sm="6">
          <b-form-group
            :label="$t('pageSensors.sensorThreshold.modal.upperCritical')"
            label-for="upperCritical"
          >
            <b-form-input
              id="upperCritical"
              v-model="form.upperCritical"
              type="text"
              :state="getValidationState($v.form.upperCritical)"
              @input="$v.form.upperCritical.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.upperCritical.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.upperCritical.required &&
                  !$v.form.upperCritical.pattern
                "
              >
                {{ uppercriticalErrorMsg }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="form.upperCaution != undefined" sm="6">
          <b-form-group
            :label="$t('pageSensors.sensorThreshold.modal.upperCaution')"
            label-for="upperCaution"
          >
            <b-form-input
              id="upperCaution"
              v-model="form.upperCaution"
              type="text"
              :state="getValidationState($v.form.upperCaution)"
              @input="$v.form.upperCaution.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.upperCaution.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.upperCaution.required && !$v.form.upperCaution.pattern
                "
              >
                {{ upperCautionErrorMsg }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col v-if="form.lowerCaution != undefined" sm="6">
          <b-form-group
            :label="$t('pageSensors.sensorThreshold.modal.lowerCaution')"
            label-for="lowerCaution"
          >
            <b-form-input
              id="lowerCaution"
              v-model="form.lowerCaution"
              type="text"
              :state="getValidationState($v.form.lowerCaution)"
              :disabled="form.protocol == 'ALL'"
              @input="$v.form.lowerCaution.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.lowerCaution.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.lowerCaution.required && !$v.form.lowerCaution.pattern
                "
              >
                {{ lowerCautionErrorMsg }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="form.lowerCritical != undefined" sm="6">
          <b-form-group
            :label="$t('pageSensors.sensorThreshold.modal.lowerCritical')"
            label-for="lowerCritical"
          >
            <b-form-input
              id="lowerCritical"
              v-model="form.lowerCritical"
              type="text"
              :state="getValidationState($v.form.lowerCritical)"
              @input="$v.form.lowerCritical.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.lowerCritical.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.lowerCritical.required &&
                  !$v.form.lowerCritical.pattern
                "
              >
                {{ lowerCriticalErrorMsg }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col v-if="form.lowerFatal != undefined" sm="6">
          <b-form-group
            :label="$t('pageSensors.sensorThreshold.modal.lowerFatal')"
            label-for="lowerFatal"
          >
            <b-form-input
              id="lowerFatal"
              v-model="form.lowerFatal"
              type="text"
              :state="getValidationState($v.form.lowerFatal)"
              @input="$v.form.lowerFatal.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.lowerFatal.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.lowerFatal.required && !$v.form.lowerFatal.pattern
                "
              >
                {{ lowerFatalErrorMsg }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <template #modal-footer="{ cancel }">
      <b-button variant="secondary" @click="cancel()">
        <icon-cancel />
        {{ $t('global.action.cancel') }}
      </b-button>
      <b-button form="form-ipv6" type="submit" variant="primary" @click="onOk">
        <icon-save />
        {{ $t('global.action.save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { requiredIf } from 'vuelidate/lib/validators';
import IconSave from '@carbon/icons-vue/es/save/20';
import IconCancel from '@carbon/icons-vue/es/rule--cancelled/20';

export default {
  components: {
    IconSave,
    IconCancel,
  },
  mixins: [VuelidateMixin],
  props: {
    modalSuccess: {
      type: Boolean,
      default: false,
    },
    modalSensorThreshold: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      uppercriticalErrorMsg: '',
      upperCautionErrorMsg: '',
      lowerCautionErrorMsg: '',
      lowerCriticalErrorMsg: '',
      upperFatalErrorMsg: '',
      lowerFatalErrorMsg: '',
      form: {
        upperCritical: '',
        upperCaution: '',
        lowerCritical: '',
        lowerCaution: '',
        upperFatal: '',
        lowerFatal: '',
      },
    };
  },
  watch: {
    modalSuccess: function (value) {
      if (value === true) {
        this.closeModal();
      }
    },
    modalSensorThreshold() {
      this.initModal();
    },
  },
  created() {},
  validations() {
    return {
      form: {
        upperCaution: {
          required: requiredIf(function (form) {
            if (form.upperCaution != undefined) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.upperCautionValidation(val);
          },
        },
        upperCritical: {
          required: requiredIf(function (form) {
            if (form.upperCritical != undefined) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.upperCriticalValidation(val);
          },
        },
        lowerCritical: {
          required: requiredIf(function (form) {
            if (form.lowerCritical != undefined) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.lowerCriticalValidation(val);
          },
        },
        lowerCaution: {
          required: requiredIf(function (form) {
            if (form.lowerCaution != undefined) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.lowerCautionValidation(val);
          },
        },
        upperFatal: {
          required: requiredIf(function (form) {
            if (form.upperFatal != undefined) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.upperFatalValidation(val);
          },
        },
        lowerFatal: {
          required: requiredIf(function (form) {
            if (form.lowerFatal != undefined) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.lowerFatalValidation(val);
          },
        },
      },
    };
  },
  methods: {
    initModal() {
      const processThreshold = (value) => {
        if (value === undefined) return value;
        return value !== Math.floor(value)
          ? parseFloat(value).toFixed(2)
          : Math.floor(value);
      };
      this.form.upperFatal = processThreshold(
        this.modalSensorThreshold.upperFatal,
      );
      this.form.upperCritical = processThreshold(
        this.modalSensorThreshold.upperCritical,
      );
      this.form.upperCaution = processThreshold(
        this.modalSensorThreshold.upperCaution,
      );
      this.form.lowerCaution = processThreshold(
        this.modalSensorThreshold.lowerCaution,
      );
      this.form.lowerCritical = processThreshold(
        this.modalSensorThreshold.lowerCritical,
      );
      this.form.lowerFatal = processThreshold(
        this.modalSensorThreshold.lowerFatal,
      );
    },
    resetForm() {
      this.$emit('closeAddModal', false);
      this.$v.$reset();
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let setThresholdValue = {};
      if (this.form.upperCritical != undefined) {
        setThresholdValue.UpperCritical = parseFloat(this.form.upperCritical);
      }
      if (this.form.upperCaution) {
        setThresholdValue.UpperCaution = parseFloat(this.form.upperCaution);
      }
      if (this.form.lowerCritical != undefined) {
        setThresholdValue.LowerCritical = parseFloat(this.form.lowerCritical);
      }
      if (this.form.lowerCaution != undefined) {
        setThresholdValue.LowerCaution = parseFloat(this.form.lowerCaution);
      }
      if (this.form.upperFatal != undefined) {
        setThresholdValue.UpperFatal = parseFloat(this.form.upperFatal);
      }
      if (this.form.lowerFatal != undefined) {
        setThresholdValue.LowerFatal = parseFloat(this.form.lowerFatal);
      }
      this.$emit('setSensorThresholdOk', setThresholdValue);
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
        this.resetForm();
      });
    },
    upperFatalValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        this.upperFatalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.upperFatalValidationInfo',
        );
        return false;
      } else {
        return true;
      }
    },
    upperCriticalValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        this.uppercriticalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.upperCriticalValidationInfo',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperFatal != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperFatal)
      ) {
        this.uppercriticalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.upperCriticalValidationInfo1',
        );
        return false;
      } else {
        return true;
      }
    },
    upperCautionValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        this.upperCautionErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.upperCautionValidationInfo',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperFatal != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperFatal)
      ) {
        this.upperCautionErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.upperCautionValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperCritical != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperCritical)
      ) {
        this.upperCautionErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.upperCautionValidationInfo1',
        );
        return false;
      } else {
        return true;
      }
    },
    lowerCautionValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        this.lowerCautionErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCautionValidationInfo',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperCaution != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperCaution)
      ) {
        this.lowerCautionErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCautionValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperCritical != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperCritical)
      ) {
        this.lowerCautionErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCautionValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperFatal != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperFatal)
      ) {
        this.lowerCautionErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCautionValidationInfo1',
        );
        return false;
      } else {
        return true;
      }
    },
    lowerCriticalValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        this.lowerCriticalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCriticalValidationInfo',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperFatal != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperFatal)
      ) {
        this.lowerCriticalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCriticalValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperCritical != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperCritical)
      ) {
        this.lowerCriticalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCriticalValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperCaution != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperCaution)
      ) {
        this.lowerCriticalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCriticalValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.lowerCaution != undefined &&
        parseFloat(value) >= parseFloat(this.form.lowerCaution)
      ) {
        this.lowerCriticalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerCriticalValidationInfo1',
        );
        return false;
      } else {
        return true;
      }
    },
    lowerFatalValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        this.lowerFatalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerFatalValidationInfo',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperFatal != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperFatal)
      ) {
        this.lowerFatalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerFatalValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperCritical != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperCritical)
      ) {
        this.lowerFatalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerFatalValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.upperCaution != undefined &&
        parseFloat(value) >= parseFloat(this.form.upperCaution)
      ) {
        this.lowerFatalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerFatalValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.lowerCaution != undefined &&
        parseFloat(value) >= parseFloat(this.form.lowerCaution)
      ) {
        this.lowerFatalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerFatalValidationInfo1',
        );
        return false;
      } else if (
        value != undefined &&
        this.form.lowerCritical != undefined &&
        parseFloat(value) >= parseFloat(this.form.lowerCritical)
      ) {
        this.lowerFatalErrorMsg = this.$t(
          'pageSensors.sensorThreshold.modal.lowerFatalValidationInfo1',
        );
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
<style scoped>
.box-shadow-0 {
  box-shadow: none;
}
</style>
