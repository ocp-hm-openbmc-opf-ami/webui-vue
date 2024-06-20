<template>
  <b-container fluid="xl">
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
export default {
  name: 'DDNSConfiguration',
  components: {
    PageSection,
    FormFile,
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
    };
  },
  computed: {
    ddnsEthernetData() {
      return this.$store.getters['ddnsNetwork/ddnsEthernetData'][this.tabIndex];
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
  },
};
</script>
<style scoped>
.section_DDNS {
  font-size: large;
  width: -webkit-fill-available;
}
</style>
