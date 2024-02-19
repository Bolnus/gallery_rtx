import React from "react";
import classes from "./loader.module.scss"

export enum ImageSize
{
    small="small",
    big="big"
}

export interface LoaderICompProps
{
    height: ImageSize
}

export function LoaderIComp(props: LoaderICompProps)
{
    //width="200px" height="200px"
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${classes.loader} ${props.height === ImageSize.small ? classes.loader_small : classes.loader_big}`}
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
        >
            <circle className={classes.loader__circle} cx="50" cy="50" fill="none" r="40" strokeWidth="14"
                    strokeDasharray="188.49555921538757 64.83185307179586">
                <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s"
                                  values="0 50 50;360 50 50" keyTimes="0;1"/>
            </circle>
        </svg>
    );
}