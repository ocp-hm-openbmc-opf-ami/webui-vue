<template>
  <b-modal id="modal-user" ref="modal" size="lg" @hidden="resetForm">
    <template #modal-title>
      <template v-if="newUser">
        {{ $t('pageUserManagement.addUser') }}
      </template>
      <template v-else>
        {{ $t('pageUserManagement.editUser') }}
      </template>
    </template>
    <b-form id="form-user" novalidate @submit.prevent="handleSubmit">
      <b-container>
        <!-- Manual unlock form control -->
        <b-row v-if="!newUser && manualUnlockPolicy && user.Locked">
          <b-col sm="9">
            <alert :show="true" variant="warning" small>
              <template v-if="!$v.form.manualUnlock.$dirty">
                {{ $t('pageUserManagement.modal.accountLocked') }}
              </template>
            </alert>
          </b-col>
          <b-col sm="3">
            <input
              v-model="form.manualUnlock"
              data-test-id="userManagement-input-manualUnlock"
              type="hidden"
              value="false"
            />
            <b-button
              variant="primary"
              :disabled="$v.form.manualUnlock.$dirty"
              data-test-id="userManagement-button-manualUnlock"
              @click="accountUnLock"
            >
              {{ $t('pageUserManagement.modal.unlock') }}
            </b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="12">
            <b-row>
              <b-col lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.accountStatus')"
                >
                  <b-form-radio
                    v-model="form.status"
                    name="user-status"
                    :value="true"
                    data-test-id="userManagement-radioButton-statusEnabled"
                    @input="$v.form.status.$touch()"
                  >
                    {{ $t('global.status.enabled') }}
                  </b-form-radio>
                  <b-form-radio
                    v-model="form.status"
                    name="user-status"
                    data-test-id="userManagement-radioButton-statusDisabled"
                    :value="false"
                    :disabled="
                      (!newUser && originalUsername === disabled) ||
                      globalPrivilege !== 'Administrator' ||
                      form.username === 'root'
                    "
                    @input="$v.form.status.$touch()"
                  >
                    {{ $t('global.status.disabled') }}
                  </b-form-radio>
                </b-form-group>
              </b-col>
              <b-col lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.username')"
                  label-for="username"
                >
                  <b-form-text id="username-help-block">
                    {{ $t('pageUserManagement.modal.cannotStartWithANumber') }}
                    <br />
                    {{
                      $t(
                        'pageUserManagement.modal.noSpecialCharactersExceptUnderscore',
                      )
                    }}
                  </b-form-text>
                  <b-form-input
                    id="username"
                    v-model="form.username"
                    type="text"
                    aria-describedby="username-help-block"
                    data-test-id="userManagement-input-username"
                    :state="getValidationState($v.form.username)"
                    :disabled="
                      (!newUser && originalUsername === disabled) ||
                      globalPrivilege !== 'Administrator' ||
                      newUser === 'root'
                    "
                    autocomplete="new-username"
                    @input="$v.form.username.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.username.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template v-else-if="!$v.form.username.maxLength">
                      {{
                        $t('global.form.lengthMustBeBetween', {
                          min: 1,
                          max: 16,
                        })
                      }}
                    </template>
                    <template v-else-if="!$v.form.username.pattern">
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col :style="changePasswordFieldStyle" lg="4">
                <b-form-checkbox
                  v-if="!newUser"
                  id="changePassword"
                  v-model="form.changePassword"
                >
                  {{ $t('pageUserManagement.modal.changePassword') }}
                </b-form-checkbox>
                <b-form-group
                  :label="$t('pageUserManagement.modal.userPassword')"
                  label-for="password"
                >
                  <b-form-text id="password-help-block">
                    {{
                      $t('pageUserManagement.modal.passwordMustBeBetween', {
                        min: passwordRequirements.minLength,
                        max: passwordRequirements.maxLength,
                      })
                    }}
                  </b-form-text>
                  <input-password-toggle>
                    <b-form-input
                      id="password"
                      v-model="form.password"
                      type="password"
                      data-test-id="userManagement-input-password"
                      aria-describedby="password-help-block"
                      :state="getValidationState($v.form.password)"
                      class="form-control-with-button"
                      :style="passwordInputFieldStyle"
                      :disabled="
                        !newUser &&
                        !(form.snmpUserEnable || form.changePassword)
                      "
                      autocomplete="new-password"
                      @input="$v.form.password.$touch()"
                    />
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.form.password.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template v-else-if="!$v.form.password.pattern">
                        {{ $t('global.form.invalidFormat') }}
                      </template>
                    </b-form-invalid-feedback>
                  </input-password-toggle>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.passwordChangeRequired')"
                >
                  <b-form-radio
                    v-model="form.PasswordChangeRequired"
                    name="Password-change-status"
                    :value="true"
                    data-test-id="userManagement-radioButton-statusEnabled"
                    :disabled="
                      form.username === 'root' ||
                      globalPrivilege !== 'Administrator'
                    "
                    @input="$v.form.PasswordChangeRequired.$touch()"
                  >
                    {{ $t('global.status.enabled') }}
                  </b-form-radio>
                  <b-form-radio
                    v-model="form.PasswordChangeRequired"
                    name="Password-change-status"
                    data-test-id="userManagement-radioButton-statusDisabled"
                    :value="false"
                    :disabled="
                      form.username === 'root' ||
                      globalPrivilege !== 'Administrator'
                    "
                    @input="$v.form.PasswordChangeRequired.$touch()"
                  >
                    {{ $t('global.status.disabled') }}
                  </b-form-radio>
                </b-form-group>
              </b-col>
              <b-col lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.privilege')"
                  label-for="privilege"
                >
                  <b-form-select
                    id="privilege"
                    v-model="form.privilege"
                    :options="privilegeTypes"
                    data-test-id="userManagement-select-privilege"
                    :state="getValidationState($v.form.privilege)"
                    :disabled="
                      (!newUser && originalUsername === 'root') ||
                      globalPrivilege !== 'Administrator'
                    "
                    @input="$v.form.privilege.$touch()"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled>
                        {{ $t('global.form.selectAnOption') }}
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.privilege.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.confirmUserPassword')"
                  label-for="password-confirmation"
                >
                  <input-password-toggle>
                    <b-form-input
                      id="password-confirmation"
                      v-model="form.passwordConfirmation"
                      data-test-id="userManagement-input-passwordConfirmation"
                      type="password"
                      :state="getValidationState($v.form.passwordConfirmation)"
                      class="form-control-with-button"
                      :disabled="
                        !newUser &&
                        !(form.snmpUserEnable || form.changePassword)
                      "
                      autocomplete="new-password"
                      @input="$v.form.passwordConfirmation.$touch()"
                    />
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.form.passwordConfirmation.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template
                        v-else-if="!$v.form.passwordConfirmation.sameAsPassword"
                      >
                        {{ $t('pageUserManagement.modal.passwordsDoNotMatch') }}
                      </template>
                    </b-form-invalid-feedback>
                  </input-password-toggle>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.snmpUserEnable')"
                >
                  <b-form-radio
                    v-model="form.snmpUserEnable"
                    name="snmp-user-enable"
                    :value="true"
                    data-test-id="userManagement-radioButton-snmpUserEnable"
                    @input="$v.form.snmpUserEnable.$touch()"
                  >
                    {{ $t('global.status.enabled') }}
                  </b-form-radio>
                  <b-form-radio
                    v-model="form.snmpUserEnable"
                    name="snmp-user-enable"
                    data-test-id="userManagement-radioButton-snmpUserEnable"
                    :value="false"
                    @input="$v.form.snmpUserEnable.$touch()"
                  >
                    {{ $t('global.status.disabled') }}
                  </b-form-radio>
                </b-form-group>
              </b-col>
              <b-col v-if="form.snmpUserEnable" lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.encryption')"
                  label-for="encryption"
                >
                  <b-form-select
                    id="encryption"
                    v-model="form.encryption"
                    :options="encryptionType"
                    data-test-id="userManagement-input-encryption"
                    :state="getValidationState($v.form.encryption)"
                    @input="$v.form.encryption.$touch()"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled>
                        {{ $t('global.form.selectAnOption') }}
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.encryption.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col v-if="form.snmpUserEnable" lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.readWritePermission')"
                  label-for="readWritePermission"
                >
                  <b-form-select
                    id="readWritePermission"
                    v-model="form.readWritePermission"
                    :options="readWritePermissionType"
                    data-test-id="userManagement-input-readWritePermission"
                    :state="getValidationState($v.form.readWritePermission)"
                    @input="$v.form.readWritePermission.$touch()"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled>
                        {{ $t('global.form.selectAnOption') }}
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.readWritePermission.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.vmediaAccess')"
                >
                  <b-form-radio
                    v-model="form.vmediaAccess"
                    name="vmediaAccess-change-status"
                    :value="true"
                    data-test-id="userManagement-vmediaAccess-statusEnabled"
                    :disabled="
                      form.username === 'root' ||
                      globalPrivilege !== 'Administrator'
                    "
                    @input="$v.form.vmediaAccess.$touch()"
                  >
                    {{ $t('global.status.enabled') }}
                  </b-form-radio>
                  <b-form-radio
                    v-model="form.vmediaAccess"
                    name="vmediaAccess-change-status"
                    data-test-id="userManagement-vmediaAccess-statusDisabled"
                    :value="false"
                    :disabled="
                      form.username === 'root' ||
                      globalPrivilege !== 'Administrator'
                    "
                    @input="$v.form.vmediaAccess.$touch()"
                  >
                    {{ $t('global.status.disabled') }}
                  </b-form-radio>
                </b-form-group>
              </b-col>
              <b-col v-if="form.snmpUserEnable" lg="4">
                <b-form-group
                  :label="$t('pageUserManagement.modal.algorithm')"
                  label-for="algorithm"
                >
                  <b-form-select
                    id="algorithm"
                    v-model="form.algorithm"
                    :options="algorithmType"
                    data-test-id="userManagement-input-algorithm"
                    :state="getValidationState($v.form.algorithm)"
                    @input="$v.form.algorithm.$touch()"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled>
                        {{ $t('global.form.selectAnOption') }}
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.algorithm.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-form>
    <template #modal-footer="{ cancel }">
      <b-button
        variant="secondary"
        data-test-id="userManagement-button-cancel"
        @click="cancel()"
      >
        <icon-cancel />
        {{ $t('global.action.cancel') }}
      </b-button>
      <b-button
        form="form-user"
        data-test-id="userManagement-button-submit"
        type="submit"
        variant="primary"
        @click="onOk"
      >
        <template v-if="newUser">
          <icon-add />
          {{ $t('pageUserManagement.addUser') }}
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
import {
  required,
  maxLength,
  sameAs,
  helpers,
  requiredIf,
} from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import InputPasswordToggle from '@/components/Global/InputPasswordToggle';
import Alert from '@/components/Global/Alert';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconSave from '@carbon/icons-vue/es/save/20';
import IconCancel from '@carbon/icons-vue/es/rule--cancelled/20';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';

export default {
  components: { Alert, InputPasswordToggle, IconSave, IconCancel, IconAdd },
  mixins: [VuelidateMixin, BVToastMixin],
  props: {
    user: {
      type: Object,
      default: null,
    },
    passwordRequirements: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      originalUsername: '',
      form: {
        status: true,
        username: '',
        privilege: null,
        password: '',
        passwordConfirmation: '',
        manualUnlock: false,
        PasswordChangeRequired: false,
        vmediaAccess: true,
        changePassword: false,
        snmpUserEnable: false,
        encryption: null,
        algorithm: null,
        readWritePermission: null,
      },
      disabled: this.$store.getters['global/username'],
      globalPrivilege: this.$store.getters['global/userPrivilege'],
      encryptionType: [
        { value: 'DES', text: 'DES' },
        { value: 'AES', text: 'AES' },
      ],
      algorithmType: [
        {
          value: 'SHA',
          text: this.$tc('pageUserManagement.modal.authProtocolsh224'),
        },
        {
          value: 'SHA-256',
          text: this.$tc('pageUserManagement.modal.authProtocolsha256'),
        },
        {
          value: 'SHA-384',
          text: this.$tc('pageUserManagement.modal.authProtocolsha384'),
        },
        {
          value: 'SHA-512',
          text: this.$tc('pageUserManagement.modal.authProtocolsha512'),
        },
      ],
      readWritePermissionType: [
        {
          value: 'ReadOnly',
          text: this.$t('pageUserManagement.modal.readOnly'),
        },
        {
          value: 'ReadWrite',
          text: this.$t('pageUserManagement.modal.readWrite'),
        },
      ],
    };
  },
  computed: {
    newUser() {
      return this.user ? false : true;
    },
    accountSettings() {
      return this.$store.getters['userManagement/accountSettings'];
    },
    manualUnlockPolicy() {
      return !this.accountSettings.accountLockoutDuration;
    },
    privilegeTypes() {
      return this.$store.getters['userManagement/accountRoles'];
    },
    changePasswordFieldStyle() {
      return !this.newUser ? { transform: 'translateY(-4px)' } : {};
    },
    passwordInputFieldStyle() {
      return this.newUser ? { marginTop: '29px' } : {};
    },
  },
  watch: {
    user: function (value) {
      if (value === null) return;
      this.originalUsername = value.username;
      this.form.username = value.username;
      this.form.status = value.Enabled;
      this.form.privilege = value.privilege;
      this.form.PasswordChangeRequired = value.PasswordChangeRequired;
      this.form.vmediaAccess = value.OEMAccountTypes.includes('media');
      this.form.snmpUserEnable = value.Oem.Ami.SNMP.SNMPAccessEnableStatus;
      this.form.algorithm = value.Oem.Ami.SNMP.Algorithm;
      this.form.encryption = value.Oem.Ami.SNMP.Encryption;
      this.form.readWritePermission = value.Oem.Ami.SNMP.Access;
    },
  },
  validations() {
    return {
      form: {
        status: {
          required,
        },
        vmediaAccess: {
          required,
        },
        username: {
          required,
          maxLength: maxLength(16),
          pattern: helpers.regex('pattern', /^[a-zA-Z_][a-zA-Z0-9_]*$/),
        },
        privilege: {
          required,
        },
        password: {
          required: requiredIf(function () {
            return (
              (this.requirePassword() && this.form.changePassword) ||
              this.newUser
            );
          }),
          pattern: function (pw) {
            return this.form.changePassword
              ? this.passwordValidation(pw)
              : true;
          },
        },
        passwordConfirmation: {
          required: requiredIf(function () {
            return (
              (this.requirePassword() && this.form.changePassword) ||
              this.newUser
            );
          }),
          sameAsPassword: sameAs('password'),
        },
        manualUnlock: {},
        PasswordChangeRequired: {
          required,
        },
        snmpUserEnable: {
          required,
        },
        encryption: {
          required: requiredIf(function () {
            return this.form.snmpUserEnable;
          }),
        },
        algorithm: {
          required: requiredIf(function () {
            return this.form.snmpUserEnable;
          }),
        },
        readWritePermission: {
          required: requiredIf(function () {
            return this.form.snmpUserEnable;
          }),
        },
      },
    };
  },
  methods: {
    handleSubmit() {
      let userData = {};

      if (this.newUser) {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        userData.username = this.form.username;
        userData.status = this.form.status;
        userData.privilege = this.form.privilege;
        userData.PasswordChangeRequired = this.form.PasswordChangeRequired;
        userData.vmediaAccess = this.form.vmediaAccess;
        userData.password = this.form.password;
        userData.snmpUserEnable = this.form.snmpUserEnable;
        userData.encryption = this.form.encryption ? this.form.encryption : '';
        userData.algorithm = this.form.algorithm ? this.form.algorithm : '';
        userData.readWritePermission = this.form.readWritePermission
          ? this.form.readWritePermission
          : '';
      } else {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        userData.originalUsername = this.originalUsername;
        if (this.$v.form.status.$dirty) {
          userData.status = this.form.status;
        }
        if (this.$v.form.username.$dirty) {
          userData.username = this.form.username;
        }
        if (this.$v.form.privilege.$dirty) {
          userData.privilege = this.form.privilege;
        }
        if (this.$v.form.PasswordChangeRequired.$dirty) {
          userData.PasswordChangeRequired = this.form.PasswordChangeRequired;
        }
        if (this.$v.form.vmediaAccess.$dirty) {
          userData.vmediaAccess = this.form.vmediaAccess;
        }
        if (this.$v.form.password.$dirty) {
          userData.password = this.form.password;
        }
        if (this.$v.form.snmpUserEnable.$dirty) {
          userData.snmpUserEnable = this.form.snmpUserEnable;
        }
        if (this.form.snmpUserEnable === false) {
          userData.encryption = '';
          userData.algorithm = '';
          userData.readWritePermission = '';
        } else {
          if (this.$v.form.encryption.$dirty) {
            userData.encryption = this.form.encryption
              ? this.form.encryption
              : '';
          }
          if (this.$v.form.algorithm.$dirty) {
            userData.algorithm = this.form.algorithm ? this.form.algorithm : '';
          }
          if (this.$v.form.readWritePermission.$dirty) {
            userData.readWritePermission = this.form.readWritePermission
              ? this.form.readWritePermission
              : '';
          }
        }
        if (Object.entries(userData).length === 1) {
          this.closeModal();
          return;
        }
      }

      this.$emit('ok', { isNewUser: this.newUser, userData });
      this.closeModal();
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },
    resetForm() {
      this.form.originalUsername = '';
      this.form.status = true;
      this.form.username = '';
      this.form.privilege = null;
      this.form.PasswordChangeRequired = false;
      this.form.vmediaAccess = true;
      this.form.password = '';
      this.form.passwordConfirmation = '';
      this.form.changePassword = false;
      this.form.snmpUserEnable = false;
      this.form.encryption = null;
      this.form.algorithm = null;
      this.form.readWritePermission = null;
      this.$v.$reset();
      this.$emit('hidden');
    },
    requirePassword() {
      if (this.newUser) return true;
      if (this.$v.form.password.$dirty) return true;
      if (this.$v.form.passwordConfirmation.$dirty) return true;
      return false;
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    passwordValidation(val) {
      if (!/^(?=.*[\w\d]).+/gi.test(val)) {
        return false;
      }
      return true;
    },
    accountUnLock() {
      let userData = {};
      userData.originalUsername = this.originalUsername;
      userData.locked = false;
      this.$store
        .dispatch('userManagement/updateUser', userData)
        .then((success) => this.successToast(success))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.closeModal());
    },
  },
};
</script>
<style scoped>
.form-change-password {
  transform: translateY(-4px);
}
</style>
