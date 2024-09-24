<template>
  <div>
    <page-section>
      <b-row>
        <b-col xl="6" class="p0">
          <div v-if="!advancedRadius.authentication">
            <b-alert show variant="danger">{{
              $t('pageRadius.RadiusConfiguration')
            }}</b-alert>
          </div>
        </b-col>

        <b-col md="9">
          <b-row>
            <b-col cols="6">
              <div>
                <b-form-group
                  :label="$t('pageRadius.form.administrator')"
                  label-for="administrator"
                >
                  <b-form-input
                    :id="administrator"
                    v-model="advancedRadius.administrator"
                    :disabled="!advancedRadius.authentication"
                    :state="getValidationState($v.advancedRadius.administrator)"
                    :type="text"
                    @input="$v.advancedRadius.administrator.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    {{ $t('global.form.fieldRequired') }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.operator')"
                  label-for="operator"
                >
                  <b-form-input
                    :id="operator"
                    v-model="advancedRadius.operator"
                    :disabled="!advancedRadius.authentication"
                    :state="getValidationState($v.advancedRadius.operator)"
                    :type="text"
                    @input="$v.advancedRadius.operator.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    {{ $t('global.form.fieldRequired') }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.user')"
                  label-for="user"
                >
                  <b-form-input
                    :id="user"
                    v-model="advancedRadius.user"
                    :disabled="!advancedRadius.authentication"
                    :state="getValidationState($v.advancedRadius.user)"
                    :type="text"
                    @input="$v.advancedRadius.user.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    {{ $t('global.form.fieldRequired') }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.oemProprietary')"
                  label-for="oemProprietary"
                >
                  <b-form-input
                    :id="oemProprietary"
                    v-model="advancedRadius.oemProprietary"
                    :disabled="!advancedRadius.authentication"
                    :state="
                      getValidationState($v.advancedRadius.oemProprietary)
                    "
                    :type="text"
                    @input="$v.advancedRadius.oemProprietary.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    {{ $t('global.form.fieldRequired') }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group
                  :label="$t('pageRadius.form.noAccess')"
                  label-for="noAccess"
                >
                  <b-form-input
                    :id="noAccess"
                    v-model="advancedRadius.noAccess"
                    :disabled="!advancedRadius.authentication"
                    :state="getValidationState($v.advancedRadius.noAccess)"
                    :type="text"
                    @input="$v.advancedRadius.noAccess.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    {{ $t('global.form.fieldRequired') }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-row class="mt-4 mb-5">
                  <b-col>
                    <b-btn variant="primary" type="submit" @click="onOk">
                      {{ $t('global.action.saveSettings') }}
                    </b-btn>
                  </b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </page-section>
  </div>
</template>

<script>
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';

import { requiredIf } from 'vuelidate/lib/validators';
export default {
  name: 'AdvancedRadius',
  components: {
    PageSection,
  },
  mixins: [BVToastMixin, VuelidateMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      advancedRadius: {
        authentication: false,
        administrator: '',
        operator: '',
        user: '',
        oemProprietary: '',
        noAccess: '',
      },
    };
  },
  validations() {
    return {
      advancedRadius: {
        administrator: {
          required: requiredIf(function () {
            if (this.advancedRadius.authentication) {
              return true;
            }
          }),
        },
        operator: {
          required: requiredIf(function () {
            if (this.advancedRadius.authentication) {
              return true;
            }
          }),
        },
        user: {
          required: requiredIf(function () {
            if (this.advancedRadius.authentication) {
              return true;
            }
          }),
        },
        oemProprietary: {
          required: requiredIf(function () {
            if (this.advancedRadius.authentication) {
              return true;
            }
          }),
        },
        noAccess: {
          required: requiredIf(function () {
            if (this.advancedRadius.authentication) {
              return true;
            }
          }),
        },
      },
    };
  },
  methods: {
    onOk() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      console.log('this.videoRemote', this.advancedRadius.authentication);
    },
  },
};
</script>
