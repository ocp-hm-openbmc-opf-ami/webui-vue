<template>
  <b-modal
    id="modal-add-license"
    ref="modal"
    :title="$t('license.add_license_key')"
    @hidden="resetForm"
  >
    <b-form id="form-addLicense" @submit.prevent="handleSubmit">
      <b-row>
        <b-col sm="6">
          <b-form-group :label="$t('license.license_key')">
            <form-file
              id="certificate-file"
              v-model="form.file"
              accept=".key"
              :state="getValidationState($v.form.file)"
              @input="onFileUpload($event)"
            >
              <template #invalid>
                <b-form-invalid-feedback role="alert">
                  {{ $t('global.form.required') }}
                </b-form-invalid-feedback>
              </template>
            </form-file>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <template #modal-footer="{ cancel }">
      <b-button variant="secondary" @click="cancel()">
        {{ $t('global.action.cancel') }}
      </b-button>
      <b-button
        form="form-Licenses"
        type="submit"
        variant="primary"
        @click="onOk"
      >
        {{ $t('global.action.save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { required } from 'vuelidate/lib/validators';
import FormFile from '@/components/Global/FormFile';
export default {
  components: { FormFile },
  mixins: [VuelidateMixin],
  props: {
    modalAddliceseSuccess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        file: '',
      },
    };
  },
  watch: {
    modalAddliceseSuccess: function (value) {
      if (value === true) {
        this.closeModal();
      }
    },
  },
  validations() {
    return {
      form: {
        file: {
          required,
        },
      },
    };
  },
  methods: {
    resetForm() {
      this.$emit('closeAddLicenseModal', false);
      this.form.file = '';
      this.$v.$reset();
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$emit('licenseKeyOk', this.form.file);
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
        this.resetForm();
      });
    },
    onFileUpload(file) {
      this.form.file = file;
      this.$v.form.file.$touch();
    },
  },
};
</script>
