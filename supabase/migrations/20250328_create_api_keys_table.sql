-- Create API keys table for authentication
-- Stores hashed API keys with metadata and rate limiting

CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 100
);

-- Create index for fast key lookup
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON public.api_keys(is_active);

-- Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can read API keys
CREATE POLICY "Service role can read all api_keys"
  ON public.api_keys
  FOR SELECT
  TO service_role
  USING (true);

-- Policy: Only service role can insert API keys
CREATE POLICY "Service role can insert api_keys"
  ON public.api_keys
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Only service role can update API keys
CREATE POLICY "Service role can update api_keys"
  ON public.api_keys
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Only service role can delete API keys
CREATE POLICY "Service role can delete api_keys"
  ON public.api_keys
  FOR DELETE
  TO service_role
  USING (true);

-- Comment
COMMENT ON TABLE public.api_keys IS 'Stores API keys for endpoint authentication with rate limiting';
COMMENT ON COLUMN public.api_keys.key_hash IS 'Hashed API key for secure storage';
COMMENT ON COLUMN public.api_keys.name IS 'Human-readable name for the API key';
COMMENT ON COLUMN public.api_keys.rate_limit IS 'Requests per hour allowed (default: 100)';
