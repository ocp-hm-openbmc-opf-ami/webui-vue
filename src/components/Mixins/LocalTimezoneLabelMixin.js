import { format } from 'date-fns-tz';

const LocalTimezoneLabelMixin = {
  methods: {
    localOffset() {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTz = this.$options.filters.shortTimeZone(new Date());
      const pattern = `'${shortTz}' O`;
      return format(new Date(), pattern, { timezone }).replace('GMT', 'UTC');
    },
    localOffsetTimezone(timezone) {
      const shortTimeZoneOffset = this.$options.filters.shortTzOffset(timezone);
      return shortTimeZoneOffset;
    },
  },
};

export default LocalTimezoneLabelMixin;
