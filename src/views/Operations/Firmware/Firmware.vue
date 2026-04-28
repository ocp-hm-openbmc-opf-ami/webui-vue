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
      class="firmware_header_inline"
    >
      <label class="ml5 multipart_fontsize">
        {{ $t('pageFirmware.form.updateFirmware.multiPartSupport') }}
      </label>
      <b-form-checkbox
        v-model="multiPartChangStatus"
        data-test-id="firmware-multiPart-support-checkbox"
        class="firmware_header_inline"
        switch
      >
      </b-form-checkbox>
      <label>{{
        $t('pageFirmware.form.updateFirmware.multiPartSupportEnd')
      }}</label>
      <b-row>
        <b-col v-if="httpPushUriOptions !== undefined" sm="6" md="6" xl="6">
          <firmware-card-time-apply
            :current-bmc-time-value="currentBmcTime"
            :set-apply-time-status="setApplyTimeValue"
            :is-multi-part-status="multiPartChangStatus"
            @validationSuccess="isValidationSuccess"
            @applyTimeForm="isApplyTimeForm"
          ></firmware-card-time-apply>
        </b-col>
        <!-- Update form -->
        <b-col sm="6" md="6" xl="6">
          <form-update
            v-if="showFWinfo"
            :is-server-off="isServerOff"
            :is-page-disabled="isPageDisabled"
            :is-validation-status="validationStatus"
            :apply-time-form-value="applyTimeFormvalues"
            :is-multi-part-status="multiPartChangStatus"
            @onSubmitUploadOk="isOnSubmitUploadOk"
            @onGetApplyTimeSetValue="isOnGetApplyTimeSetValue"
            @multiplePartJsonContent="isOnMultiplePartJsonContent"
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
      globalPrivilege: this.$store.getters['global/userPrivilege'],
      multiPartChangStatus: false,
      MultiplePartJsonFormat: {},
      showFWinfo: false,
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
      if (this.globalPrivilege !== 'Administrator') {
        return true;
      } else if (this.isServerPowerOffRequired) {
        return !this.isServerOff || this.loading || this.isOperationInProgress;
      }
      return this.loading || this.isOperationInProgress;
    },
    httpPushUriOptions() {
      return this.$store.getters['firmware/httpPushUriOptions'];
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('firmware/getFirmwareInformation').finally(() => {
      this.showFWinfo = true;
      this.endLoader();
    });
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
    isOnMultiplePartJsonContent(val) {
      this.MultiplePartJsonFormat = val;
    },
  },
};
</script>
<style>
.firmware_header_inline {
  display: inline !important;
  top: 8px;
  left: 5px;
}
.firmware_header_inline h2 {
  display: inline-block;
}

.ml5 {
  margin-left: 5px;
}
.multipart_fontsize {
  font-weight: 600;
  color: #161616;
}
</style>
