import {
  CHANGE_VIEW,
  CHANGE_DATE,
  ADD_REMINDER,
  TOGGLE_CREATING_REMINDER,
  UPDATE_REMINDER
} from "./types";

export const ChangeView = new_view => dispatch => {
  dispatch({ type: CHANGE_VIEW, payload: new_view });
};
export const ChangeDate = new_date => dispatch => {
  dispatch({ type: CHANGE_DATE, payload: new_date });
};
export const AddReminder = ({ reminder, key }) => dispatch => {
  dispatch({ type: ADD_REMINDER, payload: { key, reminder } });
};
export const UpdateReminder = ({ reminder, key, old_key }) => dispatch => {
  dispatch({ type: UPDATE_REMINDER, payload: { key, reminder, old_key } });
};
export const ToggleCreating = () => dispatch => {
  dispatch({ type: TOGGLE_CREATING_REMINDER });
};
