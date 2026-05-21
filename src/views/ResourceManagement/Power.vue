<template>
  <b-container fluid="xl">
    <page-title :description="$t('pagePower.description')" />
    <b-form @submit.prevent="submitForm">
      <b-form-group :disabled="loading"
        ><b-row>
          <b-col sm="8" md="6" xl="3">
            <b-form-group
              id="input-group-1"
              :label="$t('pagePower.powerCapLabel')"
              label-for="input-1"
            >
              <b-form-text id="power-help-text">
                {{
                  $t('pagePower.powerCapLabelTextInfo', {
                    min: 0,
                    max: 1000,
                  })
                }}
              </b-form-text>
              <b-form-text id="power-help-text">
                {{ $t('pagePower.powerCapDisablesState') }}
              </b-form-text>

              <b-form-input
                id="input-1"
                v-model.number="powerCapValue"
                data-test-id="power-input-powerCapValue"
                type="number"
                aria-describedby="power-help-text"
                :state="getValidationState($v.powerCapValue)"
              ></b-form-input>

              <b-form-invalid-feedback id="input-live-feedback" role="alert">
                <template v-if="!$v.powerCapValue.required">
                  {{ $t('global.form.fieldRequired') }}
                </template>
                <template v-else-if="!$v.powerCapValue.between">
                  {{ $t('global.form.invalidValue') }}
                </template>
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>

        <b-button
          variant="primary"
          type="submit"
          :disabled="isButtonDisable"
          data-test-id="power-button-savePowerCapValue"
        >
          <icon-save />
          {{ $t('global.action.save') }}
        </b-button>
      </b-form-group>
    </b-form>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { requiredIf, between } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import IconSave from '@carbon/icons-vue/es/save/20';
import { privilegesId } from '@/store/modules/GlobalStore';

export default {
  name: 'Power',
  components: { PageTitle, IconSave },
  mixins: [VuelidateMixin, BVToastMixin, LoadingBarMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      loading,
    };
  },
  computed: {
    ...mapGetters({
      powerConsumptionValue: 'powerControl/powerConsumptionValue',
    }),
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      return this.userPrivilege !== privilegesId.admin;
    },

    powerCapValue: {
      get() {
        let powerCapValue = this.$store.getters['powerControl/powerCapValue'];
        return powerCapValue !== null ? powerCapValue : 0;
      },
      set(value) {
        this.$v.$touch();
        this.$store.dispatch('powerControl/setPowerCapUpdatedValue', value);
      },
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('powerControl/getPowerControl')
      .finally(() => this.endLoader());
  },
  validations: {
    powerCapValue: {
      between: between(0, 1000),
      required: requiredIf(function () {
        return !this.powerCapValue;
      }),
    },
  },
  methods: {
    submitForm() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.startLoader();
      this.$store
        .dispatch('powerControl/setPowerControl', this.powerCapValue)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
