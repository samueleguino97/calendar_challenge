import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  ToggleCreating,
  UpdateReminder,
  AddReminder,
  ChangeDate,
  ChangeView
} from "../redux/actions";

export function useFetch(url = "", options = {}, initialValue = {}) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(url, options)
      .then(res => res.json())
      .then(json_data => {
        setData(json_data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
export function useLazyFetch(url = "", options = {}, initialValue = {}) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetch_call = useCallback(() => {
    setLoading(false);
    fetch(url, options)
      .then(res => res.json())
      .then(json_data => {
        setData(json_data);
        setLoading(true);
      })
      .catch(err => setError(err.message));
  }, [url, options]);

  return [fetch_call, { data, loading, error }];
}

export function useAction(actionCreator) {
  const dispatch = useDispatch();

  const action = useCallback(payload => actionCreator(payload)(dispatch), []);

  return action;
}
export function useFormState(initialState = {}) {
  const [formState, setFormState] = useState(initialState || {});

  const handleFieldChange = field => ev => {
    if (ev.target) {
      setFormState({ ...formState, [field]: ev.target.value });
    } else {
      setFormState({ ...formState, [field]: ev });
    }
  };

  function clearForm() {
    setFormState(initialState);
  }

  return [formState, handleFieldChange, clearForm];
}
export function useCalendarActions() {
  const handleChangeView = useAction(ChangeView);
  const handleDateChange = useAction(ChangeDate);
  const createReminder = useAction(AddReminder);
  const updateReminder = useAction(UpdateReminder);
  const toggleCreating = useAction(ToggleCreating);

  return {
    handleChangeView,
    handleDateChange,
    createReminder,
    updateReminder,
    toggleCreating
  };
}
