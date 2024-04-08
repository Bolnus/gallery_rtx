import React from "react";
import { UnknownAction } from "redux";
import { AppDispatch } from "../redux/reduxStore";
import { SelectOption } from "./commonTypes";

export function resetScrollOnBlur() 
{
  window.scrollTo(0, 0);
}

function addDays(date: Date, days: number): Date 
{
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getUpcomingDate(): string 
{
  let date: Date = new Date();
  date = addDays(date, 1);
  return String(
    date.getFullYear() +
      String("00" + (date.getMonth() + 1)).slice(-2) +
      String("00" + date.getDate()).slice(-2) +
      "235959"
  );
}

export function onFocusIn(getCatalog: Function, catalogLoaded: boolean) 
{
  if (!catalogLoaded) {
    getCatalog();
  }
}

export function toUnsigned(text: string): number 
{
  const digitArray: RegExpMatchArray | null = text.match(/^\d+$/);
  if (digitArray) {
    return +digitArray.join();
  }
  return 0;

}

export function toInteger(text: string): number 
{
  const digitArray: RegExpMatchArray | null = text.match(/^-?\d+$/);
  if (digitArray) {
    return +digitArray.join();
  }
  return 0;
}

export function toFloat(text: string): number 
{
  const digitArray: RegExpMatchArray | null = text.match(/^-?\d+(\.\d+)?$/);
  if (digitArray) 
  {
    return +digitArray.join();
  }
  return 0;
}

export function onSimpleDispatch(
  dispatch: AppDispatch,
  actionCreator: () => UnknownAction,
  localEvent: React.FormEvent
)
{
  localEvent.preventDefault();
  dispatch(actionCreator());
}

export function onCallbackExec(
  callBack: () => void,
  localEvent: React.FormEvent
)
{
  localEvent.preventDefault();
  callBack();
}

export function setStateOnInputChange(
  callBack: (str: string) => void,
  localEvent: React.FormEvent
)
{
  localEvent.preventDefault();
  const inputElement = localEvent.target as HTMLInputElement;
  callBack(inputElement.value);
}

export function valueDispatch<T>(
  dispatch: AppDispatch,
  actionCreator: (str: T) => UnknownAction,
  value: T
) 
{
  dispatch(actionCreator(value));
}

export function updateStateValue<T>(
  setState: (str: T) => void,
  value: T
) 
{
  setState(value);
}

export function invertTrigger(flag: boolean, setValue: (newFlag: boolean) => void) 
{
  setValue(!flag);
}

export function mapOptionToLabel(option: SelectOption): string
{
  return option.label;
}

export function mapValueToOption(value: string): SelectOption
{
  return {
    value,
    label: value
  };
}
