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
        <b-form-text class="font-italic">
          {{ $t('pageVirtualMedia.modal.serverUriSupportFollowing') }}
        </b-form-text>
        <ul class="pl-3 mb-4">
          <li
            v-for="(item, index) in $t(
              `pageVirtualMedia.modal.serverUriSupport`,
            )"
            :key="index"
          >
            <b-form-text class="font-italic">
              {{ $t(item) }}
            </b-form-text>
          </li>
        </ul>
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
          <template
            v-if="$v.form.serverUri.required && !$v.form.serverUri.pattern"
          >
            {{ $t('global.form.invalidFormat') }}
          </template>
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        :label="$t('pageVirtualMedia.modal.imagePath')"
        label-for="imagePath"
      >
        <b-form-text class="font-italic">
          {{ $t('pageVirtualMedia.modal.imagePathSupport') }}
        </b-form-text>
        <b-form-text class="font-italic">
          {{ $t('pageVirtualMedia.modal.imagePathSupportCharacter') }}
        </b-form-text>
        <b-form-input
          id="imagePath"
          v-model="form.imagePath"
          type="text"
          maxlength="256"
          :state="getValidationState($v.form.imagePath)"
          data-test-id="configureConnection-input-imagePath"
          @input="$v.form.imagePath.$touch()"
        />
        <b-form-invalid-feedback role="alert">
          <template v-if="!$v.form.imagePath.required">
            {{ $t('global.form.fieldRequired') }}
          </template>
          <template
            v-if="$v.form.imagePath.required && !$v.form.imagePath.pattern"
          >
            {{ $t('global.form.invalidFormat') }}
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
        v-if="form.transferProtocolType && form.transferProtocolType !== 'NFS'"
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
          :disabled="isCDImage()"
          data-test-id="configureConnection-input-isRW"
          name="check-button"
        >
          RW
        </b-form-checkbox>
        <b-form-text v-if="isCDImage()" class="text-muted small">
          {{ $t('pageVirtualMedia.modal.rwDisabledForCD') }}
        </b-form-text>
      </b-form-group>
    </b-form>
    <template #modal-ok>
      <icon-save />
      {{ $t('global.action.save') }}
    </template>
    <template #modal-cancel>
      <icon-cancel />
      {{ $t('global.action.cancel') }}
    </template>
  </b-modal>
</template>

<script>
import { required, requiredIf, helpers } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconCancel from '@carbon/icons-vue/es/rule--cancelled/20';
import IconSave from '@carbon/icons-vue/es/save/20';
export default {
  components: { IconSave, IconCancel },
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
    'form.imagePath': function () {
      // Reset RW checkbox to false when switching to CD image
      if (this.isCDImage()) {
        this.form.isRW = false;
      }
    },
  },
  validations() {
    return {
      form: {
        serverUri: {
          required,
          pattern: helpers.regex(
            'pattern',
            /^(?=.{1,253}$)(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$|^(localhost|127\.0\.0\.1|(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])|([0-9A-Fa-f]{1,4}:){7,7}[0-9A-Fa-f]{1,4}|(::1))$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
          ),
        },
        imagePath: {
          required,
          pattern: helpers.regex(
            'pattern',
            /^[a-zA-Z0-9/\\_.-]+(\.(iso|nrg|ima|img))$/,
          ),
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
    isCDImage() {
      if (!this.form.imagePath) return false;
      const path = this.form.imagePath.toLowerCase();
      return path.endsWith('.iso') || path.endsWith('.nrg');
    },
    mountChange() {
      this.form.username = '';
      this.form.password = '';
    },
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      let connectionData = {};
      Object.assign(connectionData, this.form);
      const isIPv6 = this.ipv6Regex(connectionData.serverUri);
      if (isIPv6) {
        connectionData.serverUri = `[${connectionData.serverUri}]`;
      }
      this.$store.commit('virtualMedia/setSlotData', {
        slotId: connectionData.id,
        slotData: connectionData,
      });
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
