import moment from "moment";

export function getMonthDays(month = moment()) {
  const startOfMonth = moment(month).startOf("month");
  const initialWeekDay = moment(startOfMonth).startOf("week");

  const month_array = Array.from({ length: 35 }, (_, index) => {
    const month_day = moment(initialWeekDay).add(index, "days");
    return month_day;
  });
  return month_array;
}
export function getWeek(week = moment()) {
  const initialWeekDay = moment(week).startOf("week");
  const week_array = Array.from({ length: 7 }, (_, index) => {
    const week_day = moment(initialWeekDay).add(index, "days");
    return week_day;
  });
  return week_array;
}

export function getDayHours(day = moment()) {
  const initialHour = moment(day).startOf("day");

  const finalHour = moment(day).endOf("day");
  const period_array = Array.from(
    { length: finalHour.diff(initialHour, "hours") * 2 + 2 },
    (_, index) => {
      const period = moment(initialHour).add(index * 30, "minutes");
      return period;
    }
  );
  return period_array;
}
