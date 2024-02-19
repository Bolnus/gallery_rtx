import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import { PhotoView } from "./components/Contents/PhotoView/PhotoView";
import { Header } from "./components/Header/Header";
import { Contents } from "./components/Contents/Contents";

export function App()
{
  return (
    <div className="rootContent">
      <PhotoView  />
      <Header />
      <Contents />
    </div>
  );
}

window.addEventListener("resize", function ()
{
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});
