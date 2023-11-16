<template>
  <b-container fluid="xl">
    <b-row>
      <b-col md="4">
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mr-3 w-75">
              <dt>{{ $t('pageVideo.videoTriggerSettings.critical') }}</dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>{{ $t('pageVideo.videoTriggerSettings.nonCritical') }}</dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>{{ $t('pageVideo.videoTriggerSettings.nonRecoverable') }}</dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>
                {{ $t('pageVideo.videoTriggerSettings.fanStateChanged') }}
              </dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>{{ $t('pageVideo.videoTriggerSettings.watchdogTimer') }}</dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>{{ $t('pageVideo.videoTriggerSettings.chassisPowerOn') }}</dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>
                {{ $t('pageVideo.videoTriggerSettings.chassisPowerOff') }}
              </dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>
                {{ $t('pageVideo.videoTriggerSettings.chassisReset') }}
              </dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>
                {{ $t('pageVideo.videoTriggerSettings.LPCReset') }}
              </dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="setting-section">
          <b-col class="d-flex align-items-center justify-content-between">
            <dl class="mt-3 mr-3 w-75">
              <dt>
                {{ $t('pageVideo.videoTriggerSettings.dateAndTime') }}
              </dt>
            </dl>
            <b-form-checkbox id="" switch>
              <span v-if="videotriggerevent">
                {{ $t('global.status.enabled') }}
              </span>
              <span v-else>{{ $t('global.status.disabled') }}</span>
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="mt-4 mb-5">
          <b-col>
            <b-btn
              variant="primary"
              type="submit"
              data-test-id="smtp-button-saveSettings"
              :disabled="loading"
            >
              {{ $t('global.action.saveSettings') }}
            </b-btn>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';

export default {
  name: 'Videotrigger',
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      videotriggerevent: false,
    };
  },
};
</script>
