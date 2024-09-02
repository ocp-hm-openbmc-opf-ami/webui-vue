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
                {{
                  $t(
                    'pageSensors.sensorThreshold.modal.upperCriticalValidationInfo',
                  )
                }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
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
                {{
                  $t(
                    'pageSensors.sensorThreshold.modal.upperCautionValidationInfo',
                  )
                }}
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
                {{
                  $t(
                    'pageSensors.sensorThreshold.modal.lowerCriticalValidationInfo',
                  )
                }}
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
                {{
                  $t(
                    'pageSensors.sensorThreshold.modal.lowerCautionValidationInfo',
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
        {{ $t('global.action.save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { requiredIf } from 'vuelidate/lib/validators';

export default {
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
      form: {
        upperCritical: '',
        upperCaution: '',
        lowerCritical: '',
        lowerCaution: '',
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
      },
    };
  },
  methods: {
    initModal() {
      this.form.upperCritical =
        this.modalSensorThreshold.upperCritical == undefined
          ? this.modalSensorThreshold.upperCritical
          : this.modalSensorThreshold.upperCritical !=
              Math.floor(this.modalSensorThreshold.upperCritical)
            ? parseFloat(this.modalSensorThreshold.upperCritical).toFixed(2)
            : Math.floor(this.modalSensorThreshold.upperCritical);
      this.form.upperCaution =
        this.modalSensorThreshold.upperCaution == undefined
          ? this.modalSensorThreshold.upperCaution
          : this.modalSensorThreshold.upperCaution !=
              Math.floor(this.modalSensorThreshold.upperCaution)
            ? parseFloat(this.modalSensorThreshold.upperCaution).toFixed(2)
            : Math.floor(this.modalSensorThreshold.upperCaution);
      this.form.lowerCritical =
        this.modalSensorThreshold.lowerCritical == undefined
          ? this.modalSensorThreshold.lowerCritical
          : this.modalSensorThreshold.lowerCritical !=
              Math.floor(this.modalSensorThreshold.lowerCritical)
            ? parseFloat(this.modalSensorThreshold.lowerCritical).toFixed(2)
            : Math.floor(this.modalSensorThreshold.lowerCritical);
      this.form.lowerCaution =
        this.modalSensorThreshold.lowerCaution == undefined
          ? this.modalSensorThreshold.lowerCaution
          : this.modalSensorThreshold.lowerCaution !=
              Math.floor(this.modalSensorThreshold.lowerCaution)
            ? parseFloat(this.modalSensorThreshold.lowerCaution).toFixed(2)
            : Math.floor(this.modalSensorThreshold.lowerCaution);
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
      this.$emit('setSensorThresholdOk', setThresholdValue);
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
        this.resetForm();
      });
    },
    upperCriticalValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        return false;
      } else if (
        value != undefined &&
        this.form.upperCaution != undefined &&
        parseFloat(value) < parseFloat(this.form.upperCaution)
      ) {
        return false;
      } else {
        return true;
      }
    },
    upperCautionValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        return false;
      } else if (
        value != undefined &&
        this.form.lowerCritical != undefined &&
        parseFloat(value) < parseFloat(this.form.lowerCritical)
      ) {
        return false;
      } else if (
        value != undefined &&
        this.form.upperCritical != undefined &&
        parseFloat(value) > parseFloat(this.form.upperCritical)
      ) {
        return false;
      } else {
        return true;
      }
    },
    lowerCriticalValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        return false;
      } else if (
        value != undefined &&
        this.form.upperCaution != undefined &&
        parseFloat(value) > parseFloat(this.form.upperCaution)
      ) {
        return false;
      } else if (
        value != undefined &&
        this.form.lowerCaution != undefined &&
        parseFloat(value) < parseFloat(this.form.lowerCaution)
      ) {
        return false;
      } else {
        return true;
      }
    },
    lowerCautionValidation(value) {
      if (value != undefined && !/^-?\d{1,}(\.\d{1,2})?$/.test(value)) {
        return false;
      } else if (
        value != undefined &&
        this.form.lowerCritical != undefined &&
        parseFloat(value) > parseFloat(this.form.lowerCritical)
      ) {
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
