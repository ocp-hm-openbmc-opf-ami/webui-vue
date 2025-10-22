<template>
  <div>
    <page-section>
      <b-row>
        <b-col xl="6">
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="$t('advancedLogSettings.remotelogserver')"
                label-for="remotelogserver"
              >
                <b-form-input
                  id="remotelogserver"
                  v-model="remoteLog.remotelogserver"
                  :state="getValidationState($v.remoteLog.remotelogserver)"
                  type="text"
                  :disabled="isButtonDisable"
                  data-test-id="advancedLogSettings-remotelogserver"
                  @input="$v.remoteLog.remotelogserver.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.remoteLog.remotelogserver.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.remoteLog.remotelogserver.required &&
                      !$v.remoteLog.remotelogserver.pattern
                    "
                  >
                    {{ $t('advancedLogSettings.invalidIPAddress') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                :label="$t('advancedLogSettings.remoteserverport')"
                label-for="remoteserverport"
              >
                <b-form-input
                  id="remoteserverport"
                  v-model="remoteLog.remoteserverport"
                  :state="getValidationState($v.remoteLog.remoteserverport)"
                  type="text"
                  :disabled="isButtonDisable"
                  data-test-id="advancedLogSettings-remoteserverport"
                  @input="$v.remoteLog.remoteserverport.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.remoteLog.remoteserverport.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.remoteLog.remoteserverport.required &&
                      !$v.remoteLog.remoteserverport.pattern
                    "
                  >
                    {{
                      $t('advancedLogSettings.advancedLogValueLimits', {
                        min: portValues.min,
                        max: portValues.max,
                      })
                    }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="$t('advancedLogSettings.portType')"
                label-for="portType"
              >
                <b-form-radio-group
                  v-model="remoteLog.portType"
                  :disabled="isButtonDisable"
                  data-test-id="advancedLogSettings-portType"
                  stacked
                >
                  <b-form-row>
                    <b-form-radio
                      value="UDP"
                      data-test-id="advancedLogSettings-udp"
                      class="mr-2"
                    >
                      {{ $t('advancedLogSettings.udp') }}
                    </b-form-radio>
                    <b-form-radio
                      value="TCP"
                      data-test-id="advancedLogSettings-tcp"
                      class="mr-2"
                    >
                      {{ $t('advancedLogSettings.tcp') }}
                    </b-form-radio>
                  </b-form-row>
                </b-form-radio-group>
              </b-form-group>
            </b-col>
          </b-row>

          <!-- TCP Certificate Section -->
          <div
            v-if="remoteLog.portType == 'TCP'"
            class="form-background p-3 mt-3"
          >
            <b-row>
              <b-col sm="4">
                <b-form-group
                  :label="$t('advancedLogSettings.caCertificateFile')"
                >
                  <span v-if="advancedLogCacertModifiedDate">
                    Last Modified Date:
                    {{ advancedLogCacertModifiedDate | formatDate }}
                    {{ advancedLogCacertModifiedDate | formatTime }}
                  </span>
                  <form-file
                    id="certificatecacertPEM-file"
                    ref="cacertPEMFile"
                    v-model="remoteLog.cacertPEM"
                    accept=".pem"
                    :state="getValidationState($v.remoteLog.cacertPEM)"
                    :disabled="isButtonDisable"
                    data-test-id="advancedLogSettings-cacertPEM"
                    @input="onFileUpload($event, 'cacertPEM', 'pem')"
                  >
                    <template #invalid>
                      <b-form-invalid-feedback role="alert">
                        {{ $t('global.form.required') }}
                      </b-form-invalid-feedback>
                    </template>
                  </form-file>
                </b-form-group>
              </b-col>
              <b-col sm="4">
                <b-form-group
                  :label="$t('advancedLogSettings.certificatefile')"
                >
                  <span v-if="advancedLogServerCRTModifiedDate">
                    Last Modified Date:
                    {{ advancedLogServerCRTModifiedDate | formatDate }}
                    {{ advancedLogServerCRTModifiedDate | formatTime }}
                  </span>
                  <form-file
                    id="certificateserverCRT-file"
                    ref="serverCRTFile"
                    v-model="remoteLog.serverCRT"
                    accept=".crt"
                    :state="getValidationState($v.remoteLog.serverCRT)"
                    :disabled="isButtonDisable"
                    data-test-id="advancedLogSettings-serverCRT"
                    @input="onFileUpload($event, 'serverCRT', 'crt')"
                  >
                    <template #invalid>
                      <b-form-invalid-feedback role="alert">
                        {{ $t('global.form.required') }}
                      </b-form-invalid-feedback>
                    </template>
                  </form-file>
                </b-form-group>
              </b-col>
              <b-col sm="4">
                <b-form-group :label="$t('advancedLogSettings.privateKey')">
                  <span v-if="advancedLogServerKeyModifiedDate">
                    Last Modified Date:
                    {{ advancedLogServerKeyModifiedDate | formatDate }}
                    {{ advancedLogServerKeyModifiedDate | formatTime }}
                  </span>
                  <form-file
                    id="certificateserverKey-file"
                    ref="serverKeyFile"
                    v-model="remoteLog.serverKey"
                    accept=".key"
                    :state="getValidationState($v.remoteLog.serverKey)"
                    :disabled="isButtonDisable"
                    data-test-id="advancedLogSettings-serverKey"
                    @input="onFileUpload($event, 'serverKey', 'key')"
                  >
                    <template #invalid>
                      <b-form-invalid-feedback role="alert">
                        {{ $t('global.form.required') }}
                      </b-form-invalid-feedback>
                    </template>
                  </form-file>
                </b-form-group>
              </b-col>
            </b-row>
          </div>

          <b-row class="mt-4">
            <b-col>
              <b-button
                type="submit"
                variant="primary"
                :disabled="isButtonDisable"
                data-test-id="advancedLogSettings-save"
                @click="onSave"
              >
                <icon-save />
                {{ $t('global.action.save') }}
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </page-section>
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import FormFile from '@/components/Global/FormFile';
import { mapState } from 'vuex';
import { requiredIf } from 'vuelidate/lib/validators';
import IconSave from '@carbon/icons-vue/es/save/20';

export default {
  name: 'RemoteLogSettings',
  components: {
    PageSection,
    FormFile,
    IconSave,
  },
  mixins: [LoadingBarMixin, VuelidateMixin, BVToastMixin],
  props: {
    isButtonDisable: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      remoteLog: {
        remotelogserver: '',
        remoteserverport: '',
        portType: '',
        cacertPEM: '',
        serverCRT: '',
        serverKey: '',
      },
      portValues: {
        min: 0,
        max: 65535,
      },
      advancedLogsDataInfo: '',
      advancedLogCacertModifiedDate: '',
      advancedLogServerCRTModifiedDate: '',
      advancedLogServerKeyModifiedDate: '',
      fileUploadTCP: [],
      fileUploaddetails: {},
    };
  },
  computed: {
    ...mapState('advancedLog', ['advancedLogsData']),
  },
  watch: {
    advancedLogsData() {
      this.getadvancedLogsDataInfo();
    },
  },
  validations() {
    return {
      remoteLog: {
        remotelogserver: {
          required: requiredIf(function () {
            return true;
          }),
          pattern: function (val) {
            return this.ipValidation(val);
          },
        },
        remoteserverport: {
          required: requiredIf(function () {
            return true;
          }),
          pattern: function (val) {
            return this.validateRange(
              val,
              this.portValues.min,
              this.portValues.max,
            );
          },
        },
        cacertPEM: {
          required: requiredIf(function () {
            if (
              this.remoteLog.portType == 'TCP' &&
              !this.advancedLogCacertModifiedDate
            ) {
              return true;
            }
          }),
        },
        serverCRT: {
          required: requiredIf(function () {
            if (
              this.remoteLog.portType == 'TCP' &&
              !this.advancedLogServerCRTModifiedDate
            ) {
              return true;
            }
          }),
        },
        serverKey: {
          required: requiredIf(function () {
            if (
              this.remoteLog.portType == 'TCP' &&
              !this.advancedLogServerKeyModifiedDate
            ) {
              return true;
            }
          }),
        },
      },
    };
  },
  methods: {
    initRemoteLogSettings() {
      this.startLoader();
      this.$store
        .dispatch('advancedLog/getAdvancedLogsSettings')
        .finally(() => {
          this.endLoader();
        });
    },
    getadvancedLogsDataInfo() {
      const advancedLogsDataInfo =
        this.$store.getters['advancedLog/getAdvancedLogsData'].Oem?.Ami?.SysLog
          ?.Configuration || {};

      this.remoteLog = {
        remotelogserver: advancedLogsDataInfo.RemoteLogServer,
        remoteserverport: advancedLogsDataInfo.RemoteServerPort,
        portType: advancedLogsDataInfo.PortType,
        cacertPEM: '',
        serverCRT: '',
        serverKey: '',
      };

      this.fileUploadTCP = [];
      this.fileUploaddetails = {};

      this.advancedLogCacertModifiedDate = advancedLogsDataInfo.IsCACERTExist
        ? new Date(advancedLogsDataInfo.SyslogCACERTModifiedDate)
        : '';

      this.advancedLogServerCRTModifiedDate =
        advancedLogsDataInfo.IsServerCRTExist
          ? new Date(advancedLogsDataInfo.SyslogserverCRTModifiedDate)
          : '';

      this.advancedLogServerKeyModifiedDate =
        advancedLogsDataInfo.IsServerKeyExist
          ? new Date(advancedLogsDataInfo.SyslogServerKeyModifiedDate)
          : '';
    },
    onSave() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      const params = {
        PortType: this.remoteLog.portType,
        RemoteLogServer: this.remoteLog.remotelogserver,
        RemoteServerPort: parseInt(this.remoteLog.remoteserverport),
      };

      this.startLoader();
      this.$store
        .dispatch('advancedLog/setRemoteLogSettings', params)
        .then((success) => {
          this.successToast(success);
          if (this.remoteLog.portType == 'TCP') {
            this.prepareCertificatesForUpload();
            this.addCertificate();
          } else {
            this.initRemoteLogSettings();
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    onFileUpload(file, type, extension) {
      if (file) {
        const fileTypeCorrect = this.getIsFileTypeCorrect(file, extension);
        if (!fileTypeCorrect) {
          this.errorToast(
            this.$t('advancedLogSettings.incorrectAdvancedCertificateFileType'),
          );
          setTimeout(() => {
            this.remoteLog[type] = '';
            this.clearSpecificFile(type);
          }, 200); // added 200 milliseconds delay to show selected wrong type file
        }
      } else {
        this.remoteLog[type] = '';
      }
    },
    clearSpecificFile(type) {
      // Map file types to their corresponding refs
      const fileRefMap = {
        cacertPEM: 'cacertPEMFile',
        serverCRT: 'serverCRTFile',
        serverKey: 'serverKeyFile',
      };

      const refName = fileRefMap[type];
      if (refName && this.$refs[refName]) {
        this.$refs[refName].clearSelectedFile();
      }
    },
    prepareCertificatesForUpload() {
      this.fileUploadTCP = [];
      this.fileUploaddetails = {};
      // Only add files that are actually selected and valid
      if (this.remoteLog.cacertPEM) {
        this.fileUploaddetails.cacertPEM = {
          file: this.remoteLog.cacertPEM,
          type: 'cacertPEM',
        };
      }
      if (this.remoteLog.serverCRT) {
        this.fileUploaddetails.serverCRT = {
          file: this.remoteLog.serverCRT,
          type: 'serverCRT',
        };
      }
      if (this.remoteLog.serverKey) {
        this.fileUploaddetails.serverKey = {
          file: this.remoteLog.serverKey,
          type: 'serverKey',
        };
      }
      // Only push if there are files to upload
      if (Object.keys(this.fileUploaddetails).length > 0) {
        this.fileUploadTCP.push(this.fileUploaddetails);
      }
    },
    addCertificate() {
      this.startLoader();
      if (this.fileUploadTCP.length <= 0) {
        this.initRemoteLogSettings();
        return;
      }
      this.fileUploadTCP.forEach((obj) => {
        Object.entries(obj).forEach((item) => {
          const file = item[1];
          const type = file.type;
          this.$store
            .dispatch('advancedLog/addAdvancedLogsCertificate', { file, type })
            .then((success) => {
              this.successToast(success);
              this.initRemoteLogSettings();
              this.clearFile();
            })
            .catch(({ message }) => {
              this.errorToast(message);
              this.clearFile();
            })
            .finally(() => {
              this.endLoader();
            });
        });
      });
    },
    clearFile() {
      this.fileUploadTCP = [];
      this.fileUploaddetails = {};
      this.remoteLog.cacertPEM = '';
      this.remoteLog.serverCRT = '';
      this.remoteLog.serverKey = '';

      if (this.$refs.cacertPEMFile) {
        this.$refs.cacertPEMFile.clearSelectedFile();
      }
      if (this.$refs.serverCRTFile) {
        this.$refs.serverCRTFile.clearSelectedFile();
      }
      if (this.$refs.serverKeyFile) {
        this.$refs.serverKeyFile.clearSelectedFile();
      }
    },
    getIsFileTypeCorrect(file, extension) {
      const fileTypeExtension = file.name.split('.').pop();
      return fileTypeExtension === extension;
    },
  },
};
</script>

<style scoped>
.form-background {
  background-color: #f8f9fa;
  border-radius: 0.25rem;
}
</style>
