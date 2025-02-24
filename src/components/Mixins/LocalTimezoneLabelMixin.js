import { format } from 'date-fns-tz';
const moment = require('moment-timezone');

const LocalTimezoneLabelMixin = {
  methods: {
    localOffset() {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTz = this.$options.filters.shortTimeZone(new Date());
      const pattern = `O '${shortTz}'`;
      return format(new Date(), pattern, { timezone });
    },
    offsetUseTimezone(value) {
      const offset = moment().tz(value).format('Z');
      return offset;
    },
  },
};

export default LocalTimezoneLabelMixin;
