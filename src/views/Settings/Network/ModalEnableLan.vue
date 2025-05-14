<template>
  <b-modal
    id="modal-enable-lan"
    ref="modal"
    :title="$t('pageNetwork.modal.enableLAN')"
    @hidden="resetForm"
  >
    <b-form id="enableLan-settings" @submit.prevent="handleSubmit">
      <b-row>
        <b-col sm="4">
          <b-form-group :label="$t('pageNetwork.enableLAN')">
            <b-form-checkbox
              v-model="form.InterfaceEnabled"
              data-test-id="enableLAN"
              switch
            >
            </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageNetwork.modal.lanInterface')"
            label-for="protocol"
          >
            <b-form-select
              id="lanInterface"
              v-model="form.lanInterface"
              class="input"
              :options="interfaceOptions"
              data-test-id="ineterface-option"
              :state="getValidationState($v.form.lanInterface)"
              @change="vlanInterfaceChange"
              ><template #first>
                <b-form-select-option :value="valuedefault" disabled>
                  {{ $t('global.form.selectAnOption') }}
                </b-form-select-option>
              </template></b-form-select
            >
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.lanInterface.required">
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
      <b-button
        form="hostname-settings"
        type="submit"
        variant="primary"
        @click="onOk"
      >
        {{ $t('global.action.save') }}
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
    ethernetData: {
      type: Array,
      default: () => [],
    },
    modalSuccess: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valuedefault: '',
      interfaceOptions: [],
      form: {
        InterfaceEnabled: true,
        lanInterface: '',
      },
    };
  },
  watch: {
    ethernetData(val) {
      this.interfaceOptions = [];
      val.forEach((val) => {
        if (this.ethernetData.length > 0) {
          if (!val.data.Id.includes('usb')) {
            let ethernetDataOptionsVal = {
              value: val.data.Id,
              text: val.data.Id,
            };
            this.interfaceOptions.push(ethernetDataOptionsVal);
          }
        }
      });
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
        lanInterface: {
          required,
        },
      },
    };
  },
  methods: {
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
        this.resetForm();
      });
    },
    resetForm() {
      this.$emit('closeAddModal', false);
      // this.form.lanInterface = '';
      // this.form.InterfaceEnabled = false;
      this.$v.$reset();
    },
    vlanInterfaceChange(selectValue) {
      this.ethernetData.forEach((val) => {
        if (val.data.Id == selectValue) {
          this.form.InterfaceEnabled = val.data.InterfaceEnabled;
        }
      });
    },
    onOk() {
      // prevent modal close
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$bvModal
        .msgBoxConfirm(this.$t('pageNetwork.modal.confirmMsg'), {
          title: this.$tc('pageNetwork.modal.enableLAN'),
          okTitle: this.$tc('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((deleteConfirmed) => {
          if (deleteConfirmed) {
            this.$emit('ok', { form: this.form });
          }
        });
    },
  },
};
</script>
