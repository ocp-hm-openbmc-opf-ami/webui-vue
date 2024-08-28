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
  },
};

export default getUtcDateTimeMixin;
