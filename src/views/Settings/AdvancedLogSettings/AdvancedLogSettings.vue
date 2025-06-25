<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="align-items-end form-background p-3">
      <b-col xl="6" class="align-items-end">
        <b-form id="form-advancedLogSettings">
          <page-section
            :section-title="$t('advancedLogSettings.localLog')"
            class="pagesection_margin"
          >
            <div class="form-background p-3">
              <b-row>
                <b-col sm="6">
                  <b-form-group
                    :label="$t('advancedLogSettings.fileSize')"
                    label-for="portStart"
                  >
                    <b-form-input
                      id="fileSize"
                      v-model="form.fileSize"
                      :state="getValidationState($v.form.fileSize)"
                      type="text"
                      @input="$v.form.fileSize.$touch()"
                    />
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.form.fileSize.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template
                        v-if="
                          $v.form.fileSize.required && !$v.form.fileSize.pattern
                        "
                      >
                        {{
                          $t('advancedLogSettings.advancedLogValueLimits', {
                            min: 3,
                            max: 50000,
                          })
                        }}
                      </template>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group
                    :label="$t('advancedLogSettings.rotateCount')"
                    label-for="rotateCount"
                  >
                    <b-form-checkbox
                      id="rotateCount"
                      v-model="form.rotateCount"
                      switch
                    >
                      <span v-if="form.rotateCount">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </page-section>
          <page-section
            :section-title="$t('advancedLogSettings.remoteLog')"
            class="pagesection_margin"
          >
            <div class="form-background p-3">
              <b-row>
                <b-col sm="6">
                  <b-form-group
                    :label="$t('advancedLogSettings.remotelogserver')"
                    label-for="remotelogserver"
                  >
                    <b-form-input
                      id="remotelogserver"
                      v-model="form.remotelogserver"
                      :state="getValidationState($v.form.remotelogserver)"
                      type="text"
                    />
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.form.remotelogserver.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template
                        v-if="
                          $v.form.remotelogserver.required &&
                          !$v.form.remotelogserver.pattern
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
                      v-model="form.remoteserverport"
                      :state="getValidationState($v.form.remoteserverport)"
                      type="text"
                    />
                    <b-form-invalid-feedback role="alert">
                      <template v-if="!$v.form.remoteserverport.required">
                        {{ $t('global.form.fieldRequired') }}
                      </template>
                      <template
                        v-if="
                          $v.form.remoteserverport.required &&
                          !$v.form.remoteserverport.pattern
                        "
                      >
                        {{
                          $t('advancedLogSettings.advancedLogValueLimits', {
                            min: 3,
                            max: 65535,
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
                    <b-form-radio-group v-model="form.portType" stacked>
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
            </div>
          </page-section>
          <div v-if="form.portType == 'TCP'" class="form-background p-3">
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
                    id="certificate-file"
                    v-model="form.cacertPEM"
                    accept=".pem"
                    :state="getValidationState($v.form.cacertPEM)"
                    @input="onFileUpload($event, 'CacertPEM', 'pem')"
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
                    id="certificate-file"
                    v-model="form.serverCRT"
                    accept=".crt"
                    :state="getValidationState($v.form.serverCRT)"
                    @input="onFileUpload($event, 'ServerCRT', 'crt')"
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
                    id="certificate-file"
                    v-model="form.serverKey"
                    accept=".key"
                    :state="getValidationState($v.form.serverKey)"
                    @input="onFileUpload($event, 'ServerKey', 'key')"
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
          <b-button
            form="form-networLink"
            type="submit"
            variant="primary"
            @click="onOk"
          >
            <icon-save />
            {{ $t('global.action.save') }}
          </b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import PageTitle from '@/components/Global/PageTitle';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import FormFile from '@/components/Global/FormFile';
import PageSection from '@/components/Global/PageSection';
import { mapState } from 'vuex';
import { requiredIf } from 'vuelidate/lib/validators';
import IconSave from '@carbon/icons-vue/es/save/20';

export default {
  components: {
    PageTitle,
    FormFile,
    PageSection,
    IconSave,
  },
  mixins: [LoadingBarMixin, VuelidateMixin, BVToastMixin],
  data() {
    return {
      loading,
      form: {
        portType: '',
        fileSize: '',
        rotateCount: '',
        remotelogserver: '',
        remoteserverport: '',
        ServerCRT: '',
        serverCRT: '',
        serverKey: '',
      },
      advancedLogsDataInfo: '',
      advancedLogCacertModifiedDate: '',
      advancedLogServerCRTModifiedDate: '',
      advancedLogServerKeyModifiedDate: '',
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
  created() {
    this.initAdvancedLogSettings();
  },
  validations() {
    return {
      form: {
        fileSize: {
          required: requiredIf(function () {
            return true;
          }),
          pattern: function (val) {
            return this.validateRange(val, 3, 50000);
          },
        },
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
            return this.validateRange(val, 0, 65535);
          },
        },
        cacertPEM: {
          required: requiredIf(function () {
            if (
              this.form.portType == 'TCP' &&
              !this.advancedLogCacertModifiedDate
            ) {
              return true;
            }
          }),
        },
        serverCRT: {
          required: requiredIf(function () {
            if (
              this.form.portType == 'TCP' &&
              !this.advancedLogServerCRTModifiedDate
            ) {
              return true;
            }
          }),
        },
        serverKey: {
          required: requiredIf(function () {
            if (
              this.form.portType == 'TCP' &&
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
    initAdvancedLogSettings() {
      this.startLoader();
      this.$store
        .dispatch('advancedLog/getAdvancedLogsSettings')
        .finally(() => {
          this.endLoader();
        });
    },
    getadvancedLogsDataInfo() {
      this.advancedLogsDataInfo =
        this.$store.getters['advancedLog/getAdvancedLogsData']?.Oem?.Ami?.SysLog
          ?.Configuration || {};
      this.form = {
        portType: this.advancedLogsDataInfo.PortType,
        fileSize: this.advancedLogsDataInfo.FileSize,
        rotateCount: this.advancedLogsDataInfo.RotateCount,
        remotelogserver: this.advancedLogsDataInfo.RemoteLogServer,
        remoteserverport: this.advancedLogsDataInfo.RemoteServerPort,
      };
      if (this.advancedLogsDataInfo.IsCACERTExist) {
        this.advancedLogCacertModifiedDate = new Date(
          this.advancedLogsDataInfo.SyslogCACERTModifiedDate,
        );
      }
      if (this.advancedLogsDataInfo.IsServerCRTExist) {
        this.advancedLogServerCRTModifiedDate = new Date(
          this.advancedLogsDataInfo.SyslogserverCRTModifiedDate,
        );
      }
      if (this.advancedLogsDataInfo.IsServerKeyExist) {
        this.advancedLogServerKeyModifiedDate = new Date(
          this.advancedLogsDataInfo.SyslogServerKeyModifiedDate,
        );
      }
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let params = {
        PortType: this.form.portType,
        FileSize: parseInt(this.form.fileSize),
        RotateCount: this.form.rotateCount,
        RemoteLogServer: this.form.remotelogserver,
        RemoteServerPort: parseInt(this.form.remoteserverport),
      };
      this.startLoader();
      this.$store
        .dispatch('advancedLog/setAdvancedLogsSettings', params)
        .then((success) => {
          this.successToast(success);
          this.initAdvancedLogSettings();
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    onFileUpload(file, type, extension) {
      if (file) {
        let fileTypeCorrect = this.getIsFileTypeCorrect(file, extension);
        if (fileTypeCorrect) {
          this.addCertificate(file, type);
        } else {
          this.errorToast(
            this.$t('advancedLogSettings.incorrectAdvancedCertificateFileType'),
            {
              title: this.$t(
                'advancedLogSettings.toast.errorAdvancedAddCertificate',
              ),
            },
          );
        }
      }
    },
    addCertificate(file, type) {
      this.startLoader();
      this.$store
        .dispatch('advancedLog/addAdvancedLogsCertificate', { file, type })
        .then((success) => {
          this.successToast(success);
          this.initAdvancedLogSettings();
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    getIsFileTypeCorrect(file, extension) {
      const fileTypeExtension = file.name.split('.').pop();
      return fileTypeExtension === extension;
    },
  },
};
</script>
<style scoped>
.pagesection_margin {
  margin-bottom: 0;
}
</style>
