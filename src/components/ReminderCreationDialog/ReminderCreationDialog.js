import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Autocomplete from "../Autocomplete/Autocomplete";
import { SELECT_CITY_LIST } from "../../utils/constants";

import styles from "./reminder_creation.module.scss";
import { useFormState, useFetch } from "../../hooks";
import moment from "moment";
import { CirclePicker } from "react-color";

function ReminderCreationDialog({ open, onClose, onAdd, currentDate, data }) {
  const [
    { date, title, info, city, color },
    onChangeField,
    clear
  ] = useFormState({
    date: currentDate || moment(),
    color: "#5393fe",
    ...(data || {}),
    city: data?.city
  });
  const { data: weatherData, loading } = useFetch(
    data
      ? `https://api.openweathermap.org/data/2.5/weather?id=${data?.city}&appid=b1759ab2e648648dd842f387480a6c9f`
      : ""
  );
  console.log(city);

  const [errors, setErrors] = useState({});
  function validateFields() {
    const actual_errors = {};
    //Validate date
    if (!date || !moment.isDate(date)) {
      actual_errors.date = "Date field is required";
    }
    if (!title) {
      actual_errors.title = "Reminder needs a title field";
    }
    if (title && title.length > 30) {
      actual_errors.title = "Reminder cannot be more that 30 characters long";
    }
    if (!city) {
      actual_errors.city = "Reminder needs to be assigned to a valid city";
    }

    setErrors(actual_errors);

    if (!Object.keys(actual_errors).length) {
      return true;
    }
  }

  return (
    <Dialog
      data-testid="creation_dialog"
      className={styles.dialog}
      open={open}
      onClose={onClose}
      classes={{ paper: styles.dialog }}
    >
      <DialogContent className={styles.content}>
        <div>
          <div>
            <TextField
              label="Reminder"
              onChange={onChangeField("title")}
              value={title}
              inputProps={{ maxLength: 30 }}
              placeholder="e.j. Pick up laundry"
              error={!!errors["title"]}
              helperText="Max length is 30 characters"
            />
          </div>
          <div>
            <TextField
              label="Additional Info"
              onChange={onChangeField("info")}
              value={info}
              error={!!errors["info"]}
              placeholder="e.j. Pick before 10 am"
              helperText="Max length is 30 characters"
            />
          </div>
          <div>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDateTimePicker
                label="Reminder Date"
                value={date.toDate()}
                error={!!errors["date"]}
                onChange={onChangeField("date")}
                variant="inline"
                format="MM/DD/YYYY HH:mm A"
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <div>
          <div>
            <Autocomplete
              options={SELECT_CITY_LIST.map(city => ({
                value: city.id,
                label: `${city.name}, ${city.country}`
              }))}
              error={!!errors["city"]}
              onChange={onChangeField("city")}
              value={city}
              label="City"
            />
          </div>
          <div>
            <CirclePicker
              onChange={color => onChangeField("color")(color.hex)}
              hex
            />
          </div>
          <div>{weatherData?.weather?.[0]?.main}</div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (validateFields()) {
              onAdd({
                city,
                title,
                info,
                date,
                color,
                existing: !!data,
                id: data?.id,
                old_date: data?.date
              });
              clear();
            }
          }}
          style={{ backgroundColor: color }}
        >
          {data ? "Update Reminder" : "Create Reminder"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReminderCreationDialog;
