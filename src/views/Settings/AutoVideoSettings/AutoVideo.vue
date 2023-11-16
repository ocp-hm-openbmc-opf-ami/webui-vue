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
            <videotrigger></videotrigger>
          </b-tab>
          <b-tab :title="$t('pageVideo.videoRemote')">
            <videoremotestorage></videoremotestorage>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import videoremotestorage from './videoremotestorage.vue';
import videotrigger from './videotrigger.vue';
export default {
  name: 'AutoVideo',
  components: {
    PageTitle,
    videoremotestorage,
    videotrigger,
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
};
</script>
