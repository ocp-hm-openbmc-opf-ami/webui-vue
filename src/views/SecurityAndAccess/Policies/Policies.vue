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
                <b-col lg="3" class="session-timeout">
                  <b-form-select
                    id="session-timeout-options"
                    v-model="sessionTimeoutState"
                    :options="sessionTimeOutOptions"
                    @change="saveSessionTimeoutValue"
                  >
                    <template #first>
                      <b-form-select-option :value="null" disabled>
                        {{ $t('global.form.selectAnOption') }}
                      </b-form-select-option>
                    </template>
                  </b-form-select>
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

export default {
  name: 'Policies',
  components: { PageTitle, PageSection },
  mixins: [LoadingBarMixin, BVToastMixin],
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
    solSshPortValueState: {
      get() {
        return this.$store.getters['policies/solSshPortValue'];
      },
      set(newValue) {
        this.$store.dispatch('policies/setSolSshPortUpdatedValue', newValue);
      },
    },
    sessionTimeoutState: {
      get() {
        return this.$store.getters['policies/getSessionTimeoutValue'];
      },
      set(newValue) {
        return newValue;
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
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSOLState(state) {
      this.$store
        .dispatch('policies/saveSOLSshState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveSolSshPortValue() {
      this.$store
        .dispatch(
          'policies/saveSolSshPortState',
          parseInt(this.solSshPortValueState)
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveSessionTimeoutValue(sessionTimeoutState) {
      this.$store
        .dispatch('policies/saveSessionTimeoutValue', sessionTimeoutState)
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
          parseInt(this.passwordHistoryState)
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
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
