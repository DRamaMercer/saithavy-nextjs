"use client";

import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: "blue" | "green" | "terracotta" | "yellow" | "gray";
  showPercentage?: boolean;
  animated?: boolean;
}

const colorStyles = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  terracotta: "bg-blueprint-terracotta",
  yellow: "bg-yellow-500",
  gray: "bg-gray-500",
};

const containerStyles = {
  blue: "bg-blue-100",
  green: "bg-green-100",
  terracotta: "bg-orange-100",
  yellow: "bg-yellow-100",
  gray: "bg-gray-200",
};

export default function ProgressBar({
  value,
  label,
  color = "blue",
  showPercentage = true,
  animated = true,
}: ProgressBarProps): React.JSX.Element {
  const [displayValue, setDisplayValue] = useState(0);

  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  useEffect(() => {
    if (animated) {
      const duration = 600; // 600ms animation
      const steps = 30; // 30 updates for smooth animation
      const increment = clampedValue / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= clampedValue) {
          setDisplayValue(clampedValue);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.round(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Safe: non-animated mode, direct value assignment
      setDisplayValue(clampedValue);
    }
  }, [clampedValue, animated]);

  return (
    <div className="my-6">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full h-3 rounded-full overflow-hidden ${containerStyles[color]}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorStyles[color]}`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}
