<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="mb-4">
      <b-col md="8" xl="6">
        <page-section
          :section-title="$t('pageServerPowerOperations1.currentStatus')"
        >
          <b-row>
            <b-col>
              <dl>
                <dt>{{ $t('pageServerPowerOperations1.serverStatus') }}</dt>
                <dd
                  v-if="serverStatus === 'on'"
                  data-test-id="powerServerOps-text-hostStatus"
                >
                  {{ $t('global.status.on') }}
                </dd>
                <dd
                  v-else-if="serverStatus === 'off'"
                  data-test-id="powerServerOps-text-hostStatus"
                >
                  {{ $t('global.status.off') }}
                </dd>
                <dd
                  v-else-if="serverStatus === 'diagnosticMode'"
                  data-test-id="powerServerOps-text-hostStatus"
                >
                  {{ $t('global.status.diagnosticMode') }}
                </dd>
                <dd v-else>
                  {{ $t('global.status.notAvailable') }}
                </dd>
              </dl>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <dl>
                <dt>
                  {{ $t('pageServerPowerOperations1.lastPowerOperation') }}
                </dt>
                <dd
                  v-if="lastPowerOperationTime"
                  data-test-id="powerServerOps-text-lastPowerOp"
                >
                  {{ lastPowerOperationTime | formatDate }}
                  {{ lastPowerOperationTime | formatTime }}
                </dd>
                <dd v-else>--</dd>
              </dl>
            </b-col>
          </b-row>
        </page-section>
      </b-col>
    </b-row>
    <b-row>
      <!-- <b-col v-if="hasBootSourceOptions" sm="8" md="6" xl="4">
        <page-section
          :section-title="$t('pageServerPowerOperations1.serverBootSettings')"
        >
          <boot-settings />
        </page-section>
      </b-col> -->
      <b-col sm="8" md="6" xl="7">
        <page-section
          :section-title="$t('pageServerPowerOperations1.operations')"
        >
          <alert :show="oneTimeBootEnabled" variant="warning">
            {{ $t('pageServerPowerOperations1.oneTimeBootWarning') }}
          </alert>
          <template v-if="isOperationInProgress">
            <alert variant="info">
              {{ $t('pageServerPowerOperations1.operationInProgress') }}
            </alert>
          </template>
          <template v-else-if="serverStatus === 'off'">
            <b-button
              variant="primary"
              data-test-id="serverPowerOperations-button-powerOn"
              :disabled="globalPrivilege !== 'Administrator'"
              @click="powerOn"
            >
              <icon-power />
              {{ $t('pageServerPowerOperations1.powerOn') }}
            </b-button>
          </template>
          <template v-else>
            <!-- Reboot server options -->
            <b-form novalidate class="mb-5" @submit.prevent="rebootServer">
              <b-form-group
                :label="$t('pageServerPowerOperations1.rebootServer')"
              >
                <b-form-radio
                  v-model="form.rebootOption"
                  name="reboot-option"
                  data-test-id="serverPowerOperations-radio-rebootOrderly"
                  value="orderly"
                >
                  {{ $t('pageServerPowerOperations1.orderlyReboot') }}
                </b-form-radio>
                <b-form-radio
                  v-model="form.rebootOption"
                  name="reboot-option"
                  data-test-id="serverPowerOperations-radio-rebootImmediate"
                  value="immediate"
                >
                  {{ $t('pageServerPowerOperations1.immediateReboot') }}
                </b-form-radio>
              </b-form-group>
              <b-button
                variant="primary"
                type="submit"
                data-test-id="serverPowerOperations-button-reboot"
                :disabled="globalPrivilege !== 'Administrator'"
              >
                <icon-reset />
                {{ $t('pageServerPowerOperations1.reboot') }}
              </b-button>
            </b-form>
            <!-- Shutdown server options -->
            <b-form novalidate @submit.prevent="shutdownServer">
              <b-form-group
                :label="$t('pageServerPowerOperations1.shutdownServer')"
              >
                <b-form-radio
                  v-model="form.shutdownOption"
                  name="shutdown-option"
                  data-test-id="serverPowerOperations-radio-shutdownOrderly"
                  value="orderly"
                >
                  {{ $t('pageServerPowerOperations1.orderlyShutdown') }}
                </b-form-radio>
                <b-form-radio
                  v-model="form.shutdownOption"
                  name="shutdown-option"
                  data-test-id="serverPowerOperations-radio-shutdownImmediate"
                  value="immediate"
                >
                  {{ $t('pageServerPowerOperations1.immediateShutdown') }}
                </b-form-radio>
              </b-form-group>
              <b-button
                variant="primary"
                type="submit"
                data-test-id="serverPowerOperations-button-shutDown"
                :disabled="globalPrivilege !== 'Administrator'"
              >
                <icon-power />
                {{ $t('pageServerPowerOperations1.shutDown') }}
              </b-button>
            </b-form>
          </template>
        </page-section>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
// import BootSettings from './BootSettings1';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import Alert from '@/components/Global/Alert';
import IconPower from '@carbon/icons-vue/es/power/20';
import IconReset from '@carbon/icons-vue/es/reset/20';

export default {
  name: 'ServerPowerOperations',
  components: {
    PageTitle,
    PageSection,
    // BootSettings,
    Alert,
    IconPower,
    IconReset,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      form: {
        rebootOption: 'orderly',
        shutdownOption: 'orderly',
      },
      globalPrivilege: this.$store.getters['global/userPrivilege'],
    };
  },
  computed: {
    serverStatus() {
      return this.$store.getters['kvm1Control/serverStatus'];
    },
    isOperationInProgress() {
      return this.$store.getters['kvm1Control/isOperationInProgress'];
    },
    lastPowerOperationTime() {
      return this.$store.getters['kvm1Control/lastPowerOperationTime'];
    },
    oneTimeBootEnabled() {
      return this.$store.getters['serverBootSettings/overrideEnabled'];
    },
    hasBootSourceOptions() {
      let bootOptions =
        this.$store.getters['serverBootSettings/bootSourceOptions'];
      return bootOptions.length !== 0;
    },
  },
  created() {
    this.startLoader();
    // const bootSettingsPromise = new Promise((resolve) => {
    //   this.$root.$on('server-power-operations1-boot-settings-complete', () =>
    //     resolve(),
    //   );
    // });
    Promise.all([
      // this.$store.dispatch('serverBootSettings/getBootSettings'),
      this.$store.dispatch('kvm1Control/getLastPowerOperationTime'),
    ]).finally(() => this.endLoader());
  },
  methods: {
    powerOn() {
      this.$store
        .dispatch('kvm1Control/serverPowerOn')
        .then((message) => {
          this.successToast(message);
          window.events.fire('powerActionServerStatus');
        })
        .catch(({ message }) => this.errorToast(message));
    },
    rebootServer() {
      const modalMessage = this.$t(
        'pageServerPowerOperations1.modal.confirmRebootMessage',
      );
      const modalOptions = {
        title: this.$t('pageServerPowerOperations1.modal.confirmRebootTitle'),
        okTitle: this.$t('global.action.confirm'),
        cancelTitle: this.$t('global.action.cancel'),
        autoFocusButton: 'ok',
      };

      if (this.form.rebootOption === 'orderly') {
        this.$bvModal
          .msgBoxConfirm(modalMessage, modalOptions)
          .then((confirmed) => {
            if (confirmed) {
              this.$store
                .dispatch('kvm1Control/serverSoftReboot')
                .then((message) => {
                  this.successToast(message);
                  window.events.fire('powerActionServerStatus');
                })
                .catch(({ message }) => this.errorToast(message));
            }
          });
      } else if (this.form.rebootOption === 'immediate') {
        this.$bvModal
          .msgBoxConfirm(modalMessage, modalOptions)
          .then((confirmed) => {
            if (confirmed) {
              this.$store
                .dispatch('kvm1Control/serverHardReboot')
                .then((message) => {
                  this.successToast(message);
                  window.events.fire('powerActionServerStatus');
                })
                .catch(({ message }) => this.errorToast(message));
            }
          });
      }
    },
    shutdownServer() {
      const modalMessage = this.$t(
        'pageServerPowerOperations1.modal.confirmShutdownMessage',
      );
      const modalOptions = {
        title: this.$t('pageServerPowerOperations1.modal.confirmShutdownTitle'),
        okTitle: this.$t('global.action.confirm'),
        cancelTitle: this.$t('global.action.cancel'),
        autoFocusButton: 'ok',
      };

      if (this.form.shutdownOption === 'orderly') {
        this.$bvModal
          .msgBoxConfirm(modalMessage, modalOptions)
          .then((confirmed) => {
            if (confirmed) {
              this.$store
                .dispatch('kvm1Control/serverSoftPowerOff')
                .then((message) => {
                  this.successToast(message);
                  window.events.fire('powerActionServerStatus');
                })
                .catch(({ message }) => this.errorToast(message));
            }
          });
      }
      if (this.form.shutdownOption === 'immediate') {
        this.$bvModal
          .msgBoxConfirm(modalMessage, modalOptions)
          .then((confirmed) => {
            if (confirmed) {
              this.$store
                .dispatch('kvm1Control/serverHardPowerOff')
                .then((message) => {
                  this.successToast(message);
                  window.events.fire('powerActionServerStatus');
                })
                .catch(({ message }) => this.errorToast(message));
            }
          });
      }
    },
  },
};
</script>
