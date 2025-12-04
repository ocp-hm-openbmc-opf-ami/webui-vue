<template>
  <b-container fluid="xl">
    <page-title />
    <div class="form-background p-3">
      <b-row>
        <b-col xl="6" class="p0">
          <div v-if="!radius.authentication">
            <b-alert :show="!isNotAdmin(userPrivilege)" variant="danger">{{
              $t('pageRadius.radiusConfiguration')
            }}</b-alert>
          </div>
          <div v-if="isExternalUser">
            <b-alert show variant="warning">
              {{ $t('global.alerts.externalUserRestriction') }}
              Settings.
            </b-alert>
          </div>
        </b-col>
        <b-col xl="8">
          <b-row>
            <b-col>
              <b-form-group>
                <b-form-checkbox
                  v-model="radius.authentication"
                  :disabled="isNotAdmin(userPrivilege)"
                >
                  {{ $t('pageRadius.enableRadiusAuthentication') }}
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group
                :label="$t('pageRadius.enableEAPTLSAuthentication')"
              >
                <b-form-checkbox
                  id="enableEapTLS"
                  v-model="radius.tlsAuthenticationEnable"
                  data-test-id="radius-toggle-TLS"
                  switch
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  @input="$v.radius.tlsAuthenticationEnable.$touch()"
                >
                  <span v-if="radius.tlsAuthenticationEnable">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.serverAddress')"
                label-for="serverAddress"
              >
                <b-form-input
                  id="serverAddress"
                  v-model="radius.serverAddress"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  type="text"
                  :state="getValidationState($v.radius.serverAddress)"
                  @input="$v.radius.serverAddress.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.radius.serverAddress.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.radius.serverAddress.required &&
                      !$v.radius.serverAddress.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.port')"
                label-for="port"
              >
                <b-form-input
                  id="port"
                  v-model="radius.port"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  :state="getValidationState($v.radius.port)"
                  @input="$v.radius.port.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.radius.port.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template v-else-if="!$v.radius.port.pattern">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                  <template v-else-if="!$v.radius.port.rangeValue">
                    {{
                      $t('pageRadius.radiusPortValueLimits', {
                        min: 0,
                        max: 65535,
                      })
                    }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.secret')"
                label-for="secret"
              >
                <b-form-input
                  id="secret"
                  v-model="radius.secret"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  type="password"
                  :state="getValidationState($v.radius.secret)"
                  aria-describedby="secret-help-block"
                  @input="$v.radius.secret.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.groupName1')"
                label-for="groupName1"
              >
                <b-form-input
                  id="groupName1"
                  v-model="radius.groupName1"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  type="text"
                  :state="getValidationState($v.radius.groupName1)"
                  aria-describedby="groupName1-help-block"
                  @input="$v.radius.groupName1.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.groupName2')"
                label-for="groupName2"
              >
                <b-form-input
                  id="groupName2"
                  v-model="radius.groupName2"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  type="text"
                  :state="getValidationState($v.radius.groupName2)"
                  aria-describedby="groupName2-help-block"
                  @input="$v.radius.groupName2.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.groupName3')"
                label-for="groupName3"
              >
                <b-form-input
                  id="groupName3"
                  v-model="radius.groupName3"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  type="text"
                  :state="getValidationState($v.radius.groupName3)"
                  aria-describedby="groupName3-help-block"
                  @input="$v.radius.groupName3.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.privilege1')"
                label-for="privilege1"
              >
                <b-form-select
                  id="privilege1"
                  v-model="radius.privilege1"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  class="input"
                  :options="privilegeTypes"
                  :state="getValidationState($v.radius.privilege1)"
                  data-test-id="radius1-option"
                  ><template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template></b-form-select
                ><b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.privilege2')"
                label-for="privilege2"
              >
                <b-form-select
                  id="privilege2"
                  v-model="radius.privilege2"
                  class="input"
                  :options="privilegeTypes"
                  :state="getValidationState($v.radius.privilege2)"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  data-test-id="radius2-option"
                  ><template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template></b-form-select
                ><b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6" xl="4">
              <b-form-group
                :label="$t('pageRadius.form.privilege3')"
                label-for="privilege3"
              >
                <b-form-select
                  id="privilege3"
                  v-model="radius.privilege3"
                  class="input"
                  :options="privilegeTypes"
                  :state="getValidationState($v.radius.privilege3)"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  data-test-id="radius3-option"
                  ><template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template></b-form-select
                ><b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row
            v-if="radius.tlsAuthenticationEnable && radius.authentication"
            class="mt-4"
          >
            <b-col sm="4">
              <b-form-group :label="$t('pageRadius.form.radiusCA')">
                <span v-if="radius.radiusCAModifiedDate">
                  Last Modified Date: {{ radius.radiusCAModifiedDate }}
                </span>
                <form-file
                  id="radius-certificate-radiusCA"
                  ref="radiusCAFile"
                  v-model="radius.radiusCA"
                  accept=".pem"
                  :state="getValidationState($v.radius.radiusCA)"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  @input="onFileSelect($event, 'radiusCA', 'pem')"
                >
                  <template #invalid>
                    <b-form-invalid-feedback role="alert">
                      {{ $t('global.form.required') }}
                    </b-form-invalid-feedback>
                  </template>
                </form-file>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group :label="$t('pageRadius.form.radiusClient')">
                <span v-if="radius.radiusClientModifiedDate">
                  Last Modified Date: {{ radius.radiusClientModifiedDate }}
                </span>
                <form-file
                  id="radius-certificate-radiusClient"
                  ref="radiusClientFile"
                  v-model="radius.radiusClient"
                  accept=".pem"
                  :state="getValidationState($v.radius.radiusClient)"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  @input="onFileSelect($event, 'radiusClient', 'pem')"
                >
                  <template #invalid>
                    <b-form-invalid-feedback role="alert">
                      {{ $t('global.form.required') }}
                    </b-form-invalid-feedback>
                  </template>
                </form-file>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group :label="$t('pageRadius.form.radiusKey')">
                <span v-if="radius.radiusKeyModifiedDate">
                  Last Modified Date: {{ radius.radiusKeyModifiedDate }}
                </span>
                <form-file
                  id="radius-certificate-radiusKey"
                  ref="radiusKeyFile"
                  v-model="radius.radiusKey"
                  accept=".pem"
                  :state="getValidationState($v.radius.radiusKey)"
                  :disabled="
                    !radius.authentication || isNotAdmin(userPrivilege)
                  "
                  @input="onFileSelect($event, 'radiusKey', 'pem')"
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
          <b-row class="mt-4 mb-5">
            <b-col>
              <b-button
                variant="primary"
                :disabled="$v.radius.$invalid || isExternalUser"
                @click="SaveConfig"
              >
                <icon-save />
                {{ $t('global.action.save') }}
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { requiredIf } from 'vuelidate/lib/validators';
import { mapState, mapGetters } from 'vuex';
import IconSave from '@carbon/icons-vue/es/save/20';
import FormFile from '@/components/Global/FormFile';

export default {
  name: 'Radius',
  components: {
    PageTitle,
    IconSave,
    FormFile,
  },
  mixins: [BVToastMixin, VuelidateMixin, LoadingBarMixin],
  data() {
    return {
      radius: {
        authentication: false,
        serverAddress: '',
        port: '',
        secret: '',
        groupName1: '',
        groupName2: '',
        groupName3: '',
        privilege1: null,
        privilege2: null,
        privilege3: null,
        radiusCA: '',
        radiusClient: '',
        radiusKey: '',
        radiusCAModifiedDate: '',
        radiusClientModifiedDate: '',
        radiusKeyModifiedDate: '',
        tlsAuthenticationEnable: false,
      },
      privilegeTypes: [
        { value: 'Administrator', text: 'Administrator' },
        { value: 'Operator', text: 'Operator' },
        { value: 'ReadOnly', text: 'ReadOnly' },
      ],
      fileUploadTLS: [],
      fileUploadDetails: {},
      isSaving: false,
    };
  },
  computed: {
    ...mapState('radius', ['radiusValues']),
    ...mapGetters('global', ['userPrivilege']),
    ...mapGetters('authentication', ['isExternalUser']),
  },
  watch: {
    radiusValues() {
      if (!this.isSaving) {
        this.initRadiusValues();
      }
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('radius/radiusConfigValues')
      .catch(({ message }) => this.errorToast(message))
      .finally(() => this.endLoader());
  },
  validations() {
    return {
      radius: {
        serverAddress: {
          required: requiredIf(function () {
            return this.radius.authentication;
          }),
          pattern: function (val) {
            if (!this.radius.authentication) return true;
            return this.serverAddressValidation(val);
          },
        },
        port: {
          required: requiredIf(function () {
            return this.radius.authentication;
          }),
          pattern: function (val) {
            if (!this.radius.authentication) return true;
            if (/^[0-9]+$/.test(val)) {
              //handling value with leading zeors
              this.radius.port = String(Number(val));
            }
            return /^-?\d+$/.test(val);
          },
          rangeValue: function (val) {
            if (!this.radius.authentication) return true;
            if (!/^-?\d+$/.test(val)) return true;
            return val >= 0 && val <= 65535;
          },
        },
        secret: {
          required: requiredIf(function () {
            return this.radius.authentication;
          }),
        },
        privilege1: {
          required: requiredIf(function () {
            return this.radius.authentication;
          }),
        },
        groupName1: {
          required: requiredIf(function () {
            return this.radius.authentication;
          }),
        },
        privilege2: {
          required: requiredIf(function () {
            return this.radius.authentication && !!this.radius.groupName2;
          }),
        },
        groupName2: {
          required: requiredIf(function () {
            return this.radius.authentication && !!this.radius.privilege2;
          }),
        },
        privilege3: {
          required: requiredIf(function () {
            return this.radius.authentication && !!this.radius.groupName3;
          }),
        },
        groupName3: {
          required: requiredIf(function () {
            return this.radius.authentication && !!this.radius.privilege3;
          }),
        },
        radiusCA: {
          required: requiredIf(function () {
            return (
              this.radius.authentication &&
              this.radius.tlsAuthenticationEnable &&
              !this.radius.radiusCAModifiedDate
            );
          }),
        },
        radiusClient: {
          required: requiredIf(function () {
            return (
              this.radius.authentication &&
              this.radius.tlsAuthenticationEnable &&
              !this.radius.radiusClientModifiedDate
            );
          }),
        },
        radiusKey: {
          required: requiredIf(function () {
            return (
              this.radius.authentication &&
              this.radius.tlsAuthenticationEnable &&
              !this.radius.radiusKeyModifiedDate
            );
          }),
        },
        tlsAuthenticationEnable: {
          required: requiredIf(function () {
            return this.radius.authentication;
          }),
        },
      },
    };
  },
  methods: {
    initRadiusValues() {
      const config = this.$store.getters['radius/getRadiusValues'] || {};
      const radiusEnable = this.$store.getters['radius/getServiceEnabled'];
      this.$v.$reset();
      const preservedFiles = {
        radiusCA: this.radius?.radiusCA || '',
        radiusClient: this.radius?.radiusClient || '',
        radiusKey: this.radius?.radiusKey || '',
      };

      this.radius = {
        authentication: radiusEnable,
        serverAddress: config.ServiceAddress,
        port: config.ServicePort,
        secret: config.Password,
        groupName1: config.GroupName1,
        groupName2: config.GroupName2,
        groupName3: config.GroupName3,
        privilege1: config.Privilege1 === '' ? null : config.Privilege1,
        privilege2: config.Privilege2 === '' ? null : config.Privilege2,
        privilege3: config.Privilege3 === '' ? null : config.Privilege3,
        radiusCA: preservedFiles.radiusCA,
        radiusClient: preservedFiles.radiusClient,
        radiusKey: preservedFiles.radiusKey,
        radiusCAModifiedDate: config?.CAFileModifiedDate,
        radiusClientModifiedDate: config?.ClientFileModifiedDate,
        radiusKeyModifiedDate: config?.PrivateKeyFileModifiedDate,
        tlsAuthenticationEnable: config.EnableEapTLS,
      };
      this.fileUploadTLS = [];
      this.fileUploadDetails = {};
    },
    SaveConfig() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.isSaving = true;

      let saveConfigValues = {};
      saveConfigValues.authentication = this.radius.authentication;
      saveConfigValues.port = Number(this.radius.port);
      saveConfigValues.secret = this.radius.secret;
      saveConfigValues.serverAddress = this.radius.serverAddress;
      saveConfigValues.Privilege1 = this.radius.privilege1;
      saveConfigValues.Privilege2 = this.radius.privilege2;
      saveConfigValues.Privilege3 = this.radius.privilege3;
      saveConfigValues.GroupName1 = this.radius.groupName1;
      saveConfigValues.GroupName2 = this.radius.groupName2;
      saveConfigValues.GroupName3 = this.radius.groupName3;
      saveConfigValues.tlsAuthenticationEnable =
        this.radius.tlsAuthenticationEnable;

      this.startLoader();
      this.$store
        .dispatch('radius/saveRadiusConfig', saveConfigValues)
        .then((message) => {
          this.successToast(message);
          // After config save, upload files if TLS is enabled
          if (this.radius.tlsAuthenticationEnable) {
            this.prepareCertificatesForUpload();
            this.addCertificate();
          } else {
            this.isSaving = false; // Reset flag
            this.initRadiusValues();
            this.endLoader();
          }
        })
        .catch(({ message }) => {
          this.errorToast(message);
          this.isSaving = false; // Reset flag on error
          this.endLoader();
        });
    },
    serverAddressValidation(value) {
      if (
        !/^$/gi.test(value) &&
        (!(
          /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))(.*\.)?.*\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/gi.test(
            value,
          ) ||
          /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/gi.test(
            value,
          )
        ) ||
          /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
            value,
          ) ||
          String(value).charAt(0) == '0' ||
          '#255.255.255.0#0.24.56.4#255.255.255.255#'.indexOf(
            '#' + value + '#',
          ) > -1)
      ) {
        return false;
      } else {
        return true;
      }
    },
    radiusPortValueValidation(val) {
      if (
        !/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          val,
        )
      ) {
        return false;
      }
      return true;
    },
    onFileSelect(file, type, extension) {
      if (file) {
        const fileTypeCorrect = this.getIsFileTypeCorrect(file, extension);
        if (!fileTypeCorrect) {
          this.errorToast(this.$t('global.form.invalidFormat'));
          setTimeout(() => {
            this.radius[type] = '';
            this.clearSpecificFile(type);
          }, 200);
        } else {
          // File is valid, store it
          this.radius[type] = file;
        }
      } else {
        this.radius[type] = '';
      }
    },
    clearSpecificFile(type) {
      // Map file types to their corresponding refs
      const fileRefMap = {
        radiusCA: 'radiusCAFile',
        radiusClient: 'radiusClientFile',
        radiusKey: 'radiusKeyFile',
      };

      const refName = fileRefMap[type];
      if (refName && this.$refs[refName]) {
        this.$refs[refName].clearSelectedFile();
      }
    },
    prepareCertificatesForUpload() {
      this.fileUploadTLS = [];
      this.fileUploadDetails = {};

      // Only add files that are actually selected and valid
      if (this.radius.radiusCA) {
        this.fileUploadDetails.radiusCA = {
          file: this.radius.radiusCA,
          type: 'radius_ca',
        };
      }
      if (this.radius.radiusClient) {
        this.fileUploadDetails.radiusClient = {
          file: this.radius.radiusClient,
          type: 'radius_client',
        };
      }
      if (this.radius.radiusKey) {
        this.fileUploadDetails.radiusKey = {
          file: this.radius.radiusKey,
          type: 'radius_key',
        };
      }

      // Only push if there are files to upload
      if (Object.keys(this.fileUploadDetails).length > 0) {
        this.fileUploadTLS.push(this.fileUploadDetails);
      }
    },
    addCertificate() {
      if (this.fileUploadTLS.length <= 0) {
        this.isSaving = false; // Reset flag
        this.initRadiusValues();
        this.endLoader();
        return;
      }

      this.fileUploadTLS.forEach((obj) => {
        Object.entries(obj).forEach((item) => {
          const file = item[1];
          const type = file.type;
          this.$store
            .dispatch('radius/addNewCertificate', { file: file.file, type })
            .then((success) => {
              this.successToast(success);
              this.isSaving = false; // Reset flag after successful upload
              this.initRadiusValues();
              this.clearFile();
            })
            .catch(({ message }) => {
              this.errorToast(message);
              this.isSaving = false; // Reset flag after error
              this.clearFile();
            })
            .finally(() => {
              this.endLoader();
            });
        });
      });
    },
    clearFile() {
      this.fileUploadTLS = [];
      this.fileUploadDetails = {};
      this.radius.radiusCA = '';
      this.radius.radiusClient = '';
      this.radius.radiusKey = '';

      if (this.$refs.radiusCAFile) {
        this.$refs.radiusCAFile.clearSelectedFile();
      }
      if (this.$refs.radiusClientFile) {
        this.$refs.radiusClientFile.clearSelectedFile();
      }
      if (this.$refs.radiusKeyFile) {
        this.$refs.radiusKeyFile.clearSelectedFile();
      }
    },
    getIsFileTypeCorrect(file, extension) {
      if (!file || !file.name) return false;

      const fileTypeExtension = file.name.split('.').pop().toLowerCase();
      const expectedExtension = extension.toLowerCase();

      return fileTypeExtension === expectedExtension;
    },
  },
};
</script>
