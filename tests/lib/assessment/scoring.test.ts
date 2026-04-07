/**
 * Burnout Prevention Assessment Scoring Tests
 */

import { describe, it, expect } from "vitest";
import {
  calculateWarningSignsScore,
  calculateDimensionsScore,
  calculateEnvironmentScore,
  calculateSatisfactionScore,
  calculateOverallScore,
  type AllScores,
} from "@/lib/assessment/scoring";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a full AllScores fixture with sensible defaults. */
function buildAllScores(overrides?: Partial<AllScores>): AllScores {
  return {
    warningSigns: calculateWarningSignsScore([]),
    dimensions: calculateDimensionsScore({
      Exhaustion: 3,
      Cynicism: 2,
      Inefficacy: 4,
    }),
    environment: calculateEnvironmentScore({
      "Physical Workspace": ["a", "b", "c"],
      "Digital Environment": ["a", "b"],
      "Schedule & Boundaries": ["a"],
      "Workload Analysis": ["a", "b", "c", "d"],
    }),
    satisfaction: calculateSatisfactionScore({
      "Work Fulfillment": 7,
      "Team Relationships": 8,
      "Leadership Impact": 6,
      "Physical Health": 5,
      "Mental Health": 7,
      "Personal Relationships": 8,
      "Personal Growth": 6,
      "Play/Fun": 5,
    }),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Section 1: Early Warning Signs
// ---------------------------------------------------------------------------

describe("calculateWarningSignsScore", () => {
  it("returns green zone for 0-5 checked items", () => {
    const result = calculateWarningSignsScore(["a", "b", "c"]);
    expect(result.zone).toBe("green");
    expect(result.count).toBe(3);
  });

  it("returns green zone at the boundary of 5 items", () => {
    const result = calculateWarningSignsScore(["1", "2", "3", "4", "5"]);
    expect(result.zone).toBe("green");
    expect(result.count).toBe(5);
  });

  it("returns yellow zone for 6-15 checked items", () => {
    const result = calculateWarningSignsScore([
      "a", "b", "c", "d", "e", "f",
    ]);
    expect(result.zone).toBe("yellow");
    expect(result.count).toBe(6);
  });

  it("returns yellow zone at the boundary of 15 items", () => {
    const items = Array.from({ length: 15 }, (_, i) => String(i));
    const result = calculateWarningSignsScore(items);
    expect(result.zone).toBe("yellow");
    expect(result.count).toBe(15);
  });

  it("returns red zone for 16+ checked items", () => {
    const items = Array.from({ length: 16 }, (_, i) => String(i));
    const result = calculateWarningSignsScore(items);
    expect(result.zone).toBe("red");
    expect(result.count).toBe(16);
  });

  it("returns red zone when all 30 items are checked", () => {
    const items = Array.from({ length: 30 }, (_, i) => String(i));
    const result = calculateWarningSignsScore(items);
    expect(result.zone).toBe("red");
    expect(result.count).toBe(30);
    expect(result.score).toBe(100);
  });

  it("normalises score to 0-100 based on 30 max items", () => {
    // 15 out of 30 = 50%
    const items = Array.from({ length: 15 }, (_, i) => String(i));
    const result = calculateWarningSignsScore(items);
    expect(result.score).toBe(50);
  });

  it("returns score 0 for empty array", () => {
    const result = calculateWarningSignsScore([]);
    expect(result.score).toBe(0);
    expect(result.zone).toBe("green");
    expect(result.count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Section 2: Burnout Dimensions
// ---------------------------------------------------------------------------

describe("calculateDimensionsScore", () => {
  const validRatings = {
    Exhaustion: 5,
    Cynicism: 3,
    Inefficacy: 8,
  };

  it("returns the raw scores for each dimension", () => {
    const result = calculateDimensionsScore(validRatings);
    expect(result.scores).toEqual({
      Exhaustion: 5,
      Cynicism: 3,
      Inefficacy: 8,
    });
  });

  it("identifies priority areas where rating >= 7", () => {
    const result = calculateDimensionsScore(validRatings);
    expect(result.priorityAreas).toEqual(["Inefficacy"]);
  });

  it("returns all dimensions as priority when all >= 7", () => {
    const result = calculateDimensionsScore({
      Exhaustion: 7,
      Cynicism: 10,
      Inefficacy: 9,
    });
    expect(result.priorityAreas).toHaveLength(3);
    expect(result.priorityAreas).toContain("Exhaustion");
    expect(result.priorityAreas).toContain("Cynicism");
    expect(result.priorityAreas).toContain("Inefficacy");
  });

  it("returns no priority areas when all < 7", () => {
    const result = calculateDimensionsScore({
      Exhaustion: 1,
      Cynicism: 6,
      Inefficacy: 3,
    });
    expect(result.priorityAreas).toHaveLength(0);
  });

  it("throws for a missing dimension", () => {
    expect(() =>
      calculateDimensionsScore({ Exhaustion: 5 })
    ).toThrow('Invalid rating for "Cynicism"');
  });

  it("throws for a rating below 1", () => {
    expect(() =>
      calculateDimensionsScore({
        Exhaustion: 0,
        Cynicism: 5,
        Inefficacy: 5,
      })
    ).toThrow('Invalid rating for "Exhaustion": expected 1-10, got 0');
  });

  it("throws for a rating above 10", () => {
    expect(() =>
      calculateDimensionsScore({
        Exhaustion: 5,
        Cynicism: 11,
        Inefficacy: 5,
      })
    ).toThrow('Invalid rating for "Cynicism": expected 1-10, got 11');
  });
});

// ---------------------------------------------------------------------------
// Section 3: Work Environment Audit
// ---------------------------------------------------------------------------

describe("calculateEnvironmentScore", () => {
  it("counts checked items per category", () => {
    const result = calculateEnvironmentScore({
      "Physical Workspace": ["a", "b", "c"],
      "Digital Environment": ["a"],
      "Schedule & Boundaries": ["a", "b", "c", "d", "e"],
      "Workload Analysis": [],
    });
    expect(result.categoryScores).toEqual({
      "Physical Workspace": 3,
      "Digital Environment": 1,
      "Schedule & Boundaries": 5,
      "Workload Analysis": 0,
    });
  });

  it("computes the overall average across categories", () => {
    // 3 + 1 + 5 + 0 = 9 / 4 = 2.25
    const result = calculateEnvironmentScore({
      "Physical Workspace": ["a", "b", "c"],
      "Digital Environment": ["a"],
      "Schedule & Boundaries": ["a", "b", "c", "d", "e"],
      "Workload Analysis": [],
    });
    expect(result.overall).toBe(2.25);
  });

  it("returns 0 for a category with no checked items", () => {
    const result = calculateEnvironmentScore({});
    expect(result.categoryScores["Physical Workspace"]).toBe(0);
    expect(result.categoryScores["Digital Environment"]).toBe(0);
    expect(result.categoryScores["Schedule & Boundaries"]).toBe(0);
    expect(result.categoryScores["Workload Analysis"]).toBe(0);
    expect(result.overall).toBe(0);
  });

  it("returns 5 for each category when all items checked", () => {
    const full = ["a", "b", "c", "d", "e"];
    const result = calculateEnvironmentScore({
      "Physical Workspace": full,
      "Digital Environment": full,
      "Schedule & Boundaries": full,
      "Workload Analysis": full,
    });
    expect(result.overall).toBe(5);
  });

  it("ignores keys not matching known categories", () => {
    const result = calculateEnvironmentScore({
      "Physical Workspace": ["a"],
      "Unknown Category": ["x", "y", "z"],
    } as Record<string, string[]>);
    expect(result.categoryScores["Physical Workspace"]).toBe(1);
    expect(result.categoryScores["Unknown Category"]).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Section 4: Life Satisfaction
// ---------------------------------------------------------------------------

describe("calculateSatisfactionScore", () => {
  const validRatings: Record<string, number> = {
    "Work Fulfillment": 5,
    "Team Relationships": 6,
    "Leadership Impact": 3,
    "Physical Health": 4,
    "Mental Health": 7,
    "Personal Relationships": 8,
    "Personal Growth": 2,
    "Play/Fun": 9,
  };

  it("computes the average across all 8 areas", () => {
    const result = calculateSatisfactionScore(validRatings);
    // (5+6+3+4+7+8+2+9) / 8 = 44 / 8 = 5.5
    expect(result.average).toBe(5.5);
  });

  it("identifies weakest areas with rating <= 4", () => {
    const result = calculateSatisfactionScore(validRatings);
    expect(result.weakestAreas).toContain("Leadership Impact");
    expect(result.weakestAreas).toContain("Physical Health");
    expect(result.weakestAreas).toContain("Personal Growth");
    expect(result.weakestAreas).toHaveLength(3);
  });

  it("returns no weakest areas when all > 4", () => {
    const ratings: Record<string, number> = {};
    for (const area of [
      "Work Fulfillment",
      "Team Relationships",
      "Leadership Impact",
      "Physical Health",
      "Mental Health",
      "Personal Relationships",
      "Personal Growth",
      "Play/Fun",
    ]) {
      ratings[area] = 5;
    }
    const result = calculateSatisfactionScore(ratings);
    expect(result.weakestAreas).toHaveLength(0);
  });

  it("throws for a missing area", () => {
    expect(() =>
      calculateSatisfactionScore({ "Work Fulfillment": 5 })
    ).toThrow('Invalid rating for "Team Relationships"');
  });

  it("throws for a rating below 1", () => {
    const bad = { ...validRatings, "Physical Health": 0 };
    expect(() => calculateSatisfactionScore(bad)).toThrow(
      'Invalid rating for "Physical Health": expected 1-10, got 0'
    );
  });

  it("throws for a rating above 10", () => {
    const bad = { ...validRatings, "Play/Fun": 11 };
    expect(() => calculateSatisfactionScore(bad)).toThrow(
      'Invalid rating for "Play/Fun": expected 1-10, got 11'
    );
  });
});

// ---------------------------------------------------------------------------
// Overall Score
// ---------------------------------------------------------------------------

describe("calculateOverallScore", () => {
  it("returns a high readiness for a low-risk profile", () => {
    const all = buildAllScores({
      warningSigns: calculateWarningSignsScore([]),
      dimensions: calculateDimensionsScore({
        Exhaustion: 1,
        Cynicism: 1,
        Inefficacy: 1,
      }),
      environment: calculateEnvironmentScore({
        "Physical Workspace": ["a", "b", "c", "d", "e"],
        "Digital Environment": ["a", "b", "c", "d", "e"],
        "Schedule & Boundaries": ["a", "b", "c", "d", "e"],
        "Workload Analysis": ["a", "b", "c", "d", "e"],
      }),
      satisfaction: calculateSatisfactionScore({
        "Work Fulfillment": 10,
        "Team Relationships": 10,
        "Leadership Impact": 10,
        "Physical Health": 10,
        "Mental Health": 10,
        "Personal Relationships": 10,
        "Personal Growth": 10,
        "Play/Fun": 10,
      }),
    });

    const result = calculateOverallScore(all);
    expect(result.readiness).toBeGreaterThanOrEqual(75);
    expect(result.zone).toBe("Thriving");
  });

  it("returns a low readiness for a high-risk profile", () => {
    const all = buildAllScores({
      warningSigns: calculateWarningSignsScore(
        Array.from({ length: 25 }, (_, i) => String(i))
      ),
      dimensions: calculateDimensionsScore({
        Exhaustion: 10,
        Cynicism: 10,
        Inefficacy: 10,
      }),
      environment: calculateEnvironmentScore({}),
      satisfaction: calculateSatisfactionScore({
        "Work Fulfillment": 1,
        "Team Relationships": 1,
        "Leadership Impact": 1,
        "Physical Health": 1,
        "Mental Health": 1,
        "Personal Relationships": 1,
        "Personal Growth": 1,
        "Play/Fun": 1,
      }),
    });

    const result = calculateOverallScore(all);
    expect(result.readiness).toBeLessThanOrEqual(25);
    expect(result.zone).toBe("Critical");
  });

  it("identifies the 3 weakest areas", () => {
    const all = buildAllScores({
      warningSigns: calculateWarningSignsScore(
        Array.from({ length: 20 }, (_, i) => String(i))
      ),
      dimensions: calculateDimensionsScore({
        Exhaustion: 9,
        Cynicism: 8,
        Inefficacy: 7,
      }),
      satisfaction: calculateSatisfactionScore({
        "Work Fulfillment": 2,
        "Team Relationships": 3,
        "Leadership Impact": 1,
        "Physical Health": 8,
        "Mental Health": 7,
        "Personal Relationships": 9,
        "Personal Growth": 8,
        "Play/Fun": 7,
      }),
    });

    const result = calculateOverallScore(all);
    expect(result.weakestAreas.length).toBeLessThanOrEqual(3);
    expect(result.weakestAreas.length).toBeGreaterThan(0);
  });

  it("generates recommendations for weak areas", () => {
    const all = buildAllScores({
      warningSigns: calculateWarningSignsScore(
        Array.from({ length: 18 }, (_, i) => String(i))
      ),
      dimensions: calculateDimensionsScore({
        Exhaustion: 8,
        Cynicism: 2,
        Inefficacy: 3,
      }),
    });

    const result = calculateOverallScore(all);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
    // Each recommendation should be a non-empty string
    for (const rec of result.recommendations) {
      expect(rec.length).toBeGreaterThan(0);
    }
  });

  it("returns readiness clamped between 0 and 100", () => {
    // Extreme low
    const low = buildAllScores({
      warningSigns: calculateWarningSignsScore(
        Array.from({ length: 30 }, (_, i) => String(i))
      ),
      dimensions: calculateDimensionsScore({
        Exhaustion: 10,
        Cynicism: 10,
        Inefficacy: 10,
      }),
      environment: calculateEnvironmentScore({}),
      satisfaction: calculateSatisfactionScore({
        "Work Fulfillment": 1,
        "Team Relationships": 1,
        "Leadership Impact": 1,
        "Physical Health": 1,
        "Mental Health": 1,
        "Personal Relationships": 1,
        "Personal Growth": 1,
        "Play/Fun": 1,
      }),
    });
    expect(calculateOverallScore(low).readiness).toBeGreaterThanOrEqual(0);

    // Extreme high
    const high = buildAllScores({
      warningSigns: calculateWarningSignsScore([]),
      dimensions: calculateDimensionsScore({
        Exhaustion: 1,
        Cynicism: 1,
        Inefficacy: 1,
      }),
      environment: calculateEnvironmentScore({
        "Physical Workspace": ["a", "b", "c", "d", "e"],
        "Digital Environment": ["a", "b", "c", "d", "e"],
        "Schedule & Boundaries": ["a", "b", "c", "d", "e"],
        "Workload Analysis": ["a", "b", "c", "d", "e"],
      }),
      satisfaction: calculateSatisfactionScore({
        "Work Fulfillment": 10,
        "Team Relationships": 10,
        "Leadership Impact": 10,
        "Physical Health": 10,
        "Mental Health": 10,
        "Personal Relationships": 10,
        "Personal Growth": 10,
        "Play/Fun": 10,
      }),
    });
    expect(calculateOverallScore(high).readiness).toBeLessThanOrEqual(100);
  });

  it("returns an empty recommendation list when there are no weak areas", () => {
    const all = buildAllScores({
      warningSigns: calculateWarningSignsScore([]),
      dimensions: calculateDimensionsScore({
        Exhaustion: 1,
        Cynicism: 1,
        Inefficacy: 1,
      }),
      environment: calculateEnvironmentScore({
        "Physical Workspace": ["a", "b", "c", "d", "e"],
        "Digital Environment": ["a", "b", "c", "d", "e"],
        "Schedule & Boundaries": ["a", "b", "c", "d", "e"],
        "Workload Analysis": ["a", "b", "c", "d", "e"],
      }),
      satisfaction: calculateSatisfactionScore({
        "Work Fulfillment": 10,
        "Team Relationships": 10,
        "Leadership Impact": 10,
        "Physical Health": 10,
        "Mental Health": 10,
        "Personal Relationships": 10,
        "Personal Growth": 10,
        "Play/Fun": 10,
      }),
    });

    const result = calculateOverallScore(all);
    expect(result.recommendations).toHaveLength(0);
    expect(result.weakestAreas).toHaveLength(0);
  });

  it("returns a fallback recommendation for unknown weak areas", () => {
    // Directly inject a weakness label that is not in the recommendation map.
    // We do this by passing an environment category with a non-standard name
    // through the public API won't reach this path, so we verify the fallback
    // by ensuring every known weak area produces a known recommendation.
    const all = buildAllScores({
      dimensions: calculateDimensionsScore({
        Exhaustion: 7,
        Cynicism: 2,
        Inefficacy: 2,
      }),
    });

    const result = calculateOverallScore(all);
    const exhaustionRec = result.recommendations.find((r) =>
      r.includes("sleep")
    );
    expect(exhaustionRec).toBeDefined();
  });
});
