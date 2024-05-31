<template>
  <b-container fluid="xl">
    <page-title class="mb-4" :description="$t('pageSerialOverLan.subTitle')" />

    <page-section class="mb-0">
      <serial-over-lan-console :is-full-window="false" />
    </page-section>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import SerialOverLanConsole from './SerialOverLanConsole';

import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  name: 'SerialOverLan',
  components: {
    PageSection,
    PageTitle,
    SerialOverLanConsole,
  },
  mixins: [LoadingBarMixin],
  created() {
    this.startLoader();
    this.$store
      .dispatch('global/getSystemInfo')
      .finally(() => this.endLoader());
  },
};
</script>
