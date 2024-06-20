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
              <template
                v-if="
                  $v.form.ipAddress.required && !$v.form.ipAddress.ipAddress
                "
              >
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
              <template
                v-if="
                  $v.form.prefixLength.required && !$v.form.prefixLength.pattern
                "
              >
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
              <template
                v-if="$v.form.gateway.required && !$v.form.gateway.ipAddress"
              >
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <template #modal-footer="{ cancel: modalCancel }">
      <b-button variant="secondary" @click="modalCancel()">
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
import { required } from 'vuelidate/lib/validators';

export default {
  mixins: [VuelidateMixin],
  props: {
    defaultGateway: {
      type: String,
      default: '',
    },
    ipv6Data: {
      type: Object,
      default: () => ({}),
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
          pattern: function (val) {
            return this.ipv6addressValidation(val);
          },
        },
        prefixLength: {
          required,
          pattern: function (val) {
            return this.ipv6prefixValidation(val);
          },
        },
        gateway: {
          required,
          pattern: function (val) {
            return this.ipv6gatewayValidation(val);
          },
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
    onCancel() {
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
    ipv6addressValidation(value) {
      if (
        !/^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/.test(
          value,
        ) ||
        /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
          value,
        ) ||
        /[fF][eE][8][0]::|[fF][eE][bB]::/.test(value) ||
        /[fF][eE][cC][0]::|[fF][eE][fF]::/.test(value) ||
        /[2][0][0][1]::/.test(value) ||
        /[2][0][0][1]:[dD][bB][8]::/.test(value) ||
        /::[fF][fF][fF][fF]:0:0/.test(value) ||
        (value != undefined &&
          value != null &&
          (String(value).charAt(0) == '0' || String(value).charAt(0) == ':'))
      ) {
        return false;
      } else {
        return true;
      }
    },
    ipv6prefixValidation(value) {
      if (!(/^\d+$/.test(value) && value >= 0 && value <= 128)) {
        return false;
      } else {
        return true;
      }
    },
    ipv6gatewayValidation(value) {
      if (
        !/^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/.test(
          value,
        ) ||
        /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
          value,
        ) ||
        (value != undefined &&
          value != null &&
          (String(value).charAt(0) == '0' || String(value).charAt(0) == ':'))
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
