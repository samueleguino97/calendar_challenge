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

function Calendar({
  onCreate,
  onChangeView,
  onChangeDate,
  onCreationToggle,
  onUpdate,
  view,
  current_date,
  reminders,
  creating_reminder
}) {
  const [reminderToEdit, setReminderToEdit] = useState(null);

  function handleDateStep(direction = 0) {
    onChangeDate(moment(current_date).add(direction, view));
  }
  function handleToday() {
    onChangeDate(moment());
  }

  function openCreateOrEditDialog(date, data) {
    //CHECKS IF OPENING TO UPDATE
    if (data) {
      setReminderToEdit(data);
    }
    onChangeDate(date);
    onCreationToggle();
  }

  function closeCreateOrEditDialog() {
    onCreationToggle();
    setReminderToEdit(null);
  }

  function addReminder({ existing, old_date, ...reminder }) {
    if (reminder.title.length >= 30) {
      reminder.title = reminder.title
        .split("")
        .slice(0, 30)
        .join("");
    }
    if (existing) {
      onUpdate({
        reminder,
        key: GET_KEY_FORMAT(reminder.date),
        old_key: GET_KEY_FORMAT(old_date)
      });
    } else {
      //GENERATES REMINDER ID
      reminder.id = reminders[GET_KEY_FORMAT(reminder.date)]
        ? reminders[GET_KEY_FORMAT(reminder.date)].length
        : 0;

      onCreate({ reminder, key: GET_KEY_FORMAT(reminder.date) });
    }
    closeCreateOrEditDialog();
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
              onClick={() => onChangeView(view_option.value)}
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
          onChange={onChangeDate}
          reminders={reminders}
        />
      )}
      <Fab
        data-testid="add_button"
        onClick={onCreationToggle}
        color="primary"
        className={styles.add}
      >
        +
      </Fab>
      {/* TEST BUTTON */}
      <button
        data-testid="create_test_button"
        style={{
          visibility: "hidden",
          opacity: 0,
          position: "absolute",
          zIndex: -2
        }}
        onClick={(wa, e) => {
          addReminder({
            id: 0,
            title:
              "test reminder to test characters this should stop at 30 hehe this should not be more that 30",
            date: moment(),
            city: 2453
          });
        }}
      ></button>
      {/* TEST BUTTON */}
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
