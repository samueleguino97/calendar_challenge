import React from "react";

import styles from "./views.module.scss";
import { getWeek, getDayHours } from "../date_utils";
import { GET_KEY_FORMAT } from "../../utils/constants";
import moment from "moment";
import Reminder from "../Reminder/Reminder";

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
                      <Reminder
                        reminder={reminder}
                        onEdit={onAdd}
                        date={weekday}
                      />
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
