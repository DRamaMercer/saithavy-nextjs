/**
 * Burnout Prevention Assessment Scoring Engine
 *
 * Provides scoring logic for four assessment sections:
 * 1. Early Warning Signs (checkbox, 30 items)
 * 2. Burnout Dimensions (sliders, 1-10)
 * 3. Work Environment Audit (checkbox, 20 items)
 * 4. Life Satisfaction (sliders, 1-10)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RiskZone = "green" | "yellow" | "red";

export interface WarningSignsResult {
  score: number;
  zone: RiskZone;
  count: number;
}

export interface DimensionsResult {
  scores: Record<string, number>;
  priorityAreas: string[];
}

export interface EnvironmentResult {
  categoryScores: Record<string, number>;
  overall: number;
}

export interface SatisfactionResult {
  average: number;
  weakestAreas: string[];
}

export interface AllScores {
  warningSigns: WarningSignsResult;
  dimensions: DimensionsResult;
  environment: EnvironmentResult;
  satisfaction: SatisfactionResult;
}

export interface OverallResult {
  readiness: number;
  zone: string;
  weakestAreas: string[];
  recommendations: string[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Items per category for the Work Environment Audit */
const ENVIRONMENT_CATEGORIES = [
  "Physical Workspace",
  "Digital Environment",
  "Schedule & Boundaries",
  "Workload Analysis",
] as const;

/** Life satisfaction area labels */
const SATISFACTION_AREAS = [
  "Work Fulfillment",
  "Team Relationships",
  "Leadership Impact",
  "Physical Health",
  "Mental Health",
  "Personal Relationships",
  "Personal Growth",
  "Play/Fun",
] as const;

/** Burnout dimension labels */
const DIMENSION_LABELS = ["Exhaustion", "Cynicism", "Inefficacy"] as const;

// ---------------------------------------------------------------------------
// Section 1: Early Warning Signs
// ---------------------------------------------------------------------------

/**
 * Calculate the Early Warning Signs score.
 *
 * @param checked - Array of checked warning-sign item identifiers.
 * @returns score (normalised 0-100), zone label, and raw count.
 */
export function calculateWarningSignsScore(
  checked: string[]
): WarningSignsResult {
  const count = checked.length;

  let zone: RiskZone;
  if (count <= 5) {
    zone = "green";
  } else if (count <= 15) {
    zone = "yellow";
  } else {
    zone = "red";
  }

  // Normalise to 0-100 (30 items max)
  const score = Math.round((count / 30) * 100);

  return { score, zone, count };
}

// ---------------------------------------------------------------------------
// Section 2: Burnout Dimensions
// ---------------------------------------------------------------------------

/**
 * Calculate the Burnout Dimensions score.
 *
 * @param ratings - Record mapping dimension name to rating (1-10).
 * @returns Per-dimension scores and the list of priority areas (rating >= 7).
 */
export function calculateDimensionsScore(
  ratings: Record<string, number>
): DimensionsResult {
  const scores: Record<string, number> = {};
  const priorityAreas: string[] = [];

  for (const label of DIMENSION_LABELS) {
    const raw = ratings[label];
    if (raw === undefined || raw < 1 || raw > 10) {
      throw new Error(
        `Invalid rating for "${label}": expected 1-10, got ${String(raw)}`
      );
    }

    scores[label] = raw;

    if (raw >= 7) {
      priorityAreas.push(label);
    }
  }

  return { scores, priorityAreas };
}

// ---------------------------------------------------------------------------
// Section 3: Work Environment Audit
// ---------------------------------------------------------------------------

/**
 * Calculate the Work Environment Audit score.
 *
 * @param checked - Record mapping category name to an array of checked item
 *                  identifiers within that category.
 * @returns Per-category scores (0-5) and an overall average (0-5).
 */
export function calculateEnvironmentScore(
  checked: Record<string, string[]>
): EnvironmentResult {
  const categoryScores: Record<string, number> = {};

  for (const category of ENVIRONMENT_CATEGORIES) {
    const items = checked[category] ?? [];
    categoryScores[category] = items.length;
  }

  const values = Object.values(categoryScores);
  const overall =
    values.length > 0
      ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) /
        100
      : 0;

  return { categoryScores, overall };
}

// ---------------------------------------------------------------------------
// Section 4: Life Satisfaction
// ---------------------------------------------------------------------------

/**
 * Calculate the Life Satisfaction score.
 *
 * @param ratings - Record mapping satisfaction area to rating (1-10).
 * @returns Average rating and the weakest areas (rating <= 4).
 */
export function calculateSatisfactionScore(
  ratings: Record<string, number>
): SatisfactionResult {
  const validated: number[] = [];

  for (const area of SATISFACTION_AREAS) {
    const raw = ratings[area];
    if (raw === undefined || raw < 1 || raw > 10) {
      throw new Error(
        `Invalid rating for "${area}": expected 1-10, got ${String(raw)}`
      );
    }
    validated.push(raw);
  }

  const average =
    Math.round(
      (validated.reduce((a, b) => a + b, 0) / validated.length) * 100
    ) / 100;

  const weakestAreas = SATISFACTION_AREAS.filter(
    (area) => ratings[area] <= 4
  );

  return { average, weakestAreas };
}

// ---------------------------------------------------------------------------
// Overall Score
// ---------------------------------------------------------------------------

/**
 * Normalise a value from [min, max] to [0, 100].
 */
function normalise(value: number, min: number, max: number): number {
  if (max === min) return 100;
  return ((value - min) / (max - min)) * 100;
}

/**
 * Build a list of weakness descriptors from all section results.
 */
function collectWeaknesses(all: AllScores): string[] {
  const weaknesses: { label: string; severity: number }[] = [];

  // Warning signs — higher count = weaker
  if (all.warningSigns.zone !== "green") {
    weaknesses.push({
      label: "Early Warning Signs",
      severity: all.warningSigns.count,
    });
  }

  // Dimensions — priority areas
  for (const area of all.dimensions.priorityAreas) {
    weaknesses.push({
      label: `Burnout Dimension: ${area}`,
      severity: all.dimensions.scores[area],
    });
  }

  // Environment — categories with score <= 2
  for (const [cat, score] of Object.entries(all.environment.categoryScores)) {
    if (score <= 2) {
      weaknesses.push({ label: `Work Environment: ${cat}`, severity: 5 - score });
    }
  }

  // Satisfaction — weakest areas
  for (const area of all.satisfaction.weakestAreas) {
    weaknesses.push({
      label: `Life Satisfaction: ${area}`,
      severity: 10 - all.satisfaction.average,
    });
  }

  // Sort descending by severity, return top 3 labels
  return weaknesses
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3)
    .map((w) => w.label);
}

/**
 * Generate personalised recommendations based on weak areas.
 */
function generateRecommendations(weakestAreas: string[]): string[] {
  const recommendationMap: Record<string, string> = {
    "Early Warning Signs":
      "Schedule a comprehensive health check-up and establish a daily wellness routine with regular breaks.",
    "Burnout Dimension: Exhaustion":
      "Prioritize sleep hygiene, reduce overtime, and consider delegating or deferring non-critical tasks.",
    "Burnout Dimension: Cynicism":
      "Reconnect with your purpose by revisiting what originally motivated you in your role. Seek mentorship or peer support.",
    "Burnout Dimension: Inefficacy":
      "Break large goals into small wins. Track accomplishments daily and request regular, specific feedback from your manager.",
    "Work Environment: Physical Workspace":
      "Audit your ergonomics: adjust chair height, monitor position, and lighting. Add plants or personal touches to make the space inviting.",
    "Work Environment: Digital Environment":
      "Reduce notification overload. Set focused work blocks and organize your digital workspace (desktop, tabs, bookmarks).",
    "Work Environment: Schedule & Boundaries":
      "Define clear start and end times for your workday. Communicate boundaries to your team and protect your personal time.",
    "Work Environment: Workload Analysis":
      "Conduct a weekly workload review. Identify tasks to delegate, automate, or eliminate. Discuss capacity openly with your manager.",
  };

  const areaMap: Record<string, string> = {
    "Life Satisfaction: Work Fulfillment":
      "Explore projects that align with your strengths. Discuss career development goals with your manager.",
    "Life Satisfaction: Team Relationships":
      "Invest in team-building activities. Schedule regular one-on-one check-ins with key colleagues.",
    "Life Satisfaction: Leadership Impact":
      "Seek leadership coaching or training. Practice giving constructive feedback and recognition to your team.",
    "Life Satisfaction: Physical Health":
      "Establish a consistent exercise routine and meal plan. Consider working with a nutritionist or personal trainer.",
    "Life Satisfaction: Mental Health":
      "Consider speaking with a therapist or counselor. Practice mindfulness or meditation for at least 10 minutes daily.",
    "Life Satisfaction: Personal Relationships":
      "Schedule quality time with loved ones. Practice active listening and be fully present during personal interactions.",
    "Life Satisfaction: Personal Growth":
      "Set a learning goal for the quarter. Dedicate time each week to reading, courses, or skill development.",
    "Life Satisfaction: Play/Fun":
      "Schedule at least one enjoyable activity per week. Reconnect with hobbies or explore new creative outlets.",
  };

  const allRecommendations = { ...recommendationMap, ...areaMap };

  const recs: string[] = [];
  for (const area of weakestAreas) {
    recs.push(
      allRecommendations[area] ??
        `Focus on improving: ${area}. Set small, measurable goals and track progress weekly.`
    );
  }

  return recs;
}

/**
 * Calculate the overall Burnout Prevention Readiness score.
 *
 * @param allScores - Aggregated results from all four assessment sections.
 * @returns Overall readiness percentage (0-100), zone label, weakest areas,
 *          and personalised recommendations.
 */
export function calculateOverallScore(allScores: AllScores): OverallResult {
  // 1. Warning signs contribution (0-100, inverted — fewer checked = better)
  const warningContribution = 100 - allScores.warningSigns.score;

  // 2. Dimensions contribution (0-100, inverted — lower ratings = better)
  const dimValues = Object.values(allScores.dimensions.scores);
  const dimAvg =
    dimValues.reduce((a, b) => a + b, 0) / dimValues.length;
  const dimContribution = 100 - normalise(dimAvg, 1, 10);

  // 3. Environment contribution (0-100, scale 0-5 → 0-100)
  const envContribution = normalise(allScores.environment.overall, 0, 5);

  // 4. Satisfaction contribution (0-100, scale 1-10 → 0-100)
  const satContribution = normalise(allScores.satisfaction.average, 1, 10);

  // Weighted average: each section equally weighted at 25%
  const readiness = Math.round(
    warningContribution * 0.25 +
      dimContribution * 0.25 +
      envContribution * 0.25 +
      satContribution * 0.25
  );

  // Zone classification
  let zone: string;
  if (readiness >= 75) {
    zone = "Thriving";
  } else if (readiness >= 50) {
    zone = "Stable";
  } else if (readiness >= 25) {
    zone = "At Risk";
  } else {
    zone = "Critical";
  }

  const weakestAreas = collectWeaknesses(allScores);
  const recommendations = generateRecommendations(weakestAreas);

  return { readiness, zone, weakestAreas, recommendations };
}
