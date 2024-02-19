import React, {MouseEventHandler} from "react";
import classes from "./ringProgress.module.scss";

export interface RingProgressProps
{
    value?: number;
    onClick?: MouseEventHandler<SVGSVGElement>
}

export function RingProgressIComp(props: RingProgressProps)
{
    const [localValue, setLocalValue] = React.useState(251.2);
    const [previousValue, setPreviousValue] = React.useState(251.2);

    React.useEffect(function()
    {
        if (typeof props.value === "number")
        {
            const newLocalValue = 251.2 - 251.2 * props.value / 100;
            setPreviousValue(localValue);
            setLocalValue(newLocalValue);
        }
    }, [props.value]);

    return (
        <svg
            className={classes.ringBlock}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            onClick={props.onClick}
        >
            <circle
                className={classes.bgRing}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="8"
            />
            <circle
                className={classes.progressRing}
                transform="rotate(-90 50 50)"
                cx="50"
                cy="50"
                r="40"
                fill="none"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={String(localValue)}
            >
                <animate attributeName="stroke-dashoffset" from={String(previousValue)} to={String(localValue)} dur="1s" />
            </circle>
        </svg>
    )
}