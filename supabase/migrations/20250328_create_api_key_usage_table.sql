-- Create API key usage tracking table
-- Logs API key usage for analytics and rate limiting

CREATE TABLE IF NOT EXISTS public.api_key_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_api_key_usage_api_key_id ON public.api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_created_at ON public.api_key_usage(created_at);

-- Row Level Security
ALTER TABLE public.api_key_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can read usage logs
CREATE POLICY "Service role can read all api_key_usage"
  ON public.api_key_usage
  FOR SELECT
  TO service_role
  USING (true);

-- Policy: Only service role can insert usage logs
CREATE POLICY "Service role can insert api_key_usage"
  ON public.api_key_usage
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Only service role can delete usage logs
CREATE POLICY "Service role can delete api_key_usage"
  ON public.api_key_usage
  FOR DELETE
  TO service_role
  USING (true);

-- Comment
COMMENT ON TABLE public.api_key_usage IS 'Logs API key usage for analytics and rate limiting';
COMMENT ON COLUMN public.api_key_usage.api_key_id IS 'Reference to the API key used';
COMMENT ON COLUMN public.api_key_usage.endpoint IS 'API endpoint that was accessed';
COMMENT ON COLUMN public.api_key_usage.method IS 'HTTP method used (GET, POST, etc.)';
