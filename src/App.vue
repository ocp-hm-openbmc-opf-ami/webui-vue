<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import store from './store';
import router from './router';
import Cookies from 'js-cookie';
import i18n from '@/i18n';
export default {
  name: 'App',
  data() {
    return {
      F5detect: false,
      isFirmwareLoaderActive: false,
    };
  },
  computed: {},
  watch: {
    $route: function (to) {
      document.title =
        i18n.t('global.ariaLabel.megaracOneTree') + to.meta.title ||
        'Page is missing title';
    },
  },
  created() {
    localStorage.setItem('pollingEnabled', 'false');
    Cookies.set('loginSessionSuccess', 'true');
    this.$root.$on('loader-start', this.onLoaderStart);
    this.$root.$on('loader-end', this.onLoaderStop);
    this.$root.$on('loader-hide', this.onLoaderStop);
    document.title =
      i18n.t('global.ariaLabel.megaracOneTree') + this.$route.meta.title ||
      'Page is missing title';
    window.addEventListener('beforeunload', this.handleRefresh);
    const currentPath = router.currentRoute.path;
    if (currentPath !== '/login') {
      this.$store.dispatch('global/getManagerinstance');
    }
    window.addEventListener('unload', this.handleRefresh);
    document.addEventListener('keyup', this.handleKeyUp);
    document.addEventListener('keydown', this.handleKeyDown);
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
    this.$root.$off('loader-start', this.onLoaderStart);
    this.$root.$off('loader-end', this.onLoaderStop);
    this.$root.$off('loader-hide', this.onLoaderStop);
    window.removeEventListener('beforeunload', this.handleRefresh);
    window.removeEventListener('unload', this.handleRefresh);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    onLoaderStart() {
      if (this.$route.path === '/operations/firmware') {
        this.isFirmwareLoaderActive = true;
      }
    },
    onLoaderStop() {
      this.isFirmwareLoaderActive = false;
    },
    // Handle keyup events - reset refresh key flag
    handleKeyUp() {
      this.F5detect = false;
    },
    // Handle keydown events - intercept F5 and Ctrl+R refresh keys
    handleKeyDown(e) {
      const keyCode = e.which || e.keyCode;
      const isF5 = keyCode === 116;
      const isCtrlR = (e.ctrlKey || e.metaKey) && keyCode === 82;

      if ((isF5 || isCtrlR) && this.F5detect === false) {
        /* Disable browser refresh and trigger customized refresh action. */
        this.F5detect = true;
        e.preventDefault();
        this.handleRefresh(e);
      }
    },
    // Perform logout or any other actions needed before unload
    // This function will be called before the page is unloaded or refreshed
    handleRefresh(event) {
      if (
        this.$route.path === '/operations/firmware' &&
        this.isFirmwareLoaderActive &&
        this.F5detect === true
      ) {
        return;
      }
      if (
        window.name != 'kvmConsoleWindow' &&
        window.name != 'kvm1ConsoleWindow' &&
        window.location.href.indexOf('serial-over-lan-console') == -1 &&
        window.location.href.indexOf('/redfish/v1') == -1
      ) {
        const eventUrl =
          (event && event.srcElement && event.srcElement.URL) ||
          window.location.href;
        if (eventUrl.indexOf('login') == -1 && this.F5detect === false) {
          console.log('event:', event);
          store.dispatch('authentication/logout');
        } else {
          this.F5detect = false;
          this.$root.$emit('refresh-application');
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/_obmc-custom';
</style>
