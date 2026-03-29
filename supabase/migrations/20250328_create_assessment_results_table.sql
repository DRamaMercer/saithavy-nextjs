-- Assessment Results Table
-- Stores detailed assessment responses and results

CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  assessment_type TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INTEGER NOT NULL,
  results JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessment_results_email ON assessment_results(email);
CREATE INDEX IF NOT EXISTS idx_assessment_results_type ON assessment_results(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessment_results_created_at ON assessment_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_results_score ON assessment_results(score);

-- Add comment
COMMENT ON TABLE assessment_results IS 'Stores detailed assessment responses, scores, and results';
COMMENT ON COLUMN assessment_results.assessment_type IS 'Type of assessment (e.g., mindful-leadership, ai-readiness, resilience)';
COMMENT ON COLUMN assessment_results.responses IS 'User responses to assessment questions';
COMMENT ON COLUMN assessment_results.results IS 'Calculated results and recommendations';
COMMENT ON COLUMN assessment_results.score IS 'Overall assessment score (0-100)';
