"use client";

import { useState } from "react";

interface AssessmentSection {
  id: string;
  title: string;
  questions: string[];
}

const sections: AssessmentSection[] = [
  {
    id: "workload",
    title: "Workload & Energy",
    questions: [
      "How often do you feel exhausted after a typical workday?",
      "Do you have enough time for strategic thinking vs. firefighting?",
      "How frequently do you work beyond your scheduled hours?",
    ],
  },
  {
    id: "recovery",
    title: "Recovery & Boundaries",
    questions: [
      "Do you fully disconnect from work during personal time?",
      "How often do you take breaks during the workday?",
      "Do you have hobbies or activities unrelated to work?",
    ],
  },
  {
    id: "purpose",
    title: "Purpose & Engagement",
    questions: [
      "Do you feel your work aligns with your personal values?",
      "How often do you feel enthusiastic about your projects?",
      "Do you see a clear path for growth in your role?",
    ],
  },
  {
    id: "support",
    title: "Support & Connection",
    questions: [
      "Do you have colleagues or mentors you can rely on?",
      "How comfortable are you discussing challenges with your team?",
      "Do you feel recognized for your contributions?",
    ],
  },
];

const options = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Always", value: 4 },
];

type Answers = Record<string, number>;

function getRiskLevel(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct <= 30) return { label: "Low Risk", color: "text-green-600 dark:text-green-400" };
  if (pct <= 60) return { label: "Moderate Risk", color: "text-yellow-600 dark:text-yellow-400" };
  return { label: "High Risk", color: "text-red-600 dark:text-red-400" };
}

export default function BurnoutAssessment() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const section = sections[currentSection];
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const sectionScores = sections.map((s) => {
    const score = s.questions.reduce((sum, _, qi) => {
      const key = `${s.id}-${qi}`;
      return sum + (answers[key] ?? 0);
    }, 0);
    return { id: s.id, title: s.title, score, max: s.questions.length * 4 };
  });

  const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0);
  const maxScore = sectionScores.reduce((sum, s) => sum + s.max, 0);
  const risk = getRiskLevel(totalScore, maxScore);

  function handleAnswer(questionKey: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  }

  function handleNext() {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  }

  function handleBack() {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  }

  function handleRestart() {
    setAnswers({});
    setCurrentSection(0);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <h3
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: "var(--heading)" }}
          >
            Your Burnout Prevention Results
          </h3>

          <div className="text-center mb-8">
            <p className={`text-3xl font-bold ${risk.color}`}>{risk.label}</p>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Overall Score: {totalScore} / {maxScore}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {sectionScores.map((s) => {
              const sectionRisk = getRiskLevel(s.score, s.max);
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: "var(--surface-alt)" }}
                >
                  <span className="font-medium" style={{ color: "var(--heading)" }}>
                    {s.title}
                  </span>
                  <span className={sectionRisk.color}>{sectionRisk.label}</span>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Want your personalized 90-day burnout prevention strategy? Enter your
              email to receive the full report with actionable steps.
            </p>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
          <span>
            Section {currentSection + 1} of {sections.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--accent)",
            }}
          />
        </div>
      </div>

      {/* Section */}
      <div
        className="rounded-2xl p-8 shadow-lg"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--heading)" }}
        >
          {section.title}
        </h3>

        <div className="space-y-8">
          {section.questions.map((question, qi) => {
            const key = `${section.id}-${qi}`;
            return (
              <div key={key}>
                <p
                  className="font-medium mb-3"
                  style={{ color: "var(--heading)" }}
                >
                  {question}
                </p>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(key, opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        answers[key] === opt.value
                          ? "text-white border-transparent"
                          : "border-slate-300 dark:border-slate-600 hover:border-slate-400"
                      }`}
                      style={
                        answers[key] === opt.value
                          ? { backgroundColor: "var(--accent)" }
                          : { color: "var(--foreground)" }
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentSection === 0}
            className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-40"
            style={{ color: "var(--accent)" }}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {currentSection === sections.length - 1
              ? "See Results"
              : "Next Section"}
          </button>
        </div>
      </div>
    </div>
  );
}
