<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageCups.pageDescription')" />
    <div class="form-background p-3">
      <b-row>
        <b-col md="2">
          <dl>
            <dt>
              <b>{{ $t('pageCups.dynamicLoadFactor') }}</b>
            </dt>
          </dl>
          <dl>
            <dt class="font-style">
              {{ $t('pageCups.dynamicLoadFactorCoreLoadFactor') }}
            </dt>
            <dd>
              {{ DynamicCoreLoadFactor }}
            </dd>
          </dl>

          <dl>
            <dt class="font-style">
              {{ $t('pageCups.dynamicLoadFactorMemoryLoadFactor') }}
            </dt>
            <dd>{{ DynamicMemoryLoadFactor }}</dd>
          </dl>

          <dl>
            <dt class="font-style">
              {{ $t('pageCups.dynamicLoadFactorIioLoadFactor') }}
            </dt>
            <dd>{{ DynamicIioLoadFactor }}</dd>
          </dl>
        </b-col>
        <b-col md="5">
          <dl>
            <dt>
              <b>{{ $t('pageCups.staticLoadFactor') }}</b>
            </dt>
          </dl>
          <b-form-text id="cups-service-help-block">
            {{ $t('pageCups.staticLoaderFactorSum') }}
            <br />
          </b-form-text>
          <b-form-group :label="$t('pageCups.staticLoadFactorCoreLoadFactor')">
            <b-form-input
              id="cups-service-staticCoreLoadFactor"
              v-model="StaticCoreLoadFactor"
              class="input"
              type="text"
              aria-describedby="cups-service-help-block"
              data-test-id="cups-service-input-staticCoreLoadFactor"
              :disabled="LoadFactorConfiguration === 'Dynamic'"
              :state="getValidationState($v.StaticCoreLoadFactor)"
              @input="$v.StaticCoreLoadFactor.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.StaticCoreLoadFactor.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('pageCups.staticLoadFactorMemoryLoadFactor')"
          >
            <b-form-input
              id="cups-service-staticMemoryLoadFactor"
              v-model="StaticMemoryLoadFactor"
              class="input"
              type="text"
              data-test-id="cups-service-input-staticMemoryLoadFactor"
              :disabled="LoadFactorConfiguration === 'Dynamic'"
              :state="getValidationState($v.StaticMemoryLoadFactor)"
              @input="$v.StaticMemoryLoadFactor.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.StaticMemoryLoadFactor.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group :label="$t('pageCups.staticLoadFactorIioLoadFactor')">
            <b-form-input
              id="cups-service-staticIioLoadFactor"
              v-model="StaticIioLoadFactor"
              class="input"
              type="text"
              data-test-id="cups-service-input-staticIioLoadFactor"
              :disabled="LoadFactorConfiguration === 'Dynamic'"
              :state="getValidationState($v.StaticIioLoadFactor)"
              @input="$v.StaticIioLoadFactor.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.StaticIioLoadFactor.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col md="5">
          <dl>
            <dt>
              <b>{{ $t('pageCups.cupsService') }}</b>
            </dt>
          </dl>
          <b-form-group :label="$t('pageCups.cupsServiceCoreInterval')">
            <b-form-text id="cups-service-help-block">
              {{ $t('pageCups.cupsIntervelHelpContent') }}
              <br />
            </b-form-text>
            <b-form-input
              id="cups-service-Interval"
              v-model="CupsServiceInterval"
              class="input"
              type="text"
              aria-describedby="cups-service-help-block"
              data-test-id="cups-service-input-Interval"
              :state="getValidationState($v.CupsServiceInterval)"
              @input="$v.CupsServiceInterval.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.CupsServiceInterval.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-else-if="!$v.CupsServiceInterval.pattern">
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group :label="$t('pageCups.cupsServiceAveragingPeriod')">
            <b-form-text id="cups-service-help-block">
              {{ $t('pageCups.cupsAveragingPeriodContent') }}
              <br />
            </b-form-text>
            <b-form-input
              id="cups-service-AveragingPeriod"
              v-model="CupsServiceAveragingPeriod"
              class="input"
              type="text"
              aria-describedby="cups-service-help-block"
              data-test-id="cups-service-input-AveragingPeriod"
              :state="getValidationState($v.CupsServiceAveragingPeriod)"
              @input="$v.CupsServiceAveragingPeriod.$touch()"
            />
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.CupsServiceAveragingPeriod.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-else-if="!$v.CupsServiceAveragingPeriod.pattern">
                {{ $t('global.form.invalidFormat') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            class="form-radio"
            :label="$t('pageCups.loadFactorConfiguration')"
          >
            <b-row>
              <b-col md="3">
                <b-form-radio
                  v-model="LoadFactorConfiguration"
                  name="cups-service-change-static"
                  value="Static"
                  data-test-id="cups-loadFactorConfiguration-static"
                  @input="$v.LoadFactorConfiguration.$touch()"
                >
                  {{ $t('pageCups.static') }}
                </b-form-radio>
              </b-col>
              <b-col md="3">
                <b-form-radio
                  v-model="LoadFactorConfiguration"
                  name="cups-service-change-dynamic"
                  value="Dynamic"
                  data-test-id="cups-loadFactorConfiguration-dynamic"
                  @input="$v.LoadFactorConfiguration.$touch()"
                >
                  {{ $t('pageCups.dynamic') }}
                </b-form-radio>
              </b-col>
            </b-row>
          </b-form-group>
          <b-row class="mt-4 mb-5">
            <b-col>
              <b-btn
                variant="primary"
                type="submit"
                class="btn-style"
                data-test-id="cupsService-button-saveSettings"
                @click="createCupsServices"
              >
                {{ $t('global.action.saveSettings') }}
              </b-btn>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
<script>
import { required, requiredIf } from 'vuelidate/lib/validators';
import PageTitle from '@/components/Global/PageTitle';
import { mapState } from 'vuex';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
export default {
  name: 'Cups',
  components: { PageTitle },
  mixins: [VuelidateMixin, BVToastMixin, LoadingBarMixin],
  data() {
    return {
      StaticCoreLoadFactor: this.$store.getters['cups/staticCoreLoadFactor'],
      StaticMemoryLoadFactor:
        this.$store.getters['cups/staticMemoryLoadFactor'],
      StaticIioLoadFactor: this.$store.getters['cups/staticIioLoadFactor'],
      DynamicCoreLoadFactor: this.$store.getters['cups/dynamicCoreLoadFactor'],
      DynamicMemoryLoadFactor:
        this.$store.getters['cups/dynamicMemoryLoadFactor'],
      DynamicIioLoadFactor: this.$store.getters['cups/dynamicIioLoadFactor'],
      CupsServiceInterval: this.$store.getters['cups/cupsServiceInterval'],
      CupsServiceAveragingPeriod:
        this.$store.getters['cups/cupsServiceAveragingPeriod'],
      LoadFactorConfiguration:
        this.$store.getters['cups/loadFactorConfiguration'],
      cupsService: null,
    };
  },
  computed: {
    ...mapState('cups', [
      'staticCoreLoadFactor',
      'staticMemoryLoadFactor',
      'staticIioLoadFactor',
      'dynamicCoreLoadFactor',
      'dynamicMemoryLoadFactor',
      'dynamicIioLoadFactor',
      'cupsServiceInterval',
      'cupsServiceAveragingPeriod',
      'loadFactorConfiguration',
    ]),
  },
  watch: {
    staticCoreLoadFactor: function (value) {
      this.StaticCoreLoadFactor = value;
    },
    staticMemoryLoadFactor: function (value) {
      this.StaticMemoryLoadFactor = value;
    },
    staticIioLoadFactor: function (value) {
      this.StaticIioLoadFactor = value;
    },
    dynamicCoreLoadFactor: function (value) {
      this.DynamicCoreLoadFactor = value;
    },
    dynamicMemoryLoadFactor: function (value) {
      this.DynamicMemoryLoadFactor = value;
    },
    dynamicIioLoadFactor: function (value) {
      this.DynamicIioLoadFactor = value;
    },
    cupsServiceInterval: function (value) {
      this.CupsServiceInterval = value;
    },
    cupsServiceAveragingPeriod: function (value) {
      this.CupsServiceAveragingPeriod = value;
    },
    loadFactorConfiguration: function (value) {
      this.LoadFactorConfiguration = value;
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('cups/getCupsService')
      .finally(() => {
        this.endLoader();
      })
      .catch(({ message }) => this.errorToast(message));
  },
  validations() {
    return {
      CupsServiceInterval: {
        required,
        pattern: function (val) {
          return this.timeRangeInterval(val);
        },
      },
      CupsServiceAveragingPeriod: {
        required,
        pattern: function (val) {
          return this.timeRangeAveragingPeriod(val);
        },
      },
      LoadFactorConfiguration: {
        required,
      },
      StaticCoreLoadFactor: {
        required: requiredIf(function () {
          if (this.LoadFactorConfiguration !== 'Dynamic') {
            return true;
          }
        }),
      },
      StaticMemoryLoadFactor: {
        required: requiredIf(function () {
          if (this.LoadFactorConfiguration !== 'Dynamic') {
            return true;
          }
        }),
      },
      StaticIioLoadFactor: {
        required: requiredIf(function () {
          if (this.LoadFactorConfiguration !== 'Dynamic') {
            return true;
          }
        }),
      },
    };
  },
  methods: {
    createCupsServices() {
      let CupsServices = {};
      let staticLoadFactors = {};
      this.$v.$touch();
      if (this.$v.$invalid) return;
      if (this.$v.CupsServiceAveragingPeriod.$dirty) {
        CupsServices.AveragingPeriod = this.CupsServiceAveragingPeriod;
      }
      if (this.$v.CupsServiceInterval.$dirty) {
        CupsServices.Interval = this.CupsServiceInterval;
      }
      if (this.$v.LoadFactorConfiguration.$dirty) {
        CupsServices.LoadFactorConfiguration = this.LoadFactorConfiguration;
      }
      if (this.LoadFactorConfiguration !== 'Dynamic') {
        if (this.$v.StaticCoreLoadFactor.$dirty) {
          staticLoadFactors.CoreLoadFactor = Number(this.StaticCoreLoadFactor);
        }
        if (this.$v.StaticIioLoadFactor.$dirty) {
          staticLoadFactors.IioLoadFactor = Number(this.StaticIioLoadFactor);
        }
        if (this.$v.StaticMemoryLoadFactor.$dirty) {
          staticLoadFactors.MemoryLoadFactor = Number(
            this.StaticMemoryLoadFactor,
          );
        }
      }
      let totalSum =
        Number(this.StaticCoreLoadFactor) +
        Number(this.StaticMemoryLoadFactor) +
        Number(this.StaticIioLoadFactor);
      if (Object.keys(staticLoadFactors).length > 0) {
        if (Math.round(totalSum * 1e8) / 1e8 !== 100) {
          // Handle the error, display a message, or prevent further processing
          this.errorToast(
            this.$t('pageCups.toast.errorAddingStaticLoadFactor'),
          );
          return;
        } else {
          CupsServices.StaticLoadFactors = staticLoadFactors;
        }
      }
      if (Object.entries(CupsServices).length === 1) {
        return;
      }
      this.startLoader();
      this.$store
        .dispatch('cups/updateCupsService', CupsServices)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
    timeRangeInterval(value) {
      if (/^(0\.[1-9]\d*|1(\.0{1,2})?)$/gi.test(value.toString())) {
        return true;
      } else {
        return false;
      }
    },
    timeRangeAveragingPeriod(value) {
      if (
        /^(1\.0{1,8}|[1-9](\.\d{1,8})?|10(\.00?)?)$/gi.test(value.toString())
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.font-style {
  font-weight: 700;
}

.form-radio {
  margin-top: -20px;
}

.btn-style {
  float: right;
}
.input {
  width: 75%;
  height: 40px;
}
</style>
