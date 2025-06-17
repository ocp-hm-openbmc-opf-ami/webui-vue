<template>
  <div>
    <div v-if="factoryDefaultOverlay">
      <b-overlay :show="true" opacity="0.6" no-wrap fixed class="full-overlay">
        <template #overlay>
          <div></div>
        </template>
      </b-overlay>
    </div>
    <b-container fluid="xl">
      <page-title />
      <div class="form-background p-3">
        <p>
          {{ $t('PageFactoryDefault.navigationInfoFactoryDefault') }}
        </p>
        <a href="#/operations/preserve-configuration" class="link-style">
          {{ $t('appPageTitle.preserve') }} </a
        >{{ $t('PageFactoryDefault.navigationInfoExtensionFactoryDefault') }}
        <hr class="my-3" style="border-color: #e9ecef" />
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.authentication" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.authentication') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.bootOverride" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.bootOverride') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.extLog" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.extLog') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.fru" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.fru') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.ipmi" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.ipmi') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.kvm" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.kvm') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.network" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.network') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.ntp" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.ntp') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.redfish" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.redfish') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.sdr" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.sdr') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.sel" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.sel') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.smtp" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.smtp') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.snmp" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.snmp') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.sol" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.sol') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.sysLog" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.sysLog') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.serviceManager" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.serviceManager') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="d-flex align-items-center">
              <b-form-checkbox v-model="checkboxes.ubootEnv" disabled>
              </b-form-checkbox>
              <span class="ml-2">
                {{ $t('PageFactoryDefault.ubootEnv') }}
              </span>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <b-button
              type="submit"
              variant="primary"
              @click="onRestoreToDefaults"
            >
              {{ $t('global.action.save') }}
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import { mapState } from 'vuex';

export default {
  name: 'FactoryDefault',
  components: { PageTitle },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      factoryDefaultOverlay: false,
      checkboxes: {
        authentication: '',
        bootOverride: '',
        extLog: '',
        fru: '',
        ipmi: '',
        kvm: '',
        network: '',
        ntp: '',
        redfish: '',
        sdr: '',
        sel: '',
        smtp: '',
        snmp: '',
        sol: '',
        sysLog: '',
        serviceManager: '',
        ubootEnv: '',
      },
    };
  },
  computed: {
    ...mapState('FactoryDefault', ['resetDefaultValues']),
  },
  watch: {
    resetDefaultValues() {
      this.initResetDefaultValues();
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('FactoryDefault/getResetDefault')
      .catch(({ message }) => this.errorToast(message))
      .finally(() => this.endLoader());
  },
  methods: {
    initResetDefaultValues() {
      const config =
        this.$store.getters['FactoryDefault/getResetDefaultValues'] || {};
      this.checkboxes = {
        authentication: config.AUTHENTICATION,
        bootOverride: config.Boot_Override,
        extLog: config.EXTLOG,
        fru: config.FRU,
        ipmi: config.IPMI,
        kvm: config.KVM,
        network: config.NETWORK,
        ntp: config.NTP,
        redfish: config.REDFISH,
        sdr: config.SDR,
        sel: config.SEL,
        smtp: config.SMTP,
        snmp: config.SNMP,
        sol: config.SOL,
        sysLog: config.SYSLOG,
        serviceManager: config.ServiceManager,
        ubootEnv: config.U_BOOT_ENV,
      };
    },
    onRestoreToDefaults() {
      this.$bvModal
        .msgBoxConfirm(
          this.$tc('PageFactoryDefault.toast.FactoryDefaultConfirmation'),
          {
            title: this.$tc('PageFactoryDefault.toast.title'),
            okTitle: this.$tc('PageFactoryDefault.toast.okTitle'),
            cancelTitle: this.$t('global.action.cancel'),
            autoFocusButton: 'ok',
          },
        )
        .then((confirmed) => {
          if (confirmed) {
            this.$store
              .dispatch('FactoryDefault/saveResetDefault')
              .then((message) => {
                this.factoryDefaultOverlay = true;
                this.successToast(message);
              })
              .catch(({ message }) => this.errorToast(message));
          }
        });
    },
  },
};
</script>
