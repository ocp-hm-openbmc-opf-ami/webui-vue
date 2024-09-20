<template>
  <div>
    <page-section>
      <b-row>
        <b-col xl="6">
          <b-row>
            <b-col sm="6">
              <b-form-group>
                <b-form-checkbox v-model="videoRemote.recordVideoServer">
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
                  v-model="videoRemote.maximumDumps"
                  :disabled="!videoRemote.recordVideoServer"
                  type="text"
                  :state="getValidationState($v.videoRemote.maximumDumps)"
                  @input="$v.videoRemote.maximumDumps.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.maximumDumps.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.maximumDumps.required &&
                      !$v.videoRemote.maximumDumps.pattern
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
                  $t('pageVideo.videoRemoteSettings.videoRemoteMaximumDuration')
                "
                label-for="videoRemoteMaximumDuration"
              >
                <b-form-input
                  id="videoRemoteMaximumDuration"
                  v-model="videoRemote.maximumDuration"
                  :disabled="!videoRemote.recordVideoServer"
                  type="text"
                  :state="getValidationState($v.videoRemote.maximumDuration)"
                  @input="$v.videoRemote.maximumDuration.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.maximumDuration.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.maximumDuration.required &&
                      !$v.videoRemote.maximumDuration.pattern
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
                  $t('pageVideo.videoRemoteSettings.videoRemoteMaximumSize')
                "
                label-for="videoRemoteMaximumSize"
              >
                <b-form-input
                  id="videoRemoteMaximumSize"
                  v-model="videoRemote.maximumSize"
                  :disabled="!videoRemote.recordVideoServer"
                  type="text"
                  :state="getValidationState($v.videoRemote.maximumSize)"
                  @input="$v.videoRemote.maximumSize.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.maximumSize.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.maximumSize.required &&
                      !$v.videoRemote.maximumSize.pattern
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
                  $t('pageVideo.videoRemoteSettings.videoRemoteServerAddress')
                "
                label-for="videoRemoteServerAddress"
              >
                <b-form-input
                  id="videoRemoteServerAddress"
                  v-model="videoRemote.serverAddress"
                  :disabled="!videoRemote.recordVideoServer"
                  type="text"
                  :state="getValidationState($v.videoRemote.serverAddress)"
                  @input="$v.videoRemote.serverAddress.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.serverAddress.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.serverAddress.required &&
                      !$v.videoRemote.serverAddress.pattern
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
                  v-model="videoRemote.pathInServer"
                  :disabled="!videoRemote.recordVideoServer"
                  type="text"
                  :state="getValidationState($v.videoRemote.pathInServer)"
                  @input="$v.videoRemote.pathInServer.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.videoRemote.pathInServer.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.videoRemote.pathInServer.required &&
                      !$v.videoRemote.pathInServer.pattern
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
                <b-form-radio-group v-model="videoRemote.shareType" stacked>
                  <b-form-row>
                    <b-form-radio
                      :disabled="!videoRemote.recordVideoServer"
                      value="NFS"
                      data-test-id="video-videoRemoteSettings-sharetype-nfs"
                      class="mr-2"
                    >
                      {{ $t('pageVideo.videoRemoteSettings.nfs') }}
                    </b-form-radio>
                    <b-form-radio
                      :disabled="!videoRemote.recordVideoServer"
                      value="CIFS"
                      data-test-id="video-videoRemoteSettings-sharetype-cifs"
                    >
                      {{ $t('pageVideo.videoRemoteSettings.cifs') }}
                    </b-form-radio>
                  </b-form-row>
                </b-form-radio-group>
              </b-form-group>
            </b-col>
          </b-row>
          <div v-if="videoRemote.shareType == 'CIFS'">
            <b-row>
              <b-col sm="6">
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.domainName')"
                  label-for="domainName"
                >
                  <b-form-input
                    id="domainName"
                    v-model="videoRemote.domainName"
                    :disabled="
                      !videoRemote.recordVideoServer &&
                      videoRemote.shareType != 'CIFS'
                    "
                    type="text"
                    :state="getValidationState($v.videoRemote.domainName)"
                    @input="$v.videoRemote.domainName.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.videoRemote.domainName.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col sm="6">
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.username')"
                  label-for="username"
                >
                  <b-form-input
                    id="username"
                    v-model="videoRemote.userName"
                    :disabled="
                      !videoRemote.recordVideoServer &&
                      videoRemote.shareType != 'CIFS'
                    "
                    type="text"
                    :state="getValidationState($v.videoRemote.userName)"
                    @input="$v.videoRemote.userName.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.videoRemote.userName.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="6">
                <b-form-group
                  :label="$t('pageVideo.videoRemoteSettings.password')"
                  label-for="password"
                >
                  <b-form-input
                    id="password"
                    v-model="videoRemote.password"
                    :disabled="
                      !videoRemote.recordVideoServer &&
                      videoRemote.shareType != 'CIFS'
                    "
                    type="password"
                    :state="getValidationState($v.videoRemote.password)"
                    @input="$v.videoRemote.password.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.videoRemote.password.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
          <b-row class="mt-4 mb-5">
            <b-col>
              <b-button type="submit" variant="primary" @click="onOk">
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

export default {
  name: 'Videoremotestorage',
  components: {
    PageSection,
  },
  mixins: [BVToastMixin, DataFormatterMixin, VuelidateMixin, LoadingBarMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      videoRemote: {
        recordVideoServer: false,
        maximumDumps: '',
        maximumDuration: '',
        maximumSize: '',
        serverAddress: '',
        shareType: '',
        domainName: '',
        userName: '',
        password: '',
      },
    };
  },
  computed: {
    ...mapState('autoVideo', ['videoRemoteStoragevalues']),
  },
  watch: {
    videoRemoteStoragevalues() {
      this.initVideoRemoteStoragevalues();
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('autoVideo/getVideoRemoteStorage').finally(() => {
      this.endLoader();
    });
  },
  validations() {
    return {
      videoRemote: {
        maximumDumps: {
          required: requiredIf(function () {
            if (this.videoRemote.recordVideoServer) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.validateFieldValue(val, 100);
          },
        },
        maximumDuration: {
          required: requiredIf(function () {
            if (this.videoRemote.recordVideoServer) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.validateFieldValue(val, 3600);
          },
        },
        maximumSize: {
          required: requiredIf(function () {
            if (this.videoRemote.recordVideoServer) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.validateFieldValue(val, 500);
          },
        },
        serverAddress: {
          required: requiredIf(function () {
            if (this.videoRemote.recordVideoServer) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.serverAddressvalidate(val);
          },
        },
        pathInServer: {
          required: requiredIf(function () {
            if (this.videoRemote.recordVideoServer) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.pathInServervalidate(val);
          },
        },
        domainName: {
          required: requiredIf(function () {
            if (
              this.videoRemote.recordVideoServer &&
              this.videoRemote.shareType == 'CIFS'
            ) {
              return true;
            }
          }),
          pattern: function (val) {
            return this.domainNamevalidate(val);
          },
        },
        userName: {
          required: requiredIf(function () {
            if (
              this.videoRemote.recordVideoServer &&
              this.videoRemote.shareType == 'CIFS'
            ) {
              return true;
            }
          }),
        },
        password: {
          required: requiredIf(function () {
            if (
              this.videoRemote.recordVideoServer &&
              this.videoRemote.shareType == 'CIFS'
            ) {
              return true;
            }
          }),
        },
      },
    };
  },
  methods: {
    initVideoRemoteStoragevalues() {
      const config =
        this.$store.getters['autoVideo/getVideoRemoteStoragevalues'] || {};
      this.videoRemote = {
        recordVideoServer: config.remote_support,
        maximumDumps: config.max_dumps,
        maximumDuration: config.max_duration,
        maximumSize: config.max_size,
        serverAddress: config.ip_address,
        shareType: config.share_type,
        domainName: config.domain_name,
        userName: config.user_name,
        password: config.password,
      };
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
    },
    validateFieldValue(value, max) {
      if (
        this.videoRemote.recordVideoServer &&
        !(/^[0-9]*$/.test(value) && value >= 1 && value <= max)
      ) {
        return false;
      } else {
        return true;
      }
    },
    serverAddressvalidate(value) {
      if (
        this.videoRemote.recordVideoServer &&
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
    domainNamevalidate(value) {
      if (
        (this.videoRemote.recordVideoServer &&
          this.videoRemote.shareType == 'CIFS' &&
          value != '' &&
          !/^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))(.*\.)?.*\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/.test(
            value,
          )) ||
        !(value.length <= 64)
      ) {
        return false;
      } else {
        return true;
      }
    },
    pathInServervalidate(value) {
      if (
        this.videoRemote.recordVideoServer &&
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
