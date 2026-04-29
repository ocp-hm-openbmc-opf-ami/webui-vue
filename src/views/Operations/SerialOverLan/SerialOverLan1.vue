<template>
  <b-container fluid="xl">
    <page-title class="mb-4" :description="$t('pageSerialOverLan.subTitle')" />

    <page-section class="mb-0">
      <serial-over-lan-console1 :is-full-window="false" />
    </page-section>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import SerialOverLanConsole1 from './SerialOverLanConsole1';

import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  name: 'SerialOverLan1',
  components: {
    PageSection,
    PageTitle,
    SerialOverLanConsole1,
  },
  mixins: [LoadingBarMixin],
  created() {
    this.startLoader();
    this.$store
      .dispatch('global/getSystemInfo1')
      .finally(() => this.endLoader());
  },
};
</script>
