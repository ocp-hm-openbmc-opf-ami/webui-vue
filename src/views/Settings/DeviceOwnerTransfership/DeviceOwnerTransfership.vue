<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageDeviceOwnerTransfership.description')" />
    <div v-if="moduleLoaded" class="form-background p-3">
      <b-nav pills>
        <!--
        <b-nav-item
          :active="activeStep === 0"
          :disabled="false"
          @click="setActiveStep(0)"
        >
          {{ $t('pageDeviceOwnerTransfership.step1.title') }}
          <b-badge
            v-if="cakUnlockStatus"
            :variant="statusVariant(cakUnlockStatus)"
          >
            {{ cakUnlockStatus }}
          </b-badge>
        </b-nav-item>
        <b-nav-item
          :active="activeStep === 1"
          :disabled="activeStep < 1"
          @click="activeStep >= 1 && setActiveStep(1)"
        >
          {{ $t('pageDeviceOwnerTransfership.step2.title') }}
          <b-badge
            v-if="dotDisableStatus"
            :variant="statusVariant(dotDisableStatus)"
          >
            {{ dotDisableStatus }}
          </b-badge>
        </b-nav-item>
        -->
        <b-nav-item
          :active="activeStep === 2"
          :disabled="activeStep < 2"
          @click="
            activeStep >= 2 &&
              $store.commit('deviceOwnerTransfership/setActiveStep', 2)
          "
        >
          {{ $t('pageDeviceOwnerTransfership.step3.title') }}
          <b-badge
            v-if="dotEnableStatus"
            :variant="statusVariant(dotEnableStatus)"
          >
            {{ dotEnableStatus }}
          </b-badge>
        </b-nav-item>
        <b-nav-item
          :active="activeStep === 3"
          :disabled="activeStep < 3"
          @click="
            activeStep >= 3 &&
              $store.commit('deviceOwnerTransfership/setActiveStep', 3)
          "
        >
          {{ $t('pageDeviceOwnerTransfership.step4.title') }}
          <b-badge
            v-if="cakInstallStatus"
            :variant="statusVariant(cakInstallStatus)"
          >
            {{ cakInstallStatus }}
          </b-badge>
        </b-nav-item>
        <b-nav-item
          :active="activeStep === 4"
          :disabled="activeStep < 4"
          @click="
            activeStep >= 4 &&
              $store.commit('deviceOwnerTransfership/setActiveStep', 4)
          "
        >
          {{ $t('pageDeviceOwnerTransfership.step5.title') }}
          <b-badge v-if="cakLockStatus" :variant="statusVariant(cakLockStatus)">
            {{ cakLockStatus }}
          </b-badge>
        </b-nav-item>
        <b-nav-item
          :active="activeStep === 5"
          :disabled="activeStep < 5"
          @click="
            activeStep >= 5 &&
              $store.commit('deviceOwnerTransfership/setActiveStep', 5)
          "
        >
          {{ $t('pageDeviceOwnerTransfership.step6.title') }}
          <b-badge v-if="cakTestStatus" :variant="statusVariant(cakTestStatus)">
            {{ cakTestStatus }}
          </b-badge>
        </b-nav-item>
        <b-nav-item
          :active="activeStep === 6"
          :disabled="activeStep < 6"
          @click="
            activeStep >= 6 &&
              $store.commit('deviceOwnerTransfership/setActiveStep', 6)
          "
        >
          {{ $t('pageDeviceOwnerTransfership.step7.title') }}
          <b-badge
            v-if="cakSignTestStatus"
            :variant="statusVariant(cakSignTestStatus)"
          >
            {{ cakSignTestStatus }}
          </b-badge>
        </b-nav-item>
      </b-nav>

      <div class="mt-3">
        <!--
        <div v-if="activeStep === 0">
          <h2>{{ $t('pageDeviceOwnerTransfership.step1.title') }}</h2>
          <p>{{ $t('pageDeviceOwnerTransfership.step1.description') }}</p>
          <b-button
            variant="primary"
            :disabled="isLoading"
            @click="handleStep1"
          >
            <b-spinner v-if="isLoading" small></b-spinner>
            {{ $t('pageDeviceOwnerTransfership.step1.generateToken') }}
          </b-button>
          <div v-if="showFileUpload.step1" class="mt-3">
            <p>
              {{ $t('pageDeviceOwnerTransfership.step1.uploadSignedToken') }}
            </p>
            <form-file v-model="file.step1" accept=".bin"></form-file>
            <b-button
              class="mt-2"
              variant="primary"
              :disabled="!file.step1 || isLoading"
              @click="uploadSignedToken(1)"
            >
              <b-spinner v-if="isLoading" small></b-spinner>
              {{ $t('pageDeviceOwnerTransfership.upload') }}
            </b-button>
          </div>
        </div>

        <div v-if="activeStep === 1">
          <p>{{ $t('pageDeviceOwnerTransfership.step2.description') }}</p>
          <b-alert show variant="warning">
            {{ $t('pageDeviceOwnerTransfership.powerCyclePrompt') }}
          </b-alert>
          <h2>{{ $t('pageDeviceOwnerTransfership.step2.disableDot') }}</h2>
          <p>
            {{ $t('pageDeviceOwnerTransfership.step2.uploadLakPub') }}
          </p>
          <form-file v-model="file.step2_lak" accept=".pem"></form-file>
          <b-button
            class="mt-2"
            variant="primary"
            :disabled="!file.step2_lak || isLoading"
            @click="handleStep2"
          >
            <b-spinner v-if="isLoading" small></b-spinner>
            {{ $t('pageDeviceOwnerTransfership.upload') }}
          </b-button>
        </div>
        -->

        <!-- Step 3: Enable DOT -->
        <div v-if="activeStep === 2">
          <h2>{{ $t('pageDeviceOwnerTransfership.step3.title') }}</h2>
          <p>{{ $t('pageDeviceOwnerTransfership.step3.description') }}</p>
          <b-button
            variant="primary"
            data-test-id="step3-generate-token"
            :disabled="isLoading"
            @click="handleStep3"
          >
            <b-spinner v-if="isLoading" small></b-spinner>
            <icon-launch v-else />
            {{ $t('pageDeviceOwnerTransfership.step3.generateToken') }}
          </b-button>
          <div v-if="showFileUpload.step3" class="mt-3">
            <p>
              {{ $t('pageDeviceOwnerTransfership.step3.uploadSignedToken') }}
            </p>
            <form-file
              v-model="file.step3"
              data-test-id="step3-upload-signed-token"
              accept=".bin"
            ></form-file>
            <b-button
              class="mt-2"
              variant="primary"
              data-test-id="step3-upload-button"
              :disabled="!file.step3 || isLoading"
              @click="uploadSignedToken(3)"
            >
              <b-spinner v-if="isLoading" small></b-spinner>
              <icon-upload v-else />
              {{ $t('pageDeviceOwnerTransfership.upload') }}
            </b-button>
          </div>
        </div>

        <!-- Step 4: Install CAK -->
        <div v-if="activeStep === 3">
          <h2>{{ $t('pageDeviceOwnerTransfership.step4.title') }}</h2>
          <p>{{ $t('pageDeviceOwnerTransfership.step4.description') }}</p>
          <p>{{ $t('pageDeviceOwnerTransfership.step4.uploadLakPub') }}</p>
          <form-file v-model="file.step4_lak" accept=".pem"></form-file>
          <b-button
            class="mt-2"
            variant="primary"
            data-test-id="step4-upload-button"
            :disabled="!file.step4_lak || isLoading"
            @click="handleStep4"
          >
            <b-spinner v-if="isLoading" small></b-spinner>
            <icon-upload v-else />
            {{ $t('pageDeviceOwnerTransfership.upload') }}
          </b-button>
        </div>

        <!-- Step 5: Lock CAK -->
        <div v-if="activeStep === 4">
          <h2>{{ $t('pageDeviceOwnerTransfership.step5.title') }}</h2>
          <p>{{ $t('pageDeviceOwnerTransfership.step5.description') }}</p>
          <p>{{ $t('pageDeviceOwnerTransfership.step4.uploadLakPub') }}</p>
          <form-file
            v-model="file.step5_lak"
            data-test-id="step5-upload-public-key"
            accept=".pem"
          ></form-file>
          <b-button
            variant="primary"
            data-test-id="step5-upload-button"
            :disabled="!file.step5_lak || isLoading"
            @click="handleStep5"
          >
            <b-spinner v-if="isLoading" small></b-spinner>
            <icon-upload v-else />
            {{ $t('pageDeviceOwnerTransfership.upload') }}
          </b-button>
        </div>

        <!-- Step 6: CAK Test -->
        <div v-if="activeStep === 5">
          <h2>{{ $t('pageDeviceOwnerTransfership.step6.title') }}</h2>
          <p>{{ $t('pageDeviceOwnerTransfership.step6.description') }}</p>
          <b-button
            variant="primary"
            data-test-id="step6-test-cak-button"
            :disabled="isLoading"
            @click="handleStep6"
          >
            <b-spinner v-if="isLoading" small></b-spinner>
            <icon-test v-else />
            {{ $t('pageDeviceOwnerTransfership.step6.testCak') }}
          </b-button>
        </div>

        <!-- Step 7: CAK Sign Test -->
        <div v-if="activeStep === 6">
          <h2>{{ $t('pageDeviceOwnerTransfership.step7.title') }}</h2>
          <p>{{ $t('pageDeviceOwnerTransfership.step7.description') }}</p>
          <b-button
            variant="primary"
            data-test-id="step7-generate-token"
            :disabled="isLoading"
            @click="handleStep7"
          >
            <b-spinner v-if="isLoading" small></b-spinner>
            <icon-launch v-else />
            {{ $t('pageDeviceOwnerTransfership.step7.generateToken') }}
          </b-button>
          <div v-if="showFileUpload.step7" class="mt-3">
            <p>
              {{ $t('pageDeviceOwnerTransfership.step7.uploadSignedToken') }}
            </p>
            <form-file
              v-model="file.step7"
              data-test-id="step7-upload-signed-token"
              accept=".bin"
            ></form-file>
            <b-button
              class="mt-2"
              variant="primary"
              data-test-id="step7-upload-button"
              :disabled="!file.step7 || isLoading"
              @click="uploadSignedToken(7)"
            >
              <b-spinner v-if="isLoading" small></b-spinner>
              <icon-upload v-else />
              {{ $t('pageDeviceOwnerTransfership.upload') }}
            </b-button>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="activeStep === 7">
          <h2>{{ $t('pageDeviceOwnerTransfership.success.title') }}</h2>
          <p>{{ $t('pageDeviceOwnerTransfership.success.message') }}</p>
          <b-button
            variant="primary"
            data-test-id="step7-reset-button"
            @click="reset"
          >
            <icon-reset />
            {{ $t('pageDeviceOwnerTransfership.reset') }}
          </b-button>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import FormFile from '@/components/Global/FormFile';
import { mapState, mapActions, mapMutations } from 'vuex';
import { saveAs } from 'file-saver';
import store from '@/store';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { BSpinner } from 'bootstrap-vue';
import IconUpload from '@carbon/icons-vue/es/upload/20';
import IconReset from '@carbon/icons-vue/es/reset/20';
import IconLaunch from '@carbon/icons-vue/es/launch/20';
import IconTest from '@carbon/icons-vue/es/test-tool/20';

export default {
  name: 'DeviceOwnerTransfership',
  components: {
    PageTitle,
    FormFile,
    BSpinner,
    IconUpload,
    IconReset,
    IconLaunch,
    IconTest,
  },
  mixins: [BVToastMixin],
  beforeRouteLeave(to, from, next) {
    this.resetSteps();
    store.unregisterModule('deviceOwnerTransfership');
    next();
  },
  data() {
    return {
      file: {
        // step1: null,
        // step2_lak: null,
        step3: null,
        step4_lak: null,
        step5_lak: null,
        step7: null,
      },
      showFileUpload: {
        // step1: false,
        step3: false,
        step7: false,
      },
      isLoading: false,
      moduleLoaded: false,
    };
  },
  computed: {
    ...mapState({
      activeStep: (state) =>
        state.deviceOwnerTransfership
          ? state.deviceOwnerTransfership.activeStep
          : 2,
      /*
      cakUnlockStatus: (state) =>
        state.deviceOwnerTransfership
          ? state.deviceOwnerTransfership.cakUnlockStatus
          : null,
      dotDisableStatus: (state) =>
        state.deviceOwnerTransfership
          ? state.deviceOwnerTransfership.dotDisableStatus
          : null,
      */
      dotEnableStatus: (state) =>
        state.deviceOwnerTransfership
          ? state.deviceOwnerTransfership.dotEnableStatus
          : null,
      cakInstallStatus: (state) =>
        state.deviceOwnerTransfership
          ? state.deviceOwnerTransfership.cakInstallStatus
          : null,
      cakLockStatus: (state) =>
        state.deviceOwnerTransfership
          ? state.deviceOwnerTransfership.cakLockStatus
          : null,
      cakTestStatus: (state) =>
        state.deviceOwnerTransfership
          ? state.deviceOwnerTransfership.cakTestStatus
          : null,
      cakSignTestStatus: (state) =>
        state.deviceOwnerTransfership
          ? state.deviceOwnerTransfership.cakSignTestStatus
          : null,
    }),
  },
  created() {
    if (!store.hasModule('deviceOwnerTransfership')) {
      // eslint-disable-next-line global-require
      const deviceOwnerTransfershipStore =
        require('@/store/modules/Settings/DeviceOwnerTransfershipStore').default;
      store.registerModule(
        'deviceOwnerTransfership',
        deviceOwnerTransfershipStore,
      );
    }
    this.moduleLoaded = true;
  },
  methods: {
    ...mapActions('deviceOwnerTransfership', [
      // 'step1_generateCAKUnlockToken',
      // 'step2_dotDisable',
      'step3_generateEnableToken',
      'step4_cakInstall',
      'step5_cakLock',
      'step6_cakTest',
      'step7_generateSignTestToken',
      'uploadDotToken',
      'resetSteps',
    ]),
    ...mapMutations({
      // setActiveStep: 'deviceOwnerTransfership/setActiveStep',
      // setCakUnlockStatus: 'deviceOwnerTransfership/setCakUnlockStatus',
      // setDotDisableStatus: 'deviceOwnerTransfership/setDotDisableStatus',
      // setDotEnableStatus: 'deviceOwnerTransfership/setDotEnableStatus',
      // setCakInstallStatus: 'deviceOwnerTransfership/setCakInstallStatus',
      // setCakLockStatus: 'deviceOwnerTransfership/setCakLockStatus',
      // setCakTestStatus: 'deviceOwnerTransfership/setCakTestStatus',
      // setCakSignTestStatus: 'deviceOwnerTransfership/setCakSignTestStatus',
    }),
    statusVariant(status) {
      if (status === 'Success') return 'success';
      if (status === 'Error') return 'danger';
      return 'secondary';
    },
    /*
    async handleStep1() {
      this.isLoading = true;
      try {
        await this.step1_generateCAKUnlockToken();
        this.setCakUnlockStatus('Success');
        this.setActiveStep(1);
      } catch (error) {
        if (error.attachment) {
          saveAs(error.attachment, 'CAKUnlockToken.bin');
          this.showFileUpload.step1 = true;
        } else {
          this.setCakUnlockStatus('Error');
        }
      } finally {
        this.isLoading = false;
      }
    },
    */
    async uploadSignedToken(step) {
      const currentFile = this.file[`step${step}`];
      if (!currentFile) return;
      this.isLoading = true;
      try {
        await this.uploadDotToken(currentFile);
        /*
        if (step === 1) {
          this.showFileUpload.step1 = false;
          this.setCakUnlockStatus('Success');
          this.setActiveStep(1);
        } else */ if (step === 3) {
          this.showFileUpload.step3 = false;
          this.$store.commit(
            'deviceOwnerTransfership/setDotEnableStatus',
            'Success',
          );
          this.$store.commit('deviceOwnerTransfership/setActiveStep', 3);
        } else if (step === 7) {
          this.showFileUpload.step7 = false;
          this.$store.commit(
            'deviceOwnerTransfership/setCakSignTestStatus',
            'Success',
          );
          this.$store.commit('deviceOwnerTransfership/setActiveStep', 7);
        }
      } catch (error) {
        // if (step === 1) this.setCakUnlockStatus('Error');
        if (step === 3)
          this.$store.commit(
            'deviceOwnerTransfership/setDotEnableStatus',
            'Error',
          );
        if (step === 7)
          this.$store.commit(
            'deviceOwnerTransfership/setCakSignTestStatus',
            'Error',
          );
      } finally {
        this.isLoading = false;
      }
    },
    /*
    async handleStep2() {
      if (!this.file.step2_lak) return;
      this.isLoading = true;
      try {
        await this.step2_dotDisable(this.file.step2_lak);
        this.successToast(
          this.$t('pageDeviceOwnerTransfership.toast.success.step2'),
        );
        this.setDotDisableStatus('Success');
        this.setActiveStep(2);
      } catch (error) {
        this.errorToast(
          this.$t('pageDeviceOwnerTransfership.toast.error.step2'),
        );
        this.setDotDisableStatus('Error');
      } finally {
        this.isLoading = false;
      }
    },
    */
    async handleStep3() {
      this.isLoading = true;
      try {
        await this.step3_generateEnableToken();
        // This is the success path for real API. The token has been downloaded inside pollTask.
        this.showFileUpload.step3 = true; // Show the upload component
        this.successToast(
          this.$t('pageDeviceOwnerTransfership.toast.success.step3'),
        );
      } catch (error) {
        if (error.attachment) {
          // This is the expected "success" path for MOCK token generation
          saveAs(error.attachment, '14_dot_token.bin');
          this.showFileUpload.step3 = true; // Show the upload component
          this.successToast(
            this.$t('pageDeviceOwnerTransfership.toast.success.step3'),
          );
        } else {
          // This is a true failure
          this.errorToast(
            this.$t('pageDeviceOwnerTransfership.toast.error.step3'),
          );
          this.$store.commit(
            'deviceOwnerTransfership/setDotEnableStatus',
            'Error',
          );
        }
      } finally {
        this.isLoading = false;
      }
    },
    async handleStep4() {
      if (!this.file.step4_lak) return;
      this.isLoading = true;
      try {
        await this.step4_cakInstall(this.file.step4_lak);
        this.successToast(
          this.$t('pageDeviceOwnerTransfership.toast.success.step4'),
        );
        this.$store.commit(
          'deviceOwnerTransfership/setCakInstallStatus',
          'Success',
        );
        this.$store.commit('deviceOwnerTransfership/setActiveStep', 4);
      } catch (error) {
        this.errorToast(
          this.$t('pageDeviceOwnerTransfership.toast.error.step4'),
        );
        this.$store.commit(
          'deviceOwnerTransfership/setCakInstallStatus',
          'Error',
        );
      } finally {
        this.isLoading = false;
      }
    },
    async handleStep5() {
      if (!this.file.step5_lak) return;
      this.isLoading = true;
      try {
        await this.step5_cakLock(this.file.step5_lak);
        this.successToast(
          this.$t('pageDeviceOwnerTransfership.toast.success.step5'),
        );
        this.$store.commit(
          'deviceOwnerTransfership/setCakLockStatus',
          'Success',
        );
        this.$store.commit('deviceOwnerTransfership/setActiveStep', 5);
      } catch (error) {
        this.errorToast(
          this.$t('pageDeviceOwnerTransfership.toast.error.step5'),
        );
        this.$store.commit('deviceOwnerTransfership/setCakLockStatus', 'Error');
      } finally {
        this.isLoading = false;
      }
    },
    async handleStep6() {
      this.isLoading = true;
      try {
        await this.step6_cakTest();
        this.successToast(
          this.$t('pageDeviceOwnerTransfership.toast.success.step6'),
        );
        this.$store.commit(
          'deviceOwnerTransfership/setCakTestStatus',
          'Success',
        );
        this.$store.commit('deviceOwnerTransfership/setActiveStep', 6);
      } catch (error) {
        this.errorToast(
          this.$t('pageDeviceOwnerTransfership.toast.error.step6'),
        );
        this.$store.commit('deviceOwnerTransfership/setCakTestStatus', 'Error');
      } finally {
        this.isLoading = false;
      }
    },
    async handleStep7() {
      this.isLoading = true;
      try {
        await this.step7_generateSignTestToken();
        // This is the success path for real API. The token has been downloaded inside pollTask.
        this.showFileUpload.step7 = true;
        this.successToast(
          this.$t('pageDeviceOwnerTransfership.toast.success.step7'),
        );
      } catch (error) {
        if (error.attachment) {
          // This is the expected "success" path for MOCK token generation
          saveAs(error.attachment, 'SignTestToken.bin');
          this.showFileUpload.step7 = true;
          this.successToast(
            this.$t('pageDeviceOwnerTransfership.toast.success.step7'),
          );
        } else {
          // This is a true failure
          this.errorToast(
            this.$t('pageDeviceOwnerTransfership.toast.error.step7'),
          );
          this.$store.commit(
            'deviceOwnerTransfership/setCakSignTestStatus',
            'Error',
          );
        }
      } finally {
        this.isLoading = false;
      }
    },
    reset() {
      this.resetSteps();
      this.file = {
        // step1: null,
        // step2_lak: null,
        step3: null,
        step4_lak: null,
        step5_lak: null,
        step7: null,
      };
      this.showFileUpload = {
        // step1: false,
        step3: false,
        step7: false,
      };
    },
  },
};
</script>
