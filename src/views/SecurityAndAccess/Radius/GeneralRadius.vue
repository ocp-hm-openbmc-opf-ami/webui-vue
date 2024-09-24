<template>
  <div>
    <page-section>
      <b-row>
        <b-col sm="6">
          <b-form-group>
            <b-form-checkbox v-model="generalRadius.authentication">
              {{ $t('pageRadius.enableRadiusAuthentication') }}
            </b-form-checkbox>
          </b-form-group>
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="$t('pageRadius.form.serverAddress')"
                label-for="serverAddress"
              >
                <b-form-input
                  :id="serverAddress"
                  v-model="generalRadius.serverAddress"
                  :disabled="!generalRadius.authentication"
                  :type="text"
                  :state="getValidationState($v.generalRadius.serverAddress)"
                  @input="$v.generalRadius.serverAddress.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                :label="$t('pageRadius.form.port')"
                label-for="port"
              >
                <b-form-input
                  :id="port"
                  v-model="generalRadius.port"
                  :type="number"
                  :disabled="!generalRadius.authentication"
                  :state="getValidationState($v.generalRadius.port)"
                  @input="$v.generalRadius.port.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  {{ $t('global.form.fieldRequired') }}
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                :label="$t('pageRadius.form.secret')"
                label-for="secret"
              >
                <b-form-input
                  :id="secret"
                  v-model="generalRadius.secret"
                  :type="text"
                  :disabled="!generalRadius.authentication"
                  :state="getValidationState($v.generalRadius.secret)"
                  @input="$v.generalRadius.secret.$touch()"
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
  name: 'GeneralRadius',
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
      generalRadius: {
        authentication: false,
        serverAddress: '',
        port: '',
        secret: '',
      },
    };
  },
  validations() {
    return {
      generalRadius: {
        serverAddress: {
          required: requiredIf(function () {
            if (this.generalRadius.authentication) {
              return true;
            }
          }),
        },
        port: {
          required: requiredIf(function () {
            if (this.generalRadius.authentication) {
              return true;
            }
          }),
        },
        secret: {
          required: requiredIf(function () {
            if (this.generalRadius.authentication) {
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
      console.log('this.videoRemote', this.generalRadius.serverAddress);
    },
  },
};
</script>
