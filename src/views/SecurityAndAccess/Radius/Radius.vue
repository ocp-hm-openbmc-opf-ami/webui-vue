<template>
  <b-container fluid="xl">
    <page-title />
    <div class="form-background p-3">
      <b-row>
        <b-col xl="6" class="p0">
          <div v-if="!radius.authentication">
            <b-alert show variant="danger">{{
              $t('pageRadius.radiusConfiguration')
            }}</b-alert>
          </div>
        </b-col>
        <b-col xl="8">
          <b-row>
            <b-col>
              <b-form-group>
                <b-form-checkbox v-model="radius.authentication">
                  {{ $t('pageRadius.enableRadiusAuthentication') }}
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
                  :disabled="!radius.authentication"
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
                  :disabled="!radius.authentication"
                  type="number"
                  :state="getValidationState($v.radius.port)"
                  @input="$v.radius.port.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.radius.port.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="$v.radius.port.required && !$v.radius.port.pattern"
                  >
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
                  :disabled="!radius.authentication"
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
                  :disabled="!radius.authentication"
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
                  :disabled="!radius.authentication"
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
                  :disabled="!radius.authentication"
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
                  :disabled="!radius.authentication"
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
                  :disabled="!radius.authentication"
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
                  :disabled="!radius.authentication"
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
          <b-row class="mt-4 mb-5">
            <b-col>
              <b-btn variant="primary" type="submit" @click="SaveConfig">
                {{ $t('global.action.saveSettings') }}
              </b-btn>
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
import { mapState } from 'vuex';

export default {
  name: 'Radius',
  components: {
    PageTitle,
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
      },
      privilegeTypes: [
        { value: 'Administrator', text: 'Administrator' },
        { value: 'Operator', text: 'Operator' },
        { value: 'ReadOnly', text: 'ReadOnly' },
      ],
    };
  },
  computed: {
    ...mapState('radius', ['radiusValues']),
  },
  watch: {
    radiusValues() {
      this.initRadiusValues();
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
          pattern: function (pw) {
            if (!this.radius.authentication) return true;
            return this.radiusPortValueValidation(pw);
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
      },
    };
  },
  methods: {
    initRadiusValues() {
      const config = this.$store.getters['radius/getRadiusValues'] || {};
      const radiusEnable = this.$store.getters['radius/getServiceEnabled'];
      this.$v.$reset();
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
      };
    },
    SaveConfig() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
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
      this.startLoader();
      this.$store
        .dispatch('radius/saveRadiusConfig', saveConfigValues)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    serverAddressValidation(value) {
      if (
        !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/.test(
          value,
        ) ||
        /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
          value,
        ) ||
        (value != undefined &&
          value != null &&
          (String(value).charAt(0) == '0' ||
            '#255.255.255.0#0.24.56.4#255.255.255.255#'.indexOf(
              '#' + value + '#',
            ) > -1))
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
  },
};
</script>
