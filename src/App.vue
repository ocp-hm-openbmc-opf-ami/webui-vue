<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from './store';
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
    setTimeout(() => {
      if (
        Cookies.get('XSRF-TOKEN') &&
        Cookies.get('loginSessionSuccess') === 'false' &&
        window.name != 'kvmConsoleWindow' &&
        window.location.href.indexOf('serial-over-lan-console') == -1
      ) {
        this.$bvModal.msgBoxOk(
          this.$tc('global.action.same_session_running_infomation'),
        );
      }
    }, 2000); // wait to read the XSRF-TOKEN
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
