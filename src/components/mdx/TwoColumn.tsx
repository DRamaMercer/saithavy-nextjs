import React from "react";

interface TwoColumnProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: "1/2" | "1/3" | "2/3" | "1/4" | "3/4";
  gap?: "small" | "medium" | "large";
  align?: "top" | "center" | "bottom";
  stackOnMobile?: boolean;
}

const gapStyles = {
  small: "gap-4",
  medium: "gap-8",
  large: "gap-12",
};

const widthStyles = {
  "1/2": "md:w-1/2",
  "1/3": "md:w-1/3",
  "2/3": "md:w-2/3",
  "1/4": "md:w-1/4",
  "3/4": "md:w-3/4",
};

const alignmentStyles = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
};

export default function TwoColumn({
  left,
  right,
  leftWidth = "1/2",
  gap = "medium",
  align = "top",
  stackOnMobile = true,
}: TwoColumnProps): React.JSX.Element {
  const rightWidth = {
    "1/2": "md:w-1/2",
    "1/3": "md:w-2/3",
    "2/3": "md:w-1/3",
    "1/4": "md:w-3/4",
    "3/4": "md:w-1/4",
  }[leftWidth];

  return (
    <div
      className={`my-6 flex flex-col ${gapStyles[gap]} ${
        stackOnMobile ? "md:flex-row" : "flex-row"
      } ${alignmentStyles[align]}`}
    >
      <div className={`flex-1 ${stackOnMobile ? widthStyles[leftWidth] : ""}`}>
        {left}
      </div>
      <div className={`flex-1 ${stackOnMobile ? rightWidth : ""}`}>
        {right}
      </div>
    </div>
  );
}
