<template>
  <b-modal
    id="configure-connection"
    ref="modal"
    @ok="onOk"
    @hidden="resetForm"
    @show="initModal"
  >
    <template #modal-title>
      {{ $t('pageVirtualMedia.modal.title') }}
    </template>
    <b-form>
      <b-form-group
        :label="$t('pageVirtualMedia.modal.serverUri')"
        label-for="serverUri"
      >
        <b-form-input
          id="serverUri"
          v-model="form.serverUri"
          type="text"
          :state="getValidationState($v.form.serverUri)"
          data-test-id="configureConnection-input-serverUri"
          @input="$v.form.serverUri.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.serverUri.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        :label="$t('pageVirtualMedia.modal.imagePath')"
        label-for="imagePath"
      >
        <b-form-input
          id="imagePath"
          v-model="form.imagePath"
          type="text"
          :state="getValidationState($v.form.imagePath)"
          data-test-id="configureConnection-input-imagePath"
          @input="$v.form.imagePath.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.imagePath.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group :label="$t('pageVirtualMedia.modal.mount')">
        <b-form-radio-group
          id="mount-type-options"
          v-model="form.transferProtocolType"
          :options="options"
          @change="mountChange($event)"
        >
        </b-form-radio-group>
      </b-form-group>
      <div
        v-if="
          form.transferProtocolType !== undefined &&
          form.transferProtocolType !== 'NFS'
        "
      >
        <b-form-group
          :label="$t('pageVirtualMedia.modal.username')"
          label-for="username"
        >
          <b-form-input
            id="username"
            v-model="form.username"
            type="text"
            :state="getValidationState($v.form.username)"
            data-test-id="configureConnection-input-username"
            autocomplete="new-username"
            @input="$v.form.username.$touch()"
          />
          <b-form-invalid-feedback role="alert">
            <template v-if="!$v.form.username.required">
              {{ $t('global.form.fieldRequired') }}
            </template>
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          :label="$t('pageVirtualMedia.modal.password')"
          label-for="password"
        >
          <b-form-input
            id="password"
            v-model="form.password"
            type="password"
            :state="getValidationState($v.form.password)"
            data-test-id="configureConnection-input-password"
            autocomplete="new-password"
            @input="$v.form.password.$touch()"
          />
          <b-form-invalid-feedback role="alert">
            <template v-if="!$v.form.password.required">
              {{ $t('global.form.fieldRequired') }}
            </template>
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <b-form-group>
        <b-form-checkbox
          v-model="form.isRW"
          data-test-id="configureConnection-input-isRW"
          name="check-button"
        >
          RW
        </b-form-checkbox>
      </b-form-group>
    </b-form>
    <template #modal-ok>
      {{ $t('global.action.save') }}
    </template>
    <template #modal-cancel>
      {{ $t('global.action.cancel') }}
    </template>
  </b-modal>
</template>

<script>
import { required, requiredIf } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
export default {
  mixins: [VuelidateMixin, BVToastMixin],
  props: {
    connection: {
      type: Object,
      default: null,
      validator: (prop) => {
        console.log(prop);
        return true;
      },
    },
  },
  data() {
    return {
      options: [
        { text: 'CIFS', value: 'CIFS' },
        { text: 'HTTPS', value: 'HTTPS' },
        { text: 'NFS', value: 'NFS' },
      ],
      form: {
        serverUri: null,
        imagePath: null,
        username: null,
        password: null,
        isRW: false,
        transferProtocolType: '',
      },
    };
  },
  watch: {
    connection: function (value) {
      if (value === null) return;
      Object.assign(this.form, value);
    },
  },
  validations() {
    return {
      form: {
        serverUri: {
          required,
        },
        imagePath: {
          required,
        },
        username: {
          required: requiredIf(function () {
            return (
              this.form.transferProtocolType !== undefined &&
              this.form.transferProtocolType !== 'NFS'
            );
          }),
        },
        password: {
          required: requiredIf(function () {
            return (
              this.form.transferProtocolType !== undefined &&
              this.form.transferProtocolType !== 'NFS'
            );
          }),
        },
      },
    };
  },
  methods: {
    mountChange(input) {
      if (input == 'NFS') {
        this.form.username = '';
        this.form.password = '';
      }
    },
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let connectionData = {};
      Object.assign(connectionData, this.form);
      this.$emit('ok', connectionData);
      this.closeModal();
    },
    initModal() {
      if (this.connection) {
        Object.assign(this.form, this.connection);
      }
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },
    resetForm() {
      this.form.serverUri = null;
      this.form.imagePath = null;
      this.form.username = null;
      this.form.password = null;
      this.form.isRW = false;
      this.form.transferProtocolType = '';
      this.$v.$reset();
    },
    onOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
  },
};
</script>
