<template>
  <div class="form-background p-3">
    <b-form novalidate @submit.prevent="handleSubmit">
      <b-form-group
        :label="
          $t('pageServerPowerOperations.bootSettings.bootSettingsOverride')
        "
        label-for="boot-option"
        class="mb-3"
      >
        <b-form-select
          id="boot-option"
          v-model="form.bootOption"
          :disabled="bootSourceOptions.length === 0"
          :options="bootSourceOptions"
          @change="onChangeSelect"
        >
        </b-form-select>
      </b-form-group>
      <b-form-checkbox
        v-model="form.oneTimeBoot"
        class="mb-4"
        :disabled="form.bootOption === 'None' || isForcedOneTimeBootTarget"
        @change="$v.form.oneTimeBoot.$touch()"
      >
        {{ $t('pageServerPowerOperations.bootSettings.enableOneTimeBoot') }}
      </b-form-checkbox>
      <b-form-group
        :label="$t('pageServerPowerOperations.bootSettings.tpmRequiredPolicy')"
      >
        <b-form-text id="tpm-required-policy-help-block">
          {{
            $t('pageServerPowerOperations.bootSettings.tpmRequiredPolicyHelper')
          }}
        </b-form-text>
        <b-form-checkbox
          id="tpm-required-policy"
          v-model="form.tpmPolicyOn"
          aria-describedby="tpm-required-policy-help-block"
          @change="$v.form.tpmPolicyOn.$touch()"
        >
          {{ $t('global.status.enabled') }}
        </b-form-checkbox>
      </b-form-group>
      <b-button
        variant="primary"
        type="submit"
        class="mb-3"
        :disabled="globalPrivilege !== 'Administrator'"
      >
        <icon-save />
        {{ $t('global.action.save') }}
      </b-button>
    </b-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import IconSave from '@carbon/icons-vue/es/save/20';

export default {
  name: 'BootSettings',
  components: { IconSave },
  mixins: [BVToastMixin, LoadingBarMixin],
  data() {
    return {
      form: {
        bootOption: this.$store.getters['serverBootSettings/bootSource'],
        oneTimeBoot: this.$store.getters['serverBootSettings/overrideEnabled'],
        tpmPolicyOn: this.$store.getters['serverBootSettings/tpmEnabled'],
      },
      globalPrivilege: this.$store.getters['global/userPrivilege'],
    };
  },
  computed: {
    ...mapState('serverBootSettings', [
      'bootSourceOptions',
      'bootSource',
      'overrideEnabled',
      'tpmEnabled',
    ]),
    isForcedOneTimeBootTarget() {
      return ['BiosSetup', 'UefiBootNext', 'UefiTarget'].includes(
        this.form.bootOption,
      );
    },
  },
  watch: {
    bootSource: function (value) {
      this.form.bootOption = value;
      if (['BiosSetup', 'UefiBootNext', 'UefiTarget'].includes(value)) {
        this.form.oneTimeBoot = false;
      }
    },
    overrideEnabled: function (value) {
      this.form.oneTimeBoot = value;
    },
    tpmEnabled: function (value) {
      this.form.tpmPolicyOn = value;
    },
  },
  validations: {
    // Empty validations to leverage vuelidate form states
    // to check for changed values
    form: {
      bootOption: {},
      oneTimeBoot: {},
      tpmPolicyOn: {},
    },
  },
  created() {
    this.$root.$emit('server-power-operations-boot-settings-complete');
  },
  methods: {
    handleSubmit() {
      this.startLoader();
      const tpmPolicyChanged = this.$v.form.tpmPolicyOn.$dirty;
      let settings;
      let bootSource = this.form.bootOption;
      let overrideEnabled = this.form.oneTimeBoot;
      let tpmEnabled = null;

      if (tpmPolicyChanged) tpmEnabled = this.form.tpmPolicyOn;
      settings = { bootSource, overrideEnabled, tpmEnabled };

      this.$store
        .dispatch('serverBootSettings/saveSettings', settings)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => {
          this.$v.form.$reset();
          this.endLoader();
        });
    },
    onChangeSelect(selectedOption) {
      this.$v.form.bootOption.$touch();
      // Disable one time boot for None and forced one-time boot targets.
      if (
        selectedOption === 'None' ||
        ['BiosSetup', 'UefiBootNext', 'UefiTarget'].includes(selectedOption)
      ) {
        this.form.oneTimeBoot = false;
      }
    },
  },
};
</script>
