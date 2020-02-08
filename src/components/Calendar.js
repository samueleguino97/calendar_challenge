import React, { useState } from "react";
import { getMonthDays, getWeek, getDayHours } from "./date_utils";
import styles from "./calendar.module.scss";
import moment from "moment";
function Calendar() {
  const [calendarView, setCalendarView] = useState("day");
  const [currentDate, setCurrentDate] = useState(moment());

  function handleNext() {
    switch (calendarView) {
      case "month":
        setCurrentDate(moment(currentDate).add(1, "month"));
        break;

      default:
        break;
    }
  }
  function handlePrev() {
    switch (calendarView) {
      case "month":
        setCurrentDate(moment(currentDate).subtract(1, "month"));
        break;

      default:
        break;
    }
  }

  return (
    <div className={styles.container}>
      <button onClick={handlePrev}>Prev</button>
      <button onClick={handleNext}>Next</button>
      <span>{currentDate.format("MMMM")}</span>
      <select
        value={calendarView}
        onChange={ev => setCalendarView(ev.target.value)}
      >
        <option value="month">Month</option>
        <option value="week">Week</option>
        <option value="day">Day</option>
      </select>
      {calendarView === "day" && (
        <div className={styles.day_view}>
          {getDayHours(currentDate).map(period => (
            <div>
              {period.format("HH:mm")}
              <div className={styles.reminders}></div>
            </div>
          ))}
        </div>
      )}
      {calendarView === "week" && (
        <div className={styles.week_view}>
          {getWeek(currentDate).map(weekday => (
            <div>
              {weekday.format("dddd")}

              <div className={styles.reminders}></div>
              <div className={styles.add}>Add Reminder</div>
            </div>
          ))}
        </div>
      )}
      {calendarView === "month" && (
        <div className={styles.month_view}>
          {getWeek(currentDate).map(weekday => (
            <div>{weekday.format("dddd")}</div>
          ))}
          {getMonthDays(currentDate).map(date => (
            <div>
              {date.date()}

              <div className={styles.reminders}></div>
              <div className={styles.add}>Add Reminder</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Calendar;
