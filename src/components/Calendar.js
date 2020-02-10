import React, { useState } from "react";
import { getMonthDays, getWeek, getDayHours } from "./date_utils";
import styles from "./calendar.module.scss";
import moment from "moment";
import { GET_KEY_FORMAT, VIEWS } from "../utils/constants";
import { useAction, useFetch } from "../hooks";
import { useSelector } from "react-redux";
import {
  ChangeView,
  ChangeDate,
  AddReminder,
  ToggleCreating,
  UpdateReminder
} from "../redux/actions";
import { Fab } from "@material-ui/core";
import classnames from "classnames";
import ReminderCreationDialog from "./ReminderCreationDialog/ReminderCreationDialog";
import { ReactComponent as WeatherIcon } from "../assets/icons/weather.svg";

function Calendar() {
  const handleChangeView = useAction(ChangeView);
  const handleDateChange = useAction(ChangeDate);
  const createReminder = useAction(AddReminder);
  const updateReminder = useAction(UpdateReminder);
  const toggleCreating = useAction(ToggleCreating);
  const { view, current_date, reminders, creating_reminder } = useSelector(
    state => state.calendar
  );
  const { data, loading, error } = useFetch(
    `https://api.openweathermap.org/data/2.5/weather?q=London&appid=b1759ab2e648648dd842f387480a6c9f`
  );
  const [reminderToEdit, setReminderToEdit] = useState(null);
  function handleNext() {
    switch (view) {
      case "month":
        handleDateChange(moment(current_date).add(1, "month"));
        break;
      case "week":
        handleDateChange(moment(current_date).add(1, "week"));
        break;
      case "day":
        handleDateChange(moment(current_date).add(1, "day"));
        break;

      default:
        break;
    }
  }
  function handlePrev() {
    switch (view) {
      case "month":
        handleDateChange(moment(current_date).subtract(1, "month"));
        break;
      case "week":
        handleDateChange(moment(current_date).subtract(1, "week"));
        break;
      case "day":
        handleDateChange(moment(current_date).subtract(1, "day"));
        break;

      default:
        break;
    }
  }
  function handleToday() {
    handleDateChange(moment());
  }

  function addReminder({
    date = moment(),
    title,
    city,
    info,
    color,
    id,
    existing
  }) {
    const reminder = {
      title,
      date,
      city,
      info,
      color,
      id
    };
    if (existing) {
      updateReminder({ reminder, key: GET_KEY_FORMAT(date) });
    } else {
      reminder.id = reminders[GET_KEY_FORMAT(date)]
        ? reminders[GET_KEY_FORMAT(date)].length
        : 0;
      createReminder({ reminder, key: GET_KEY_FORMAT(date) });
    }
    toggleCreating();
  }
  function handleAddReminder(date, data) {
    if (data) {
      setReminderToEdit(data);
    }
    handleDateChange(date);
    toggleCreating();
  }

  return (
    <div className={styles.container}>
      {creating_reminder && (
        <ReminderCreationDialog
          open={creating_reminder}
          onClose={() => {
            toggleCreating();
            setReminderToEdit(null);
          }}
          onAdd={addReminder}
          currentDate={current_date}
          data={reminderToEdit}
        />
      )}
      <header>
        <h1>{current_date.format("MMMM Do, YYYY")}</h1>
        <div className={styles.buttons}>
          <button onClick={handlePrev}>Prev</button>
          <button onClick={handleToday}>Today</button>
          <button onClick={handleNext}>Next</button>
        </div>
        <div className={styles.views}>
          {VIEWS.map(view_option => (
            <div
              className={view_option.value === view ? styles.active : ""}
              onClick={() => handleChangeView(view_option.value)}
            >
              {view_option.label}
            </div>
          ))}
        </div>
      </header>

      {view === "day" && (
        <div className={styles.day_view}>
          {getDayHours(current_date).map(period => (
            <div>
              {period.format("HH:mm")}
              <div className={styles.reminders}>
                {reminders[GET_KEY_FORMAT(period)]
                  ?.filter(reminder =>
                    reminder.date.isBetween(
                      period,
                      moment(period).add(30, "minutes")
                    )
                  )
                  .map(reminder => (
                    <div
                      onClick={() => handleAddReminder(period, reminder)}
                      style={{ backgroundColor: reminder.color }}
                    >
                      {reminder.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {view === "week" && (
        <div className={styles.week_view}>
          {getWeek(current_date).map(weekday => (
            <div>
              {weekday.format("dddd Do")}

              {getDayHours(weekday).map((hour, index) => {
                return (
                  <div>
                    <div>{hour.format("HH:mm ")}</div>
                    <div className={styles.reminders}>
                      {reminders[GET_KEY_FORMAT(weekday)]
                        ?.filter(reminder =>
                          reminder.date.isBetween(
                            hour,
                            moment(hour).add(30, "minutes")
                          )
                        )
                        .map(reminder => (
                          <div
                            onClick={() => handleAddReminder(weekday, reminder)}
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
      )}
      {view === "month" && (
        <div className={styles.month_view}>
          {getMonthDays(current_date).map((date, index) => (
            <div
              className={classnames({
                [styles.day]: true,
                [styles.first_day]: index < 7,
                [styles.disabled]: !date.isSame(current_date, "month"),
                [styles.active]: date.isSame(moment(), "day"),
                [styles.current]: date.isSame(current_date, "day")
              })}
            >
              <span>{index < 7 && getWeek()[index].format("ddd")}</span>

              <div className={styles.reminders}>
                {reminders[GET_KEY_FORMAT(date)]?.slice(0, 3).map(reminder => (
                  <div
                    onClick={() => handleAddReminder(date, reminder)}
                    style={{ backgroundColor: reminder.color }}
                  >
                    {reminder.title}
                  </div>
                ))}
              </div>
              <span className={styles.date_number}>
                <span>
                  <span
                    onClick={ev => {
                      handleAddReminder(date);
                      ev.stopPropagation();
                    }}
                  >
                    +
                  </span>
                  <span>
                    <WeatherIcon />
                  </span>
                  {reminders[GET_KEY_FORMAT(date)]?.slice(3).length
                    ? reminders[GET_KEY_FORMAT(date)]?.slice(3).length
                    : ""}
                </span>
                <span onClick={() => handleDateChange(date)}>
                  {" "}
                  {date.format("DD")}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
      <Fab onClick={toggleCreating} color="primary" className={styles.add}>
        +
      </Fab>
    </div>
  );
}

export default Calendar;
