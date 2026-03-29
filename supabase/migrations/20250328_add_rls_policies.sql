-- Row Level Security (RLS) Policies
-- Enable RLS on all tables

ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Lead Captures Policies
-- Allow anyone to insert leads (public API)
CREATE POLICY "Allow public insert on lead_captures"
  ON lead_captures
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role to read all leads
CREATE POLICY "Allow service role to read all lead_captures"
  ON lead_captures
  FOR SELECT
  TO service_role
  USING (true);

-- Allow users to read their own leads (by email)
CREATE POLICY "Allow users to read own lead_captures"
  ON lead_captures
  FOR SELECT
  TO anon, authenticated
  USING (email = current_email());

-- Assessment Results Policies
-- Allow anyone to insert assessment results (public API)
CREATE POLICY "Allow public insert on assessment_results"
  ON assessment_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role to read all assessment results
CREATE POLICY "Allow service role to read all assessment_results"
  ON assessment_results
  FOR SELECT
  TO service_role
  USING (true);

-- Allow users to read their own assessment results (by email)
CREATE POLICY "Allow users to read own assessment_results"
  ON assessment_results
  FOR SELECT
  TO anon, authenticated
  USING (email = current_email());

-- Helper function to get current email from JWT or anonymous context
CREATE OR REPLACE FUNCTION current_email()
RETURNS TEXT AS $$
  SELECT
    CASE
      WHEN auth.uid() IS NOT NULL THEN (auth.jwt()->>'email')
      ELSE NULL::TEXT
    END;
$$ LANGUAGE sql SECURITY DEFINER;

-- Add comments
COMMENT ON FUNCTION current_email() IS 'Helper function to extract email from JWT or return NULL for anonymous users';
