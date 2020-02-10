import React from "react";
import { render } from "@testing-library/react";
import Calendar from "./Calendar";

test("Adds Reminder to Date selected", () => {
  const { getByText } = render(<Calendar />);
  const addButton = getByText("Add Reminder");
  addButton.click();
  expect(addButton).toBeInDocument();
});
