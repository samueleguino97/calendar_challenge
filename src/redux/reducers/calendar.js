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
      const isDifferentDate = action.payload.old_key !== action.payload.key;
      const clonedList = Array.from(state.reminders[action.payload.old_key]);
      let new_list = Array.from(state.reminders[action.payload.key] || []);
      const reminderToUpdateIndex = state.reminders[
        action.payload.old_key
      ].findIndex(reminder => reminder.id === action.payload.reminder.id);

      if (isDifferentDate) {
        clonedList.splice(reminderToUpdateIndex, 1);
        new_list.push(action.payload.reminder);
      } else {
        clonedList[reminderToUpdateIndex] = action.payload.reminder;
      }

      if (!isDifferentDate) {
        new_list = clonedList;
      }

      return {
        ...state,
        reminders: {
          ...state.reminders,
          [action.payload.old_key]: clonedList,
          [action.payload.key]: new_list
        }
      };
    default:
      return state;
  }
};
