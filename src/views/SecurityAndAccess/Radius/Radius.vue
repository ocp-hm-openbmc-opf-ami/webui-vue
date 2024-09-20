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
          <b-tab :title="$t('pageRadius.pageGeneralRadius')">
            <general-radius></general-radius>
          </b-tab>
          <b-tab :title="$t('pageRadius.pageAdvancedRadius')">
            <advanced-radius></advanced-radius>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </b-container>
</template>
<script>
import PageTitle from '@/components/Global/PageTitle';
import GeneralRadius from './GeneralRadius.vue';
import AdvancedRadius from './AdvancedRadius.vue';
export default {
  name: 'Radius',
  components: {
    PageTitle,
    GeneralRadius,
    AdvancedRadius,
  },
  data() {
    return {
      tabIndex: 0,
    };
  },
};
</script>
