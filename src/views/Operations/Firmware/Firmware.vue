<template>
  <b-container fluid="xl">
    <page-title />
    <alerts-server-power
      v-if="isServerPowerOffRequired"
      :is-server-off="isServerOff"
    />

    <!-- Firmware cards -->
    <b-row>
      <b-col xl="10">
        <!-- BMC Firmware -->
        <bmc-cards :is-page-disabled="isPageDisabled" />

        <!-- Host Firmware -->
        <host-cards v-if="!isSingleFileUploadEnabled" />
      </b-col>
    </b-row>

    <!-- Update firmware-->
    <page-section
      :section-title="$t('pageFirmware.sectionTitleUpdateFirmware')"
    >
      <b-row>
        <b-col sm="6" md="6" xl="6">
          <firmware-card-time-apply
            :current-bmc-time-value="currentBmcTime"
            :set-apply-time-status="setApplyTimeValue"
            @validationSuccess="isValidationSuccess"
            @applyTimeForm="isApplyTimeForm"
          ></firmware-card-time-apply>
        </b-col>
        <!-- Update form -->
        <b-col sm="6" md="6" xl="6">
          <form-update
            :is-server-off="isServerOff"
            :is-page-disabled="isPageDisabled"
            :is-validation-status="validationStatus"
            :apply-time-form-value="applyTimeFormvalues"
            @onSubmitUploadOk="isOnSubmitUploadOk"
            @onGetApplyTimeSetValue="isOnGetApplyTimeSetValue"
          />
        </b-col>
      </b-row>
    </page-section>
  </b-container>
</template>

<script>
import AlertsServerPower from './FirmwareAlertServerPower';
import BmcCards from './FirmwareCardsBmc';
import FormUpdate from './FirmwareFormUpdate';
import HostCards from './FirmwareCardsHost';
import PageSection from '@/components/Global/PageSection';
import PageTitle from '@/components/Global/PageTitle';
import FirmwareCardTimeApply from './FirmwareCardTimeApply';

import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';

export default {
  name: 'FirmwareSingleImage',
  components: {
    AlertsServerPower,
    BmcCards,
    FormUpdate,
    HostCards,
    PageSection,
    PageTitle,
    FirmwareCardTimeApply,
  },
  mixins: [LoadingBarMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      loading,
      isServerPowerOffRequired:
        process.env.VUE_APP_SERVER_OFF_REQUIRED === 'true',
      validationStatus: true,
      applyTimeFormvalues: {},
      currentBmcTime: '',
      setApplyTimeValue: {},
    };
  },
  computed: {
    serverStatus() {
      return this.$store.getters['global/serverStatus'];
    },
    isServerOff() {
      return this.serverStatus === 'off' ? true : false;
    },
    isSingleFileUploadEnabled() {
      return this.$store.getters['firmware/isSingleFileUploadEnabled'];
    },
    isPageDisabled() {
      if (this.isServerPowerOffRequired) {
        return !this.isServerOff || this.loading || this.isOperationInProgress;
      }
      return this.loading || this.isOperationInProgress;
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('firmware/getFirmwareInformation')
      .finally(() => this.endLoader());
  },
  methods: {
    isApplyTimeForm(val) {
      this.applyTimeFormvalues = val;
    },
    isValidationSuccess(val) {
      this.validationStatus = val;
    },
    isOnSubmitUploadOk(val) {
      this.currentBmcTime = val;
    },
    isOnGetApplyTimeSetValue(val) {
      this.setApplyTimeValue = val;
    },
  },
};
</script>
