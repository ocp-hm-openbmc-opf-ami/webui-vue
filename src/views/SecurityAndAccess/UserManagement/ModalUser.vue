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
          <!-- first column start-->
          <b-col lg="4">
            <b-form-group :label="$t('pageUserManagement.modal.accountStatus')">
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
            <b-form-group
              :label="$t('pageUserManagement.modal.snmpUserEnable')"
            >
              <b-form-radio
                v-model="form.snmpUserEnable"
                name="snmp-user-enable"
                :value="true"
                :disabled="
                  form.username === 'root' ||
                  globalPrivilege !== 'Administrator'
                "
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
            <b-form-group :label="$t('pageUserManagement.modal.vmediaAccess')">
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
          <!-- first column End-->
          <!-- second column start -->
          <b-col lg="8">
            <b-row>
              <b-col lg="6">
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

              <b-col :style="changePasswordFieldStyle" lg="6">
                <b-form-checkbox
                  v-if="!newUser"
                  id="changePassword"
                  v-model="form.changePassword"
                  :disabled="isCheckboxDisabled(form)"
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
                      :disabled="!newUser && !form.changePassword"
                      autocomplete="new-password"
                      @input="$v.form.password.$touch()"
                    />
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.form.password.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template
                        v-else-if="
                          !$v.form.password.minLength ||
                          !$v.form.password.maxLength
                        "
                      >
                        {{
                          $t('pageUserManagement.modal.passwordMustBeBetween', {
                            min: passwordRequirements.minLength,
                            max: passwordRequirements.maxLength,
                          })
                        }}
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
              <!-- <b-col lg="6">
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
              </b-col> -->

              <b-col lg="6">
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
                      :disabled="!newUser && !form.changePassword"
                      autocomplete="new-password"
                      @input="$v.form.passwordConfirmation.$touch()"
                    />
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.form.passwordConfirmation.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template
                        v-else-if="
                          !$v.form.passwordConfirmation.minLength ||
                          !$v.form.passwordConfirmation.maxLength
                        "
                      >
                        {{
                          $t('pageUserManagement.modal.passwordMustBeBetween', {
                            min: passwordRequirements.minLength,
                            max: passwordRequirements.maxLength,
                          })
                        }}
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
              <b-col lg="6">
                <b-form-group
                  :label="$t('pageUserManagement.modal.email')"
                  label-for="email"
                >
                  <b-form-text id="email-help-block">
                    {{ $t('pageUserManagement.modal.emailOptional') }}
                  </b-form-text>
                  <b-form-input
                    id="email"
                    v-model="form.email"
                    type="email"
                    data-test-id="userManagement-input-email"
                    aria-describedby="email-help-block"
                    :state="getValidationState($v.form.email)"
                    autocomplete="email"
                    @input="$v.form.email.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.form.email.email">
                      {{ $t('pageUserManagement.modal.invalidEmailFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="form.snmpUserEnable">
              <b-col lg="6">
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
              <b-col lg="6">
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
            <b-row v-if="form.snmpUserEnable">
              <b-col lg="6">
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
            <b-row>
              <!-- <b-col lg="6">
                <b-form-checkbox
                  :id="'channelAccess' + index"
                  v-model="form.channelAccess[index]"
                >
                  {{ $t('pageUserManagement.modal.channel') }}
                  {{ channelListAccess }}
                </b-form-checkbox>
              </b-col> -->
              <b-col
                v-for="(channelListAccess, index) in networkChannelList"
                :key="index"
                lg="6"
              >
                <b-form-checkbox
                  :id="'channelAccess' + index"
                  v-model="form.channelAccess[index]"
                  :disabled="
                    (!newUser && originalUsername === 'root') ||
                    globalPrivilege !== 'Administrator'
                  "
                >
                  {{
                    $t('pageUserManagement.modal.privilege') +
                    '(' +
                    $t('pageUserManagement.modal.channel') +
                    ' ' +
                    channelListAccess.ChannelId +
                    ')'
                  }}
                </b-form-checkbox>
                <b-form-group label="" label-for="privilege">
                  <b-form-select
                    :id="'channelList_' + index"
                    v-model="form.channelList[index]"
                    :options="privilegeTypes"
                    :state="
                      $v.form.channelList.$each &&
                      $v.form.channelList.$each[index]
                        ? getValidationState($v.form.channelList.$each[index])
                        : null
                    "
                    data-test-id="userManagement-select-channelList"
                    :disabled="
                      (!newUser && originalUsername === 'root') ||
                      globalPrivilege !== 'Administrator'
                    "
                    @input="
                      $v.form.channelList.$each &&
                      $v.form.channelList.$each[index]
                        ? $v.form.channelList.$each[index].$touch()
                        : ''
                    "
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled>
                        {{ $t('global.form.selectAnOption') }}
                      </b-form-select-option>
                    </template>
                  </b-form-select>
                  <b-form-invalid-feedback role="alert">
                    <template
                      v-if="
                        $v.form.channelList.$each &&
                        $v.form.channelList.$each[index] &&
                        !$v.form.channelList.$each[index].required
                      "
                    >
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
          <!-- second column End -->
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
  minLength,
  sameAs,
  email,
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
        email: '',
        manualUnlock: false,
        PasswordChangeRequired: false,
        vmediaAccess: true,
        changePassword: false,
        snmpUserEnable: false,
        encryption: null,
        algorithm: null,
        readWritePermission: null,
        channelList: [],
        channelAccess: [],
      },
      disabled: this.$store.getters['global/username'],
      globalPrivilege: this.$store.getters['global/userPrivilege'],
      encryptionType: [
        { value: 'DES', text: 'DES' },
        { value: 'AES', text: 'AES' },
      ],
      algorithmType: [
        {
          value: 'SHA-224',
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
      channelPrivilegesList: [],
      accountTypes: [
        'HostConsole',
        'IPMI',
        'VirtualMedia',
        'Redfish',
        'WebUI',
        'ManagerConsole',
        'SNMP',
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
    networkChannelList() {
      return this.$store.getters['policies/getChannelList'];
    },
    defaultChannelList() {
      return this.$store.getters['policies/getDefaultChannelList'];
    },
    dynamicAccountTypes() {
      const baseTypes = [
        'HostConsole',
        'IPMI',
        'Redfish',
        'WebUI',
        'ManagerConsole',
        'SNMP',
      ];
      if (this.form.vmediaAccess) {
        return [...baseTypes, 'VirtualMedia'];
      } else {
        return baseTypes;
      }
    },
  },
  watch: {
    user: function (value) {
      if (value === null) return;
      this.originalUsername = value.username;
      this.form.username = value.username;
      this.form.status = value.Enabled;
      this.form.PasswordChangeRequired = value.PasswordChangeRequired;
      this.form.vmediaAccess = value.AccountTypes
        ? value.AccountTypes.includes('VirtualMedia')
        : true;
      this.form.snmpUserEnable = value.Oem.Ami.SNMP.SNMPAccessEnableStatus;
      this.form.algorithm = value.Oem.Ami.SNMP.Algorithm
        ? value.Oem.Ami.SNMP.Algorithm
        : null;
      this.form.encryption = value.Oem.Ami.SNMP.Encryption
        ? value.Oem.Ami.SNMP.Encryption
        : null;
      this.form.readWritePermission = value.Oem.Ami.SNMP.Access
        ? value.Oem.Ami.SNMP.Access
        : null;
      this.form.channelAccess = [];
      this.form.channelList = [];
      this.form.email = value.Oem?.Ami?.SMTP?.SMTPMailId || '';
      value?.Oem?.Ami?.ChannelPrivileges?.forEach((channelPrivilege) => {
        this.form.channelList.push(channelPrivilege.ChannelPrivilege);
        this.form.channelAccess.push(channelPrivilege.ChannelAccess);
      });
    },
    'form.snmpUserEnable': function (newValue) {
      this.form.changePassword =
        !this.newUser &&
        this.user.snmpUserEnabled == 'Disabled' &&
        newValue === true;
    },
    networkChannelList() {
      // Initialize arrays with the correct length when channel list changes
      this.form.channelAccess = new Array(this.networkChannelList.length).fill(
        false,
      );
      this.form.channelList = new Array(this.networkChannelList.length).fill(
        '',
      );
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
        password: {
          required: requiredIf(function () {
            return (
              (this.requirePassword() && this.form.changePassword) ||
              this.newUser
            );
          }),
          minLength: minLength(8),
          maxLength: maxLength(20),
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
          minLength: minLength(8),
          maxLength: maxLength(20),
          sameAsPassword: sameAs('password'),
        },
        email: {
          email: email,
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
        channelList: {
          $each: {
            required,
          },
        },
      },
    };
  },
  methods: {
    handleSubmit() {
      let userData = {};

      // Validate channel list only if channels are enabled
      this.channelPrivilegesList = [];
      for (let i = 0; i < this.form.channelList.length; i++) {
        const channelAccessValue = this.form.channelAccess[i] || false; // Default to false if value not avaiable
        const privilegeValue = this.form.channelList[i];
        const networkChannelNumber = this.networkChannelList[i];
        let channelPrivilegesAccess = {
          ChannelId: networkChannelNumber,
          ChannelPrivilege: privilegeValue,
          ChannelAccess: channelAccessValue,
        };
        if (
          this.defaultChannelList.ChannelId === networkChannelNumber.ChannelId
        ) {
          userData.RoleId = privilegeValue;
        }
        this.channelPrivilegesList.push(channelPrivilegesAccess);
        userData.channelPrivileges = this.channelPrivilegesList;
      }

      if (this.newUser) {
        this.$v.$touch();
        if (this.$v.$invalid || this.privilegeValidation()) return;
        userData.username = this.form.username;
        userData.status = this.form.status;
        userData.PasswordChangeRequired = this.form.PasswordChangeRequired;
        userData.accountTypes = this.dynamicAccountTypes;
        userData.password = this.form.password;
        userData.email = this.form.email;
        userData.snmpUserEnable = this.form.snmpUserEnable;
        userData.encryption = this.form.encryption ? this.form.encryption : '';
        userData.algorithm = this.form.algorithm ? this.form.algorithm : '';
        userData.readWritePermission = this.form.readWritePermission
          ? this.form.readWritePermission
          : '';
      } else {
        this.$v.$touch();
        if (this.$v.$invalid || this.privilegeValidation()) return;
        userData.originalUsername = this.originalUsername;
        if (this.$v.form.status.$dirty) {
          userData.status = this.form.status;
        }
        if (this.$v.form.username.$dirty) {
          userData.username = this.form.username;
        }
        if (this.$v.form.PasswordChangeRequired.$dirty) {
          userData.PasswordChangeRequired = this.form.PasswordChangeRequired;
        }
        if (this.$v.form.vmediaAccess.$dirty) {
          userData.accountTypes = this.dynamicAccountTypes;
        }
        if (this.$v.form.password.$dirty) {
          userData.password = this.form.password;
        }
        if (this.form.email || this.form.email === '') {
          userData.email = this.form.email;
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
      this.form.PasswordChangeRequired = false;
      this.form.vmediaAccess = true;
      this.form.password = '';
      this.form.passwordConfirmation = '';
      this.form.email = '';
      this.form.changePassword = false;
      this.form.snmpUserEnable = false;
      this.form.encryption = null;
      this.form.algorithm = null;
      this.form.readWritePermission = null;
      this.form.channelList = new Array(this.form.channelAccess.length).fill(
        '',
      );
      this.form.channelAccess = [];
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
    isCheckboxDisabled(form) {
      const snmpFields = ['encryption', 'algorithm', 'readWritePermission'];
      return (
        !this.newUser &&
        this.user.snmpUserEnabled === 'Disabled' &&
        form.snmpUserEnable === true &&
        snmpFields.some((field) => this.user[field] === 'NA')
      );
    },
    privilegeValidation() {
      var flag = false;
      this.networkChannelList.forEach((access, index) => {
        if (
          access &&
          this.$v.form.channelList.$each &&
          this.$v.form.channelList.$each[index]
        ) {
          this.$v.form.channelList.$each[index].$touch();
          if (this.$v.form.channelList.$each[index].$invalid) {
            flag = true;
            return flag;
          }
        }
      });

      if (flag) {
        return flag;
      }
      return flag;
    },
  },
};
</script>
<style scoped>
.form-change-password {
  transform: translateY(-4px);
}
</style>
