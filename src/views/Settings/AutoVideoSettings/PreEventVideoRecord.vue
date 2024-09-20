<template>
  <div>
    <page-section>
      <b-row>
        <b-col xl="6">
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.preEventVideoRecordSettings.videoQuality')
                "
                label-for="videoQuality"
              >
                <b-form-select
                  id="videoQuality"
                  v-model="eventvideoRecord.videoQuality"
                  class="input"
                  :options="videoQualityOptions"
                  data-test-id="videoQuality-option"
                  :state="getValidationState($v.eventvideoRecord.videoQuality)"
                >
                  <template #first>
                    <b-form-select-option :value="valueDefault" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template></b-form-select
                >
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.eventvideoRecord.videoQuality.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.preEventVideoRecordSettings.compressionMode')
                "
                label-for="compressionMode"
              >
                <b-form-select
                  id="compressionMode"
                  v-model="eventvideoRecord.compressionMode"
                  class="input"
                  :options="compressionModeOptions"
                  data-test-id="compressionMode-option"
                  :state="
                    getValidationState($v.eventvideoRecord.compressionMode)
                  "
                >
                  <template #first>
                    <b-form-select-option :value="valueDefault" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template></b-form-select
                >
                <b-form-invalid-feedback role="alert">
                  <template
                    v-if="!$v.eventvideoRecord.compressionMode.required"
                  >
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.preEventVideoRecordSettings.framesPerSecond')
                "
                label-for="framesPerSecond"
              >
                <b-form-select
                  id="framesPerSecond"
                  v-model="eventvideoRecord.framesPerSecond"
                  class="input"
                  :options="framesPerSecondOptions"
                  data-test-id="framesPerSecond-option"
                  :state="
                    getValidationState($v.eventvideoRecord.framesPerSecond)
                  "
                >
                  <template #first>
                    <b-form-select-option :value="valueDefault" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template></b-form-select
                >
                <b-form-invalid-feedback role="alert">
                  <template
                    v-if="!$v.eventvideoRecord.framesPerSecond.required"
                  >
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                :label="
                  $t('pageVideo.preEventVideoRecordSettings.videoDuration')
                "
                label-for="videoDuration"
              >
                <b-form-select
                  id="videoDuration"
                  v-model="eventvideoRecord.videoDuration"
                  class="input"
                  :options="videoDurationOptions"
                  data-test-id="videoDuration-option"
                  :state="getValidationState($v.eventvideoRecord.videoDuration)"
                >
                  <template #first>
                    <b-form-select-option :value="valueDefault" disabled>
                      {{ $t('global.form.selectAnOption') }}
                    </b-form-select-option>
                  </template></b-form-select
                >
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.eventvideoRecord.videoDuration.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-button
            form="form-networLink"
            type="submit"
            variant="primary"
            @click="onSave"
          >
            {{ $t('global.action.save') }}
          </b-button>
        </b-col>
      </b-row>
    </page-section>
  </div>
</template>

<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageSection from '@/components/Global/PageSection';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import DataFormatterMixin from '@/components/Mixins/DataFormatterMixin';

import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { required } from 'vuelidate/lib/validators';
import { mapState } from 'vuex';

export default {
  name: 'PreEventVideoRecord',
  components: {
    PageSection,
  },
  mixins: [BVToastMixin, DataFormatterMixin, VuelidateMixin, LoadingBarMixin],
  data() {
    return {
      videoQualityOptions: [
        {
          value: 0,
          text: this.$t(
            'pageVideo.preEventVideoRecordSettings.videoQualityVeryLow',
          ),
        },
        {
          value: 1,
          text: this.$t('pageVideo.preEventVideoRecordSettings.preEventLow'),
        },
        {
          value: 2,
          text: this.$t(
            'pageVideo.preEventVideoRecordSettings.videoQualityAverage',
          ),
        },
        {
          value: 3,
          text: this.$t('pageVideo.preEventVideoRecordSettings.preEventNormal'),
        },
        {
          value: 4,
          text: this.$t('pageVideo.preEventVideoRecordSettings.preEventHigh'),
        },
      ],
      compressionModeOptions: [
        {
          value: 0,
          text: this.$t('pageVideo.preEventVideoRecordSettings.preEventHigh'),
        },
        {
          value: 1,
          text: this.$t('pageVideo.preEventVideoRecordSettings.preEventNormal'),
        },
        {
          value: 2,
          text: this.$t('pageVideo.preEventVideoRecordSettings.preEventLow'),
        },
        {
          value: 3,
          text: this.$t(
            'pageVideo.preEventVideoRecordSettings.compressionModeNo',
          ),
        },
      ],
      framesPerSecondOptions: [
        { value: 0, text: '1' },
        { value: 1, text: '2' },
        { value: 2, text: '3' },
        { value: 3, text: '4' },
      ],
      videoDurationOptions: [
        { value: 10, text: '10' },
        { value: 20, text: '20' },
        { value: 30, text: '30' },
        { value: 40, text: '40' },
        { value: 50, text: '50' },
        { value: 60, text: '60' },
      ],
      valueDefault: '',
      eventvideoRecord: {
        videoQuality: '',
        compressionMode: '',
        framesPerSecond: '',
        videoDuration: '',
      },
    };
  },
  computed: {
    ...mapState('autoVideo', ['preEventVideovalues']),
  },
  watch: {
    preEventVideovalues() {
      this.initPreEventVideovalues();
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('autoVideo/getPreEventVideo').finally(() => {
      this.endLoader();
    });
  },
  validations() {
    return {
      eventvideoRecord: {
        videoQuality: {
          required,
        },
        compressionMode: {
          required,
        },
        framesPerSecond: {
          required,
        },
        videoDuration: {
          required,
        },
      },
    };
  },
  methods: {
    initPreEventVideovalues() {
      const config =
        this.$store.getters['autoVideo/getPreEventVideovalues'] || {};
      this.eventvideoRecord = {
        videoQuality: config.video_quality,
        compressionMode: config.comp_mode,
        framesPerSecond: config.fps,
        videoDuration: config.video_duration,
      };
    },
    onSave() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
    },
  },
};
</script>
