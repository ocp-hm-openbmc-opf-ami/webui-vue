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
            <video-trigger-settings
              :is-button-disable="isButtonDisable"
            ></video-trigger-settings>
          </b-tab>
          <b-tab :title="$t('pageVideo.videoRemote')">
            <video-remote-storage
              :is-button-disable="isButtonDisable"
            ></video-remote-storage>
          </b-tab>
          <!-- <b-tab :title="$t('pageVideo.preEventVideoRecord')">
            <pre-event-video-record></pre-event-video-record>
          </b-tab> -->
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>
<script>
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import VideoRemoteStorage from './VideoRemoteStorage.vue';
import VideoTriggerSettings from './VideoTriggerSettings.vue';
// import PreEventVideoRecord from './PreEventVideoRecord';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
export default {
  name: 'AutoVideo',
  components: {
    PageTitle,
    VideoRemoteStorage,
    VideoTriggerSettings,
  },
  mixins: [LoadingBarMixin],
  data() {
    return {
      tabIndex: 0,
    };
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isButtonDisable() {
      if (this.userPrivilege !== privilegesId.admin) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.startLoader();
    this.$store.dispatch('autoVideo/getActiveBmcVideoSettings').finally(() => {
      this.endLoader();
      this.isBusy = false;
    });
  },
};
</script>
