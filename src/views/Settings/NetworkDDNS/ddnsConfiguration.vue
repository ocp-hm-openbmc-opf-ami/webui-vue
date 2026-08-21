<template>
  <b-container fluid="xl">
    <b-row>
      <b-col sm="4">
        <b-form-group
          :label="$t('pageDDNSNetwork.ddnsConfiguration.sendHostNameEnabled')"
        >
          <b-form-checkbox
            v-model="sendHostNameEnabled"
            data-test-id="ddns-toggle-host-name"
            switch
            :disabled="isButtonDisable"
            @change="changeHostNameEnabled"
          >
            <span v-if="sendHostNameEnabled">
              {{ $t('global.status.enabled') }}
            </span>
            <span v-else>{{ $t('global.status.disabled') }}</span>
          </b-form-checkbox>
        </b-form-group>
      </b-col>
    </b-row>
    <page-section
      :section-title="
        $t('pageDDNSNetwork.ddnsConfiguration.domainConfiguration')
      "
    >
      <b-row>
        <b-col sm="3">
          <b-button
            variant="link"
            data-test-id="add-domain-name-button"
            :disabled="
              domainNames.length >= 12 ||
              dhcpv4useDomainName ||
              dhcpv6useDomainName ||
              ddnsInterfaceId === 'hostusb0'
            "
            @click="addDomainName"
          >
            <icon-add />
            {{ $t('pageDDNSNetwork.ddnsConfiguration.addDomainNames') }}
          </b-button>
        </b-col>
      </b-row>
      <br />
      <label v-if="domainNames.length > 0">{{
        $t('pageDDNSNetwork.ddnsConfiguration.domainName')
      }}</label>
      <b-row>
        <b-col v-for="(domain, index) in domainNames" :key="index" sm="3">
          <b-form-group>
            <b-form-input
              :id="'Static-Domain-Name-' + index"
              v-model="domainNames[index]"
              type="text"
              data-test-id="static-domain-name-input"
              :state="getValidationState($v.domainNames.$each[index])"
              @input="$v.domainNames.$each[index].$touch()"
            />
            <b-button
              v-if="index > 0"
              variant="cancel"
              class="input-action-btn cancel-btn"
              data-test-id="remove-domain-name-button"
              @click="removeDomainName(index)"
            >
              <icon-misuse />
            </b-button>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.domainNames.$each[index].required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-else-if="!$v.domainNames.$each[index].validFQDN">
                {{ $t('pageDDNSNetwork.ddnsConfiguration.invalidFQDN') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-button
        type="submit"
        variant="primary"
        data-test-id="domain-names-save-button"
        :disabled="isButtonDisable"
        @click="saveConfigurations"
      >
        <icon-save />
        {{ $t('global.action.save') }}
      </b-button>
    </page-section>
    <page-section
      class="section_DDNS"
      :section-title="
        $t('pageDDNSNetwork.ddnsConfiguration.interfacesConfiguration')
      "
    >
      <div class="form-background p-3">
        <b-row>
          <b-col sm="3">
            <b-form-group
              :label="$t('pageDDNSNetwork.ddnsConfiguration.ddnsMethod')"
            >
              <b-form-checkbox
                v-model="form.ddnsMethod"
                data-test-id="ddns-method"
                :disabled="isButtonDisable"
                switch
              >
                <span v-if="form.ddnsMethod">
                  {{ $t('pageDDNSNetwork.ddnsConfiguration.register') }}
                </span>
                <span v-else>{{
                  $t('pageDDNSNetwork.ddnsConfiguration.deregister')
                }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col sm="3">
            <b-form-group
              :label="$t('pageDDNSNetwork.ddnsConfiguration.nsUpdateEnable')"
            >
              <b-form-checkbox
                v-model="form.nsUpdateEnabled"
                data-test-id="ddns-ns-update-enabled"
                :disabled="isButtonDisable"
                switch
              >
                <span v-if="form.nsUpdateEnabled">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col sm="3">
            <b-form-group
              :label="$t('pageDDNSNetwork.ddnsConfiguration.useTSIG')"
            >
              <b-form-checkbox
                v-model="form.useTSIG"
                data-test-id="ddns-use-tsig"
                :disabled="isButtonDisable"
                switch
              >
                <span v-if="form.useTSIG">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col v-if="form.useTSIGFileUpload" sm="3">
            <b-form-group
              :label="$t('pageDDNSNetwork.ddnsConfiguration.tsigFileUpload')"
            >
              <b-form-text>
                {{
                  $t(
                    'pageDDNSNetwork.ddnsConfiguration.tsigFileUploadDiscription',
                  )
                }}
              </b-form-text>
              <form-file
                id="image-file"
                ref="formFile"
                v-model="file"
                accept=".private"
                :state="getValidationState($v.file)"
                aria-describedby="image-file-help-block"
                data-test-id="ddns-tsig-file-upload"
                @input="onFileUpload($event)"
              >
                <template #invalid>
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.file.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template v-else-if="!$v.file.pattern">
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                </template>
              </form-file>
            </b-form-group>
            <b-button
              class="upload-button"
              type="submit"
              variant="primary"
              data-test-id="ddns-tsig-file-upload-button"
              :disabled="!form.useTSIG || isButtonDisable"
              @click="onSubmitUpload"
            >
              <icon-upload />
              {{ $t('global.action.upload') }}
            </b-button>
          </b-col>
        </b-row>
        <b-button
          type="submit"
          variant="primary"
          class="mt-5"
          data-test-id="ddns-save-button"
          :disabled="isButtonDisable"
          @click="handleSubmit"
        >
          <icon-save />
          {{ $t('global.action.save') }}
        </b-button>
      </div>
    </page-section>
    <page-section
      :section-title="$t('pageDDNSNetwork.ddnsConfiguration.dnsOverHttps')"
    >
      <b-row>
        <b-col sm="6">
          <b-form-group :label="$t('pageDDNSNetwork.ddnsConfiguration.mode')">
            <b-form-radio-group
              v-model="dohMode"
              :options="dohModeOptions"
              :disabled="isButtonDisable"
              data-test-id="doh-mode-radio"
              @change="onDohModeChange"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="dohMode === 'Auto'">
        <b-col sm="6">
          <b-form-group :label="$t('pageDDNSNetwork.ddnsConfiguration.server')">
            <b-form-radio-group
              v-model="dohServer"
              :options="dohServerOptions"
              :disabled="isButtonDisable"
              data-test-id="doh-server-radio"
              @change="onDohServerChange"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="dohMode === 'Auto'">
        <b-col sm="3">
          <b-form-group
            :label="$t('pageDDNSNetwork.ddnsConfiguration.serviceTraffic')"
          >
            <b-form-select
              v-model="dohServiceTraffic"
              :options="dohServiceTrafficOptions"
              :disabled="isButtonDisable"
              data-test-id="doh-service-traffic-select"
              @change="onDohServiceTrafficChange"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="dohMode === 'Manual'">
        <b-col sm="3">
          <b-button
            variant="link"
            data-test-id="add-doh-server-button"
            :disabled="dohServers.length >= 3 || isButtonDisable"
            @click="addDohServer"
          >
            <icon-add />
            {{ $t('pageDDNSNetwork.ddnsConfiguration.addDohServer') }}
          </b-button>
        </b-col>
      </b-row>
      <br v-if="dohMode === 'Manual'" />
      <label v-if="dohMode === 'Manual' && dohServers.length > 0">{{
        $t('pageDDNSNetwork.ddnsConfiguration.dohServer')
      }}</label>
      <b-row v-if="dohMode === 'Manual'">
        <b-col v-for="(server, index) in dohServers" :key="index" sm="6">
          <b-form-group>
            <b-form-input
              :id="'DOH-Server-' + index"
              v-model="dohServers[index]"
              type="text"
              placeholder="IPv4 or IPv6"
              data-test-id="doh-server-input"
              :state="getValidationState($v.dohServers.$each[index])"
              @input="$v.dohServers.$each[index].$touch()"
            />
            <b-button
              v-if="index > 0"
              variant="cancel"
              class="input-action-btn cancel-btn"
              data-test-id="remove-doh-server-button"
              @click="removeDohServer(index)"
            >
              <icon-misuse />
            </b-button>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.dohServers.$each[index].required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-else-if="!$v.dohServers.$each[index].validIPAddress">
                {{ $t('pageDDNSNetwork.ddnsConfiguration.invalidIPAddress') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <label v-if="dohMode === 'Manual'">{{
        $t('pageDDNSNetwork.ddnsConfiguration.dohDnsUrl')
      }}</label>
      <b-row v-if="dohMode === 'Manual'">
        <b-col sm="6">
          <b-form-group>
            <b-form-input
              id="DOH-DNS-URL"
              v-model="dohDnsUrl"
              type="text"
              data-test-id="doh-dns-url-input"
              :state="getValidationState($v.dohDnsUrl)"
              @input="$v.dohDnsUrl.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.dohDnsUrl.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-else-if="!$v.dohDnsUrl.validUrl">
                {{ $t('pageDDNSNetwork.ddnsConfiguration.invalidUrl') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-button
        type="submit"
        variant="primary"
        data-test-id="doh-save-button"
        :disabled="isButtonDisable"
        @click="saveDohConfiguration"
      >
        <icon-save />
        {{ $t('global.action.save') }}
      </b-button>
    </page-section>
  </b-container>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
import FormFile from '@/components/Global/FormFile';
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import IconMisuse from '@carbon/icons-vue/es/misuse/20';
import { mapState } from 'vuex';
import IconUpload from '@carbon/icons-vue/es/upload/20';
import IconSave from '@carbon/icons-vue/es/save/20';
export default {
  name: 'DDNSConfiguration',
  components: {
    PageSection,
    FormFile,
    IconAdd,
    IconMisuse,
    IconUpload,
    IconSave,
  },
  mixins: [VuelidateMixin, BVToastMixin, LoadingBarMixin],
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
      selectedInterface: '',
      file: null,
      form: {
        ddnsMethod: false,
        nsUpdateEnabled: false,
        useTSIG: false,
        useTSIGFileUpload: false,
      },
      domainNames: [],
      dohMode: 'Auto',
      dohServer: 'Google',
      dohServiceTraffic: 'Both',
      dohServers: [''],
      dohDnsUrl: '',
      dohModeOptions: [
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.disable'),
          value: 'Disabled',
        },
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.automatic'),
          value: 'Auto',
        },
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.manual'),
          value: 'Manual',
        },
      ],
      dohServerOptions: [
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.google'),
          value: 'Google',
        },
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.cloudflare'),
          value: 'Cloudflare',
        },
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.opendns'),
          value: 'OpenDNS',
        },
      ],
      dohServiceTrafficOptions: [
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.both'),
          value: 'Both',
        },
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.ipv4'),
          value: 'IPv4',
        },
        {
          text: this.$t('pageDDNSNetwork.ddnsConfiguration.ipv6'),
          value: 'IPv6',
        },
      ],
      ddnsInterfaceId:
        this.$store.getters['ddnsNetwork/ddnsSelectedInterfaceId'],
    };
  },
  computed: {
    ...mapState('ddnsNetwork', ['domainName1', 'ddnsSelectedInterfaceId']),
    ddnsEthernetData() {
      return this.$store.getters['ddnsNetwork/ddnsEthernetData'][this.tabIndex];
    },
    dhcpv4useDomainName() {
      return this.$store.getters['ddnsNetwork/domainNameServer'][this.tabIndex]
        .dhcpv4.useDomainNameEnabled;
    },
    dhcpv6useDomainName() {
      return this.$store.getters['ddnsNetwork/domainNameServer'][this.tabIndex]
        .dhcpv6.useDomainNameEnabled;
    },
    sendHostNameEnabled: {
      get() {
        console.log(
          this.$store.getters['ddnsNetwork/ddnsEthernetData'][this.tabIndex].Oem
            ?.Ami?.DNSConfiguration?.DHCPConfiguration?.SendHostNameEnabled,
        );
        return this.$store.getters['ddnsNetwork/ddnsEthernetData'][
          this.tabIndex
        ].Oem?.Ami?.DNSConfiguration?.DHCPConfiguration?.SendHostNameEnabled;
      },
      set(newValue) {
        return newValue;
      },
    },
  },
  watch: {
    tabIndex() {
      this.getdata();
    },
    ddnsSelectedInterfaceId: function (value) {
      this.ddnsInterfaceId = value;
    },
  },
  created() {
    this.getdata();
  },
  validations() {
    return {
      file: {
        required,
        pattern: function (file) {
          if (!this.$v.file.required) return true;
          return this.getIsFileTypeCorrect(file);
        },
      },
      domainNames: {
        $each: {
          required,
          validFQDN: function (value) {
            if (!value) return true; // Skip validation if empty (required handles this)
            return this.isValidFQDN(value);
          },
        },
      },
      dohServers: {
        $each: {
          required: function (value) {
            if (this.dohMode !== 'Manual') return true;
            return required(value);
          },
          validIPAddress: function (value) {
            if (this.dohMode !== 'Manual' || !value) return true;
            return this.isValidIPAddress(value);
          },
        },
      },
      dohDnsUrl: {
        required: function (value) {
          if (this.dohMode !== 'Manual') return true;
          return required(value);
        },
        validUrl: function (value) {
          if (this.dohMode !== 'Manual' || !value) return true;
          return this.isValidUrl(value);
        },
      },
    };
  },
  methods: {
    getdata() {
      this.selectedInterface = this.tabIndex;
      const ddnsData = this.ddnsEthernetData?.Oem?.Ami?.DNSConfiguration;
      this.form.ddnsMethod =
        ddnsData?.InterfacesConfiguration?.DDNSMethod === 'Register'
          ? true
          : false;
      this.form.nsUpdateEnabled =
        ddnsData?.InterfacesConfiguration?.NSUpdateEnable;
      this.form.useTSIG = ddnsData?.InterfacesConfiguration?.UseTSIG;
      this.form.useTSIGFileUpload = this.form.useTSIG;
      this.domainNames = ddnsData?.DomainConfiguration?.DomainNames || [];

      const dohData = ddnsData?.DoHSetting;

      this.dohMode = dohData?.DoHMode || 'Auto';

      if (this.dohMode === 'Manual') {
        this.dohServers =
          Array.isArray(dohData?.DoHServers) && dohData.DoHServers.length > 0
            ? dohData.DoHServers
            : [''];
        this.dohDnsUrl = dohData?.DoHURL || '';
      } else if (this.dohMode === 'Auto') {
        this.dohServer =
          Array.isArray(dohData?.DoHServers) && dohData.DoHServers.length > 0
            ? dohData.DoHServers[0]
            : 'Google';
        this.dohServiceTraffic = dohData?.ServiceTrafficMode || 'Both';
      } else {
        //Disabled
      }
    },
    handleSubmit() {
      let data = {};
      data.DDNSMethod =
        this.form.ddnsMethod === true ? 'Register' : 'Deregister';
      data.NSUpdateEnable = this.form.nsUpdateEnabled;
      data.UseTSIG = this.form.useTSIG;
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/saveInterfaceConfiguration', data)
        .then((success) => {
          if (success) {
            this.getdata();
            this.successToast(success);
          }
        })
        .catch(({ message }) => {
          this.getdata();
          this.errorToast(message);
        })
        .finally(() => this.endLoader());
    },
    doNSUpdate() {
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/nsUpdate')
        .then((success) => {
          if (success) {
            this.successToast(success);
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    onFileUpload(file) {
      this.file = file;
      this.$v.file.$touch();
    },
    clearFile() {
      const formFileComponent = this.$refs.formFile;
      if (formFileComponent) {
        formFileComponent.clearSelectedFile();
      }
    },
    onSubmitUpload() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/uploadTSIGFile', this.file)
        .then((message) => {
          this.successToast(message);
          this.clearFile();
        })
        .catch(({ message }) => {
          this.errorToast(message);
          this.clearFile();
        })
        .finally(() => {
          this.reset();
          this.endLoader();
        });
    },
    getIsFileTypeCorrect(file) {
      const fileTypeExtension = file.name.split('.').pop();
      return fileTypeExtension === 'private';
    },
    isValidFQDN(domain) {
      let cleanDomain = domain.trim();
      cleanDomain = cleanDomain.replace(/^(https?:\/\/)/i, '');

      if (!cleanDomain || cleanDomain.length > 253) {
        return false;
      }

      if (!cleanDomain.includes('.')) {
        return false;
      }

      const labels = cleanDomain.split('.');

      if (labels.length < 2) {
        return false;
      }

      const labelRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];

        if (label.length === 0 || label.length > 63) {
          return false;
        }

        if (!labelRegex.test(label)) {
          return false;
        }
      }

      const tld = labels[labels.length - 1];
      if (tld.length < 2 || !/^[a-zA-Z]{2,}$/.test(tld)) {
        return false;
      }

      return true;
    },
    isValidIPAddress(value) {
      const input = value?.trim();
      if (!input) return false;

      const ipv4Regex =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
      const ipv6Regex =
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2})|(([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3})|(([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4})|(([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5})|([0-9a-fA-F]{1,4}:)((:[0-9a-fA-F]{1,4}){1,6})|(:)((:[0-9a-fA-F]{1,4}){1,7}|:))$/;

      return ipv4Regex.test(input) || ipv6Regex.test(input);
    },
    isValidUrl(value) {
      const urlRegex =
        /(https:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g;
      return value.match(urlRegex) !== null;
    },
    reset() {
      this.file = null;
      this.$v.$reset();
    },
    addDomainName() {
      if (this.domainNames.length < 12) {
        this.domainNames.push(''); // Add a new empty string to represent a new input field
      }
    },
    removeDomainName(index) {
      this.domainNames.splice(index, 1); // Remove the domain at the given index
    },
    onDohModeChange(mode) {
      this.dohMode = mode;

      if (this.dohMode === 'Auto') {
        if (!this.dohServer) this.dohServer = 'Google';
        if (!this.dohServiceTraffic) this.dohServiceTraffic = 'Both';
      } else if (this.dohServers.length === 0) {
        this.dohServers.push('');
      }

      this.$v.dohServers.$reset();
      this.$v.dohDnsUrl.$reset();
    },
    onDohServerChange(server) {
      this.dohServer = server;
    },
    onDohServiceTrafficChange(mode) {
      this.dohServiceTraffic = mode;
    },
    addDohServer() {
      if (this.dohServers.length < 3) {
        this.dohServers.push('');
      }
    },
    removeDohServer(index) {
      this.dohServers.splice(index, 1);
    },
    saveDohConfiguration() {
      this.$v.$touch();

      if (this.dohMode === 'Manual') {
        const hasInvalidServer = this.dohServers.some(
          (_, index) => this.$v.dohServers.$each[index].$invalid,
        );
        if (hasInvalidServer || this.$v.dohDnsUrl.$invalid) {
          return;
        }
      }

      const doHSetting =
        this.dohMode === 'Auto'
          ? {
              DoHMode: this.dohMode,
              DoHServers: [this.dohServer],
              ServiceTrafficMode: this.dohServiceTraffic,
            }
          : {
              DoHMode: this.dohMode,
              DoHServers: this.dohServers.map((server) => server.trim()),
              DoHURL: this.dohDnsUrl.trim(),
            };

      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/saveDohConfiguration', doHSetting)
        .then((success) => {
          if (success) {
            this.successToast(success);
            this.getdata();
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    saveConfigurations() {
      this.$v.$touch(); // Trigger validation
      var flag = false;
      this.domainNames.forEach((domain, index) => {
        if (this.$v.domainNames.$each[index].$invalid) {
          flag = true;
          return;
        }
      });
      if (flag) {
        return;
      }
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/saveDomainNameConfigurations', this.domainNames)
        .then((success) => {
          if (success) {
            this.successToast(success);
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    changeHostNameEnabled(state) {
      this.startLoader();
      this.$store
        .dispatch('ddnsNetwork/saveHostNameEnabled', state)
        .then((success) => {
          if (success) {
            this.successToast(success);
          }
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
<style lang="scss" scoped>
.section_DDNS {
  font-size: large;
  width: -webkit-fill-available;
}
.cancel-btn {
  padding: 6px !important;
  margin-top: 2px;
  margin-right: 12px;
}
.btn-cancel {
  font-weight: $headings-font-weight;
  text-decoration: none !important;
  color: #cb2026;
  &:hover {
    color: #d24145;
  }
  &:focus {
    box-shadow: inset 0 0 0 0;
    color: #d24145;
    outline: none;
  }
  &:disabled {
    box-shadow: $btn-focus-box-shadow;
  }
}
</style>
