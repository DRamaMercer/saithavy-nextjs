"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AssessmentStep from "./AssessmentStep";
import CheckboxGroup from "./CheckboxGroup";
import SliderGroup from "./SliderGroup";
import ResultsPanel from "./ResultsPanel";

interface AssessmentAnswers {
  warningSigns: string[];
  dimensions: Record<string, number>;
  environment: Record<string, string[]>;
  satisfaction: Record<string, number>;
}

const TOTAL_STEPS = 5;

const WARNING_SIGN_ITEMS = [
  { id: "fatigue", label: "Chronic fatigue or low energy", category: "Physical" },
  { id: "insomnia", label: "Trouble sleeping or insomnia", category: "Physical" },
  { id: "headaches", label: "Frequent headaches or muscle tension", category: "Physical" },
  { id: "illness", label: "Getting sick more often than usual", category: "Physical" },
  { id: "cynicism", label: "Feeling cynical or negative about work", category: "Emotional" },
  { id: "detachment", label: "Emotional detachment from colleagues", category: "Emotional" },
  { id: "irritability", label: "Increased irritability or short temper", category: "Emotional" },
  { id: "dread", label: "Dreading going to work", category: "Emotional" },
  { id: "procrastination", label: "Procrastinating more than usual", category: "Behavioral" },
  { id: "withdrawal", label: "Withdrawing from social interactions", category: "Behavioral" },
  { id: "substance", label: "Using food, drugs, or alcohol to cope", category: "Behavioral" },
  { id: "lateness", label: "Taking more sick days or arriving late", category: "Behavioral" },
];

const DIMENSION_ITEMS = [
  { id: "workload", label: "Workload / Time Pressure" },
  { id: "control", label: "Control / Autonomy" },
  { id: "reward", label: "Reward / Recognition" },
  { id: "community", label: "Community / Relationships" },
  { id: "fairness", label: "Fairness / Equity" },
  { id: "values", label: "Values Alignment" },
];

const ENVIRONMENT_ITEMS = [
  { id: "unclear-expectations", label: "Unclear job expectations", category: "Work Structure" },
  { id: "unreasonable-workload", label: "Unreasonably heavy workload", category: "Work Structure" },
  { id: "no-breaks", label: "No time for breaks during the day", category: "Work Structure" },
  { id: "micromanagement", label: "Excessive micromanagement", category: "Management" },
  { id: "no-support", label: "Lack of support from leadership", category: "Management" },
  { id: "no-feedback", label: "Little to no constructive feedback", category: "Management" },
  { id: "toxic-dynamics", label: "Toxic team dynamics or conflict", category: "Social" },
  { id: "isolation", label: "Feeling isolated or excluded", category: "Social" },
  { id: "no-recognition", label: "Contributions go unrecognized", category: "Social" },
];

const SATISFACTION_ITEMS = [
  { id: "meaning", label: "Meaningfulness of my work" },
  { id: "growth", label: "Opportunities for growth" },
  { id: "balance", label: "Work-life balance" },
  { id: "compensation", label: "Compensation and benefits" },
  { id: "relationships", label: "Relationships with colleagues" },
  { id: "purpose", label: "Sense of purpose in my role" },
];

const STEP_TITLES = [
  "Warning Signs",
  "Burnout Dimensions",
  "Work Environment",
  "Job Satisfaction",
  "Your Results",
];

const STEP_DESCRIPTIONS = [
  "Select any warning signs you have experienced in the past 30 days.",
  "Rate how strongly you experience each dimension of burnout.",
  "Select the workplace factors contributing to your stress.",
  "Rate your satisfaction with different aspects of your job.",
  "Review your personalized burnout risk assessment and recommendations.",
];

function calculateScore(answers: AssessmentAnswers): number {
  let score = 0;

  // Warning signs: 4 points each (max 48)
  score += Math.min(answers.warningSigns.length * 4, 48);

  // Dimensions: each 0-10, normalized to 0-40
  const dimValues = Object.values(answers.dimensions);
  const dimAvg =
    dimValues.length > 0
      ? dimValues.reduce((a, b) => a + b, 0) / dimValues.length
      : 0;
  score += (dimAvg / 10) * 40;

  // Environment: 2 points per selection (max ~20)
  const envCount = Object.values(answers.environment).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );
  score += Math.min(envCount * 2, 20);

  // Satisfaction: inverted, each 0-10, normalized to 0-20
  const satValues = Object.values(answers.satisfaction);
  const satAvg =
    satValues.length > 0
      ? satValues.reduce((a, b) => a + b, 0) / satValues.length
      : 5;
  score += ((10 - satAvg) / 10) * 20;

  return Math.round(Math.min(score, 100));
}

function getZone(score: number): "green" | "yellow" | "red" {
  if (score >= 66) return "red";
  if (score >= 33) return "yellow";
  return "green";
}

function getSectionScores(answers: AssessmentAnswers): Record<string, number> {
  const warningScore = Math.min(
    Math.round((answers.warningSigns.length / WARNING_SIGN_ITEMS.length) * 100),
    100,
  );

  const dimValues = Object.values(answers.dimensions);
  const dimScore =
    dimValues.length > 0
      ? Math.round(
          (dimValues.reduce((a, b) => a + b, 0) / dimValues.length / 10) * 100,
        )
      : 0;

  const totalEnv = ENVIRONMENT_ITEMS.length;
  const envCount = Object.values(answers.environment).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );
  const envScore = Math.min(Math.round((envCount / totalEnv) * 100), 100);

  const satValues = Object.values(answers.satisfaction);
  const satScore =
    satValues.length > 0
      ? Math.round(
          100 -
            (satValues.reduce((a, b) => a + b, 0) / satValues.length / 10) * 100,
        )
      : 0;

  return {
    "Warning Signs": warningScore,
    "Burnout Dimensions": dimScore,
    "Work Environment": envScore,
    "Job Satisfaction": satScore,
  };
}

function getWeakestAreas(answers: AssessmentAnswers): string[] {
  const scores = getSectionScores(answers);
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([label]) => label);
}

function getRecommendations(
  zone: "green" | "yellow" | "red",
  answers: AssessmentAnswers,
): string[] {
  const recs: string[] = [];

  if (zone === "red") {
    recs.push("Consider speaking with a mental health professional as a priority.");
    recs.push("Schedule an urgent conversation with your manager about workload.");
  }

  if (zone === "yellow" || zone === "red") {
    recs.push("Establish firm boundaries around work hours and email response times.");
    recs.push("Build in daily recovery practices: 10-minute walks, deep breathing, or journaling.");
  }

  if (answers.warningSigns.includes("insomnia")) {
    recs.push("Create a consistent sleep routine and limit screen time before bed.");
  }

  if (answers.warningSigns.includes("fatigue")) {
    recs.push("Evaluate your nutrition, hydration, and physical activity levels.");
  }

  if (answers.dimensions.workload && answers.dimensions.workload >= 7) {
    recs.push("Identify tasks to delegate or defer, and discuss prioritization with your team lead.");
  }

  if (answers.dimensions.community && answers.dimensions.community >= 7) {
    recs.push("Invest in one meaningful workplace relationship through regular check-ins.");
  }

  if (answers.dimensions.control && answers.dimensions.control >= 7) {
    recs.push("Negotiate for more autonomy in how you approach your work, even in small ways.");
  }

  recs.push("Practice the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.");

  if (recs.length < 5) {
    recs.push("Schedule regular one-on-ones with your manager to maintain open communication.");
  }

  return recs;
}

export default function BurnoutAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    warningSigns: [],
    dimensions: {},
    environment: {},
    satisfaction: {},
  });

  const partialScore = useMemo(() => calculateScore(answers), [answers]);
  const zone = useMemo(() => getZone(partialScore), [partialScore]);
  const zoneColor =
    zone === "green" ? "#22c55e" : zone === "yellow" ? "#eab308" : "#ef4444";

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0:
        return answers.warningSigns.length > 0;
      case 1:
        return Object.keys(answers.dimensions).length === DIMENSION_ITEMS.length;
      case 2:
        return true; // environment is optional
      case 3:
        return Object.keys(answers.satisfaction).length === SATISFACTION_ITEMS.length;
      case 4:
        return showResults;
      default:
        return false;
    }
  }, [currentStep, answers, showResults]);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setShowResults(false);
    }
  }, [currentStep]);

  const handleWarningSignsChange = useCallback((selected: string[]) => {
    setAnswers((prev) => ({ ...prev, warningSigns: selected }));
  }, []);

  const handleDimensionsChange = useCallback(
    (values: Record<string, number>) => {
      setAnswers((prev) => ({ ...prev, dimensions: values }));
    },
    [],
  );

  const handleEnvironmentChange = useCallback((selected: string[]) => {
    const grouped: Record<string, string[]> = {};
    for (const id of selected) {
      const item = ENVIRONMENT_ITEMS.find((i) => i.id === id);
      if (item?.category) {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(id);
      }
    }
    setAnswers((prev) => ({ ...prev, environment: grouped }));
  }, []);

  const flattenedEnvSelected = useMemo(
    () => Object.values(answers.environment).flat(),
    [answers.environment],
  );

  const handleSatisfactionChange = useCallback(
    (values: Record<string, number>) => {
      setAnswers((prev) => ({ ...prev, satisfaction: values }));
    },
    [],
  );

  const handleDownloadPDF = useCallback(() => {
    // PDF download logic to be implemented with a PDF generation library
  }, []);

  const sectionScores = useMemo(
    () => getSectionScores(answers),
    [answers],
  );
  const weakestAreas = useMemo(
    () => getWeakestAreas(answers),
    [answers],
  );
  const recommendations = useMemo(
    () => getRecommendations(zone, answers),
    [zone, answers],
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 200px",
        gap: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* Main Content */}
      <div>
        {/* Progress Bar */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--heading)",
              }}
            >
              Step {currentStep + 1} of {TOTAL_STEPS}
            </span>
            <span
              style={{
                fontSize: "0.8125rem",
                color: "var(--foreground)",
              }}
            >
              {Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)}% complete
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "var(--border)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%`,
                background: "var(--accent)",
                borderRadius: "3px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <AssessmentStep
            step={0}
            title={STEP_TITLES[0]}
            description={STEP_DESCRIPTIONS[0]}
          >
            <CheckboxGroup
              items={WARNING_SIGN_ITEMS}
              selected={answers.warningSigns}
              onChange={handleWarningSignsChange}
              columns={2}
            />
          </AssessmentStep>
        )}

        {currentStep === 1 && (
          <AssessmentStep
            step={1}
            title={STEP_TITLES[1]}
            description={STEP_DESCRIPTIONS[1]}
          >
            <SliderGroup
              items={DIMENSION_ITEMS}
              values={answers.dimensions}
              onChange={handleDimensionsChange}
              showLabels
            />
          </AssessmentStep>
        )}

        {currentStep === 2 && (
          <AssessmentStep
            step={2}
            title={STEP_TITLES[2]}
            description={STEP_DESCRIPTIONS[2]}
          >
            <CheckboxGroup
              items={ENVIRONMENT_ITEMS}
              selected={flattenedEnvSelected}
              onChange={handleEnvironmentChange}
              columns={1}
            />
          </AssessmentStep>
        )}

        {currentStep === 3 && (
          <AssessmentStep
            step={3}
            title={STEP_TITLES[3]}
            description={STEP_DESCRIPTIONS[3]}
          >
            <SliderGroup
              items={SATISFACTION_ITEMS}
              values={answers.satisfaction}
              onChange={handleSatisfactionChange}
              showLabels
            />
          </AssessmentStep>
        )}

        {currentStep === 4 && (
          <AssessmentStep
            step={4}
            title={STEP_TITLES[4]}
            description={STEP_DESCRIPTIONS[4]}
          >
            <ResultsPanel
              overallScore={partialScore}
              zone={zone}
              sectionScores={sectionScores}
              weakestAreas={weakestAreas}
              recommendations={recommendations}
              onDownloadPDF={handleDownloadPDF}
            />
          </AssessmentStep>
        )}

        {/* Navigation Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.5rem",
          }}
        >
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: currentStep === 0 ? "var(--border)" : "var(--foreground)",
              fontSize: "0.9375rem",
              fontWeight: 500,
              cursor: currentStep === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              background: "var(--accent)",
              color: "#ffffff",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: canProceed ? "pointer" : "not-allowed",
              opacity: canProceed ? 1 : 0.5,
              transition: "all 0.2s ease",
            }}
          >
            {currentStep === TOTAL_STEPS - 1 ? "View Results" : "Next"}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Sidebar Score Indicator */}
      <div
        style={{
          position: "sticky",
          top: "2rem",
          alignSelf: "start",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.25rem",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--foreground)",
              marginBottom: "0.75rem",
            }}
          >
            Current Score
          </span>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              border: `4px solid ${zoneColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.75rem",
              transition: "border-color 0.4s ease",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: zoneColor,
                transition: "color 0.4s ease",
              }}
            >
              {partialScore}
            </span>
          </div>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#ffffff",
              background: zoneColor,
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              transition: "background 0.4s ease",
            }}
          >
            {zone === "green"
              ? "Low Risk"
              : zone === "yellow"
                ? "Moderate"
                : "High Risk"}
          </span>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            {[0, 1, 2, 3, 4].map((step) => (
              <div
                key={step}
                style={{
                  height: "3px",
                  borderRadius: "2px",
                  background:
                    step <= currentStep ? "var(--accent)" : "var(--border)",
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Responsive: stack on small screens */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
