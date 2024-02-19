import React from "react";
import { useNavigate, Routes, Route, NavigateFunction } from "react-router-dom";
import classes from "./navigation.module.scss";
import { getUpcomingDate } from "../../utils/commonUtils";
import { TriangleSVG } from "../Pixmaps/Triangle/TriangleSVG";
import { Menu } from "./Menu";
import { DarkToggle } from "../Pixmaps/DarkToggle/DarkToggle";

export interface StateProps 
{
  taskArrayLoaded: boolean;
  authorizedLogin: string;
}

// export interface DispatchProps {
//   getFullCatalog: Function;
//   getJobNamesCatalog: Function;
//   getUser: Function;
// }

function goBack(navigate: NavigateFunction, albumsArrayLoaded: boolean) 
{
  // const previousURL = document.referrer;
  // console.log(previousURL);
  // const isPreviousURLExternal = new URL(previousURL).origin == new URL(location).origin;
  if (albumsArrayLoaded) 
  {
    navigate(-1);
  }
  else 
  {
    navigate("/");
  }
}

export function Header() 
{
  const albumsArrayLoaded = false;
  const navigate = useNavigate();

  // React.useEffect(function ()
  // {
  // props.getUser().then(function (rc: number) {
  //   //console.log(window.location.pathname);
  //   if ((window.location.pathname === "/" || window.location.pathname === "/auth") && rc >= 200 && rc < 300) {
  //     navigate("/tasks");
  //   } else if (window.location.pathname !== "/auth" && ((rc >= 400 && rc < 500) || rc < 100)) {
  //     navigate("/auth");
  //   }
  // });
  // }, []);

  const navBackBlock = (
    <div onClick={goBack.bind(null, navigate, albumsArrayLoaded)} className={classes.header__link}>
      <TriangleSVG />
    </div>
  );

  return (
    <nav role="navigation" className={classes.header}>
      <Routes>
        <Route path="/tasks/detail/*" element={navBackBlock} />
        <Route path="*" element={<Menu />} />
      </Routes>
      <div className={classes.darkToggleWrapper}>
        <DarkToggle />
      </div>
    </nav>
  );
}
