import React from "react";
import classes from "./DarkToggle.module.scss";
import { PROP_DARK_TOGGLE_CHECKED } from "../../../utils/localStorageUtils";

function updateStyle(toggleState: boolean): void 
{
  if (toggleState) 
  {
    document.documentElement.style.setProperty("--mainColor", "#112734");
    document.documentElement.style.setProperty("--bgColor", "#021e2a");
    document.documentElement.style.setProperty("--fontColorFirm", "white");
    document.documentElement.style.setProperty("--fontColorFirmGreen", "white");
    document.documentElement.style.setProperty("--fontColorGreenInverted", "#004422");
    document.documentElement.style.setProperty("--fontColorLight", "#c4ccce");
    document.documentElement.style.setProperty("--mainColorDark", "#112734");
    document.documentElement.style.setProperty("--checkBoxColor", "#4ed164");
    document.documentElement.style.setProperty("--inputBgColor", "#112734");
  } 
  else 
  {
    document.documentElement.style.setProperty("--mainColor", "#80eeb0");
    document.documentElement.style.setProperty("--bgColor", "#f5f6fa");
    document.documentElement.style.setProperty("--fontColorFirm", "black");
    document.documentElement.style.setProperty("--fontColorFirmGreen", "#004422");
    document.documentElement.style.setProperty("--fontColorGreenInverted", "grey");
    document.documentElement.style.setProperty("--fontColorLight", "grey");
    document.documentElement.style.setProperty("--mainColorDark", "#004422");
    document.documentElement.style.setProperty("--checkBoxColor", "#ebcdb5");
    document.documentElement.style.setProperty("--inputBgColor", "#c4ccce");
  }
}

function onCheckBoxClicked(toggleEvent: React.ChangeEvent<HTMLInputElement>) 
{
  const inputElement = toggleEvent.target as HTMLInputElement;
  updateStyle(inputElement.checked);
  localStorage.setItem(PROP_DARK_TOGGLE_CHECKED, String(inputElement.checked));
}

export function DarkToggle()
{
  React.useEffect(function()
  {
    updateStyle(localStorage.getItem(PROP_DARK_TOGGLE_CHECKED) === "true");
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  return (
    <input
      type="checkbox"
      defaultChecked={localStorage.getItem(PROP_DARK_TOGGLE_CHECKED) === "true"}
      onChange={onCheckBoxClicked}
      className={classes.darkToggle}
    />
  );
}