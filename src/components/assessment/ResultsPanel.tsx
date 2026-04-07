"use client";

import React, { useState, useCallback } from "react";
import { Download, ArrowRight, CheckCircle2 } from "lucide-react";

interface ResultsPanelProps {
  overallScore: number;
  zone: "green" | "yellow" | "red";
  sectionScores: Record<string, number>;
  weakestAreas: string[];
  recommendations: string[];
  onDownloadPDF: () => void;
}

const ZONE_COLORS = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
} as const;

const ZONE_LABELS = {
  green: "Low Risk",
  yellow: "Moderate Risk",
  red: "High Risk",
} as const;

export default function ResultsPanel({
  overallScore,
  zone,
  sectionScores,
  weakestAreas,
  recommendations,
  onDownloadPDF,
}: ResultsPanelProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const zoneColor = ZONE_COLORS[zone];
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await fetch("/api/lead-capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            lead_magnet: "burnout-assessment-results",
            metadata: {
              score: overallScore,
              zone,
              timestamp: new Date().toISOString(),
            },
          }),
        });
        setIsSuccess(true);
        onDownloadPDF();
      } catch {
        setIsSuccess(true);
        onDownloadPDF();
      }
      setIsSubmitting(false);
    },
    [email, overallScore, zone, onDownloadPDF],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Circular Score Indicator */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--heading)",
            margin: "0 0 1.5rem 0",
          }}
        >
          Your Burnout Risk Score
        </h3>
        <div
          style={{
            position: "relative",
            width: "140px",
            height: "140px",
            margin: "0 auto 1rem",
          }}
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke="var(--border)"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke={zoneColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: zoneColor,
                lineHeight: 1,
              }}
            >
              {overallScore}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--foreground)",
                marginTop: "0.25rem",
              }}
            >
              {ZONE_LABELS[zone]}
            </span>
          </div>
        </div>
      </div>

      {/* Section Breakdown */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "2rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--heading)",
            margin: "0 0 1.25rem 0",
          }}
        >
          Section Breakdown
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {Object.entries(sectionScores).map(([section, score]) => {
            const barColor =
              score >= 70 ? ZONE_COLORS.red : score >= 40 ? ZONE_COLORS.yellow : ZONE_COLORS.green;
            return (
              <div key={section}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.375rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--heading)",
                    }}
                  >
                    {section}
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: barColor,
                    }}
                  >
                    {score}%
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "var(--border)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${score}%`,
                      background: barColor,
                      borderRadius: "4px",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakest Areas */}
      {weakestAreas.length > 0 && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "2rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--heading)",
              margin: "0 0 1rem 0",
            }}
          >
            Top Areas of Concern
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {weakestAreas.slice(0, 3).map((area, index) => (
              <div
                key={area}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  background: "var(--surface-alt)",
                  borderRadius: "8px",
                  borderLeft: `3px solid ${ZONE_COLORS.red}`,
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "white",
                    background: ZONE_COLORS.red,
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "var(--heading)",
                  }}
                >
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "2rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--heading)",
            margin: "0 0 1rem 0",
          }}
        >
          Personalized Recommendations
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {recommendations.map((rec) => (
            <div
              key={rec}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <CheckCircle2
                size={18}
                style={{
                  color: "var(--accent)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              />
              <span
                style={{
                  fontSize: "0.95rem",
                  color: "var(--foreground)",
                  lineHeight: 1.6,
                }}
              >
                {rec}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Download / Email CTA */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--heading) 0%, var(--accent) 100%)",
          borderRadius: "12px",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 0.5rem 0",
          }}
        >
          Download Your Personalized PDF
        </h3>
        <p
          style={{
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.85)",
            margin: "0 0 1.5rem 0",
          }}
        >
          Get a detailed report with your scores, analysis, and action plan.
        </p>

        {isSuccess ? (
          <div style={{ padding: "1rem 0" }}>
            <CheckCircle2
              size={40}
              style={{ color: "#ffffff", margin: "0 auto 0.75rem" }}
            />
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Your report is downloading!
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleEmailSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                borderRadius: "8px",
                border: "none",
                fontSize: "1rem",
                background: "var(--surface)",
                color: "var(--heading)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.875rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                fontSize: "1rem",
                fontWeight: 600,
                background: "var(--surface)",
                color: "var(--accent)",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "opacity 0.2s ease",
              }}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Download size={18} />
                  Download Free Report
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
