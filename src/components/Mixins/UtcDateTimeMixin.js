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
    extractBmcLocalTime(value) {
      let timeString;
      // Check if we have access to the original ISO string to extract local time
      if (value._originalISOString) {
        // Extract time from original ISO string (e.g., "04:58:53" from "2025-09-22T04:58:53.498+08:00")
        const timeMatch =
          value._originalISOString.match(/T(\d{2}:\d{2}:\d{2})/);
        timeString = timeMatch ? timeMatch[1] : null;
      }
      if (!timeString) {
        // Fallback: Extract UTC time components (e.g., 06:02:17 from 2025-09-23T06:02:17Z)
        const utcHours = value.getUTCHours().toString().padStart(2, '0');
        const utcMinutes = value.getUTCMinutes().toString().padStart(2, '0');
        const utcSeconds = value.getUTCSeconds().toString().padStart(2, '0');
        timeString = `${utcHours}:${utcMinutes}:${utcSeconds}`;
      }
      return timeString;
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
