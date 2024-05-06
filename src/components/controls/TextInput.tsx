import React from "react";
import classes from "./TextInput.module.scss";
import { resetScrollOnBlur } from "../../utils/commonUtils";

interface TextInputProps
{
  value: string;
  onChange: (str: string) => void;
  isClearable?: boolean;
  className?: string;
}

function onInputChange(onChange: (str: string) => void, localEvent: React.FormEvent)
{
  localEvent.preventDefault();
  const inputElement = localEvent.target as HTMLInputElement;
  onChange(inputElement.value);
}

function onClearInput(onChange: (str: string) => void)
{
  onChange("");
}

export function TextInput({
  value,
  onChange,
  isClearable,
  className
}: TextInputProps)
{
  return (
    <div className={`${className || ""} ${classes.textInput}`}>
      <input
        placeholder="Album name..."
        onBlur={resetScrollOnBlur}
        value={value}
        onChange={onInputChange.bind(null, onChange)}
        className={`${classes.textInput__input} commonInput`}
      />
      {isClearable ? (
        <div className={classes.textInput__indicatorContainer}>
          <span className={classes.textInput__spacer} />
          <div onClick={onClearInput.bind(null, onChange)} className={`${classes.textInput__indicatorClose} emojiFont`}>
            ❌
          </div>
        </div>
      ) : null}
    </div>
  );
}