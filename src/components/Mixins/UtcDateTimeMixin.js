const getUtcDateTimeMixin = {
  methods: {
    getUtcDate(date, time, includesSeconds) {
      // Split user input string values to create
      // a UTC Date object
      const datesArray = date.split('-');
      const timeArray = time.split(':');
      var utcDate = '';
      // includesSeconds default will be undefined if needed to pass as third paramenter as true
      if (includesSeconds) {
        utcDate = Date.UTC(
          datesArray[0], // User input year
          //UTC expects zero-index month value 0-11 (January-December)
          //for reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC#Parameters
          parseInt(datesArray[1]) - 1, // User input month
          datesArray[2], // User input day
          timeArray[0], // User input hour
          timeArray[1], // User input minute
          timeArray[2], // User input seconds
        );
      } else {
        utcDate = Date.UTC(
          datesArray[0], // User input year
          //UTC expects zero-index month value 0-11 (January-December)
          //for reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC#Parameters
          parseInt(datesArray[1]) - 1, // User input month
          datesArray[2], // User input day
          timeArray[0], // User input hour
          timeArray[1], // User input minute
        );
      }
      return new Date(utcDate);
    },
    extractBmcLocalDateTime(value) {
      let timeString, dateString;
      if (value._originalISOString) {
        // Extract date and time from original ISO string (e.g., "2025-12-19" and "04:58:53" from "2025-12-19T04:58:53.498Z")
        const dateTimeMatch = value._originalISOString.match(
          /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/,
        );
        if (dateTimeMatch) {
          dateString = dateTimeMatch[1];
          timeString = dateTimeMatch[2];
        }
      }
      if (!timeString || !dateString) {
        // Fallback: Extract UTC date and time components
        const utcYear = value.getUTCFullYear();
        const utcMonth = (value.getUTCMonth() + 1).toString().padStart(2, '0');
        const utcDay = value.getUTCDate().toString().padStart(2, '0');
        const utcHours = value.getUTCHours().toString().padStart(2, '0');
        const utcMinutes = value.getUTCMinutes().toString().padStart(2, '0');
        const utcSeconds = value.getUTCSeconds().toString().padStart(2, '0');
        dateString = `${utcYear}-${utcMonth}-${utcDay}`;
        timeString = `${utcHours}:${utcMinutes}:${utcSeconds}`;
      }
      return { date: dateString, time: timeString };
    },
    //Creates a Date object from an ISO string while preserving the original string
    createDateWithISOString(isoString) {
      if (!isoString) return null;
      const dateObj = new Date(isoString);
      // Store original ISO string to extract local time when needed
      dateObj._originalISOString = isoString;
      return dateObj;
    },
  },
};

export default getUtcDateTimeMixin;
