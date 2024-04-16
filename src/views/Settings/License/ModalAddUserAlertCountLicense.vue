<template>
  <b-modal
    id="modal-add-user-alert-count"
    ref="modal"
    :title="$t('license.userAlertCount')"
    @hidden="resetForm"
    @show="initModal"
  >
    <b-form id="form-addUserAlert" @submit.prevent="handleSubmit">
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('license.userAlertCountPercentage')"
            label-for="useralertcount"
          >
            <b-form-input
              id="useralertcount"
              v-model="form.userAlertCount"
              type="text"
              data-test-id="userAlertCount-input"
              :state="getValidationState($v.form.userAlertCount)"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.userAlertCount.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template
                v-if="
                  $v.form.userAlertCount.required &&
                  !$v.form.userAlertCount.pattern
                "
              >
                {{ $t('license.userAlertCountRangeRequired') }}
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
      <b-button form="form-count" type="submit" variant="primary" @click="onOk">
        {{ $t('global.action.save') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { required } from 'vuelidate/lib/validators';
export default {
  mixins: [VuelidateMixin],
  props: {
    modalAddcountSuccess: {
      type: Boolean,
      default: false,
    },
    userAlertCountvalue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        userAlertCount: '',
      },
    };
  },
  computed: {
    minValidityValue() {
      return this.$store.getters['license/getLicenseMinData'];
    },
  },
  watch: {
    modalAddcountSuccess: function (value) {
      if (value === true) {
        this.closeModal();
      }
    },
  },
  validations() {
    return {
      form: {
        userAlertCount: {
          required,
          pattern: function (val) {
            return this.userAlertCountValidation(val);
          },
        },
      },
    };
  },
  methods: {
    initModal() {
      this.form.userAlertCount = this.userAlertCountvalue;
    },
    resetForm() {
      this.$emit('closeAddModal', false);
      this.form.userAlertCount = '';
      this.$v.$reset();
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$emit('alertpercentageOk', {
        UserAlertCount: parseInt(this.form.userAlertCount),
      });
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
        this.resetForm();
      });
    },
    userAlertCountValidation(value) {
      if (
        !(parseInt(value) > 0 && parseInt(value) < this.minValidityValue) ||
        !/^[0-9]*$/.test(value)
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
