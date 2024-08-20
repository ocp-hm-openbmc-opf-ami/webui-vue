<template>
  <b-container fluid="xl">
    <page-section
      :section-title="
        $t('pageDDNSNetwork.ddnsConfiguration.domainConfiguration')
      "
    >
      <b-row>
        <b-col sm="3">
          <b-button
            variant="link"
            :disabled="
              domainNames.length >= 12 ||
              dhcpv4useDomainName ||
              dhcpv6useDomainName
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
              :state="getValidationState($v.domainNames.$each[index])"
              @input="$v.domainNames.$each[index].$touch()"
            />
            <b-button
              v-if="index > 0"
              variant="cancel"
              class="input-action-btn cancel-btn"
              @click="removeDomainName(index)"
            >
              <icon-misuse />
            </b-button>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.domainNames.$each[index].required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-button type="submit" variant="primary" @click="saveConfigurations">
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
              <b-form-checkbox v-model="form.nsUpdateEnabled" switch>
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
              <b-form-checkbox v-model="form.useTSIG" switch>
                <span v-if="form.useTSIG">
                  {{ $t('global.status.enabled') }}
                </span>
                <span v-else>{{ $t('global.status.disabled') }}</span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col v-if="form.useTSIG" sm="3">
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
                ref="formFile"
                v-model="file"
                accept=".private"
                :state="getValidationState($v.file)"
                aria-describedby="image-file-help-block"
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
              @click="onSubmitUpload"
            >
              {{ $t('global.action.upload') }}
            </b-button>
          </b-col>
        </b-row>
      </div>
    </page-section>
    <b-button type="submit" variant="primary" @click="handleSubmit">
      {{ $t('global.action.save') }}
    </b-button>
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
export default {
  name: 'DDNSConfiguration',
  components: {
    PageSection,
    FormFile,
    IconAdd,
    IconMisuse,
  },
  mixins: [VuelidateMixin, BVToastMixin, LoadingBarMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
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
      },
      domainNames: [],
    };
  },
  computed: {
    ...mapState('ddnsNetwork', ['domainName1']),
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
  },
  watch: {
    tabIndex() {
      this.getdata();
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
          return this.getIsFileTypeCorrect(file);
        },
      },
      domainNames: {
        $each: {
          required,
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
      this.domainNames = ddnsData?.DomainConfiguration?.DomainNames || [];
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
            this.successToast(success);
          }
        })
        .catch(({ message }) => this.errorToast(message))
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
