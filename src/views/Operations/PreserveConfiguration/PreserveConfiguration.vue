<template>
  <b-container fluid="xl">
    <page-title
      :description="$t('pagePreserveConfiguration.pageDescription')"
    />
    <div class="form-background p-3">
      {{ $t('pagePreserveConfiguration.navigationInfoPreserve') }}
      <router-link :to="`/operations/firmware`">
        {{ $t('appPageTitle.firmware') }}
      </router-link>
      {{ $t('pagePreserveConfiguration.navigationInfoExtensionPreserve') }}
      <router-link :to="`/operations/factory-default`">
        {{ $t('appPageTitle.factoryDefault') }}
      </router-link>
      <div>
        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <b-form-checkbox v-model="checkAll" @change="toggleAllCheckboxes">
              Check All
            </b-form-checkbox>
          </b-col>
        </b-row>
      </div>
      <hr class="my-3" style="border-color: #e9ecef" />
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.authentication">
            {{ $t('pagePreserveConfiguration.authentication') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.bootOverride">
            {{ $t('pagePreserveConfiguration.bootOverride') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.extLog">
            {{ $t('pagePreserveConfiguration.extLog') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.fru">
            {{ $t('pagePreserveConfiguration.fru') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.ipmi">
            {{ $t('pagePreserveConfiguration.ipmi') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.kvm">
            {{ $t('pagePreserveConfiguration.kvm') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.network">
            {{ $t('pagePreserveConfiguration.network') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.ntp">
            {{ $t('pagePreserveConfiguration.ntp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.redfish">
            {{ $t('pagePreserveConfiguration.redfish') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.sdr">
            {{ $t('pagePreserveConfiguration.sdr') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.sel">
            {{ $t('pagePreserveConfiguration.sel') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.smtp">
            {{ $t('pagePreserveConfiguration.smtp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.snmp">
            {{ $t('pagePreserveConfiguration.snmp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.sol">
            {{ $t('pagePreserveConfiguration.sol') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.sysLog">
            {{ $t('pagePreserveConfiguration.sysLog') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.ubootEnv">
            {{ $t('pagePreserveConfiguration.ubootEnv') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-button type="submit" variant="primary" @click="SaveConfig">
            <icon-save />
            {{ $t('global.action.save') }}
          </b-button>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import { mapState } from 'vuex';
import IconSave from '@carbon/icons-vue/es/save/20';

export default {
  name: 'PreserveConfig',
  components: { PageTitle, IconSave },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      checkAll: '',
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
        ubootEnv: '',
      },
    };
  },
  computed: {
    ...mapState('preserveConfig', ['preserveConfigValues']),
  },
  watch: {
    preserveConfigValues() {
      this.initpreserveConfigValues();
    },
    checkboxes: {
      handler(val) {
        this.checkAll = Object.values(val).every((checked) => checked);
      },
      deep: true,
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('preserveConfig/getPreserveConfig')
      .catch(({ message }) => this.errorToast(message))
      .finally(() => this.endLoader());
  },
  methods: {
    initpreserveConfigValues() {
      const config =
        this.$store.getters['preserveConfig/getPreserveConfigValues'] || {};
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
        ubootEnv: config.U_BOOT_ENV,
      };
    },
    SaveConfig() {
      let saveConfigValues = {};
      saveConfigValues.authentication = this.checkboxes.authentication;
      saveConfigValues.bootOverride = this.checkboxes.bootOverride;
      saveConfigValues.extLog = this.checkboxes.extLog;
      saveConfigValues.fru = this.checkboxes.fru;
      saveConfigValues.ipmi = this.checkboxes.ipmi;
      saveConfigValues.kvm = this.checkboxes.kvm;
      saveConfigValues.network = this.checkboxes.network;
      saveConfigValues.ntp = this.checkboxes.ntp;
      saveConfigValues.redfish = this.checkboxes.redfish;
      saveConfigValues.sdr = this.checkboxes.sdr;
      saveConfigValues.sel = this.checkboxes.sel;
      saveConfigValues.smtp = this.checkboxes.smtp;
      saveConfigValues.snmp = this.checkboxes.snmp;
      saveConfigValues.sol = this.checkboxes.sol;
      saveConfigValues.sysLog = this.checkboxes.sysLog;
      saveConfigValues.ubootEnv = this.checkboxes.ubootEnv;
      this.startLoader();
      this.$store
        .dispatch('preserveConfig/savePreserveConfig', saveConfigValues)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    toggleAllCheckboxes() {
      Object.keys(this.checkboxes).forEach((key) => {
        this.checkboxes[key] = this.checkAll;
      });
    },
  },
};
</script>
