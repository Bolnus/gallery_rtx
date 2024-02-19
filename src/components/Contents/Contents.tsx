import React from "react";
import { Route, Routes } from "react-router-dom";
import classes from "./Contents.module.scss";
import { AlbumsList } from "./AlbumsList/AlbumsList";

export function Contents() 
{
  return (
    <div className={classes.contents}>
      <Routes>
        <Route path="/" element={<AlbumsList />} />
      </Routes>
    </div>
  );
}
