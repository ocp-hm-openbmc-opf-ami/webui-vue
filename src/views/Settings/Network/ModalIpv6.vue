<template>
  <b-modal
    id="modal-add-ipv6"
    ref="modal"
    :title="$t('pageNetwork.table.addIpv6Address')"
    @hidden="resetForm"
  >
    <b-form id="form-ipv6" @submit.prevent="handleSubmit">
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageNetwork.modal.ipAddress')"
            label-for="ipAddress"
          >
            <b-form-input
              id="ipAddress"
              v-model="form.ipAddress"
              type="text"
              :state="getValidationState($v.form.ipAddress)"
              @input="$v.form.ipAddress.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.ipAddress.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-if="!$v.form.ipAddress.ipAddress">
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageNetwork.modal.prefixLength')"
            label-for="prefixLength"
          >
            <b-form-input
              id="prefixLength"
              v-model="form.prefixLength"
              type="text"
              :state="getValidationState($v.form.prefixLength)"
              @input="$v.form.prefixLength.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.prefixLength.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-if="!$v.form.prefixLength.ipAddress">
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageNetwork.modal.gateway')"
            label-for="gateway"
          >
            <b-form-input
              id="gateway"
              v-model="form.gateway"
              type="text"
              :state="getValidationState($v.form.gateway)"
              @input="$v.form.gateway.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.gateway.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-if="!$v.form.gateway.ipAddress">
                {{ $t('global.form.invalidFormat') }}
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
      <b-button form="form-ipv6" type="submit" variant="primary" @click="onOk">
        {{ $t('global.action.add') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { helpers, required } from 'vuelidate/lib/validators';

export default {
  mixins: [VuelidateMixin],
  props: {
    defaultGateway: {
      type: String,
      default: '',
    },
    ipv6Data: {
      type: Object,
      default: () => {},
    },
    addIpv6: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        ipAddress: '',
        prefixLength: '',
        gateway: '',
      },
      isAddIpv6: false,
    };
  },
  watch: {
    defaultGateway() {
      // this.form.gateway = this.defaultGateway;
    },
    addIpv6() {
      this.isAddIpv6 = this.addIpv6;
      if (this.isAddIpv6) {
        this.form.ipAddress = null;
        this.form.gateway = null;
        this.form.prefixLength = null;
      }
    },
    ipv6Data() {
      this.form.ipAddress = this.ipv6Data?.Address;
      this.form.gateway = this.ipv6Data?.Gateway;
      this.form.prefixLength = this.ipv6Data?.PrefixLength;
    },
  },
  validations() {
    return {
      form: {
        ipAddress: {
          required,
          pattern: helpers.regex(
            'pattern',
            /^(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}(?::[0-9a-fA-F]{1,4}){1,1}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|(?:[0-9a-fA-F]{1,4}:){1,1}(?::[0-9a-fA-F]{1,4}){1,6}|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9]{2,2}|0?[0-9]{0,2})\.){3,3}(?:2(?:5[0-5]|[0-4][0-9])|1[0-9]{2,2}|0?[0-9]{0,2})|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9]{2,2}|0?[0-9]{0,2})\.){3,3}(?:2(?:5[0-5]|[0-4][0-9])|1[0-9]{2,2}|0?[0-9]{0,2}))$/i
          ),
        },
        prefixLength: {
          required,
        },
        gateway: {
          required,
          pattern: helpers.regex(
            'pattern',
            /^(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}(?::[0-9a-fA-F]{1,4}){1,1}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|(?:[0-9a-fA-F]{1,4}:){1,1}(?::[0-9a-fA-F]{1,4}){1,6}|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9]{2,2}|0?[0-9]{0,2})\.){3,3}(?:2(?:5[0-5]|[0-4][0-9])|1[0-9]{2,2}|0?[0-9]{0,2})|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9]{2,2}|0?[0-9]{0,2})\.){3,3}(?:2(?:5[0-5]|[0-4][0-9])|1[0-9]{2,2}|0?[0-9]{0,2}))$/i
          ),
        },
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$emit('ok', {
        Address: this.form.ipAddress,
        PrefixLength: this.form.prefixLength,
        Gateway: this.form.gateway,
      });
      this.closeModal();
    },
    cancel() {
      this.closeModal();
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },
    resetForm() {
      if (this.isAddIpv6) {
        this.form.ipAddress = null;
        this.form.gateway = null;
        this.form.prefixLength = null;
      } else {
        this.form.ipAddress = this.ipv6Data.Address;
        this.form.gateway = this.ipv6Data.Gateway;
        this.form.prefixLength = this.ipv6Data.PrefixLength;
      }
      this.$v.$reset();
      this.$emit('hidden');
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
  },
};
</script>
