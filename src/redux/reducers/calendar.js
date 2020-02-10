import {
  CHANGE_VIEW,
  ADD_REMINDER,
  CHANGE_DATE,
  TOGGLE_CREATING_REMINDER,
  UPDATE_REMINDER
} from "../actions/types";
import moment from "moment";

const INITIAL_STATE = {
  reminders: {},
  view: "month",
  current_date: moment(),
  creating_reminder: false
};

export const calendar = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_VIEW:
      return { ...state, view: action.payload };

    case CHANGE_DATE:
      return { ...state, current_date: action.payload };
    case TOGGLE_CREATING_REMINDER:
      return { ...state, creating_reminder: !state.creating_reminder };
    case ADD_REMINDER:
      return {
        ...state,
        reminders: {
          ...state.reminders,
          [action.payload.key]: [
            ...(state.reminders[action.payload.key] || []),
            action.payload.reminder
          ]
        }
      };
    case UPDATE_REMINDER:
      const clonedList = Array.from(state.reminders[action.payload.key]);
      console.log(clonedList);
      const reminderToUpdateIndex = state.reminders[
        action.payload.key
      ].findIndex(reminder => reminder.id === action.payload.reminder.id);
      clonedList[reminderToUpdateIndex] = action.payload.reminder;
      return {
        ...state,
        reminders: {
          ...state.reminders,
          [action.payload.key]: clonedList
        }
      };
    default:
      return state;
  }
};
