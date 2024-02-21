<template>
  <b-modal
    id="modal-flashall-firewall"
    ref="modal"
    :title="$t('pageFireWall.firewallSettings.flushAll')"
    @hidden="resetForm"
  >
    <b-form id="form-flushallFirewall" @submit.prevent="handleSubmit">
      <b-row>
        <b-col sm="6">
          <b-form-group
            :label="$t('pageFireWall.firewallSettings.flushAll')"
            label-for="flushAll"
          >
            <b-form-select
              id="flushAll"
              v-model="form.flushAll"
              class="input"
              :options="flushAllOptions"
              data-test-id="flushall-option"
              :state="getValidationState($v.form.flushAll)"
            >
              <template #first>
                <b-form-select-option :value="valuedefault" disabled>
                  {{ $t('global.form.selectAnOption') }}
                </b-form-select-option>
              </template></b-form-select
            >
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.flushAll.required">
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
      <b-button form="form-ipv6" type="submit" variant="primary" @click="onOk">
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
  data() {
    return {
      valuedefault: '',
      form: {
        flushAll: '',
      },
      flushAllOptions: [
        {
          value: 'FlushIPv4',
          text: this.$t('pageFireWall.firewallSettings.modal.ipv4'),
        },
        {
          value: 'FlushIPv6',
          text: this.$t('pageFireWall.firewallSettings.modal.ipv6'),
        },
        {
          value: 'FlushBoth',
          text: this.$t('pageFireWall.firewallSettings.modal.both'),
        },
      ],
      context: null,
    };
  },
  validations() {
    return {
      form: {
        flushAll: {
          required,
        },
      },
    };
  },
  methods: {
    resetForm() {
      this.form.flushAll = '';
      this.$v.$reset();
    },
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$emit('flushaAllOk', { FlushType: this.form.flushAll });
      this.closeModal();
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
        this.resetForm();
      });
    },
  },
};
</script>
