import React, { FocusEvent } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { UnknownAction } from "redux";
import { AppDispatch } from "../redux/reduxStore";
import { SelectOption } from "./commonTypes";
import { DefinedTag } from "../api/apiTypes";

function resetScroll()
{
  // window.scrollTo({ top: 0, left: 0 });
  // window.scrollY = 0;
  // if (document.scrollingElement?.scrollTop)
  // {
  //   document.scrollingElement.scrollTop = 0;
  // }
  window.scroll({ top: 0, left: 0 });
}

export function resetScrollOnBlur()
{
  // localEvent: FocusEvent<HTMLInputElement>
  // localEvent.preventDefault();
  resetScroll();
  // setTimeout(resetScroll, 100);
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

export function toUnsigned(text: string): number 
{
  const digitArray: RegExpMatchArray | null = text.match(/^\d+$/);
  if (digitArray)
  {
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
  actionCreator: ActionCreatorWithPayload<T>, // (newValue: T) => UnknownAction,
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

export function mapDefinedTagsToOptions(definedTag: DefinedTag): SelectOption
{
  return {
    value: definedTag.id,
    label: definedTag.tagName
  };
}

export function mapOptionsToDefinedTags(option: SelectOption): DefinedTag
{
  return {
    id: option.value,
    tagName: option.label
  };
}
