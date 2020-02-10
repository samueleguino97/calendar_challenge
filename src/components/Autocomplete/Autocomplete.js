import React from "react";
import styles from "./autocomplete.module.scss";
import { TextField } from "@material-ui/core";
import useAutocomplete from "@material-ui/lab/useAutocomplete";

function Autocomplete({ options = [], limit = 5, ...inputProps }) {
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    options,
    getOptionLabel: option => option.label,

    onChange: (ev, option) => inputProps.onChange(option.value),
    defaultValue: options.find(option => option.value === inputProps.value)
  });
  return (
    <div {...getRootProps()} className={styles.autocomplete}>
      <TextField
        className={styles.input}
        label={inputProps.label}
        InputLabelProps={getInputLabelProps()}
        {...getInputProps()}
      />

      <div {...getListboxProps()} className={styles.options}>
        {groupedOptions.slice(0, limit).map((option, index) => (
          <div {...getOptionProps({ option, index })}>{option.label}</div>
        ))}
      </div>
    </div>
  );
}

export default Autocomplete;
