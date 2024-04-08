import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./navigation.module.scss";

const MENU_MAIN = "Main";
const MENU_ENTER = "Login";
const MENU_EXIT = "Logout";
const MENU_CATEGORIES = "Categories";

function menuClicked(
  navigate: Function,
  checkBoxRef: React.RefObject<HTMLInputElement>,
  menuItemName: string,
  menuClickEvent: React.MouseEvent<HTMLElement>
): void 
{
  menuClickEvent.preventDefault();
  const checkBox = checkBoxRef.current as HTMLInputElement;
  checkBox.checked = false;
  // const listItem = event.target as HTMLUListElement;
  // const upcomingDate: string = getUpcomingDate();
  switch (menuItemName) 
  {
  case MENU_MAIN:
    navigate("/");
    break;
  case MENU_CATEGORIES:
    break;
  }
}

export function Menu() 
{
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  return (
    <div className={classes.menu}>
      <input type="checkbox" ref={checkBoxRef} />
      <span />
      <span />
      <span />
      <ul className={`${classes.menu__list}`}>
        <li onClick={menuClicked.bind(null, navigate, checkBoxRef, MENU_MAIN)}>
          {MENU_MAIN}
        </li>
        <li onClick={menuClicked.bind(null, navigate, checkBoxRef, MENU_CATEGORIES)}>{MENU_CATEGORIES}</li>
      </ul>
    </div>
  );
}
