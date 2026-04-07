"use client";

import React, { useCallback } from "react";

interface SliderItem {
  id: string;
  label: string;
  min?: number;
  max?: number;
}

interface SliderGroupProps {
  items: SliderItem[];
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
  showLabels?: boolean;
}

export default function SliderGroup({
  items,
  values,
  onChange,
  showLabels = true,
}: SliderGroupProps) {
  const handleChange = useCallback(
    (id: string, value: number) => {
      onChange({ ...values, [id]: value });
    },
    [values, onChange],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {items.map((item) => {
        const min = item.min ?? 0;
        const max = item.max ?? 10;
        const currentValue = values[item.id] ?? min;
        const percentage = ((currentValue - min) / (max - min)) * 100;

        return (
          <div key={item.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <label
                htmlFor={`slider-${item.id}`}
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "var(--heading)",
                }}
              >
                {item.label}
              </label>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  minWidth: "2.5rem",
                  textAlign: "right",
                }}
              >
                {currentValue}
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  transform: "translateY(-50%)",
                  height: "6px",
                  width: `${percentage}%`,
                  background: "var(--accent)",
                  borderRadius: "3px",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  transform: "translateY(-50%)",
                  height: "6px",
                  width: "100%",
                  background: "var(--border)",
                  borderRadius: "3px",
                  pointerEvents: "none",
                }}
              />
              <input
                id={`slider-${item.id}`}
                type="range"
                min={min}
                max={max}
                value={currentValue}
                onChange={(e) =>
                  handleChange(item.id, Number(e.target.value))
                }
                style={{
                  position: "relative",
                  width: "100%",
                  height: "24px",
                  appearance: "none",
                  WebkitAppearance: "none",
                  background: "transparent",
                  cursor: "pointer",
                  zIndex: 2,
                  margin: 0,
                }}
              />
            </div>
            {showLabels && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--foreground)",
                    opacity: 0.7,
                  }}
                >
                  {min}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--foreground)",
                    opacity: 0.7,
                  }}
                >
                  {max}
                </span>
              </div>
            )}
          </div>
        );
      })}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent);
          border: 3px solid var(--surface);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent);
          border: 3px solid var(--surface);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
