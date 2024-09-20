<template>
  <b-container fluid="xl">
    <page-title />
    <div>
      <!-- Tabs with card integration -->
      <b-card no-body>
        <b-tabs
          v-model="tabIndex"
          active-nav-item-class="font-weight-bold"
          card
          content-class="mt-3"
        >
          <b-tab :title="$t('pageVideo.video')">
            <video-trigger-settings></video-trigger-settings>
          </b-tab>
          <b-tab :title="$t('pageVideo.videoRemote')">
            <video-remote-storage></video-remote-storage>
          </b-tab>
          <b-tab :title="$t('pageVideo.preEventVideoRecord')">
            <pre-event-video-record></pre-event-video-record>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import VideoRemoteStorage from './VideoRemoteStorage.vue';
import VideoTriggerSettings from './VideoTriggerSettings.vue';
import PreEventVideoRecord from './PreEventVideoRecord';
export default {
  name: 'AutoVideo',
  components: {
    PageTitle,
    VideoRemoteStorage,
    VideoTriggerSettings,
    PreEventVideoRecord,
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
};
</script>
