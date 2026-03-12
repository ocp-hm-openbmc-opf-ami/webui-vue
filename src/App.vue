<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from '../store';
import router from './router';
import Cookies from 'js-cookie';
import i18n from '@/i18n';
export default {
  name: 'App',
  watch: {
    $route: function (to) {
      document.title =
        i18n.t('global.ariaLabel.megaracOneTree') + to.meta.title ||
        'Page is missing title';
    },
  },
  created() {
    Cookies.set('loginSessionSuccess', 'true');
    document.title =
      i18n.t('global.ariaLabel.megaracOneTree') + this.$route.meta.title ||
      'Page is missing title';
    window.addEventListener('beforeunload', this.handleRefresh);
    const currentPath = router.currentRoute.path;
    if (currentPath !== '/login') {
      this.$store.dispatch('global/getManagerinstance');
    }
    window.addEventListener('unload', this.handleRefresh);
    setTimeout(() => {
      if (
        Cookies.get('XSRF-TOKEN') &&
        Cookies.get('loginSessionSuccess') === 'false' &&
        window.name != 'kvmConsoleWindow' &&
        window.name != 'kvm1ConsoleWindow' &&
        window.location.href.indexOf('serial-over-lan-console') == -1 &&
        window.location.href.indexOf('/redfish/v1') != -1
      ) {
        this.$bvModal.msgBoxOk(
          this.$tc('global.action.same_session_running_information'),
        );
      }
    }, 2000); // wait to read the XSRF-TOKEN
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleRefresh);
    window.removeEventListener('unload', this.handleRefresh);
  },
  methods: {
    // Perform logout or any other actions needed before unload
    // This function will be called before the page is unloaded or refreshed
    handleRefresh(event) {
      if (
        window.name != 'kvmConsoleWindow' &&
        window.name != 'kvm1ConsoleWindow' &&
        window.location.href.indexOf('serial-over-lan-console') == -1 &&
        window.location.href.indexOf('/redfish/v1') == -1
      ) {
        if (event.srcElement.URL.indexOf('login') == -1) {
          console.log('event:', event);
          store.dispatch('authentication/logout');
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/_obmc-custom';
</style>
