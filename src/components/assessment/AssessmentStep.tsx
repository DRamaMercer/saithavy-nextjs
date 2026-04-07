"use client";

import React, { ReactNode } from "react";

interface AssessmentStepProps {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
}

export default function AssessmentStep({
  step,
  title,
  description,
  children,
}: AssessmentStepProps) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "2rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--accent)",
            marginBottom: "0.5rem",
          }}
        >
          Step {step + 1}
        </span>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--heading)",
            margin: "0 0 0.5rem 0",
            fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--foreground)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
}
