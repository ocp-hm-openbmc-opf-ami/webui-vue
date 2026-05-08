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
        <b-row class="choose-images">
          <b-col v-if="activeFeatureEnabledStatus && !isMultiPartStatus" sm="3">
            <b-form-checkbox
              v-model="activeImage"
              value="fw_active"
              :disabled="activeImageDisabled || targetSelectedBmcDisabled"
              data-test-id="firmware-input-activeImage"
              @change="changeActiveImage"
            >
              {{ $t('pageFirmware.form.updateFirmware.activeImage') }}
            </b-form-checkbox>
          </b-col>
          <b-col v-if="bmcBackupEnabledStatus && !isMultiPartStatus" sm="4">
            <b-form-checkbox
              v-model="backupImage"
              value="bmc_bkup"
              :disabled="activeImageDisabled || targetSelectedBmcDisabled"
              data-test-id="firmware-input-backupImage"
              @change="changeBackupImage"
            >
              {{ $t('pageFirmware.form.updateFirmware.backupImage') }}
            </b-form-checkbox>
          </b-col>
          <b-col
            v-if="isPFREnable && recoveryEnabledStatus && !isMultiPartStatus"
            sm="4"
          >
            <b-form-checkbox
              v-model="recoveryImage"
              value="fw_recovery"
              :disabled="activeImageDisabled || targetSelectedBmcDisabled"
              data-test-id="firmware-input-recoveryImage"
              @change="changeRecoveryImage"
            >
              {{ $t('pageFirmware.form.updateFirmware.recoveryImage') }}
            </b-form-checkbox>
          </b-col>
          <b-col
            v-if="
              (targetSelectedOptions.length > 0 && !isMultiPartStatus) ||
              (isMultiPartStatus && multipartTargetOptions.length > 0)
            "
            sm="5"
          >
            <b-form-group
              :label="$t('pageFirmware.form.updateFirmware.imageTarget')"
              class="m0"
            >
              <b-form-select
                v-model="targetSelected"
                :options="
                  isMultiPartStatus
                    ? multipartTargetOptions
                    : targetSelectedOptions
                "
                :disabled="activeImageDisabled"
                @change="setTargetSelected(targetSelected)"
                ><template v-if="!isMultiPartStatus" #first>
                  <b-form-select-option :value="valuedefault">
                    {{ $t('pageFirmware.form.updateFirmware.bmcAndBios') }}
                  </b-form-select-option>
                </template></b-form-select
              >
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group
          v-if="isTftpUploadAvailable"
          :label="$t('pageFirmware.form.updateFirmware.fileSource')"
          :disabled="isPageDisabled"
        >
          <b-form-radio
            v-model="isWorkstationSelected"
            :value="true"
            data-test-id="firmware-input-workstation"
          >
            {{ $t('pageFirmware.form.updateFirmware.workstation') }}
          </b-form-radio>
          <b-form-radio
            v-model="isWorkstationSelected"
            :value="false"
            data-test-id="firmware-input-tftpServer"
          >
            {{ $t('pageFirmware.form.updateFirmware.tftpServer') }}
          </b-form-radio>
        </b-form-group>

        <!-- Workstation Upload -->
        <div v-if="isWorkstationSelected" class="workstation-upload-container">
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
        </div>

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
              data-test-id="firmware-input-tftpFileAddress"
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
          <icon-update />
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
import IconUpdate from '@carbon/icons-vue/es/update-now/20';
import { untar } from 'untar.js';
import { ungzip } from 'pako';
const moment = require('moment-timezone');

export default {
  components: { FormFile, ModalUpdateFirmware, IconUpdate },
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
    isMultiPartStatus: {
      type: Boolean,
      default: false,
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
      recoveryImage: false,
      PFR_IMG_SIZE: 33 * 1024 * 1024, // PFR BMC/BIOS Image Size 33MB
      NON_PFR_BIOS_IMG_SIZE: 21 * 1024 * 1024, // Non-PFR BIOS Image Size 21MB
      PFR_BMC_MAGIC_CODE: '19FDEAB6', //BMC Magic number
      capsuleCodeStart: 17,
      bmcBiosFileUpload: 'bmc',
      bmcErrorActiveBackupSelected: [],
      multiPartfile: null,
      jsonContent: null,
      multipartapplyTimeFormValue: '',
      targetSelected: '',
      targetSelectedOptions: [],
      multipartTargetOptions: [],
      valuedefault: '',
      targetSelectedBmcDisabled: false,
      defaultTargetDisabled: [],
      targetSelectedClone: '',
      isPFREnable:
        process.env.VUE_APP_ONETREE_INTEL_PFR_ENABLED === 'true' ? true : false,
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
    activeFeatureEnabledStatus() {
      return this.$store.getters['firmware/getActiveFeatureEnabledStatus'];
    },
    httpPushUriOptions() {
      return this.$store.getters['firmware/httpPushUriOptions'];
    },
    recoveryEnabledStatus() {
      return this.$store.getters['firmware/getBmcRecoveryEnabledStatus'];
    },
    inventryDetailsValues() {
      return this.$store.getters['firmware/getInventryFirmwareData'];
    },
    bmcTimeZone() {
      return this.$store.getters['global/timeZone'];
    },
  },
  watch: {
    isWorkstationSelected: function () {
      this.$v.$reset();
      this.file = null;
      this.multiPartfile = null;
      this.tftpFileAddress = null;
    },
    // Handle multipart status and auto-generate JSON
    isMultiPartStatus(newVal) {
      if (newVal) {
        // When multipart is enabled, ensure image target is enabled unless busy
        this.activeImageDisabled = this.httpPushUriTargetsBusyStatus
          ? true
          : false;
        this.$nextTick(() => {
          if (
            this.targetSelected === '' &&
            this.multipartTargetOptions.length > 0
          ) {
            this.targetSelected = this.multipartTargetOptions[0].value;
          }
          this.generateMultipartJson();
        });
      } else {
        // When multipart is disabled, reset to default state
        this.targetSelected = this.targetSelectedClone;
        this.setTargetSelected(this.targetSelectedClone);
        this.multiPartfile = null;
        this.jsonContent = null;
        this.$emit('multiplePartJsonContent', {});
      }
    },
    // Watch for target selection changes in multipart mode
    targetSelected() {
      if (this.isMultiPartStatus) {
        this.$nextTick(() => this.generateMultipartJson());
      }
    },
    applyTimeFormValue: {
      handler() {
        if (this.isMultiPartStatus) {
          this.$nextTick(() => this.generateMultipartJson());
        }
      },
      deep: true,
    },
  },
  validations() {
    return {
      file: {
        required: requiredIf(function () {
          return this.isWorkstationSelected;
        }),
      },
      multiPartfile: {
        required: requiredIf(function () {
          return this.isWorkstationSelected && this.isMultiPartStatus;
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
    getTimezoneOffset() {
      // Get timezone offset based on BMC's TimeZoneName
      return moment().tz(this.bmcTimeZone).format('Z');
    },
    updateFirmwareInit() {
      this.$store.dispatch('firmware/getUpdateServiceSettings').then(() => {
        this.targetSelectedOptions = [];
        this.multipartTargetOptions = [];
        this.inventryDetailsValues.forEach((val) => {
          let options = {
            text: val.toUpperCase().replace(/_/g, ' '),
            value: val,
          };
          if (
            !val.includes('bmc_active') &&
            !val.includes('bmc_recovery') &&
            !val.includes('bios_active') &&
            !val.includes('bios_recovery') &&
            !val.includes('bmc_bkup')
          ) {
            this.targetSelectedOptions.push(options);
          }
          this.multipartTargetOptions.push(options);
        });
        // Set default target for multipart mode
        if (
          this.isMultiPartStatus &&
          this.multipartTargetOptions.length > 0 &&
          !this.targetSelected
        ) {
          this.targetSelected = this.multipartTargetOptions[0].value;
        }

        // Check if exactly one feature is enabled.
        this.defaultTargetDisabled = [
          this.activeFeatureEnabledStatus,
          this.bmcBackupEnabledStatus,
          this.recoveryEnabledStatus,
        ].filter(Boolean).length;
        this.targetSelectedBmcDisabled =
          this.defaultTargetDisabled > 1 ? false : true;
        this.bmcActiveEnabledStatusValue =
          this.$store.getters['firmware/bmcActiveEnabledStatus'];
        // For Active and Backup Feature Enable
        if (
          //bind the bmc_active as default when the HttpPushUriTargets is empty
          !this.bmcActiveEnabledStatusValue &&
          this.activeFeatureEnabledStatus
        ) {
          this.activeImage = 'fw_active';
        }
        // For Backup Feature Enable for single case
        if (
          !this.activeFeatureEnabledStatus &&
          this.bmcBackupEnabledStatus &&
          !this.recoveryEnabledStatus &&
          this.targetSelectedOptions.length <= 0
        ) {
          this.backupImage = 'bmc_bkup';
          this.activeImageDisabled = true;
        }
        // For Active Feature Enable for single case
        if (
          this.activeFeatureEnabledStatus &&
          !this.bmcBackupEnabledStatus &&
          !this.recoveryEnabledStatus &&
          this.targetSelectedOptions.length <= 0
        ) {
          this.activeImage = 'fw_active';
          this.activeImageDisabled = true;
        }
        // For Recovery Feature Enable for single case
        if (
          !this.activeFeatureEnabledStatus &&
          !this.bmcBackupEnabledStatus &&
          this.recoveryEnabledStatus &&
          this.targetSelectedOptions.length <= 0
        ) {
          this.recoveryImage = 'fw_recovery';
          this.activeImageDisabled = true;
        }
        if (this.httpPushUriTargetsBusyStatus) {
          let PushUriTargetsValue =
            this.$store.getters['firmware/httpPushUriTargetsValue'];
          PushUriTargetsValue?.forEach((val) => {
            if (val == 'bmc_active' || val == 'bios_active') {
              this.activeImage = 'fw_active';
            }
            if (val == 'bmc_bkup') {
              this.backupImage = 'bmc_bkup';
            }
            if (val == 'bmc_recovery' || val == 'bios_recovery') {
              this.recoveryImage = 'fw_recovery';
            }
            if (
              !val.includes('bmc_active') &&
              !val.includes('bmc_recovery') &&
              !val.includes('bios_active') &&
              !val.includes('bios_recovery') &&
              !val.includes('bmc_bkup')
            ) {
              this.targetSelected = val;
              this.targetSelectedClone = val;
            }
          });
          if (this.httpPushUriTargetsBusyStatus) {
            this.activeImageDisabled = true;
          }
        }
        this.$emit(
          'onGetApplyTimeSetValue',
          this.$store.getters['firmware/getApplyTimeSetValue'],
        );
      });
    },
    generateMultipartJson() {
      if (!this.isMultiPartStatus) {
        return;
      }
      const targets = [];
      // For multipart, use the selected target directly from inventory
      if (this.targetSelected) {
        // Use the target directly as it comes from the API - no manual mapping needed
        const targetUri = `/redfish/v1/UpdateService/FirmwareInventory/${this.targetSelected}`;
        targets.push(targetUri);
      }
      const applyTime = this.applyTimeFormValue?.applyTimeMode;
      if (targets.length > 0) {
        const jsonContent = {
          Targets: targets,
          '@Redfish.OperationApplyTime': applyTime,
        };
        // Create JSON file
        const jsonString = JSON.stringify(jsonContent);
        this.multiPartfile = new File([jsonString], 'parameters.json', {
          type: 'application/json',
        });
        this.jsonContent = jsonContent;
        this.multipartapplyTimeFormValue = applyTime;
        this.$emit('multiplePartJsonContent', jsonContent);
      } else {
        this.multiPartfile = null;
        this.jsonContent = null;
        this.$emit('multiplePartJsonContent', {});
      }
    },
    updateFirmware() {
      this.startLoader();
      const fileTypeExtension = this.file.name.split('.').pop();
      if (
        !this.isMultiPartStatus &&
        this.isPFREnable &&
        fileTypeExtension == 'bin' &&
        this.file.size <= this.PFR_IMG_SIZE &&
        this.targetSelected === '' //checking the  PFR feature file type with the bmc/bios file size
      ) {
        //checking the file type to call the capsule code
        this.checkCapsuleCode().then(() => {
          this.updateFirmwareImage();
        });
      } else {
        if (
          !this.isMultiPartStatus &&
          (this.file.name.endsWith('.gz') || this.file.name.endsWith('.tgz'))
        ) {
          this.tarfileChecking().then(() => {
            this.updateFirmwareImage();
          });
        } else {
          this.bmcBiosFileUpload =
            fileTypeExtension == 'bin' &&
            this.file.size <= this.NON_PFR_BIOS_IMG_SIZE
              ? 'bios'
              : 'bmc'; //checking the non PFR file type with the bmc/bios file size
          this.updateFirmwareImage();
        }
      }
    },
    updateFirmwareImage() {
      this.bmcActiveBackupSelected = [];
      this.updateServiceData = {};
      if (!this.isMultiPartStatus) {
        if (this.targetSelected === '') {
          if (this.activeImage) {
            this.bmcActiveBackupSelected.push(
              this.bmcBiosFileUpload + '_active',
            );
          }
          if (this.recoveryImage) {
            this.bmcActiveBackupSelected.push(
              this.bmcBiosFileUpload + '_recovery',
            );
          }
          if (this.backupImage) {
            this.bmcActiveBackupSelected.push('bmc_bkup');
          }
        } else {
          this.bmcActiveBackupSelected.push(this.targetSelected);
        }
        if (!this.httpPushUriTargetsBusyStatus) {
          this.updateServiceData.HttpPushUriTargets =
            this.bmcActiveBackupSelected;
          this.updateServiceData.HttpPushUriTargetsBusy = true;
        }
        if (this.httpPushUriOptions !== undefined) {
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
                    this.getTimezoneOffset()
                  : '',
            },
          };
        }
        if (Object.keys(this.updateServiceData).length != 0) {
          this.$store
            .dispatch('firmware/setFirmwarUpdateActive', this.updateServiceData)
            .then(() => {
              this.infoToast(
                this.$t('pageFirmware.toast.updateStartedMessage'),
                {
                  title: this.$t('pageFirmware.toast.updateStarted'),
                  timestamp: true,
                },
              );
              if (this.isWorkstationSelected) {
                this.dispatchWorkstationUpload();
              } else {
                this.dispatchTftpUpload();
              }
            })
            .catch(({ message }) => {
              this.endLoader();
              let errorMessage = message;
              let targetFailValue = [];
              if (message.includes('HttpPushUriTargets are Invalid')) {
                this.bmcErrorActiveBackupSelected =
                  this.$store.getters['firmware/getInventryFirmwareData'];
                for (var i = 0; i < this.bmcActiveBackupSelected.length; i++) {
                  if (
                    this.bmcActiveBackupSelected[i] !==
                    this.bmcErrorActiveBackupSelected[i]
                  ) {
                    var parts = this.bmcActiveBackupSelected[i].split('_'); // ["bmc", "active"]
                    for (var j = 0; j < parts.length; j++) {
                      parts[j] =
                        parts[j].charAt(0).toUpperCase() + parts[j].slice(1);
                    }
                    targetFailValue.push(parts.join(' '));
                  }
                }
                errorMessage = this.$t(
                  'pageFirmware.toast.errorHttpPushUriTargetsmsg',
                  {
                    bmcTarget: targetFailValue,
                  },
                );
              }
              this.errorToast(errorMessage);
            });
        }
      } else {
        this.infoToast(this.$t('pageFirmware.toast.updateStartedMessage'), {
          title: this.$t('pageFirmware.toast.updateStarted'),
          timestamp: true,
        });
        if (this.isWorkstationSelected) {
          this.dispatchWorkstationUpload();
        } else {
          this.dispatchTftpUpload();
        }
      }
    },
    dispatchWorkstationUpload() {
      if (this.isMultiPartStatus) {
        // Generate JSON for multipart before upload
        this.generateMultipartJson();
      }
      const image = this.isMultiPartStatus
        ? { UpdateFile: this.file, UpdateParameters: this.multiPartfile }
        : this.file;

      const multiPartValue = this.isMultiPartStatus;
      this.$store
        .dispatch('firmware/uploadFirmware', { image, multiPartValue })
        .then((response) => {
          let multipartapplyTimeFormValueInfo = this.isMultiPartStatus
            ? this.multipartapplyTimeFormValue
            : this.applyTimeFormValue.applyTimeMode;
          if (
            this.httpPushUriOptions !== undefined &&
            multipartapplyTimeFormValueInfo !== 'Immediate'
          ) {
            let applyTimeFirmwareninfo = '';
            if (multipartapplyTimeFormValueInfo == 'OnReset') {
              if (this.isPFREnable) {
                applyTimeFirmwareninfo = this.$tc(
                  'pageFirmware.toast.successFirmwarePfrOnreset',
                );
              } else {
                applyTimeFirmwareninfo = this.$tc(
                  'pageFirmware.form.updateFirmware.onResetinfo',
                );
              }
            } else if (
              multipartapplyTimeFormValueInfo == 'AtMaintenanceWindowStart'
            ) {
              applyTimeFirmwareninfo = this.$tc(
                'pageFirmware.form.updateFirmware.atMaintenanceWindowStartinfo',
              );
            } else if (
              multipartapplyTimeFormValueInfo == 'InMaintenanceWindowOnReset'
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
          const imageName = this.$store.getters['firmware/getImageName'];
          this.isProgress = true;
          this.progressValue = response.PercentComplete;
          if (response.TaskState != 'New') {
            clearInterval(interval);
            this.endLoader();
            if (response.TaskState == 'Completed') {
              if (imageName === 'BMC') {
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
                if (this.isPFREnable) {
                  if (this.applyTimeFormValue.applyTimeMode == 'Immediate') {
                    this.successToast(
                      i18n.t('pageFirmware.toast.successFirmwarePfrImmediate'),
                    );
                  }
                } else {
                  this.successToast(
                    i18n.t('pageFirmware.toast.successUpdateFirmware'),
                  );
                }
              }
            } else {
              this.isProgress = false;
              this.errorToast(i18n.t('pageFirmware.toast.errorUpdateFirmware'));
            }
          }
        });
      }, 300);
    },
    onSubmitUpload() {
      if (this.isMultiPartStatus) {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        this.$bvModal.show('modal-update-firmware');
      } else if (this.httpPushUriOptions == undefined) {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        this.$bvModal.show('modal-update-firmware');
      } else {
        this.minValidationStatus();
        this.$v.$touch();
        if (this.$v.$invalid || this.isValidationStatus) return;
      }
    },
    onFileUpload(file) {
      this.file = file;
      this.$v.file.$touch();
    },
    changeActiveImage(val) {
      if (val == false && this.bmcBackupEnabledStatus) {
        this.backupImage = 'bmc_bkup';
      } else if (
        val == false &&
        this.isPFREnable &&
        this.recoveryEnabledStatus
      ) {
        this.recoveryImage = 'fw_recovery';
      }
      if (
        val == 'fw_active' &&
        this.isPFREnable &&
        this.recoveryEnabledStatus
      ) {
        this.recoveryImage = false;
      }
      if (val == 'fw_active') {
        this.targetSelected = '';
      }
    },
    changeBackupImage(val) {
      if (val == false) {
        this.activeImage = 'fw_active';
      } else {
        this.targetSelected = '';
      }
    },
    changeRecoveryImage(val) {
      if (val == false) {
        this.activeImage = 'fw_active';
      } else {
        this.activeImage = false;
        this.targetSelected = '';
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
    async checkCapsuleCode() {
      return new Promise((resolve) => {
        const reader = new FileReader();
        var that = this;
        var capsuleCode = '';
        var blob = this.file.slice();
        reader.readAsArrayBuffer(blob);
        reader.onloadend = (evt) => {
          if (evt.target.readyState == FileReader.DONE) {
            // DONE == 2

            var result = that.base64ToHex(
              that.arrayBufferToBase64(evt.target.result),
            );
            // Check if the file is a valid PFR BMC firmware image
            if (result.indexOf(that.PFR_BMC_MAGIC_CODE.toLowerCase()) == -1) {
              return;
            }
            capsuleCode = parseInt(
              result.substring(
                that.capsuleCodeStart,
                that.capsuleCodeStart + 1,
              ),
            );
            if (capsuleCode == 4) {
              /* BMC Cap or BMC PFM */
              this.bmcBiosFileUpload = 'bmc';
            } else if (capsuleCode == 2) {
              /* BIOS capsule or BIOS PFM */
              this.bmcBiosFileUpload = 'bios';
            }
            resolve();
          }
        };
      });
    },
    async tarfileChecking() {
      const file = this.file;
      if (!file) return;
      try {
        const arrayBuffer = await file.arrayBuffer();
        let tarBuffer = arrayBuffer;

        // If file ends with .gz or .tgz, decompress first
        if (file.name.endsWith('.gz') || file.name.endsWith('.tgz')) {
          tarBuffer = ungzip(new Uint8Array(arrayBuffer)).buffer;
        }

        const tarEntries = await untar(tarBuffer);
        const filenames = tarEntries.map((entry) => entry.name);
        if (filenames.includes('image-bios')) {
          this.bmcBiosFileUpload = 'bios';
        } else {
          this.bmcBiosFileUpload = 'bmc';
        }
        return;
      } catch (e) {
        console.error(e);
      }
    },
    setTargetSelected(selectedOptions) {
      if (selectedOptions && selectedOptions != '') {
        this.activeImage = false;
        this.backupImage = false;
        this.recoveryImage = false;
        this.targetSelectedBmcDisabled = true;
        this.bmcActiveBackupSelected.push(selectedOptions);
      } else {
        this.activeImage = 'fw_active';
        this.targetSelectedBmcDisabled =
          this.defaultTargetDisabled > 1 ? false : true;
      }
    },
  },
};
</script>
<style>
.choose-images {
  padding-top: 15px;
  padding-bottom: 25px;
}

.workstation-upload-container {
  width: 100%;
}

.upload-files-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
}

.single-file-container {
  width: 100%;
}

.multipart-file-group {
  flex: 1;
  min-width: 0;
  margin-bottom: 0;
}

.image-file-group {
  flex: 1;
  min-width: 0;
  margin-bottom: 0;
}

.upload-files-row .multipart-file-group,
.upload-files-row .image-file-group {
  width: calc(50% - 0.5rem);
}

.single-file-container .image-file-group {
  width: 100%;
}

/* Ensure form groups don't have conflicting margins */
.upload-files-row .form-group {
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .upload-files-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .upload-files-row .multipart-file-group,
  .upload-files-row .image-file-group {
    width: 100%;
  }
}
.m0 {
  margin: 0 !important;
}
</style>
