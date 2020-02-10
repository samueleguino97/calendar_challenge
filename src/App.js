import React from "react";
import Calendar from "./components/Calendar";
import { useCalendarActions } from "./hooks";
import { useSelector } from "react-redux";

function App() {
  const {
    createReminder,
    handleChangeView,
    handleDateChange,
    toggleCreating,
    updateReminder
  } = useCalendarActions();
  const calendarState = useSelector(state => state.calendar);

  return (
    <div className="App">
      <Calendar
        onChangeDate={handleDateChange}
        onChangeView={handleChangeView}
        onCreate={createReminder}
        onCreationToggle={toggleCreating}
        onUpdate={updateReminder}
        {...calendarState}
      />
    </div>
  );
}

export default App;
