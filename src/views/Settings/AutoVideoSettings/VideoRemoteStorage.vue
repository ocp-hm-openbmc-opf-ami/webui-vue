<template>
  <div>
    <page-section>
      <b-row>
        <b-col xl="6">
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <b-form-checkbox
                  v-model="videoRemote.RecordToRemote"
                  :disabled="isButtonDisable"
                >
                  {{
                    $t(
                      'pageVideo.videoRemoteSettings.recordVideotoRemoteServer',
                    )
                  }}
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.videoRemoteSettings.videoRemoteMaximumDumps')
                "
                label-for="videoRemoteMaximumDumps"
              >
                <b-form-input
                  id="videoRemoteMaximumDumps"
                  v-model="videoRemote.MaxDumps"
                  :disabled="!videoRemote.RecordToRemote"
                  type="number"
                  :state="getValidationState($v.videoRemote.MaxDumps)"
                  @input="$v.videoRemote.MaxDumps.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.MaxDumps.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.MaxDumps.required &&
                      !$v.videoRemote.MaxDumps.pattern
                    "
                  >
                    {{ $t('pageVideo.form.maxDumpRangeRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.videoRemoteSettings.videoRemoteMaximumDuration')
                "
                label-for="videoRemoteMaximumDuration"
              >
                <b-form-input
                  id="videoRemoteMaximumDuration"
                  v-model="videoRemote.MaxDuration"
                  :disabled="!videoRemote.RecordToRemote"
                  type="number"
                  :state="getValidationState($v.videoRemote.MaxDuration)"
                  @input="$v.videoRemote.MaxDuration.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.MaxDuration.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.MaxDuration.required &&
                      !$v.videoRemote.MaxDuration.pattern
                    "
                  >
                    {{ $t('pageVideo.form.maxDurationRangeRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.videoRemoteSettings.videoRemoteMaximumSize')
                "
                label-for="videoRemoteMaximumSize"
              >
                <b-form-input
                  id="videoRemoteMaximumSize"
                  v-model="videoRemote.MaxSize"
                  :disabled="!videoRemote.RecordToRemote"
                  type="number"
                  :state="getValidationState($v.videoRemote.MaxSize)"
                  @input="$v.videoRemote.MaxSize.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.MaxSize.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.MaxSize.required &&
                      !$v.videoRemote.MaxSize.pattern
                    "
                  >
                    {{ $t('pageVideo.form.maxSizeRangeRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.videoRemoteSettings.videoRemoteServerAddress')
                "
                label-for="videoRemoteServerAddress"
              >
                <b-form-input
                  id="videoRemoteServerAddress"
                  v-model="videoRemote.ServerIP"
                  :disabled="!videoRemote.RecordToRemote"
                  type="text"
                  :state="getValidationState($v.videoRemote.ServerIP)"
                  @input="$v.videoRemote.ServerIP.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.ServerIP.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.ServerIP.required &&
                      !$v.videoRemote.ServerIP.pattern
                    "
                  >
                    {{ $t('global.form.invalidValue') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.videoRemoteSettings.videoRemotePathInServer')
                "
                label-for="videoRemotePathInServer"
              >
                <b-form-input
                  id="videoRemotePathInServer"
                  v-model="videoRemote.PathInServer"
                  :disabled="!videoRemote.RecordToRemote"
                  type="text"
                  :state="getValidationState($v.videoRemote.PathInServer)"
                  @input="$v.videoRemote.PathInServer.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.PathInServer.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.PathInServer.required &&
                      !$v.videoRemote.PathInServer.pattern
                    "
                  >
                    {{ $t('global.form.invalidValue') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.videoRemoteSettings.videoRemoteShareType')
                "
                label-for="videoRemoteShareType"
              >
                <b-form-radio-group v-model="videoRemote.ShareType" stacked>
                  <b-form-row>
                    <b-form-radio
                      :disabled="!videoRemote.RecordToRemote"
                      value="nfs"
                      data-test-id="video-videoRemoteSettings-sharetype-nfs"
                      class="mr-2"
                    >
                      {{ $t('pageVideo.videoRemoteSettings.nfs') }}
                    </b-form-radio>
                    <b-form-radio
                      :disabled="!videoRemote.RecordToRemote"
                      value="cifs"
                      data-test-id="video-videoRemoteSettings-sharetype-cifs"
                    >
                      {{ $t('pageVideo.videoRemoteSettings.cifs') }}
                    </b-form-radio>
                  </b-form-row>
                </b-form-radio-group>
              </b-form-group>
            </b-col>
          </b-row>
          <div v-if="videoRemote.ShareType == 'cifs'">
            <b-row>
              <b-col sm="6">
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.username')"
                  label-for="username"
                >
                  <b-form-input
                    id="username"
                    v-model="videoRemote.UserName"
                    :disabled="
                      !videoRemote.RecordToRemote ||
                      videoRemote.ShareType != 'cifs'
                    "
                    type="text"
                    :state="getValidationState($v.videoRemote.UserName)"
                    @input="$v.videoRemote.UserName.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.videoRemote.UserName.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.password')"
                  label-for="password"
                >
                  <b-form-input
                    id="password"
                    v-model="videoRemote.Password"
                    :disabled="
                      !videoRemote.RecordToRemote ||
                      videoRemote.ShareType != 'cifs'
                    "
                    type="password"
                    :state="getValidationState($v.videoRemote.Password)"
                    @input="$v.videoRemote.Password.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.videoRemote.Password.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
          <b-row class="mt-4 mb-5">
            <b-col>
              <b-button
                type="submit"
                variant="primary"
                :disabled="isButtonDisable"
                @click="onOk"
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
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { mapState } from 'vuex';

import { requiredIf } from 'vuelidate/lib/validators';
import IconSave from '@carbon/icons-vue/es/save/20';

export default {
  name: 'Videoremotestorage',
  components: {
    PageSection,
    IconSave,
  },
  mixins: [BVToastMixin, DataFormatterMixin, VuelidateMixin, LoadingBarMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
    isButtonDisable: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      videoRemote: {
        RecordToRemote: false,
        MaxDumps: '',
        MaxDuration: '',
        MaxSize: '',
        ServerIP: '',
        ShareType: '',
        PathInServer: '',
        UserName: '',
        Password: '',
      },
    };
  },
  computed: {
    ...mapState('autoVideo', ['autoVideoRecordFeature']),
  },
  watch: {
    autoVideoRecordFeature() {
      this.initVideoRemoteStorageValues();
    },
  },
  validations() {
    return {
      videoRemote: {
        MaxDumps: {
          required: requiredIf(function () {
            if (this.videoRemote.RecordToRemote) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.validateFieldValue(val, 1);
          },
        },
        MaxDuration: {
          required: requiredIf(function () {
            if (this.videoRemote.RecordToRemote) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.validateFieldValue(val, 20);
          },
        },
        MaxSize: {
          required: requiredIf(function () {
            if (this.videoRemote.RecordToRemote) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.validateFieldValue(val, 10);
          },
        },
        ServerIP: {
          required: requiredIf(function () {
            if (this.videoRemote.RecordToRemote) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.serverAddressvalidate(val);
          },
        },
        PathInServer: {
          required: requiredIf(function () {
            if (this.videoRemote.RecordToRemote) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.pathInServervalidate(val);
          },
        },
        UserName: {
          required: requiredIf(function () {
            return (
              this.videoRemote.RecordToRemote &&
              this.videoRemote.ShareType == 'cifs'
            );
          }),
        },
        Password: {
          required: requiredIf(function () {
            return (
              this.videoRemote.RecordToRemote &&
              this.videoRemote.ShareType == 'cifs'
            );
          }),
        },
      },
    };
  },
  methods: {
    initVideoRemoteStorageValues() {
      this.startLoader();
      this.$store
        .dispatch('autoVideo/getVideoRemoteStorage')
        .then(() => {
          const config =
            this.$store.getters['autoVideo/getVideoRemoteStorageValues'] || {};
          this.$v.$reset();
          this.videoRemote = {
            RecordToRemote: config.RecordToRemote,
            MaxDumps: config.MaxDumps,
            MaxDuration: config.MaxDuration,
            MaxSize: config.MaxSize,
            ServerIP: config.ServerIP,
            ShareType: config.ShareType,
            PathInServer: config.PathInServer,
            Password: config.Password,
            UserName: config.UserName,
          };
        })
        .finally(() => {
          this.endLoader();
        });
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let params = {};
      params = {
        RecordToRemote: this.videoRemote.RecordToRemote,
        MaxDumps:
          this.videoRemote.MaxDumps == ''
            ? 0
            : parseInt(this.videoRemote.MaxDumps),
        MaxDuration:
          this.videoRemote.MaxDuration == ''
            ? 0
            : parseInt(this.videoRemote.MaxDuration),
        MaxSize:
          this.videoRemote.MaxSize == ''
            ? 0
            : parseInt(this.videoRemote.MaxSize),
        ServerIP: this.videoRemote.ServerIP,
        ShareType: this.videoRemote.ShareType,
        PathInServer: this.videoRemote.PathInServer,
      };
      if (this.videoRemote.ShareType == 'cifs') {
        params.UserName = this.videoRemote.UserName;
        params.Password = this.videoRemote.Password;
      }
      this.startLoader();
      this.$store
        .dispatch('autoVideo/setVideoRemoteStorage', params)
        .then((success) => {
          this.initVideoRemoteStorageValues();
          this.successToast(success);
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    validateFieldValue(value, max) {
      if (
        this.videoRemote.RecordToRemote &&
        !(/^[0-9]*$/.test(value) && value >= 1 && value <= max)
      ) {
        return false;
      } else {
        return true;
      }
    },
    serverAddressvalidate(value) {
      if (
        this.videoRemote.RecordToRemote &&
        (!/((^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$)|(^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$))/.test(
          value,
        ) ||
          /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
            value,
          ) ||
          (value != undefined &&
            value != null &&
            (String(value).charAt(0) == '0' ||
              '#255.255.255.0#0.24.56.4#255.255.255.255#'.indexOf(
                '#' + value + '#',
              ) > -1)) ||
          value.trim() == '::') &&
        !/^(?=.{1,253}\.?$)([a-z][a-z0-9\\-]{0,61}[a-z0-9]\.)+([a-z]{2,63}|xn--[a-z0-9\\-]{1,58}[a-z0-9])\.?$/i.test(
          value,
        )
      ) {
        return false;
      } else {
        return true;
      }
    },
    pathInServervalidate(value) {
      if (
        this.videoRemote.RecordToRemote &&
        !/^[a-zA-Z0-9/\-_.:\\]+$/.test(value)
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
