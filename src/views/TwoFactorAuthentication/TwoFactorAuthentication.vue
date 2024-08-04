<template>
  <div class="login-container">
    <div class="py-5">
      <b-card class="card-cont my-5">
        <b-container
          class="containers logo-pos pa-5 rounded-circle d-inline-block"
        >
          <img
            class="imges"
            width="100px"
            src="@/assets/images/login_form_company_logo.svg"
            :alt="altLogo"
          />
        </b-container>
        <h1 v-if="customizableGuiName" class="h4 mt-3 mb-3">
          <img
            class="img-margin"
            width="350px"
            src="@/assets/images/login_form_product_logo.svg"
            alt="MegaRAC OneTree"
          />
        </h1>
        <div>
          <b-form>
            <span>{{ $t('pageTfa.verificationCodeMessage') }}</span>
            <br />
            <br />
            <input-password-toggle :isloginpage="true">
              <b-form-input
                id="tfa"
                v-model="verificationCode"
                type="password"
                minlength="6"
                maxlength="8"
                class="form-control-with-button input"
                :placeholder="$t('pageTfa.verificationCode')"
                aria-describedby="login-error-alert newtfa-required"
                data-test-id="login-input-newtfa"
                :state="getValidationState($v.verificationCode)"
                @input="$v.verificationCode.$touch()"
              >
              </b-form-input>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.verificationCode.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template
                  v-else-if="
                    !$v.verificationCode.maxLength ||
                    !$v.verificationCode.minLength
                  "
                >
                  {{
                    $t('global.form.lengthMustBeBetween', { min: 6, max: 8 })
                  }}
                </template>
              </b-form-invalid-feedback>
            </input-password-toggle>
            <div class="mb-2"></div>
            <b-button
              class="mt-4 btns"
              type="submit"
              variant="primary"
              data-test-id="login-button-submit"
              :disabled="disableSubmitButton"
              @click="changeTfa"
              >{{ $t('pageTfa.submit') }}</b-button
            >
          </b-form>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { required, maxLength, minLength } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';
import InputPasswordToggle from '@/components/Global/InputPasswordToggle';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

export default {
  name: 'ChangeTfa',
  components: { InputPasswordToggle },
  mixins: [VuelidateMixin, BVToastMixin],
  data() {
    return {
      verificationCode: null,
      altLogo: process.env.VUE_APP_COMPANY_NAME || 'AMI',
      customizableGuiName: process.env.VUE_APP_GUI_NAME || '',
      username: this.$store.getters['global/username'],
      disableSubmitButton: false,
      changeTfaError: false,
    };
  },
  validations() {
    return {
      verificationCode: {
        required,
        maxLength: maxLength(8),
        minLength: minLength(6),
      },
    };
  },
  methods: {
    changeTfa() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.disableSubmitButton = true;
      let data = {
        username: this.username,
        verificationcode: this.verificationCode,
      };

      this.$store
        .dispatch('authentication/verifyOtp', data)
        .then((response) => {
          if (response.Authentication == 'Success') {
            this.$router.push('/');
          }
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => (this.disableSubmitButton = false))
        .catch(() => (this.changeTfaError = true));
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  background: gray('100');
  display: flex;
  flex-direction: column;
  gap: $spacer * 2;
  min-height: 100vh;
  max-width: none !important;
  justify-content: space-around;

  @include media-breakpoint-up('md') {
    background: radial-gradient(circle, $blue 0%, #191c24 100%) !important;
    flex-direction: row;
  }
}

.card-cont {
  width: min-content;
  transform: translate(-50%, -50%);
  top: 40%;
  left: 50%;
  border: #3f3f3f;
  background: #ffffff;
  box-shadow: 0 15px 25px rgb(0 0 0 / 60%);
}

.h4 {
  padding-top: 7%;
}

.input {
  width: 100%;
  height: 50px;
}

.btns {
  width: 100%;
  height: 50px;
}

.valid {
  margin-top: 10px;
  margin-bottom: 10px;
}

.containers {
  box-shadow: 0px 10px 40px -10px rgba(0, 0, 0, 0.7);
  width: 130px;
  height: 130px;
  position: absolute;
  top: -14%;
  left: 110px;
  background: #252323;
}

.logo-pos {
  position: absolute;
  top: -20%;
  left: 34%;
}

.imges {
  position: absolute;
  top: 35%;
  left: 13%;
}

.img-bmc {
  position: absolute;
  bottom: 2%;
  right: 2%;
}
.img-margin {
  margin: inherit;
}
</style>
