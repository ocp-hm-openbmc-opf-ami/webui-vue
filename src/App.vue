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
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  methods: {
    handleBeforeUnload() {
      if (
        window.name != 'kvmConsoleWindow' &&
        window.location.href.indexOf('serial-over-lan-console') == -1
      )
        store.commit('authentication/logout');
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/_obmc-custom';
</style>
