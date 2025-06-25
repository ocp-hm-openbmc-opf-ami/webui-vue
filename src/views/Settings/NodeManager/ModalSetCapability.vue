<template>
  <b-modal id="modal-set-capability" ref="modal" @hidden="resetForm">
    <template #modal-title>
      {{ $t('pageNodeManager.setCapabilityModal.setCapabilityStr') }}
    </template>
    <b-form id="form-set-capability" novalidate>
      <b-container>
        <b-row>
          <b-col>
            <b-form-group
              :label="$t('pageNodeManager.setCapabilityModal.domain')"
              label-for="domain"
            >
              <b-form-select
                id="domain"
                v-model="form.domain"
                :options="domainOptions"
                :state="getValidationState($v.form.domain)"
                @change="onChangeSelect"
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
            <b-form-text id="form-input-helper-text">
              {{
                $t(
                  'pageNodeManager.setCapabilityModal.capabilityMinMaxHelperText',
                )
              }}
            </b-form-text>
            <b-form-group
              :label="$t('pageNodeManager.setCapabilityModal.minimum')"
              label-for="capMinimum"
            >
              <b-form-input
                id="capMinimum"
                v-model="form.capMinimum"
                type="text"
                data-test-id="setcapability-input-capMinimum"
                aria-describedby="capMinimum-help-block"
                :state="getValidationState($v.form.capMinimum)"
                @input="$v.form.capMinimum.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.capMinimum.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.form.capMinimum.pattern">
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('pageNodeManager.setCapabilityModal.maximum')"
              label-for="capMaximum"
            >
              <b-form-input
                id="capMaximum"
                v-model="form.capMaximum"
                type="number"
                data-test-id="setcapability-input-capMaximum"
                aria-describedby="capMaximum-help-block"
                :state="getValidationState($v.form.capMaximum)"
                @input="$v.form.capMaximum.$touch()"
              />
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.capMaximum.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.form.capMaximum.pattern">
                  {{ $t('global.form.invalidFormat') }}
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
        <icon-save />
        {{ $t('global.action.save') }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import IconCancel from '@carbon/icons-vue/es/rule--cancelled/20';
import IconSave from '@carbon/icons-vue/es/save/20';
export default {
  components: {
    IconCancel,
    IconSave,
  },
  mixins: [VuelidateMixin],
  props: {
    capabilities: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      domainOptions: [],
      form: {
        domain: null,
        capMaximum: '',
        capMinimum: '',
      },
    };
  },
  computed: {
    domainCapabilitiesData() {
      return this.capabilities ? false : true;
    },
  },
  watch: {
    capabilities: function (value) {
      if (value === null) return;
      //console.log('values', value);
      this.domainOptions = value.map((domainoption, index) => {
        return {
          text: domainoption.domain,
          value: index,
        };
      });
      //console.log('value', value);
      this.form.capMaximum = value.capMaximum;
      this.form.capMinimum = value.capMinimum;
    },
  },
  validations() {
    return {
      form: {
        domain: {
          required,
        },
        capMinimum: {
          required,
          pattern: (val) => this.minCapabilityValidation(val),
        },
        capMaximum: {
          required,
          pattern: (val) => this.maxCapabilityValidation(val),
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
      this.form.capMaximum = '';
      this.form.capMinimum = '';
      this.$v.$reset();
      this.$emit('hidden');
    },
    onChangeSelect(selectedOption) {
      console.log(selectedOption, this.capabilities[selectedOption]);
      this.form.domain = selectedOption;
      this.form.capMaximum = this.capabilities[selectedOption].capMaximum;
      this.form.capMinimum = this.capabilities[selectedOption].capMinimum;
    },
    handleSubmit() {
      let domainCapabilityData = {};

      this.$v.$touch();
      if (this.$v.$invalid) return;
      domainCapabilityData.domain = this.capabilities[this.form.domain].domain;
      domainCapabilityData.capMaximum = Number(this.form.capMaximum);
      domainCapabilityData.capMinimum = Number(this.form.capMinimum);

      this.$emit('ok', { domainCapabilityData });
      this.closeModal();
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    maxCapabilityValidation(val) {
      if (
        !(/^([0-9])*$/.test(val) && parseInt(val) > 0 && parseInt(val) <= 32767)
      ) {
        return false;
      }
      return true;
    },
    minCapabilityValidation(val) {
      if (
        !(/^([0-9])*$/.test(val) && parseInt(val) >= 0 && parseInt(val) < 32767)
      ) {
        return false;
      }
      return true;
    },
  },
};
</script>
