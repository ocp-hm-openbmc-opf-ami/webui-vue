<template>
  <b-modal id="modal-community-string" ref="modal" @hidden="resetForm">
    <template #modal-title>
      <template v-if="snmpCommunityData">
        {{ $t('pageSnmp.addCommunityString') }}
      </template>
      <template v-else>
        {{ $t('pageSnmp.editCommunityString') }}
      </template>
    </template>
    <b-form id="form-snmp-community" novalidate @submit.prevent="handleSubmit">
      <b-container>
        <b-row>
          <b-col>
            <b-row>
              <b-form-group
                :label="$t('pageSnmp.modal.communityProfile')"
                label-for="communityProfile"
                class="field-width"
              >
                <b-form-select
                  id="communityProfile"
                  v-model="form.communityProfile"
                  :options="communityProfileType"
                  data-test-id="snmp-select-communityProfile"
                  :state="getValidationState($v.form.communityProfile)"
                  @input="$v.form.communityProfile.$touch()"
                >
                  <template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template>
                </b-form-select>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.communityProfile.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
            <b-row>
              <b-form-group
                :label="$t('pageSnmp.modal.communityString')"
                label-for="communityString"
                class="field-width"
              >
                <b-form-input
                  id="communityString"
                  v-model="form.communityString"
                  type="text"
                  data-test-id="snmp-input-communityString"
                  :state="getValidationState($v.form.communityString)"
                  :disabled="!snmpCommunityData"
                  @input="$v.form.communityString.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.communityString.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.form.communityString.required &&
                      !$v.form.communityString.pattern
                    "
                  >
                    {{ $t('pageSnmp.defaultCommunity') }}
                  </template>
                  <template
                    v-if="
                      $v.form.communityString.required &&
                      $v.form.communityString.pattern &&
                      !$v.form.communityString.unique
                    "
                  >
                    {{ $t('pageSnmp.duplicateString') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
            <b-row>
              <b-form-group
                :label="$t('pageSnmp.modal.readWritePermission')"
                label-for="readWritePermission"
                class="field-width"
              >
                <b-form-select
                  id="readWritePermission"
                  v-model="form.readWritePermission"
                  :options="readWritePermissionType"
                  data-test-id="snmp-select-readWritePermission"
                  :state="getValidationState($v.form.readWritePermission)"
                  @input="$v.form.readWritePermission.$touch()"
                >
                  <template #first>
                    <b-form-select-option :value="null" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template>
                </b-form-select>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.form.readWritePermission.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-form>
    <template #modal-footer="{ cancel }">
      <b-button
        variant="secondary"
        data-test-id="snmp-button-cancel"
        @click="cancel()"
      >
        <icon-cancel />
        {{ $t('pageSnmp.modal.cancel') }}
      </b-button>
      <b-button
        form="form-snmp-community"
        data-test-id="snmp-button-submit"
        type="submit"
        variant="primary"
        @click="onOk"
      >
        <template v-if="snmpCommunityData">
          <icon-add />
          {{ $t('pageSnmp.modal.addCommunity') }}
        </template>
        <template v-else>
          <icon-save />
          {{ $t('global.action.save') }}
        </template>
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import IconSave from '@carbon/icons-vue/es/save/20';
import IconCancel from '@carbon/icons-vue/es/rule--cancelled/20';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
export default {
  components: {
    IconSave,
    IconCancel,
    IconAdd,
  },
  mixins: [VuelidateMixin],
  props: {
    communityStringData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        communityProfile: null,
        communityString: '',
        readWritePermission: null,
      },
      communityProfileType: [
        { value: 'all', text: this.$t('pageSnmp.modal.all') },
        { value: 'smtp', text: this.$t('pageSnmp.modal.smtp') },
        { value: 'system', text: this.$t('pageSnmp.modal.system') },
      ],
      readWritePermissionType: [
        {
          value: 'Limited',
          text: this.$t('pageSnmp.modal.readOnlyCommunity'),
        },
        {
          value: 'Full',
          text: this.$t('pageSnmp.modal.readWriteCommunity'),
        },
      ],
    };
  },
  computed: {
    snmpCommunityData() {
      return this.communityStringData ? false : true;
    },
    existingStringData() {
      return this.$store.getters['snmp/communityStrings'];
    },
  },
  watch: {
    communityStringData: function (value) {
      if (value === null) return;
      this.form.communityProfile = value.communityProfile;
      this.form.communityString = value.communityString;
      this.form.readWritePermission = value.readWritePermission;
    },
  },
  validations() {
    return {
      form: {
        communityProfile: {
          required,
        },
        communityString: {
          required,
          pattern: (val) => this.communityStringValidation(val),
          unique: (val) =>
            this.snmpCommunityData
              ? !this.existingStringData.includes(val)
              : true,
        },
        readWritePermission: {
          required,
        },
      },
    };
  },
  methods: {
    handleSubmit() {
      let SnmpCommunity = {};

      if (this.snmpCommunityData) {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        SnmpCommunity.communityProfile = this.form.communityProfile;
        SnmpCommunity.communityString = this.form.communityString;
        SnmpCommunity.readWritePermission = this.form.readWritePermission;
      } else {
        this.$v.$touch();
        if (this.$v.$invalid) return;
        SnmpCommunity.sino = this.communityStringData.Sino;
        if (this.$v.form.communityProfile.$dirty) {
          SnmpCommunity.communityProfile = this.form.communityProfile;
        }
        if (this.$v.form.communityString.$dirty) {
          SnmpCommunity.communityString = this.form.communityString;
        }
        if (this.$v.form.readWritePermission.$dirty) {
          SnmpCommunity.readWritePermission = this.form.readWritePermission;
        }
        if (Object.entries(SnmpCommunity).length === 1) {
          this.closeModal();
          return;
        }
      }
      this.$emit('ok', { isNewString: this.snmpCommunityData, SnmpCommunity });
      this.closeModal();
    },
    closeModal() {
      this.$nextTick(() => {
        this.$refs.modal.hide();
      });
    },
    resetForm() {
      this.form.communityProfile = null;
      this.form.communityString = '';
      this.form.readWritePermission = null;
      this.$v.$reset();
      this.$emit('hidden');
    },
    onOk(bvModalEvt) {
      // prevent modal close
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    communityStringValidation(value) {
      if (/^(?!\b(private|public)\b)[\w\s]+$/.test(value)) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style scoped>
.field-width {
  width: 220%;
}
</style>
