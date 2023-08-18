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
            width="350px"
            src="@/assets/images/megarac_onetree.svg"
            alt="MegaRAC OneTree"
          />
        </h1>
        <div>
          <b-form class="form" novalidate @submit.prevent="login">
            <alert
              class="login-error mb-4"
              :show="authError"
              variant="danger"
              :dismissible="true"
            >
              <p v-if="authLocked" id="login-error-alert">
                {{ $t('pageLogin.alert.authLockmessage') }}
              </p>
              <p v-else id="login-error-alert">
                {{ $t('pageLogin.alert.message') }}
              </p>
            </alert>
            <b-form-input
              id="username"
              v-model="userInfo.username"
              type="text"
              class="input"
              :placeholder="$t('pageLogin.username')"
              aria-describedby="login-error-alert username-required"
              :state="getValidationState($v.userInfo.username)"
              data-test-id="login-input-username"
              autofocus="autofocus"
              @input="$v.userInfo.username.$touch()"
            >
            </b-form-input>
            <b-form-invalid-feedback
              id="username-required"
              class="valid"
              role="alert"
            >
              <template v-if="!$v.userInfo.username.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
            <div class="mb-4"></div>
            <input-password-toggle :isloginpage="true">
              <b-form-input
                id="password"
                v-model="userInfo.password"
                :placeholder="$t('pageLogin.password')"
                aria-describedby="login-error-alert password-required"
                :state="getValidationState($v.userInfo.password)"
                type="password"
                class="form-control-with-button input"
                data-test-id="login-input-password"
                @input="$v.userInfo.password.$touch()"
              >
              </b-form-input>
            </input-password-toggle>
            <b-form-invalid-feedback
              id="password-required"
              class="valid"
              role="alert"
            >
              <template v-if="!$v.userInfo.password.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
            <div class="mb-4"></div>
            <b-form-select
              id="language"
              v-model="$i18n.locale"
              class="input"
              :options="languages"
              data-test-id="login-select-language"
            ></b-form-select>
            <b-button
              class="mt-4 btns"
              type="submit"
              variant="primary"
              data-test-id="login-button-submit"
              :disabled="disableSubmitButton"
              >{{ $t('pageLogin.logIn') }}</b-button
            >
          </b-form>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import i18n from '@/i18n';
import Alert from '@/components/Global/Alert';
import InputPasswordToggle from '@/components/Global/InputPasswordToggle';

export default {
  name: 'Login',
  components: { Alert, InputPasswordToggle },
  mixins: [VuelidateMixin],
  data() {
    return {
      userInfo: {
        username: null,
        password: null,
      },
      altLogo: process.env.VUE_APP_COMPANY_NAME || 'AMI',
      customizableGuiName: process.env.VUE_APP_GUI_NAME || '',
      disableSubmitButton: false,
      languages: [
        {
          value: 'en-US',
          text: 'US - English',
        },
        {
          value: 'es',
          text: 'Spanish - Español',
        },
        {
          value: 'ru',
          text: 'Russian - Русский',
        },
      ],
    };
  },
  created() {
    if (process.env.VUE_APP_CHINESE_ZH_CN_LANGUAGE_SUPPORT == 'true')
      this.languages.push({
        value: 'zh-CN',
        text: 'China - 中文 (简体)',
      });
    if (process.env.VUE_APP_TAIWAN_ZH_TW_LANGUAGE_SUPPORT == 'true')
      this.languages.push({
        value: 'zh-TW',
        text: 'Taiwan - 中文 (正體)',
      });
  },
  computed: {
    authError() {
      return this.$store.getters['authentication/authError'];
    },
    authLocked() {
      return this.$store.getters['authentication/authLocked'];
    },
  },
  validations: {
    userInfo: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    login: function () {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.disableSubmitButton = true;
      const username = this.userInfo.username;
      const password = this.userInfo.password;
      this.$store
        .dispatch('authentication/login', { username, password })
        .then(() => {
          localStorage.setItem('storedLanguage', i18n.locale);
          localStorage.setItem('storedUsername', username);
          this.$store.commit('global/setUsername', username);
          this.$store.commit('global/setLanguagePreference', i18n.locale);
          return this.$store.dispatch('authentication/getUserInfo', username);
        })
        .then(({ PasswordChangeRequired, RoleId }) => {
          if (PasswordChangeRequired) {
            this.$router.push('/change-password');
          } else {
            this.$router.push('/');
          }
          if (RoleId) {
            this.$store.commit('global/setPrivilege', RoleId);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.disableSubmitButton = false));
    },
  },
};
</script>

<style lang="scss" scoped>
.login-error {
  max-width: 350px;
}
</style>
