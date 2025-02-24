import Vue from 'vue';
import App from './App.vue';
import router from './router';

//Do not change store import.
//Exact match alias set to support
//dotenv customizations.
import store from './store';

import {
  AlertPlugin,
  BadgePlugin,
  ButtonPlugin,
  BVConfigPlugin,
  CardPlugin,
  CollapsePlugin,
  DropdownPlugin,
  FormPlugin,
  FormCheckboxPlugin,
  FormDatepickerPlugin,
  FormFilePlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormTextareaPlugin,
  FormRadioPlugin,
  FormSelectPlugin,
  FormTagsPlugin,
  InputGroupPlugin,
  LayoutPlugin,
  LinkPlugin,
  ListGroupPlugin,
  ModalPlugin,
  NavbarPlugin,
  NavPlugin,
  PaginationPlugin,
  ProgressPlugin,
  TablePlugin,
  TabsPlugin,
  ToastPlugin,
  TooltipPlugin,
  OverlayPlugin,
  BootstrapVueIcons,
} from 'bootstrap-vue';
import Vuelidate from 'vuelidate';
import i18n from './i18n';
import { format } from 'date-fns-tz';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
const moment = require('moment-timezone');

// Filters
Vue.filter('shortTimeZone', function (value) {
  const longTZ = value
    .toString()
    .match(/\((.*)\)/)
    .pop();
  const regexNotUpper = /[*a-z ]/g;
  return longTZ.replace(regexNotUpper, '');
});

// Short timezone using the timezone
Vue.filter('shortTzOffset', function (value) {
  const offset = moment().tz(value).format('Z');
  const shortTz = moment().tz(value).format('z');
  return shortTz != 'UTC' ? 'GMT' + offset + ' ' + shortTz : 'UTC' + offset;
});

Vue.filter('formatDate', function (value) {
  const isUtcDisplay = store.getters['global/isUtcDisplay'];
  const bmcTimeZone = store.getters['global/timeZone'];
  if (value instanceof Date) {
    if (isUtcDisplay) {
      let options = {
        timeZone: bmcTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      return value.toLocaleDateString('en-CA', options);
    }
    const pattern = `yyyy-MM-dd`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return format(value, pattern, { timezone });
  }
});

Vue.filter('formatTime', function (value) {
  const isUtcDisplay = store.getters['global/isUtcDisplay'];
  const bmcTimeZone = store.getters['global/timeZone'];

  if (value instanceof Date) {
    if (isUtcDisplay) {
      let timeOptions = {
        timeZone: bmcTimeZone,
        hourCycle: 'h23',
      };
      const shortTzOff = Vue.filter('shortTzOffset')(bmcTimeZone);
      return (
        value.toLocaleTimeString('default', timeOptions) +
        ' (' +
        shortTzOff +
        ')'
      );
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const shortTz = Vue.filter('shortTimeZone')(value);
    const pattern = `HH:mm:ss (O '${shortTz}')`;
    return format(value, pattern, { timezone });
  }
});

// Plugins
Vue.use(AlertPlugin);
Vue.use(BadgePlugin);
Vue.use(ButtonPlugin);
Vue.use(BVConfigPlugin, {
  BFormText: { textVariant: 'secondary' },
  BTable: {
    headVariant: 'light',
    footVariant: 'light',
  },
  BFormTags: {
    tagVariant: 'primary',
    addButtonVariant: 'link-primary',
  },
  BBadge: {
    variant: 'primary',
  },
});
Vue.use(CardPlugin);
Vue.use(CollapsePlugin);
Vue.use(DropdownPlugin);
Vue.use(FormPlugin);
Vue.use(FormCheckboxPlugin);
Vue.use(FormDatepickerPlugin);
Vue.use(FormFilePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(FormTextareaPlugin);
Vue.use(FormRadioPlugin);
Vue.use(FormSelectPlugin);
Vue.use(FormTagsPlugin);
Vue.use(InputGroupPlugin);
Vue.use(LayoutPlugin);
Vue.use(LayoutPlugin);
Vue.use(LinkPlugin);
Vue.use(ListGroupPlugin);
Vue.use(ModalPlugin);
Vue.use(NavbarPlugin);
Vue.use(NavPlugin);
Vue.use(PaginationPlugin);
Vue.use(ProgressPlugin);
Vue.use(TablePlugin);
Vue.use(TabsPlugin);
Vue.use(ToastPlugin);
Vue.use(TooltipPlugin);
Vue.use(Vuelidate);
Vue.use(OverlayPlugin);
Vue.use(BootstrapVueIcons);
Vue.component('VSelect', vSelect);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
