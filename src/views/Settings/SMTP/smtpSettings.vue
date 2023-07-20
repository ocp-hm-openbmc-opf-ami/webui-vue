<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageSmtp.pageDescription')" />
    <page-section :section-title="$t('pageSmtp.sectionTitle')">
      <b-form novalidate @submit.prevent="handleSubmit">
        <div class="form-background p-3">
          <b-form-group
            class="m-0"
            :label="$t('pageSmtp.smtpLabel')"
            label-class="sr-only"
            :disabled="loading"
          >
            <b-row>
              <b-col md="9" lg="8" xl="9">
                <b-row>
                  <b-col sm="12" xl="12">
                    <b-form-group
                      :label="$t('pageSmtp.formGroupLabel')"
                      label-for="enable-smtp-configuration"
                    >
                      <b-form-checkbox
                        id="enable-smtp-configuration"
                        v-model="form.enableConfiguration"
                        data-test-id="smtp-input-enableConfiguration"
                        switch
                        @change="enableSMTPConfiguration"
                      >
                        <span v-if="form.enableConfiguration">
                          {{ $t('global.status.enabled') }}
                        </span>
                        <span v-else>{{ $t('global.status.disabled') }}</span>
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" xl="4">
                    <b-form-group
                      :label="$t('pageSmtp.labelServerAddress')"
                      label-for="server-address"
                    >
                      <b-form-input
                        id="server-address"
                        v-model="form.serverAddress"
                        data-test-id="smtp-input-serverAddress"
                        :disabled="!form.enableConfiguration"
                        :state="getValidationState($v.form.serverAddress)"
                        @change="$v.form.serverAddress.$touch()"
                      />
                      <b-form-invalid-feedback role="alert">
                        <template v-if="!$v.form.serverAddress.required">
                          {{ $t('global.form.fieldRequired') }}
                        </template>
                        <template v-if="!$v.form.serverAddress.ipAddress">
                          {{ $t('global.form.invalidFormat') }}
                        </template>
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" xl="4">
                    <b-form-group
                      :label="$t('pageSmtp.labelPort')"
                      label-for="port"
                    >
                      <b-form-input
                        id="port"
                        v-model="form.port"
                        type="number"
                        :disabled="!form.enableConfiguration"
                        :state="getValidationState($v.form.port)"
                        @change="$v.form.port.$touch()"
                      />
                      <b-form-invalid-feedback role="alert">
                        {{ $t('global.form.fieldRequired') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" xl="4">
                    <b-form-group
                      :label="$t('pageSmtp.labelSenderEmailAddress')"
                      label-for="smtp-sender-email-address"
                    >
                      <b-form-input
                        id="smtp-sender-email-address"
                        v-model="form.senderEmailAddress"
                        data-test-id="smtp-input-senderEmailAddress"
                        :disabled="!form.enableConfiguration"
                        :state="getValidationState($v.form.senderEmailAddress)"
                        @change="$v.form.senderEmailAddress.$touch()"
                      />
                      <b-form-invalid-feedback role="alert">
                        <template v-if="!$v.form.senderEmailAddress.required">
                          {{ $t('global.form.fieldRequired') }}
                        </template>
                        <template v-if="!$v.form.senderEmailAddress.email">
                          {{ $t('global.form.invalidFormat') }}
                        </template>
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-form-group>
        </div>
        <b-row class="mt-4 mb-5">
          <b-col>
            <b-btn
              variant="primary"
              type="submit"
              data-test-id="smtp-button-saveSettings"
              :disabled="loading"
            >
              {{ $t('global.action.saveSettings') }}
            </b-btn>
          </b-col>
        </b-row>
      </b-form>
    </page-section>
  </b-container>
</template>

<script>
import { required, email, ipAddress } from 'vuelidate/lib/validators';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';

export default {
  name: 'SmtpSettings',
  components: {
    PageTitle,
    PageSection,
  },
  mixins: [BVToastMixin, VuelidateMixin, LoadingBarMixin],
  data() {
    return {
      form: {
        serverAddress: '',
        port: '',
        senderEmailAddress: '',
        enableConfiguration: '',
      },
      loading,
    };
  },
  watch: {
    isSMTPEnabled: function (value) {
      this.form.enableConfiguration = value;
    },
  },
  validations: {
    form: {
      serverAddress: {
        required,
        ipAddress,
      },
      port: { required },
      senderEmailAddress: {
        required,
        email,
      },
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('smtp/getSMTPdata').finally(() => {
      this.endLoader();
      this.updateSMTPData();
    });
  },
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const data = {
        FromAddress: this.form.senderEmailAddress,
        Port: parseInt(this.form.port),
        ServerAddress: this.form.serverAddress,
        ServiceEnabled: this.form.enableConfiguration,
      };
      this.startLoader();
      this.$store
        .dispatch('smtp/setSMTPdata', data)
        .then((success) => {
          this.successToast(success);
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.$v.form.$reset();
          this.endLoader();
        });
    },
    enableSMTPConfiguration() {
      console.log('smtp configuration', this.form.enableConfiguration);
    },
    updateSMTPData() {
      this.form.enableConfiguration = this.$store.getters['smtp/isSMTPEnabled'];
      (this.form.serverAddress = this.$store.getters['smtp/getSmtpServerIP']),
        (this.form.port = this.$store.getters['smtp/getSmtpServerPort']),
        (this.form.senderEmailAddress = this.$store.getters[
          'smtp/getSmtpSenderEmailAddress'
        ]);
    },
  },
};
</script>
