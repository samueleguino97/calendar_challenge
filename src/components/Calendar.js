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
import { Fab, Button } from "@material-ui/core";
import classnames from "classnames";
import ReminderCreationDialog from "./ReminderCreationDialog/ReminderCreationDialog";
import { ReactComponent as WeatherIcon } from "../assets/icons/weather.svg";
import MonthlyView from "./CalendarViews/MonthlyView";
import WeeklyView from "./CalendarViews/WeeklyView";
import DailyView from "./CalendarViews/DailyView";

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
    existing,
    old_date
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
      updateReminder({
        reminder,
        key: GET_KEY_FORMAT(date),
        old_key: GET_KEY_FORMAT(old_date)
      });
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
  console.log(reminders);

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
          <Button onClick={handlePrev}>Prev</Button>
          <Button onClick={handleToday}>Today</Button>
          <Button onClick={handleNext}>Next</Button>
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
        <DailyView
          date={current_date}
          onAdd={handleAddReminder}
          reminders={reminders}
        />
      )}
      {view === "week" && (
        <WeeklyView
          date={current_date}
          onAdd={handleAddReminder}
          reminders={reminders}
        />
      )}
      {view === "month" && (
        <MonthlyView
          date={current_date}
          onAdd={handleAddReminder}
          onChange={handleDateChange}
          reminders={reminders}
        />
      )}
      <Fab onClick={toggleCreating} color="primary" className={styles.add}>
        +
      </Fab>
    </div>
  );
}

export default Calendar;
