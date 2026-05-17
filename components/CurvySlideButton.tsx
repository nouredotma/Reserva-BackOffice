"use client";

import React from "react";
import "./CurvySlideButton.css";

export default function CurvySlideButton({
  onClick,
  text = "Hover Me!",
  color = "#FFC900",
  textColor = "black",
  borderColor = "black",
  hoverTextColor = "white",
  hoverColor = "black",
  styles,
}: {
  onClick?: () => void;
  text?: string | React.ReactNode;
  color?: string;
  textColor?: string;
  borderColor?: string;
  hoverTextColor?: string;
  hoverColor?: string;
  styles?: React.CSSProperties;
}) {
  return (
    <div className="btn-animated">
      <button
        onClick={onClick}
        style={{
          ...styles,
          color: textColor,
          background: color,
          border: `2px solid ${borderColor}`,
          position: "relative",
          overflow: "hidden",
          // @ts-expect-error - CSS custom properties
          '--hover-color': hoverColor,
          '--hover-text-color': hoverTextColor,
          '--text-color': textColor,
        }}
      >
        <span>{text}</span>
        <div className="blob"></div>
      </button>
    </div>
  );
}
