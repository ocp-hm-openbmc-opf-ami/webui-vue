<template>
  <b-container fluid="xl">
    <page-title :description="$t('pagePreserve.pageDescription')" />
    <div class="form-background p-3">
      {{ $t('pagePreserve.navigationInfoPreserve') }}
      <router-link :to="`/operations/firmware`">
        {{ $t('appPageTitle.firmware') }}
      </router-link>
      {{ $t('pagePreserve.navigationInfoExtensionPreserve') }}
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
          <b-form-checkbox
            v-model="checkboxes.authentication"
            @change="onAuthenticationChange"
          >
            {{ $t('pagePreserve.authentication') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.bootOverride">
            {{ $t('pagePreserve.bootOverride') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.extLog">
            {{ $t('pagePreserve.extLog') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.fru">
            {{ $t('pagePreserve.fru') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.ipmi">
            {{ $t('pagePreserve.ipmi') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="isKVMEnabled" class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.kvm">
            {{ $t('pagePreserve.kvm') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.network">
            {{ $t('pagePreserve.network') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.ntp">
            {{ $t('pagePreserve.ntp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.redfish">
            {{ $t('pagePreserve.redfish') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.sdr">
            {{ $t('pagePreserve.sdr') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.sel">
            {{ $t('pagePreserve.sel') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.smtp">
            {{ $t('pagePreserve.smtp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.snmp" @change="onSnmpChange">
            {{ $t('pagePreserve.snmp') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.sol">
            {{ $t('pagePreserve.sol') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.sysLog">
            {{ $t('pagePreserve.sysLog') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.serviceManager">
            {{ $t('pagePreserve.serviceManager') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-form-checkbox v-model="checkboxes.ubootEnv">
            {{ $t('pagePreserve.ubootEnv') }}
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col sm="6" md="3">
          <b-button
            type="submit"
            variant="primary"
            :disabled="isButtonDisable"
            @click="SaveConfig"
          >
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
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';

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
        serviceManager: '',
        ubootEnv: '',
      },
    };
  },
  computed: {
    ...mapState('preserveConfig', ['preserveConfigValues']),
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return (
        this.userPrivilege === privilegesId.readOnly ||
        this.userPrivilege === privilegesId.operator
      );
    },
    isKVMEnabled() {
      return process.env.VUE_APP_ONETREE_KVM_ENABLED === 'true';
    },
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
      const shouldCheckAuthAndSnmp = Boolean(
        config.AUTHENTICATION || config.SNMP,
      );
      this.checkboxes = {
        authentication: shouldCheckAuthAndSnmp,
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
        snmp: shouldCheckAuthAndSnmp,
        sol: config.SOL,
        sysLog: config.SYSLOG,
        serviceManager: config.ServiceManager,
        ubootEnv: config.U_BOOT_ENV,
      };
    },
    onAuthenticationChange(isChecked) {
      if (this.checkboxes.snmp !== isChecked) {
        this.checkboxes.snmp = isChecked;
      }
    },
    onSnmpChange(isChecked) {
      if (this.checkboxes.authentication !== isChecked) {
        this.checkboxes.authentication = isChecked;
      }
    },
    SaveConfig() {
      this.$bvModal
        .msgBoxConfirm(this.$tc('pagePreserve.toast.preserveConfirmation'), {
          title: this.$tc('pagePreserve.toast.title'),
          okTitle: this.$t('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((confirmed) => {
          if (confirmed) {
            const saveConfigValues = { ...this.checkboxes };
            this.startLoader();
            this.$store
              .dispatch('preserveConfig/savePreserveConfig', saveConfigValues)
              .then((message) => this.successToast(message))
              .catch(({ message }) => this.errorToast(message))
              .finally(() => this.endLoader());
          }
        });
    },
    toggleAllCheckboxes() {
      Object.keys(this.checkboxes).forEach((key) => {
        this.checkboxes[key] = this.checkAll;
      });
    },
  },
};
</script>
