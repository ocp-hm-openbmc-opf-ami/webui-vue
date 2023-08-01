<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageAlertDestination.pageDescription')" />
    <page-section :section-title="$t('pageAlertDestination.sectionTitle')">
      <b-form novalidate @submit.prevent="handleSubmit">
        <div class="form-background p-3">
          <b-form-group
            class="m-0"
            :label="$t('pageAlertDestination.alertDestinationLabel')"
            label-class="sr-only"
            :disabled="loading"
          >
            <b-row>
              <b-col md="9" lg="8" xl="9">
                <b-row>
                  <b-col sm="6" xl="4">
                    <b-form-group
                      :label="$t('pageAlertDestination.sendEmailTo')"
                      label-for="email-address1"
                    >
                      <b-form-input
                        id="email-address1"
                        v-model="form.emailAddress1"
                        data-test-id="alertDestination-input-emailAddress1"
                        :state="getValidationState($v.form.emailAddress1)"
                        @input="$v.form.emailAddress1.$touch()"
                      />
                      <b-form-invalid-feedback role="alert">
                        <template v-if="!$v.form.emailAddress1.required">
                          {{ $t('global.form.fieldRequired') }}
                        </template>
                        <template v-else-if="!$v.form.emailAddress1.email">
                          {{ $t('global.form.invalidFormat') }}
                        </template>
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" xl="4">
                    <b-form-group
                      :label="$t('pageAlertDestination.sendEmailTo')"
                      label-for="server-address2"
                    >
                      <b-form-input
                        id="server-address2"
                        v-model="form.emailAddress2"
                        data-test-id="alertDestination-input-emailAddress2"
                        :state="getValidationState($v.form.emailAddress2)"
                        @input="$v.form.emailAddress2.$touch()"
                      />
                      <b-form-invalid-feedback role="alert">
                        <template v-if="!$v.form.emailAddress2.required">
                          {{ $t('global.form.fieldRequired') }}
                        </template>
                        <template v-else-if="!$v.form.emailAddress2.email">
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
          <b-col sm="2" xl="2">
            <b-btn
              variant="primary"
              type="submit"
              data-test-id="alertDestination-button-saveSettings"
              :disabled="loading"
            >
              {{ $t('global.action.saveSettings') }}
            </b-btn>
          </b-col>
          <b-col sm="2" xl="2">
            <b-btn
              variant="primary"
              data-test-id="alertDestination-button-sendTestAlert"
              :disabled="loading"
              @click="checkEmailAddress"
            >
              {{ $t('pageAlertDestination.sendTestAlert') }}
            </b-btn>
          </b-col>
        </b-row>
      </b-form>
    </page-section>
  </b-container>
</template>

<script>
import { email, requiredIf } from 'vuelidate/lib/validators';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';

export default {
  name: 'AlertDestinationSettings',
  components: {
    PageTitle,
    PageSection,
  },
  mixins: [BVToastMixin, VuelidateMixin, LoadingBarMixin],
  data() {
    return {
      form: {
        emailAddress1: '',
        emailAddress2: '',
      },
      loading,
    };
  },
  validations: {
    form: {
      emailAddress1: {
        required: requiredIf(function () {
          return this.requireEmail();
        }),
        email,
      },
      emailAddress2: {
        required: requiredIf(function () {
          return this.requireEmail();
        }),
        email,
      },
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('alertDestination/getAlertDestinationData')
      .finally(() => {
        this.endLoader();
        this.updateAlertDestinationData();
      });
  },
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const data = [this.form.emailAddress1, this.form.emailAddress2];
      this.startLoader();
      this.$store
        .dispatch('alertDestination/setAlertDestinationData', data)
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
    updateAlertDestinationData() {
      this.form.emailAddress1 = this.$store.getters[
        'alertDestination/getEmailAddress1'
      ];
      this.form.emailAddress2 = this.$store.getters[
        'alertDestination/getEmailAddress2'
      ];
    },
    checkEmailAddress() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      if (this.form.emailAddress1 == '' && this.form.emailAddress2 == '') {
        this.errorToast('Configure send Email address to send Test mail.');
        return;
      }
      if (this.form.emailAddress1) {
        this.sendTestAlert(this.form.emailAddress1);
      }
      if (this.form.emailAddress2) {
        this.sendTestAlert(this.form.emailAddress2);
      }
    },
    sendTestAlert(recipient) {
      this.startLoader();
      const data = {
        Recipient: recipient,
        Subject: 'Sample Mail',
        MailContent: 'Hi, This is just a sample mail!',
      };
      this.$store
        .dispatch('alertDestination/sendTestAlert', data)
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
    requireEmail() {
      if (this.form.emailAddress1 == '' && this.form.emailAddress2 == '')
        return true;
    },
  },
};
</script>
