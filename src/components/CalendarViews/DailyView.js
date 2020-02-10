import React from "react";

import styles from "./views.module.scss";
import { getDayHours } from "../date_utils";
import { GET_KEY_FORMAT } from "../../utils/constants";
import moment from "moment";
import Reminder from "../Reminder/Reminder";

function DailyView({ date, onAdd, reminders }) {
  return (
    <div className={styles.day_view}>
      {getDayHours(date).map(period => (
        <div className={styles.hours}>
          {period.format("HH:mm")}
          <div className={styles.reminders}>
            {reminders[GET_KEY_FORMAT(period)]
              ?.filter(
                reminder =>
                  reminder.date.isBetween(
                    period,
                    moment(period).add(30, "minutes")
                  ) || reminder.date.isSame(period, "minute")
              )
              .map(reminder => (
                <Reminder reminder={reminder} onEdit={onAdd} date={period} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DailyView;
