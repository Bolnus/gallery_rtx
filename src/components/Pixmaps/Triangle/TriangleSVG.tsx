import React from "react";
import classes from "./Triangle.module.scss";

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) 
{
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function mapPointsToCoordinates(
  centerX: number,
  centerY: number,
  radius: number,
  degreeIncrement: number,
  points: number,
  index: number
) 
{
  const point = polarToCartesian(centerX, centerY, radius, degreeIncrement * index);
  return `${point.x},${point.y}`;
}

function polygon(centerX: number, centerY: number, points: number, radius: number) {
  const degreeIncrement = 360 / points;
  const d = new Array(points)
    .fill("foo")
    .map(mapPointsToCoordinates.bind(null, centerX, centerY, radius, degreeIncrement));
  return `M${d}Z`;
}

export function TriangleSVG() 
{
  // const { centerX, centerY, points, radius } = this.state;
  const polyPath = polygon(200, 200, 3, 120);
  // width="400px" height="400px"
  return (
    <svg className={classes.triangleIcon} viewBox="0 0 400 400">
      <ellipse cx="200" cy="200" rx="200" ry="200" />
      <path d={polyPath} strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
