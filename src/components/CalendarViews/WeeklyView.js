import React from "react";

import styles from "./views.module.scss";
import { getWeek, getDayHours } from "../date_utils";
import { GET_KEY_FORMAT } from "../../utils/constants";
import moment from "moment";

function WeeklyView({ date, onAdd, reminders }) {
  return (
    <div className={styles.week_view}>
      {getWeek(date).map(weekday => (
        <div>
          {weekday.format("dddd Do")}

          {getDayHours(weekday).map((hour, index) => {
            return (
              <div className={styles.hours}>
                <div>{hour.format("HH:mm ")}</div>
                <div className={styles.reminders}>
                  {reminders[GET_KEY_FORMAT(weekday)]
                    ?.filter(
                      reminder =>
                        reminder.date.isBetween(
                          hour,
                          moment(hour).add(30, "minutes")
                        ) || reminder.date.isSame(hour, "minute")
                    )
                    .map(reminder => (
                      <div
                        onClick={() => onAdd(weekday, reminder)}
                        style={{ backgroundColor: reminder.color }}
                      >
                        {reminder.title}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default WeeklyView;
