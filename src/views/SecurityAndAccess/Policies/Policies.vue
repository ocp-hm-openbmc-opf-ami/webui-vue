<template>
  <b-container fluid="xl">
    <page-title />
    <b-row>
      <b-col md="12">
        <b-row>
          <b-col>
            <page-section
              class="page-section"
              :section-title="$t('pagePolicies.servicesPolicies')"
            >
              <b-row v-if="!modifySSHPolicyDisabled" class="setting-section">
                <b-col class="d-flex align-items-center">
                  <dl class="mr-4 w-75">
                    <dt>{{ $t('pagePolicies.ssh') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.sshDescription') }}
                    </dd>
                  </dl>
                  <b-form-checkbox
                    id="sshSwitch"
                    v-model="sshProtocolState"
                    data-test-id="policies-toggle-bmcShell"
                    switch
                    @change="changeSshProtocolState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.ssh') }}
                    </span>
                    <span v-if="sshProtocolState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-4 w-75">
                    <dt>{{ $t('pagePolicies.ipmi') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.ipmiDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-checkbox
                    id="ipmiSwitch"
                    v-model="ipmiProtocolState"
                    data-test-id="polices-toggle-networkIpmi"
                    switch
                    @change="changeIpmiProtocolState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.ipmi') }}
                    </span>
                    <span v-if="ipmiProtocolState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="DisplaySection" class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-4 w-75">
                    <dt>{{ $t('pagePolicies.vtpm') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.vtpmDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-checkbox
                    id="vtpmSwitch"
                    v-model="vtpmState"
                    data-test-id="policies-toggle-vtpm"
                    switch
                    @change="changeVtpmState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.vtpm') }}
                    </span>
                    <span v-if="vtpmState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="DisplaySection" class="setting-section">
                <b-col class="d-flex align-items-center">
                  <dl class="mt-3 mr-4 w-75">
                    <dt>{{ $t('pagePolicies.rtad') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.rtadDescription') }}
                    </dd>
                  </dl>
                  <b-form-checkbox
                    id="rtadSwitch"
                    v-model="rtadState"
                    data-test-id="policies-toggle-rtad"
                    switch
                    @change="changeRtadState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.rtad') }}
                    </span>
                    <span v-if="rtadState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-4 w-75">
                    <dt>{{ $t('pagePolicies.kvm') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.kvmDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-checkbox
                    id="kvmSwitch"
                    v-model="kvmState"
                    data-test-id="policies-toggle-kvm"
                    switch
                    @change="changeKmvState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.kvm') }}
                    </span>
                    <span v-if="kvmState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="kvmState" class="setting-section">
                <b-col cols="3" class="d-flex align-items-center">
                  <b-form-group
                    id="input-group-kvm-port"
                    :label="$t('pagePolicies.kvmPortValue')"
                    label-for="input-kvm-port"
                  >
                    <b-form-input
                      id="input-kvm-port"
                      v-model.number="kvmPort"
                      data-test-id="input-kvmPort"
                      type="number"
                      aria-describedby="power-help-text"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col class="d-flex align-items-center">
                  <b-button
                    variant="primary"
                    type="submit"
                    data-test-id="button-saveKVMPortValue"
                    @click="saveKVMPortValue"
                  >
                    {{ $t('global.action.save') }}
                  </b-button>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-4 w-75">
                    <dt>{{ $t('pagePolicies.vmc') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.vmcDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-checkbox
                    id="vmcSwitch"
                    v-model="vmcState"
                    data-test-id="policies-toggle-vmc"
                    switch
                    @change="changeVmcState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.vmc') }}
                    </span>
                    <span v-if="vmcState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-4 w-75">
                    <dt>{{ $t('pagePolicies.solssh') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.solDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-checkbox
                    id="solSwitch"
                    v-model="solState"
                    data-test-id="policies-toggle-sol"
                    switch
                    @change="changeSOLState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.solssh') }}
                    </span>
                    <span v-if="solState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="solState" class="setting-section">
                <b-col cols="3" class="d-flex align-items-center">
                  <b-form-group
                    id="input-group-1"
                    :label="$t('pagePolicies.solSshPortLabel')"
                    label-for="input-1"
                  >
                    <b-form-input
                      id="input-1"
                      v-model.number="solSshPortValueState"
                      data-test-id="power-input-solSshPort"
                      type="number"
                      aria-describedby="power-help-text"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col class="d-flex align-items-center">
                  <b-button
                    variant="primary"
                    type="submit"
                    data-test-id="power-button-saveIpmiPortValue"
                    @click="saveSolSshPortValue"
                  >
                    {{ $t('global.action.save') }}
                  </b-button>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-3 w-75">
                    <dt>{{ $t('pagePolicies.ssdpProtocol') }}</dt>
                    <dd>{{ $t('pagePolicies.ssdpDescription') }}</dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-checkbox
                    id="ssdpSwitch"
                    v-model="ssdpState"
                    data-test-id="policies-toggle-sol"
                    switch
                    @change="changeSSDPLState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.ssdpProtocol') }}
                    </span>
                    <span v-if="ssdpState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="ssdpState" class="setting-section">
                <b-col cols="3" class="d-flex align-items-center">
                  <dl class="mt-3 mr-4 w-75">
                    <dt>
                      <b>{{ $t('pagePolicies.SsdpPortLabel') }}</b>
                    </dt>
                    <dd>
                      {{ ssdpPortValue }}
                    </dd>
                  </dl>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-3 w-75">
                    <dt>{{ $t('pagePolicies.snmpProtocol') }}</dt>
                    <dd>{{ $t('pagePolicies.snmpDescription') }}</dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-checkbox
                    id="snmpSwitch"
                    v-model="snmpState"
                    data-test-id="policies-toggle-sol"
                    switch
                    @change="changeSNMPState"
                  >
                    <span class="sr-only">
                      {{ $t('pagePolicies.snmpProtocol') }}
                    </span>
                    <span v-if="snmpState">
                      {{ $t('global.status.enabled') }}
                    </span>
                    <span v-else>{{ $t('global.status.disabled') }}</span>
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="snmpState" class="setting-section">
                <b-col cols="3" class="d-flex align-items-center">
                  <dl class="mt-3 mr-4 w-75">
                    <dt>
                      <b>{{ $t('pagePolicies.snmpPortLabel') }}</b>
                    </dt>
                    <dd>
                      {{ snmpPortValue }}
                    </dd>
                  </dl>
                </b-col>
              </b-row>
            </page-section>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <page-section
              :section-title="$t('pagePolicies.configurationPolicies')"
            >
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-3 w-75">
                    <dt>{{ $t('pagePolicies.webSessionTimeOut') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.webSessionTimeOutDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout text-right mb-3">
                  <b-form-group>
                    <b-form-input
                      id="web-session-timeout"
                      v-model="webSessionTimeoutValue"
                      data-test-id="web-session-timeout"
                      aria-describedby="power-help-text"
                      type="text"
                      :state="getValidationState($v.webSessionTimeoutValue)"
                      @input="$v.webSessionTimeoutValue.$touch()"
                    >
                      <template #first>
                        <b-form-select-option :value="null" disabled>
                          {{ $t('global.form.selectAnOption') }}
                        </b-form-select-option>
                      </template>
                    </b-form-input>
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.webSessionTimeoutValue.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template v-else-if="!$v.webSessionTimeoutValue.pattern">
                        {{
                          $t('pagePolicies.webSessionTimeoutLimits', {
                            min: 30,
                            max: 86400,
                          })
                        }}
                      </template>
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-button
                    variant="primary"
                    type="submit"
                    data-test-id="button-webSessionTimeoutValue"
                    @click="saveWebSessionTimeoutValue"
                  >
                    {{ $t('global.action.save') }}
                  </b-button>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-3 w-75">
                    <dt>{{ $t('pagePolicies.kvmSessionTimeOut') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.kvmSessionTimeOutDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout text-right mt-3">
                  <b-form-group>
                    <b-form-input
                      id="kvm-session"
                      v-model="kvmSessionTimeOutValue"
                      data-test-id="kvm-session-timeout"
                      type="text"
                      aria-describedby="power-help-text"
                      :min="1"
                      :max="1440"
                      :state="getValidationState($v.kvmSessionTimeOutValue)"
                      @input="$v.kvmSessionTimeOutValue.$touch()"
                    ></b-form-input>
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.kvmSessionTimeOutValue.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template v-else-if="!$v.kvmSessionTimeOutValue.pattern">
                        {{
                          $t('pagePolicies.kvmTimeoutValueLimits', {
                            min: 1,
                            max: 1440,
                          })
                        }}
                      </template>
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-button
                    variant="primary"
                    type="submit"
                    data-test-id="power-button-saveIpmiPortValue"
                    @click="saveKVMSessionTimeoutValue"
                  >
                    {{ $t('global.action.save') }}
                  </b-button>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-3 w-75">
                    <dt>{{ $t('pagePolicies.complexity') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.complexityDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-select
                    id="complexity"
                    v-model="complexityState"
                    :options="complexityOptions"
                    @change="changeComplexity"
                  >
                  </b-form-select>
                </b-col>
              </b-row>
              <b-row class="setting-section">
                <b-col
                  lg="7"
                  class="d-flex align-items-center justify-content-between"
                >
                  <dl class="mt-3 mr-3 w-75">
                    <dt>{{ $t('pagePolicies.passwordHistory') }}</dt>
                    <dd>
                      {{ $t('pagePolicies.passwordHistoryDescription') }}
                    </dd>
                  </dl>
                </b-col>
                <b-col lg="3" class="session-timeout">
                  <b-form-select
                    id="password-history"
                    v-model="passwordHistoryState"
                    :options="passwordHistoryOptions"
                    @change="changePasswordHistory"
                  >
                  </b-form-select>
                </b-col> </b-row
            ></page-section>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { mapState } from 'vuex';
export default {
  name: 'Policies',
  components: { PageTitle, PageSection },
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      sessionTimeOutOptions: [
        { value: 1800, text: this.$t('pagePolicies.options.30minutes') },
        { value: 3600, text: this.$t('pagePolicies.options.1hour') },
        { value: 7200, text: this.$t('pagePolicies.options.2hours') },
        { value: 14400, text: this.$t('pagePolicies.options.4hours') },
        { value: 28800, text: this.$t('pagePolicies.options.8hours') },
        { value: 86400, text: this.$t('pagePolicies.options.1day') },
      ],
      complexityOptions: [
        { value: 'Disabled', text: this.$t('pagePolicies.disabled') },
        { value: 'Low', text: this.$t('pagePolicies.low') },
        { value: 'Medium', text: this.$t('pagePolicies.medium') },
        { value: 'High', text: this.$t('pagePolicies.high') },
      ],
      passwordHistoryOptions: [
        { value: 0, text: 0 },
        { value: 1, text: 1 },
        { value: 2, text: 2 },
        { value: 3, text: 3 },
        { value: 4, text: 4 },
        { value: 5, text: 5 },
      ],
      kvmSessionTimeOutValue: this.$store.getters['policies/kvmSessionTimeout'],
      webSessionTimeoutValue:
        this.$store.getters['policies/sessionTimeoutValue'],
      kvmPort: this.$store.getters['policies/kvmPortValue'],
      modifySSHPolicyDisabled:
        process.env.VUE_APP_MODIFY_SSH_POLICY_DISABLED === 'true',
      DisplaySection: false,
    };
  },
  computed: {
    sshProtocolState: {
      get() {
        return this.$store.getters['policies/sshProtocolEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    ipmiProtocolState: {
      get() {
        return this.$store.getters['policies/ipmiProtocolEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    rtadState: {
      get() {
        if (this.$store.getters['policies/rtadEnabled'] === 'Enabled') {
          return true;
        } else {
          return false;
        }
      },
      set(newValue) {
        return newValue;
      },
    },
    vtpmState: {
      get() {
        if (this.$store.getters['policies/vtpmEnabled'] === 'Enabled') {
          return true;
        } else {
          return false;
        }
      },
      set(newValue) {
        return newValue;
      },
    },
    kvmState: {
      get() {
        return this.$store.getters['policies/kvmServiceEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    vmcState: {
      get() {
        return this.$store.getters['policies/virtualMediaServiceEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    solState: {
      get() {
        return this.$store.getters['policies/solSshServiceEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    ssdpState: {
      get() {
        return this.$store.getters['policies/ssdpProtocolEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    snmpState: {
      get() {
        return this.$store.getters['policies/snmpProtocolEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    snmpPortValue() {
      return this.$store.getters['policies/snmpPortValue'];
    },
    solSshPortValueState: {
      get() {
        return this.$store.getters['policies/solSshPortValue'];
      },
      set(newValue) {
        this.$store.dispatch('policies/setSolSshPortUpdatedValue', newValue);
      },
    },
    complexityState: {
      get() {
        return this.$store.getters['policies/complexity'];
      },
      set(newValue) {
        this.$store.commit('policies/setComplexity', newValue);
      },
    },
    passwordHistoryState: {
      get() {
        return this.$store.getters['policies/passwordHistory'];
      },
      set(newValue) {
        this.$store.commit('policies/setPasswordHistory', newValue);
      },
    },
    ssdpPortValue() {
      return this.$store.getters['policies/ssdpPortValue'];
    },
    ...mapState('policies', [
      'kvmSessionTimeout',
      'kvmPortValue',
      'sessionTimeoutValue',
    ]),
  },
  watch: {
    kvmSessionTimeout: function (value) {
      this.kvmSessionTimeOutValue = value;
    },
    kvmPortValue: function (value) {
      this.kvmPort = value;
    },
    sessionTimeoutValue: function (value) {
      this.webSessionTimeoutValue = value;
    },
  },
  created() {
    this.startLoader();
    Promise.all([
      // this.$store.dispatch('policies/getBiosStatus'),
      this.$store.dispatch('policies/getNetworkProtocolStatus'),
      this.$store.dispatch('policies/getSessionTimeout'),
      this.$store.dispatch('policies/getKvmServiceStatus'),
      this.$store.dispatch('policies/getAccountService'),
    ]).finally(() => this.endLoader());
  },
  validations() {
    return {
      kvmSessionTimeOutValue: {
        required,
        pattern: function (pw) {
          return this.kvmSessionTimeoutValidation(pw);
        },
      },
      webSessionTimeoutValue: {
        required,
        pattern: function (pw) {
          return this.webSessionTimeoutValidation(pw);
        },
      },
    };
  },
  methods: {
    changeIpmiProtocolState(state) {
      this.$store
        .dispatch('policies/saveIpmiProtocolState', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSshProtocolState(state) {
      this.$store
        .dispatch('policies/saveSshProtocolState', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeRtadState(state) {
      this.$store
        .dispatch('policies/saveRtadState', state ? 'Enabled' : 'Disabled')
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeVtpmState(state) {
      this.$store
        .dispatch('policies/saveVtpmState', state ? 'Enabled' : 'Disabled')
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeKmvState(state) {
      this.$store
        .dispatch('policies/saveKvmState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeVmcState(state) {
      this.$store
        .dispatch('policies/saveVmcState', state ? true : false)
        .then((message) => {
          if (!state) {
            if (this.$store.state.virtualMedia.vmStarted > 0) {
              this.$root.$emit('stop-vmedia');
            }
          }
          this.successToast(message);
        })
        .catch(({ message }) => this.errorToast(message));
    },
    changeSOLState(state) {
      this.$store
        .dispatch('policies/saveSOLSshState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSSDPLState(state) {
      this.$store
        .dispatch('policies/saveSSDPProtocolState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveSolSshPortValue() {
      this.$store
        .dispatch(
          'policies/saveSolSshPortState',
          parseInt(this.solSshPortValueState),
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveWebSessionTimeoutValue() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$store
        .dispatch(
          'policies/saveWebSessionTimeoutValue',
          parseInt(this.webSessionTimeoutValue),
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeComplexity() {
      this.$store
        .dispatch('policies/saveComplexity', this.complexityState)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changePasswordHistory() {
      this.$store
        .dispatch(
          'policies/savePasswordHistory',
          parseInt(this.passwordHistoryState),
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSNMPState(state) {
      this.$store
        .dispatch('policies/saveSnmpProtocolState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveKVMSessionTimeoutValue() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$store
        .dispatch(
          'policies/saveKVMSessionTimeout',
          parseInt(this.kvmSessionTimeOutValue),
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveKVMPortValue() {
      this.$store
        .dispatch('policies/saveKVMPortValue', parseInt(this.kvmPort))
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    kvmSessionTimeoutValidation(val) {
      if (
        !/^([1-9]|[1-9][0-9]{0,2}|1[0-3][0-9]{0,2}|14[0-3][0-9]|1440)$/.test(
          val,
        )
      ) {
        return false;
      }
      return true;
    },
    webSessionTimeoutValidation(val) {
      if (
        !/^(3[0-9]|[4-9][0-9]|[1-9][0-9]{2}|[1-8][0-9]{3}|[1-7][0-9]{4}|8[0-5][0-9]{3}|86[0-3][0-9]{2}|86400)$/.test(
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

<style lang="scss" scoped>
.setting-section {
  border-bottom: 1px solid gray('300');
}

.session-timeout {
  align-self: center;
}
.page-section {
  margin-bottom: 1rem;
}
</style>
