<template>
  <div class="app-container">
    <loading-bar class="loading" @load="loading" />
    <app-header
      ref="focusTarget"
      :key="`header-${routerKey}`"
      class="app-header"
      :router-key="routerKey"
      @refresh="refresh"
      @languageChange="languageChange"
    />
    <app-navigation
      v-if="configLoaded"
      :key="`navigation-${routerKey}`"
      class="app-navigation"
    />
    <page-container class="app-content">
      <router-view ref="routerView" :key="routerKey" />
      <!-- Scroll to top button -->
      <button-back-to-top />
    </page-container>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader';
import AppNavigation from '@/components/AppNavigation';
import PageContainer from '@/components/Global/PageContainer';
import ButtonBackToTop from '@/components/Global/ButtonBackToTop';
import JumpLinkMixin from '@/components/Mixins/JumpLinkMixin';
import LoadingBar from '@/components/Global/LoadingBar.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppNavigation,
    PageContainer,
    ButtonBackToTop,
    LoadingBar,
  },
  mixins: [JumpLinkMixin],
  data() {
    return {
      routerKey: 0,
      isloading: true,
      configLoaded: false,
    };
  },
  watch: {
    $route: function () {
      this.$nextTick(function () {
        this.setFocus(this.$refs.focusTarget.$el);
      });
    },
  },
  async beforeMount() {
    // Routes are added dynamically in the DashboardStore action
    try {
      await this.$store.dispatch('dashboard/fetchDashboardData');
      this.configLoaded = true;
    } catch (error) {
      this.configLoaded = true;
    }
  },
  mounted() {
    this.$root.$on('refresh-application', () => this.refresh());
  },
  methods: {
    async refresh() {
      // Reset dashboard data to force fresh fetch
      this.$store.commit('dashboard/resetDashboardData');
      // Fetch fresh dashboard data
      try {
        await this.$store.dispatch('dashboard/fetchDashboardData');
      } catch (error) {
        console.error('Failed to refresh dashboard data:', error);
      }
      // Changing the component :key value will trigger
      // a component re-rendering and 'refresh' the view
      this.routerKey += 1;
    },
    languageChange() {
      // Changing the component :key value will trigger
      // a component re-rendering and 'languageChange' the view
      this.routerKey += 1;
    },
    loading(isLoadingComplete) {
      this.isloading = !isLoadingComplete;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto;
  grid-template-areas:
    'header'
    'content';

  @include media-breakpoint-up($responsive-layout-bp) {
    grid-template-columns: $navigation-width 1fr;
    grid-template-areas:
      'header header'
      'navigation content';
  }
}

.app-header {
  grid-area: header;
  position: fixed;
  top: 0;
  z-index: $zindex-fixed + 1;
  width: 100%;
  margin-top: 0;
}

.app-navigation {
  grid-area: navigation;
}

.app-content {
  margin-top: 58px;
  grid-area: content;
}
</style>
