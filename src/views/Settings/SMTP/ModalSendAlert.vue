<template>
  <b-modal
    id="modal-send-alert"
    ref="modal"
    :title="$t('pageSmtp.alertDestination')"
    @hidden="resetForm"
  >
    <b-form id="form-alert" @submit.prevent="sendTestAlert">
      <b-row>
        <b-col sm="8">
          <b-form-group
            :label="$t('pageSmtp.modal.subject')"
            label-for="subject"
          >
            <b-form-input
              id="subject"
              v-model="subject"
              type="text"
              :state="getValidationState($v.subject)"
              @input="$v.subject.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.subject.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-form-group
            :label="$t('pageSmtp.modal.mailContent')"
            label-for="mailContent"
          >
            <b-form-textarea
              id="mailContent"
              v-model="mailContent"
              type="text"
              rows="3"
              :state="getValidationState($v.mailContent)"
              @input="$v.mailContent.$touch()"
            ></b-form-textarea>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.mailContent.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <template #modal-footer="{ cancel }">
      <b-button variant="secondary" @click="cancel()">
        {{ $t('global.action.cancel') }}
      </b-button>
      <b-button form="form-alert" type="submit" variant="primary" @click="onOk">
        {{ $t('global.action.send') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { required } from 'vuelidate/lib/validators';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  mixins: [VuelidateMixin, BVToastMixin, LoadingBarMixin],
  data() {
    return {
      subject: 'Sample Mail',
      mailContent: 'Hi, This is just a sample mail!',
    };
  },
  validations() {
    return {
      subject: {
        required,
      },
      mailContent: {
        required,
      },
    };
  },
  methods: {
    sendTestAlert() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const data = {
        Subject: this.subject,
        MailContent: this.mailContent,
      };
      this.startLoader();
      this.$store
        .dispatch('smtp/sendTestAlert', data)
        .then((success) => {
          this.successToast(success);
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.endLoader();
          this.closeModal();
        });
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.sendTestAlert();
    },
    resetForm() {
      this.subject = 'Sample Mail';
      this.mailContent = 'Hi, This is just a sample mail!';
    },
  },
};
</script>
