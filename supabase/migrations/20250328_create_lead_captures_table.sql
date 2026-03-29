-- Lead Captures Table
-- Stores email leads from lead magnet downloads

CREATE TABLE IF NOT EXISTS lead_captures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  lead_magnet TEXT NOT NULL,
  assessment_score INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_captures_email ON lead_captures(email);
CREATE INDEX IF NOT EXISTS idx_lead_captures_lead_magnet ON lead_captures(lead_magnet);
CREATE INDEX IF NOT EXISTS idx_lead_captures_created_at ON lead_captures(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lead_captures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lead_captures_updated_at
  BEFORE UPDATE ON lead_captures
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_captures_updated_at();

-- Add comment
COMMENT ON TABLE lead_captures IS 'Stores email leads from lead magnet downloads with optional assessment scores';
COMMENT ON COLUMN lead_captures.assessment_score IS 'Optional assessment score (0-100) if user completed an assessment';
COMMENT ON COLUMN lead_captures.metadata IS 'Additional metadata such as UTM parameters, source, etc.';
