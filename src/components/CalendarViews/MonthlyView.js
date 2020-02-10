import React from "react";

import { getMonthDays, getWeek } from "../date_utils";

import { ReactComponent as WeatherIcon } from "../../assets/icons/weather.svg";

import styles from "./views.module.scss";
import classnames from "classnames";

import moment from "moment";
import { GET_KEY_FORMAT } from "../../utils/constants";
import Reminder from "../Reminder/Reminder";

function MonthlyView({ date, reminders, onAdd, onChange }) {
  return (
    <div className={styles.month_view}>
      {getMonthDays(date).map((month_day, index) => (
        <div
          className={classnames({
            [styles.day]: true,
            [styles.first_day]: index < 7,
            [styles.disabled]: !month_day.isSame(date, "month"),
            [styles.active]: month_day.isSame(moment(), "day"),
            [styles.current]: month_day.isSame(date, "day")
          })}
        >
          <span>{index < 7 && getWeek()[index].format("ddd")}</span>

          <div className={styles.reminders}>
            {reminders[GET_KEY_FORMAT(month_day)]?.slice(0, 3).map(reminder => (
              <Reminder reminder={reminder} onEdit={onAdd} date={month_day} />
            ))}
          </div>
          <span className={styles.date_number}>
            <span>
              <span
                onClick={ev => {
                  onAdd(month_day);
                  ev.stopPropagation();
                }}
              >
                +
              </span>
              <span>
                <WeatherIcon />
              </span>
              {reminders[GET_KEY_FORMAT(month_day)]?.slice(3).length
                ? reminders[GET_KEY_FORMAT(month_day)]?.slice(3).length
                : ""}
            </span>
            <span onClick={() => onChange(month_day)}>
              {" "}
              {month_day.format("DD")}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default MonthlyView;
