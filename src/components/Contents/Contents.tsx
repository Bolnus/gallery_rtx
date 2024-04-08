import React from "react";
import { Route, Routes } from "react-router-dom";
import classes from "./Contents.module.scss";
import { AlbumsList } from "./AlbumsList/AlbumsList";
import { Album } from "./Album/Album";

export function Contents() 
{
  return (
    <div className={classes.contents}>
      <Routes>
        <Route path="/" element={<AlbumsList />} />
        <Route path="/search" element={<AlbumsList isSearch />} />
        <Route path="/album" element={<Album />} />
      </Routes>
    </div>
  );
}
