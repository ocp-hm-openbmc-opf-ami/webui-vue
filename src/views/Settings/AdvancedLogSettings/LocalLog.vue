<template>
  <div>
    <page-section>
      <b-row>
        <b-col xl="6">
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="$t('advancedLogSettings.fileSize')"
                label-for="fileSize"
              >
                <b-form-input
                  id="fileSize"
                  v-model="localLog.fileSize"
                  :state="getValidationState($v.localLog.fileSize)"
                  type="text"
                  :disabled="isButtonDisable"
                  data-test-id="advancedLogSettings-fileSize"
                  @input="$v.localLog.fileSize.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.localLog.fileSize.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.localLog.fileSize.required &&
                      !$v.localLog.fileSize.pattern
                    "
                  >
                    {{
                      $t('advancedLogSettings.advancedLogValueLimits', {
                        min: fileSizeValues.min,
                        max: fileSizeValues.max,
                      })
                    }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                :label="$t('advancedLogSettings.rotateCount')"
                label-for="rotateCount"
              >
                <b-form-checkbox
                  id="rotateCount"
                  v-model="localLog.rotateCount"
                  :disabled="isButtonDisable"
                  data-test-id="advancedLogSettings-rotateCount"
                  switch
                >
                  <span v-if="localLog.rotateCount">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="mt-4">
            <b-col>
              <b-button
                type="submit"
                variant="primary"
                :disabled="isButtonDisable"
                data-test-id="advancedLogSettings-localSave"
                @click="onSave"
              >
                <icon-save />
                {{ $t('global.action.save') }}
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </page-section>
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import { mapState } from 'vuex';
import { requiredIf } from 'vuelidate/lib/validators';
import IconSave from '@carbon/icons-vue/es/save/20';

export default {
  name: 'LocalLogSettings',
  components: {
    PageSection,
    IconSave,
  },
  mixins: [LoadingBarMixin, VuelidateMixin, BVToastMixin],
  props: {
    isButtonDisable: {
      required: true,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localLog: {
        fileSize: '',
        rotateCount: false,
      },
      fileSizeValues: {
        min: 0,
        max: 65535,
      },
    };
  },
  computed: {
    ...mapState('advancedLog', ['advancedLogsData']),
  },
  watch: {
    advancedLogsData() {
      this.initLocalLogSettings();
    },
  },
  validations() {
    return {
      localLog: {
        fileSize: {
          required: requiredIf(function () {
            return true;
          }),
          pattern: function (val) {
            return this.validateRange(
              val,
              this.fileSizeValues.min,
              this.fileSizeValues.max,
            );
          },
        },
      },
    };
  },
  methods: {
    initLocalLogSettings() {
      const advancedLogsDataInfo =
        this.$store.getters['advancedLog/getAdvancedLogsData']?.Oem?.Ami?.SysLog
          ?.Configuration || {};

      this.localLog = {
        fileSize: advancedLogsDataInfo.FileSize || '',
        rotateCount: advancedLogsDataInfo.RotateCount || false,
      };
    },
    onSave() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      const params = {
        FileSize: parseInt(this.localLog.fileSize),
        RotateCount: this.localLog.rotateCount,
      };

      this.startLoader();
      this.$store
        .dispatch('advancedLog/setLocalLogSettings', params)
        .then((success) => {
          this.successToast(success);
        })
        .catch(({ message }) => this.errorToast(message))
        .finally(() => this.endLoader());
    },
  },
};
</script>
