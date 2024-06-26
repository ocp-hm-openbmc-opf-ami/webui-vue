<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from './store';
export default {
  name: 'App',
  watch: {
    $route: function (to) {
      document.title = to.meta.title || 'Page is missing title';
    },
  },
  created() {
    document.title = this.$route.meta.title || 'Page is missing title';
    window.addEventListener('beforeunload', this.handleRefresh);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleRefresh);
  },
  methods: {
    // Perform logout or any other actions needed before unload
    // This function will be called before the page is unloaded or refreshed
    handleRefresh(event) {
      if (
        window.name != 'kvmConsoleWindow' &&
        window.location.href.indexOf('serial-over-lan-console') == -1
      ) {
        if (event.srcElement.URL.indexOf('login') == -1) {
          store.dispatch('authentication/logout');
          //Due to firefox browser behaviour keep busy the browser to logout
          if (
            window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1
          ) {
            for (let i = 0; i <= 1000; i++) {
              console.log();
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/_obmc-custom';
</style>
