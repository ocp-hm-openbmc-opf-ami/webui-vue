<template>
  <b-modal
    id="modal-add-ipv6"
    ref="modal"
    :title="$t('pageNetwork.table.addIpv6Address')"
    @hidden="resetForm"
  >
    <b-form id="form-ipv6" @submit.prevent="handleSubmit">
      <b-row>
        <b-col v-if="getOemAmiActions" sm="6">
          <b-form-group
            :label="$t('pageNetwork.ipv6Index')"
            label-for="ipv6Index"
          >
            <b-form-select
              id="ipv6Index"
              v-model="form.ipv6Index"
              class="input"
              :options="ipv6IndexOptions"
              data-test-id="ipv6Index-option"
              :state="getValidationState($v.form.ipv6Index)"
              @input="$v.form.ipv6Index.$touch()"
              @change="indexChange"
              ><template #first>
                <b-form-select-option :value="valuedefault" disabled>
                  {{ $t('global.form.selectAnOption') }}
                </b-form-select-option>
              </template></b-form-select
            >
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.ipv6Index.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
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
import { required, requiredIf } from 'vuelidate/lib/validators';

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
    ipv6IndexValue: {
      type: Object,
      default: () => {},
    },
    modalSuccess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        ipv6Index: '',
        ipAddress: '',
        prefixLength: '',
        gateway: '',
      },
      valuedefault: '',
      isAddIpv6: false,
      ipv6IndexOptions: [
        {
          text: 0,
          value: 0,
        },
        {
          text: 1,
          value: 1,
        },
        {
          text: 2,
          value: 2,
        },
        {
          text: 3,
          value: 3,
        },
        {
          text: 4,
          value: 4,
        },
        {
          text: 5,
          value: 5,
        },
        {
          text: 6,
          value: 6,
        },
        {
          text: 7,
          value: 7,
        },
        {
          text: 8,
          value: 8,
        },
        {
          text: 9,
          value: 9,
        },
        {
          text: 10,
          value: 10,
        },
        {
          text: 11,
          value: 11,
        },
        {
          text: 12,
          value: 12,
        },
        {
          text: 13,
          value: 13,
        },
        {
          text: 14,
          value: 14,
        },
        {
          text: 15,
          value: 15,
        },
      ],
    };
  },
  computed: {
    getOemAmiActions() {
      return this.ipv6IndexValue.Actions?.Oem?.Ami ? true : false;
    },
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
      this.form.ipv6Index = this.ipv6Data?.ipv6Index;
    },
    modalSuccess: function (value) {
      if (value === true) {
        this.closeModal();
      }
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
        ipv6Index: {
          required: requiredIf(function () {
            if (this.getOemAmiActions) {
              return true;
            }
          }),
        },
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let params = {
        Address: this.form.ipAddress,
        PrefixLength: this.form.prefixLength,
        Gateway: this.form.gateway,
      };
      if (this.getOemAmiActions) {
        params.ipv6Index = this.form.ipv6Index;
      }
      this.$emit('ok', params);
      // this.closeModal();
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
        this.form.ipv6Index = null;
      } else {
        this.form.ipAddress = this.ipv6Data?.Address;
        this.form.gateway = this.ipv6Data?.Gateway;
        this.form.prefixLength = this.ipv6Data?.PrefixLength;
        this.form.ipv6Index = this.ipv6Data?.ipv6Index;
      }
      this.$v.$reset();
      this.$emit('closeAddModal', false);
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    indexChange(value) {
      this.ipv6IndexValue?.IPv6StaticAddresses?.some((val) => {
        if (val.Oem.Ami.StaticIPv6AddressIndex === value) {
          this.form.ipAddress = val.Address;
          this.form.prefixLength = val.PrefixLength;
          this.form.gateway = this.ipv6IndexValue.IPv6DefaultGateway;
          return true; // stops further iteration
        } else {
          this.form.ipAddress = null;
          this.form.gateway = null;
          this.form.prefixLength = null;
        }
      });
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
