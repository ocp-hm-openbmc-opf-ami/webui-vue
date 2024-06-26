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
            src="@/assets/images/ami-logo-no-tag-dark-bg.svg"
            :alt="altLogo"
          />
        </b-container>
        <h1 v-if="customizableGuiName" class="h4 mt-3 mb-3">
          <img
            class="img-margin"
            width="350px"
            src="@/assets/images/megarac_onetree.svg"
            alt="MegaRAC OneTree"
          />
        </h1>
        <div>
          <b-form>
            <input-password-toggle>
              <b-form-input
                id="password"
                v-model="form.password"
                class="form-control-with-button input"
                placeholder="New Password"
                aria-describedby="login-error-alert newpassword-required"
                data-test-id="login-input-newpassword"
                autofocus="autofocus"
                type="password"
                :state="getValidationState($v.form.password)"
                autocomplete="new-password"
                @input="$v.form.password.$touch()"
              >
              </b-form-input>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.password.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template
                  v-else-if="
                    !$v.form.password.maxLength || !$v.form.password.minLength
                  "
                >
                  {{
                    $t('global.form.lengthMustBeBetween', { min: 8, max: 16 })
                  }}
                </template>
                <template v-else-if="!$v.form.password.pattern">
                  {{ $t('global.form.invalidFormat') }}
                </template>
              </b-form-invalid-feedback>
            </input-password-toggle>
            <div class="mb-4"></div>
            <input-password-toggle>
              <b-form-input
                id="password-confirm"
                v-model="form.passwordConfirm"
                class="form-control-with-button input"
                placeholder="Confirm Password"
                aria-describedby="login-error-alert newpassword-required"
                data-test-id="login-input-newpassword"
                autofocus="autofocus"
                type="password"
                :state="getValidationState($v.form.passwordConfirm)"
                autocomplete="new-password"
                @input="$v.form.passwordConfirm.$touch()"
              >
              </b-form-input>
              <b-form-invalid-feedback role="alert">
                <template v-if="!$v.form.passwordConfirm.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.form.passwordConfirm.sameAsPassword">
                  {{ $t('global.form.passwordsDoNotMatch') }}
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
              @click="changePassword"
              >{{ $t('pageChangePassword.submit') }}</b-button
            >
          </b-form>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import {
  required,
  sameAs,
  maxLength,
  minLength,
} from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';
import InputPasswordToggle from '@/components/Global/InputPasswordToggle';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

export default {
  name: 'ChangePassword',
  components: { InputPasswordToggle },
  mixins: [VuelidateMixin, BVToastMixin],
  data() {
    return {
      form: {
        password: null,
        passwordConfirm: null,
      },
      altLogo: process.env.VUE_APP_COMPANY_NAME || 'AMI',
      customizableGuiName: process.env.VUE_APP_GUI_NAME || '',
      username: this.$store.getters['global/username'],
      disableSubmitButton: false,
      changePasswordError: false,
    };
  },
  validations() {
    return {
      form: {
        password: {
          required,
          maxLength: maxLength(16),
          minLength: minLength(8),
          pattern: function (pw) {
            return this.passwordValidation(pw);
          },
        },
        passwordConfirm: {
          required,
          sameAsPassword: sameAs('password'),
        },
      },
    };
  },
  methods: {
    changePassword() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.disableSubmitButton = true;
      let routerPath = this.$router.history.current.path;
      let data = {
        originalUsername: this.username,
        password: this.form.password,
        routerPath: routerPath,
      };

      this.$store
        .dispatch('userManagement/updateUser', data)
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.disableSubmitButton = false;
          setTimeout(() => {
            this.$store.dispatch('authentication/logout');
          }, 2000);
        })
        .then(() => this.$router.push('/login'))
        .catch(() => (this.changePasswordError = true));
    },
    passwordValidation(val) {
      if (
        /([a-zA-Z0-9])\1\1+|(sshd|bin|daemon|sys|adm|asdfghjk|asdfghjkl|sync|shutdown|halt|mail|news|uucp operator|games|ftp|man|nobody|stunnel4|password|Password|qwertyui|qwertyuiop)+/gi.test(
          val,
        ) ||
        /^[!@#$%^&*)(+=._-]+$/gi.test(val) ||
        this.form.password.indexOf(this.username) !== -1 ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!\d)[a-zA-Z\d]$/gi.test(val) ||
        /^(?:^|\D)(\d{8,20})$/gi.test(val)
      ) {
        return false;
      }
      return true;
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
  width: 100%;
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
