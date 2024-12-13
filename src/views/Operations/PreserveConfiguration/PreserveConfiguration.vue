<template>
  <b-container fluid="xl">
    <page-title
      :description="$t('pagePreserveConfiguration.pageDescription')"
    />
    <div class="form-background p-3">
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
          <b-form-checkbox v-model="checkboxes.fru">
            {{ $t('pagePreserveConfiguration.fru') }}
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
          <b-form-checkbox v-model="checkboxes.smtp">
            {{ $t('pagePreserveConfiguration.smtp') }}
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
          <b-form-checkbox v-model="checkboxes.snmp">
            {{ $t('pagePreserveConfiguration.snmp') }}
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

export default {
  name: 'PreserveConfig',
  components: { PageTitle },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      checkAll: '',
      checkboxes: {
        authentication: '',
        fru: '',
        kvm: '',
        smtp: '',
        network: '',
        redfish: '',
        sdr: '',
        sel: '',
        snmp: '',
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
        fru: config.FRU,
        kvm: config.KVM,
        smtp: config.SMTP,
        network: config.NETWORK,
        redfish: config.REDFISH,
        sdr: config.SDR,
        sel: config.SEL,
        snmp: config.SNMP,
        ubootEnv: config.U_BOOT_ENV,
      };
    },
    SaveConfig() {
      let saveConfigValues = {};
      saveConfigValues.authentication = this.checkboxes.authentication;
      saveConfigValues.fru = this.checkboxes.fru;
      saveConfigValues.kvm = this.checkboxes.kvm;
      saveConfigValues.smtp = this.checkboxes.smtp;
      saveConfigValues.network = this.checkboxes.network;
      saveConfigValues.redfish = this.checkboxes.redfish;
      saveConfigValues.sdr = this.checkboxes.sdr;
      saveConfigValues.sel = this.checkboxes.sel;
      saveConfigValues.snmp = this.checkboxes.snmp;
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
