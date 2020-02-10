import React from "react";

function Reminder({ reminder, onEdit, date }) {
  return (
    <div
      onClick={() => onEdit(date, reminder)}
      style={{ backgroundColor: reminder.color }}
    >
      {reminder.title}
    </div>
  );
}

export default Reminder;
