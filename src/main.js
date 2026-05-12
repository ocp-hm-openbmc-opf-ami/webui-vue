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
import Events from './components/Mixins/EventBus.js';
import UtcDateTimeMixin from './components/Mixins/UtcDateTimeMixin.js';
const moment = require('moment-timezone');

function formatShortTimeZoneOffset(timeZone) {
  if (!timeZone) {
    return 'UTC+00:00';
  }

  if (moment && typeof moment.tz === 'function') {
    const zonedMoment = moment.tz(new Date(), timeZone);
    if (zonedMoment && typeof zonedMoment.format === 'function') {
      const offset = zonedMoment.format('Z');
      const shortTz = zonedMoment.format('z');
      return shortTz !== 'UTC'
        ? 'GMT' + offset + ' ' + shortTz
        : 'UTC' + offset;
    }
  }

  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    const timeZoneName = parts.find((part) => part.type === 'timeZoneName');
    return timeZoneName
      ? timeZoneName.value.replace('GMT', 'UTC')
      : 'UTC+00:00';
  } catch (error) {
    return 'UTC+00:00';
  }
}

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
  return formatShortTimeZoneOffset(value);
});

Vue.filter('formatDate', function (value) {
  const isUtcDisplay = store.getters['global/isUtcDisplay'];
  if (value instanceof Date) {
    if (isUtcDisplay) {
      const dateTime = UtcDateTimeMixin.methods.extractBmcLocalDateTime(value);
      return dateTime.date;
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
      const shortTzOff = Vue.filter('shortTzOffset')(bmcTimeZone);
      const dateTime = UtcDateTimeMixin.methods.extractBmcLocalDateTime(value);
      return dateTime.time + ' (' + shortTzOff + ')';
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
Vue.use(Events);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
