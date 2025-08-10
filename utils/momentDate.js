const moment = require("moment");

const getDateRange = (range) => {
  let startDate, endDate;

  switch (range) {
    case "today":
      // Today from 12:00 AM to 11:59 PM
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
      break;

    case "yesterday":
      // Yesterday's 24 hours
      startDate = moment().subtract(1, "day").startOf("day").toDate();
      endDate = moment().subtract(1, "day").endOf("day").toDate();
      break;

    case "thisWeek":
      // Start from Sunday/Monday to current week's Saturday/Sunday
      startDate = moment().startOf("week").toDate();
      endDate = moment().endOf("week").toDate();
      break;

    case "lastWeek":
      // One week before this week
      startDate = moment().subtract(1, "week").startOf("week").toDate();
      endDate = moment().subtract(1, "week").endOf("week").toDate();
      break;

    case "thisMonth":
      // From 1st of current month to last day of current month
      startDate = moment().startOf("month").toDate();
      endDate = moment().endOf("month").toDate();
      break;

    case "lastMonth":
      // Entire previous month
      startDate = moment().subtract(1, "month").startOf("month").toDate();
      endDate = moment().subtract(1, "month").endOf("month").toDate();
      break;

    case "thisYear":
      // From 1st Jan to 31st Dec of current year
      startDate = moment().startOf("year").toDate();
      endDate = moment().endOf("year").toDate();
      break;

    case "lastYear":
      // Entire last year
      startDate = moment().subtract(1, "year").startOf("year").toDate();
      endDate = moment().subtract(1, "year").endOf("year").toDate();
      break;

    default:
      // If input doesn't match any case
      throw new Error("Invalid range type provided.");
  }

  return { start: startDate, end: endDate };
};


module.exports= getDateRange;