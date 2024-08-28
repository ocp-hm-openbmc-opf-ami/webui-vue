<template>
  <div>
    <div v-if="firmwareOverlay">
      <b-overlay :show="true" opacity="0.6" no-wrap fixed class="full-overlay">
        <template #overlay>
          <div></div>
        </template>
      </b-overlay>
    </div>
    <div class="form-background p-3">
      <b-form @submit.prevent="onSubmitUpload">
        <b-row v-if="bmcBackupEnabledStatus" class="choose-images">
          <b-col sm="3">
            <b-form-checkbox
              v-model="activeImage"
              value="bmc_active"
              :disabled="activeImageDisabled"
              @change="changeActiveImage"
            >
              {{ $t('pageFirmware.form.updateFirmware.activeImage') }}
            </b-form-checkbox>
          </b-col>
          <b-col sm="4">
            <b-form-checkbox
              v-model="backupImage"
              value="bmc_bkup"
              :disabled="activeImageDisabled"
              @change="changeBackupImage"
            >
              {{ $t('pageFirmware.form.updateFirmware.backupImage') }}
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-form-group
          v-if="isTftpUploadAvailable"
          :label="$t('pageFirmware.form.updateFirmware.fileSource')"
          :disabled="isPageDisabled"
        >
          <b-form-radio v-model="isWorkstationSelected" :value="true">
            {{ $t('pageFirmware.form.updateFirmware.workstation') }}
          </b-form-radio>
          <b-form-radio v-model="isWorkstationSelected" :value="false">
            {{ $t('pageFirmware.form.updateFirmware.tftpServer') }}
          </b-form-radio>
        </b-form-group>

        <!-- Workstation Upload -->
        <template v-if="isWorkstationSelected">
          <b-form-group
            :label="$t('pageFirmware.form.updateFirmware.imageFile')"
            label-for="image-file"
          >
            <form-file
              id="image-file"
              :disabled="isPageDisabled"
              :state="getValidationState($v.file)"
              aria-describedby="image-file-help-block"
              @input="onFileUpload($event)"
            >
              <template #invalid>
                <b-form-invalid-feedback role="alert">
                  {{ $t('global.form.required') }}
                </b-form-invalid-feedback>
              </template>
            </form-file>
          </b-form-group>
        </template>

        <!-- TFTP Server Upload -->
        <template v-else>
          <b-form-group
            :label="$t('pageFirmware.form.updateFirmware.fileAddress')"
            label-for="tftp-address"
          >
            <b-form-input
              id="tftp-address"
              v-model="tftpFileAddress"
              type="text"
              :state="getValidationState($v.tftpFileAddress)"
              :disabled="isPageDisabled"
              @input="$v.tftpFileAddress.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              {{ $t('global.form.fieldRequired') }}
            </b-form-invalid-feedback>
          </b-form-group>
        </template>
        <b-btn
          data-test-id="firmware-button-startUpdate"
          type="submit"
          variant="primary"
          :disabled="isPageDisabled"
        >
          {{ $t('pageFirmware.form.updateFirmware.startUpdate') }}
        </b-btn>
      </b-form>
    </div>

    <!-- Modals -->
    <modal-update-firmware @ok="updateFirmware" />
    <div v-if="isProgress">
      <b-progress :max="progressMax" show-progress animated>
        <b-progress-bar
          :value="progressValue"
          :label="`${progressValue}%`"
        ></b-progress-bar>
      </b-progress>
    </div>
  </div>
</template>

<script>
import { requiredIf } from 'vuelidate/lib/validators';

import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import UtcDateTimeMixin from '@/components/Mixins/UtcDateTimeMixin';
import i18n from '@/i18n';
import FormFile from '@/components/Global/FormFile';
import ModalUpdateFirmware from './FirmwareModalUpdateFirmware';

export default {
  components: { FormFile, ModalUpdateFirmware },
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin, UtcDateTimeMixin],
  props: {
    isPageDisabled: {
      required: true,
      type: Boolean,
      default: false,
    },
    isServerOff: {
      required: true,
      type: Boolean,
    },
    isValidationStatus: {
      type: Boolean,
      default: false,
    },
    applyTimeFormValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      bmcActiveBackupSelected: [],
      bmcActiveEnabledStatusValue: '',
      activeImage: false,
      backupImage: false,
      activeImageDisabled: false,
      loading,
      isWorkstationSelected: true,
      file: null,
      tftpFileAddress: null,
      isServerPowerOffRequired:
        process.env.VUE_APP_SERVER_OFF_REQUIRED === 'true',
      progressValue: 0,
      progressMax: 100,
      isProgress: false,
      firmwareOverlay: false,
      modalReset: 0,
      updateServiceData: {},
      activeBackupValue: {},
    };
  },
  computed: {
    isTftpUploadAvailable() {
      return this.$store.getters['firmware/isTftpUploadAvailable'];
    },
    bmcBackupEnabledStatus() {
      return this.$store.getters['firmware/bmcBackupEnabledStatus'];
    },
    httpPushUriTargetsBusyStatus() {
      return this.$store.getters['firmware/httpBusyStatus'];
    },
    firmwareDateTime() {
      return this.$store.getters['firmware/getFirmwareBmcDateTime'];
    },
  },
  watch: {
    isWorkstationSelected: function () {
      this.$v.$reset();
      this.file = null;
      this.tftpFileAddress = null;
    },
  },
  validations() {
    return {
      file: {
        required: requiredIf(function () {
          return this.isWorkstationSelected;
        }),
      },
      tftpFileAddress: {
        required: requiredIf(function () {
          return !this.isWorkstationSelected;
        }),
      },
    };
  },
  created() {
    this.updateFirmwareInit();
  },
  methods: {
    updateFirmwareInit() {
      this.$store.dispatch('firmware/getUpdateServiceSettings').then(() => {
        this.bmcActiveEnabledStatusValue =
          this.$store.getters['firmware/bmcActiveEnabledStatus'];
        if (!this.bmcActiveEnabledStatusValue) {
          this.activeImage = 'bmc_active';
        }
        if (this.bmcBackupEnabledStatus) {
          if (this.httpPushUriTargetsBusyStatus) {
            let PushUriTargetsValue =
              this.$store.getters['firmware/httpPushUriTargetsValue'];
            PushUriTargetsValue?.forEach((val) => {
              if (val == 'bmc_active') {
                this.activeImage = 'bmc_active';
              }
              if (val == 'bmc_bkup') {
                this.backupImage = 'bmc_bkup';
              }
            });
            if (
              this.bmcBackupEnabledStatus &&
              this.httpPushUriTargetsBusyStatus
            ) {
              this.activeImageDisabled = true;
            }
          }
        }
        this.$emit(
          'onGetApplyTimeSetValue',
          this.$store.getters['firmware/getApplyTimeSetValue'],
        );
      });
    },
    updateFirmware() {
      this.startLoader();
      this.bmcActiveBackupSelected = [];
      this.updateServiceData = {};
      if (this.activeImage) {
        this.bmcActiveBackupSelected.push('bmc_active');
      }
      if (this.backupImage) {
        this.bmcActiveBackupSelected.push('bmc_bkup');
      }
      if (this.bmcBackupEnabledStatus && !this.httpPushUriTargetsBusyStatus) {
        this.updateServiceData.HttpPushUriTargets =
          this.bmcActiveBackupSelected;
        this.updateServiceData.HttpPushUriTargetsBusy = true;
      }
      var enddateval =
        this.applyTimeFormValue.endDate != '' &&
        this.applyTimeFormValue.endTime != ''
          ? this.getUtcDate(
              this.applyTimeFormValue.endDate,
              this.applyTimeFormValue.endTime,
              true, // include secounds in the value
            )
          : '';
      this.updateServiceData.HttpPushUriOptions = {
        HttpPushUriApplyTime: {
          ApplyTime: this.applyTimeFormValue.applyTimeMode,
          MaintenanceWindowDurationInSeconds: parseInt(
            this.applyTimeFormValue.timeSlot,
          ),
          MaintenanceWindowStartTime:
            enddateval != ''
              ? enddateval.toISOString().substring(0, 19) +
                this.firmwareDateTime?.slice(19)
              : '',
        },
      };
      this.$store
        .dispatch('firmware/setFirmwarUpdateActive', this.updateServiceData)
        .then(() => {
          this.infoToast(this.$t('pageFirmware.toast.updateStartedMessage'), {
            title: this.$t('pageFirmware.toast.updateStarted'),
            timestamp: true,
          });
          if (this.isWorkstationSelected) {
            this.dispatchWorkstationUpload();
          } else {
            this.dispatchTftpUpload();
          }
        })
        .catch(({ message }) => {
          this.updateFirmwareInit();
          this.endLoader();
          this.errorToast(message);
        });
    },
    dispatchWorkstationUpload() {
      this.$store
        .dispatch('firmware/uploadFirmware', this.file)
        .then((response) => {
          if (this.applyTimeFormValue.applyTimeMode !== 'Immediate') {
            let applyTimeFirmwareninfo = '';
            if (this.applyTimeFormValue.applyTimeMode == 'OnReset') {
              applyTimeFirmwareninfo = this.$tc(
                'pageFirmware.form.updateFirmware.onResetinfo',
              );
            } else if (
              this.applyTimeFormValue.applyTimeMode ==
              'AtMaintenanceWindowStart'
            ) {
              applyTimeFirmwareninfo = this.$tc(
                'pageFirmware.form.updateFirmware.atMaintenanceWindowStartinfo',
              );
            } else if (
              this.applyTimeFormValue.applyTimeMode ==
              'InMaintenanceWindowOnReset'
            ) {
              applyTimeFirmwareninfo = this.$tc(
                'pageFirmware.form.updateFirmware.inMaintenanceWindowOnResetinfo',
              );
            }
            this.$bvModal.msgBoxOk(applyTimeFirmwareninfo, {
              title: this.$tc('global.action.success'),
            });
            this.updateFirmwareInit();
            this.endLoader();
          } else {
            this.checkStatus(response.data['@odata.id']);
          }
        })
        .catch(({ message }) => {
          this.updateFirmwareInit();
          this.endLoader();
          this.errorToast(message);
        });
    },
    dispatchTftpUpload() {
      this.$store
        .dispatch('firmware/uploadFirmwareTFTP', this.tftpFileAddress)
        .catch(({ message }) => {
          this.updateFirmwareInit();
          this.endLoader();
          this.errorToast(message);
        });
    },
    checkStatus(data) {
      var interval = setInterval(() => {
        this.$store.dispatch('firmware/checkStatus', data).then((response) => {
          this.isProgress = true;
          this.progressValue = response.PercentComplete;
          if (response.TaskState != 'New') {
            clearInterval(interval);
            this.endLoader();
            if (response.TaskState == 'Completed') {
              this.modalReset++;
              if (this.modalReset == 1)
                this.$bvModal
                  .msgBoxOk(
                    this.$tc('pageFirmware.modal.firmwareResetCalled'),
                    {
                      title: this.$tc('global.action.success'),
                    },
                  )
                  .then((confirmed) => {
                    if (confirmed) {
                      this.firmwareOverlay = true;
                    }
                  });
            } else {
              this.isProgress = false;
              this.errorToast(i18n.t('pageFirmware.toast.errorUpdateFirmware'));
            }
          }
        });
      }, 300);
    },
    onSubmitUpload() {
      this.minValidationStatus();
      this.$v.$touch();
      if (this.$v.$invalid || this.isValidationStatus) return;
    },
    onFileUpload(file) {
      this.file = file;
      this.$v.file.$touch();
    },
    changeActiveImage(val) {
      if (val == false) {
        this.backupImage = 'bmc_bkup';
      }
    },
    changeBackupImage(val) {
      if (val == false) {
        this.activeImage = 'bmc_active';
      }
    },
    minValidationStatus() {
      this.$store.dispatch('firmware/getActiveBmcFirmware').then(() => {
        let timeValueBmc = this.firmwareDateTime;
        this.$emit('onSubmitUploadOk', timeValueBmc);
        if (
          (this.applyTimeFormValue.applyTimeMode ==
            'AtMaintenanceWindowStart' ||
            this.applyTimeFormValue.applyTimeMode ==
              'InMaintenanceWindowOnReset') &&
          this.firmwareDateTime?.slice(0, 10) ===
            this.applyTimeFormValue.endDate &&
          timeValueBmc?.slice(11, 19) >= this.applyTimeFormValue.endTime
        ) {
          return;
        } else {
          this.$v.$touch();
          if (this.$v.$invalid || this.isValidationStatus) return;
          this.$bvModal.show('modal-update-firmware');
        }
      });
    },
  },
};
</script>
<style>
.choose-images {
  padding-top: 15px;
  padding-bottom: 25px;
}
.inline-alignment {
  display: inline-flex;
}
</style>
