"use client";

import React, { useCallback, useMemo } from "react";

interface CheckboxItem {
  id: string;
  label: string;
  category?: string;
}

interface CheckboxGroupProps {
  items: CheckboxItem[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: number;
}

export default function CheckboxGroup({
  items,
  selected,
  onChange,
  columns = 1,
}: CheckboxGroupProps) {
  const grouped = useMemo(() => {
    const groups: Record<string, CheckboxItem[]> = {};
    for (const item of items) {
      const key = item.category ?? "";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    }
    return groups;
  }, [items]);

  const hasCategories = useMemo(
    () => items.some((item) => item.category != null),
    [items],
  );

  const handleToggle = useCallback(
    (id: string) => {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id));
      } else {
        onChange([...selected, id]);
      }
    },
    [selected, onChange],
  );

  const checkboxStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    padding: "0.75rem",
    borderRadius: "8px",
    transition: "background 0.15s ease",
    fontSize: "0.95rem",
    color: "var(--foreground)",
    lineHeight: 1.5,
  };

  const checkmarkStyle = (isChecked: boolean): React.CSSProperties => ({
    width: "20px",
    height: "20px",
    minWidth: "20px",
    borderRadius: "4px",
    border: `2px solid ${isChecked ? "var(--accent)" : "var(--border)"}`,
    background: isChecked ? "var(--accent)" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s ease",
    flexShrink: 0,
  });

  const renderCheckbox = (item: CheckboxItem) => {
    const isChecked = selected.includes(item.id);
    return (
      <label
        key={item.id}
        style={checkboxStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-alt)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => handleToggle(item.id)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        />
        <span style={checkmarkStyle(isChecked)}>
          {isChecked && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span>{item.label}</span>
      </label>
    );
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: "0.25rem",
  };

  if (!hasCategories) {
    return <div style={gridStyle}>{items.map(renderCheckbox)}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {Object.entries(grouped).map(([category, categoryItems]) => (
        <div key={category}>
          {category && (
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--heading)",
                margin: "0 0 0.5rem 0.75rem",
              }}
            >
              {category}
            </h3>
          )}
          <div style={gridStyle}>{categoryItems.map(renderCheckbox)}</div>
        </div>
      ))}
    </div>
  );
}
