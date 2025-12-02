`
<template>
  <b-modal
    id="modal-forgot-password"
    ref="modal"
    :title="$t('pageLogin.forgotPassword.title')"
    @hidden="resetForm"
  >
    <b-form id="form-forgot-password" novalidate @submit.prevent="handleSubmit">
      <b-alert show variant="success">
        {{ $t('pageLogin.forgotPassword.otpSentMessage') }} <br />
        {{ $t('pageLogin.forgotPassword.otpExpiryNote') }}
      </b-alert>
      <b-form-group
        :label="$t('pageLogin.forgotPassword.verificationCode')"
        label-for="verification-code"
      >
        <b-form-input
          id="verification-code"
          v-model="form.verificationCode"
          type="text"
          :state="getValidationState($v.form.verificationCode)"
          @input="$v.form.verificationCode.$touch()"
        />
        <b-form-invalid-feedback
          :state="getValidationState($v.form.verificationCode)"
        >
          <template v-if="!$v.form.verificationCode.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
          <template v-if="!$v.form.verificationCode.numeric">
            {{ $t('pageLogin.forgotPassword.numericOnly') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('pageLogin.forgotPassword.newPassword')"
        label-for="new-password"
      >
        <p class="text-muted small">
          {{ $t('pageLogin.forgotPassword.passwordRequirements') }}
        </p>
        <input-password-toggle>
          <b-form-input
            id="new-password"
            v-model="form.password"
            type="password"
            :state="getValidationState($v.form.password)"
            @input="$v.form.password.$touch()"
          />
          <b-form-invalid-feedback
            :state="getValidationState($v.form.password)"
          >
            <template v-if="!$v.form.password.required">
              {{ $t('global.form.fieldRequired') }}
            </template>
            <template v-if="!$v.form.password.minLength">
              {{ $t('pageLogin.forgotPassword.passwordLength') }}
            </template>
          </b-form-invalid-feedback>
        </input-password-toggle>
      </b-form-group>

      <b-form-group
        :label="$t('pageLogin.forgotPassword.confirmPassword')"
        label-for="confirm-password"
      >
        <input-password-toggle>
          <b-form-input
            id="confirm-password"
            v-model="form.confirmPassword"
            type="password"
            :state="getValidationState($v.form.confirmPassword)"
            @input="$v.form.confirmPassword.$touch()"
          />
          <b-form-invalid-feedback
            :state="getValidationState($v.form.confirmPassword)"
          >
            <template v-if="!$v.form.confirmPassword.required">
              {{ $t('global.form.fieldRequired') }}
            </template>
            <template v-if="!$v.form.confirmPassword.sameAsPassword">
              {{ $t('pageLogin.forgotPassword.passwordMismatch') }}
            </template>
          </b-form-invalid-feedback>
        </input-password-toggle>
      </b-form-group>
    </b-form>
    <template #modal-footer>
      <b-button variant="secondary" @click="$refs.modal.hide()">
        {{ $t('global.action.cancel') }}
      </b-button>
      <b-button
        variant="primary"
        :disabled="$v.form.$invalid"
        @click="handleSubmit"
      >
        {{ $t('global.action.submit') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import {
  required,
  minLength,
  maxLength,
  sameAs,
} from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import InputPasswordToggle from '@/components/Global/InputPasswordToggle';

export default {
  name: 'ForgotPasswordModal',
  components: {
    InputPasswordToggle,
  },
  mixins: [VuelidateMixin],
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        verificationCode: '',
        password: '',
        confirmPassword: '',
      },
    };
  },
  validations: {
    form: {
      verificationCode: {
        required,
        numeric: (val) => /^\d+$/.test(val),
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(20),
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('password'),
      },
    },
  },
  methods: {
    async handleSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$invalid) return;

      try {
        await this.$store.dispatch('authentication/validateOtp', {
          username: this.username,
          verificationCode: this.form.verificationCode,
          password: this.form.password,
        });

        this.$bvToast.toast(
          this.$t('pageLogin.forgotPassword.successMessage'),
          {
            title: this.$tc('global.status.success'),
            variant: 'success',
            autoHideDelay: 5000,
            solid: true,
          },
        );

        this.$refs.modal.hide();
        this.$router.push('/login');
      } catch (error) {
        let errorMessage = this.$t(
          'pageLogin.forgotPassword.otpValidationError',
        );

        // Check if the error response contains a specific error message
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          // If it's the OTP validation error, use our custom message
          if (error.response.data.error.includes('Failed to validate OTP')) {
            errorMessage = this.$t(
              'pageLogin.forgotPassword.otpValidationError',
            );
          } else {
            // For other API errors, show the actual error message
            errorMessage = error.response.data.error;
          }
        } else if (error.message) {
          // Fallback to the error message from the store action
          errorMessage = error.message;
        }

        this.$bvToast.toast(errorMessage, {
          title: this.$tc('global.status.error'),
          variant: 'danger',
          autoHideDelay: 5000,
          solid: true,
        });
      }
    },
    resetForm() {
      this.form = {
        verificationCode: '',
        password: '',
        confirmPassword: '',
      };
      this.$v.form.$reset();
    },
  },
};
</script>
`
