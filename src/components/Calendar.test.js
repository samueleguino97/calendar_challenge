import React from "react";
import { render, waitForElement } from "@testing-library/react";
import moment from "moment";
import Calendar from "./Calendar";
import { GET_KEY_FORMAT } from "../utils/constants";

it("Adds a new reminder and only allows for 30 chars. also includes a city", async () => {
  const calendar_state = {
    reminders: {},
    view: "month",
    current_date: moment(),
    creating_reminder: false
  };

  function addReminder({ reminder, key }) {
    calendar_state.reminders[key] = [reminder];
  }

  const { container, getByTestId } = render(
    <Calendar
      {...calendar_state}
      onCreate={addReminder}
      onCreationToggle={() => {}}
    />
  );
  const createButton = getByTestId("create_test_button");

  createButton.click();

  //A reminder has been created successfully
  expect(calendar_state.reminders[GET_KEY_FORMAT(moment())].length).toBe(1);
  //There is a city
  expect(
    calendar_state.reminders[GET_KEY_FORMAT(moment())][0].city
  ).toBeTruthy();
  //Reminder title has less that 30 words
  expect(
    calendar_state.reminders[GET_KEY_FORMAT(moment())][0].title.length
  ).toBeLessThanOrEqual(30);
});
