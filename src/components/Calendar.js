import React, { useState } from "react";
import styles from "./calendar.module.scss";
import moment from "moment";
import { GET_KEY_FORMAT, VIEWS } from "../utils/constants";
import { useCalendarActions } from "../hooks";
import { useSelector } from "react-redux";
import { Fab, Button } from "@material-ui/core";
import ReminderCreationDialog from "./ReminderCreationDialog/ReminderCreationDialog";
import MonthlyView from "./CalendarViews/MonthlyView";
import WeeklyView from "./CalendarViews/WeeklyView";
import DailyView from "./CalendarViews/DailyView";

function Calendar() {
  const {
    createReminder,
    handleChangeView,
    handleDateChange,
    toggleCreating,
    updateReminder
  } = useCalendarActions();
  const { view, current_date, reminders, creating_reminder } = useSelector(
    state => state.calendar
  );
  const [reminderToEdit, setReminderToEdit] = useState(null);
  function handleDateStep(direction = 0) {
    handleDateChange(moment(current_date).add(direction, view));
  }
  function handleToday() {
    handleDateChange(moment());
  }

  function addReminder({ existing, old_date, ...reminder }) {
    if (existing) {
      updateReminder({
        reminder,
        key: GET_KEY_FORMAT(reminder.date),
        old_key: GET_KEY_FORMAT(old_date)
      });
    } else {
      reminder.id = reminders[GET_KEY_FORMAT(reminder.date)]
        ? reminders[GET_KEY_FORMAT(reminder.date)].length
        : 0;
      createReminder({ reminder, key: GET_KEY_FORMAT(reminder.date) });
    }
    closeCreateOrEditDialog();
  }

  function openCreateOrEditDialog(date, data) {
    if (data) {
      setReminderToEdit(data);
    }
    handleDateChange(date);
    toggleCreating();
  }

  function closeCreateOrEditDialog() {
    toggleCreating();
    setReminderToEdit(null);
  }

  return (
    <div className={styles.container}>
      <header>
        <h1>{current_date.format("MMMM Do, YYYY")}</h1>
        <div className={styles.buttons}>
          <Button onClick={() => handleDateStep(-1)}>Prev</Button>
          <Button onClick={handleToday}>Today</Button>
          <Button onClick={() => handleDateStep(-1)}>Next</Button>
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
          onAdd={openCreateOrEditDialog}
          reminders={reminders}
        />
      )}
      {view === "week" && (
        <WeeklyView
          date={current_date}
          onAdd={openCreateOrEditDialog}
          reminders={reminders}
        />
      )}
      {view === "month" && (
        <MonthlyView
          date={current_date}
          onAdd={openCreateOrEditDialog}
          onChange={handleDateChange}
          reminders={reminders}
        />
      )}
      <Fab onClick={toggleCreating} color="primary" className={styles.add}>
        +
      </Fab>
      {creating_reminder && (
        <ReminderCreationDialog
          open={creating_reminder}
          onClose={closeCreateOrEditDialog}
          onAdd={addReminder}
          currentDate={current_date}
          data={reminderToEdit}
        />
      )}
    </div>
  );
}

export default Calendar;
