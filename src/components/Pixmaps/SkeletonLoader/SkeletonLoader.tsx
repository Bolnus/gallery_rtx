import React from "react";
import classes from "./SkeletonLoader.module.scss";

export interface SkeletonLoaderProps
{
    isSharp?: boolean;
}

export function SkeletonLoader({ isSharp }: SkeletonLoaderProps)
{
  // return <div className={classes.skeletonBlock}/> viewBox="0 0 100 100" preserveAspectRatio="none"
  return (
    <svg className={classes.skeletonBlock} xmlns="http://www.w3.org/2000/svg">
      <rect
        className={classes.skeletonBlock__line}
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={isSharp ? undefined : "1em"}
      />
    </svg>
  );
}