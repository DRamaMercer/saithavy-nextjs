-- ============================================================================
-- Migration 001: Initial PostgreSQL Content Tracking Schema
-- Database: PostgreSQL 16+
-- Version: 1.0.0
-- Date: 2026-03-14
-- Description: Create initial schema with core tables, enums, and extensions
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- STEP 1: CREATE EXTENSIONS
-- ----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ----------------------------------------------------------------------------
-- STEP 2: CREATE ENUMS
-- ----------------------------------------------------------------------------

CREATE TYPE content_status AS ENUM (
    'draft', 'review', 'scheduled', 'published',
    'archived', 'deleted', 'failed'
);

CREATE TYPE platform_type AS ENUM (
    'tiktok', 'instagram', 'youtube', 'twitter',
    'linkedin', 'pinterest', 'facebook'
);

CREATE TYPE content_type AS ENUM (
    'long_form_video', 'short_form_video', 'image',
    'carousel', 'thread', 'article', 'story',
    'live_stream', 'document', 'audio', 'reel'
);

CREATE TYPE swarm_role AS ENUM (
    'alpha', 'beta', 'gamma', 'delta', 'epsilon',
    'coordinator', 'reviewer'
);

CREATE TYPE task_status AS ENUM (
    'pending', 'in_progress', 'completed',
    'failed', 'cancelled', 'blocked'
);

CREATE TYPE monetization_type AS ENUM (
    'sponsorship', 'affiliate', 'ad_revenue',
    'product_sale', 'subscription', 'donation', 'license'
);

CREATE TYPE metric_source AS ENUM (
    'platform_api', 'analytics_tool', 'manual_entry',
    'estimated', 'aggregated'
);

-- ----------------------------------------------------------------------------
-- STEP 3: CREATE CONTENT INVENTORY TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE content_inventory (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    external_id TEXT UNIQUE,
    parent_content_id UUID REFERENCES content_inventory(id),

    -- Content metadata
    title TEXT NOT NULL,
    description TEXT,
    transcript TEXT,
    content_type content_type NOT NULL,
    platform platform_type NOT NULL,

    -- Content URLs
    content_url TEXT,
    thumbnail_url TEXT,
    download_url TEXT,

    -- Timing
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,

    -- Status
    status content_status NOT NULL DEFAULT 'draft',

    -- Dimensions
    width INTEGER,
    height INTEGER,
    aspect_ratio TEXT,

    -- File info
    file_size_bytes BIGINT,
    file_format TEXT,

    -- Metadata
    metadata JSONB NOT NULL DEFAULT '{}',
    tags TEXT[],
    hashtags TEXT[],

    -- Performance snapshot
    views BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    engagement_rate NUMERIC(5, 4),

    -- Monetization
    monetization_enabled BOOLEAN DEFAULT FALSE,
    monetization_type monetization_type,

    -- Attribution
    creator_id TEXT NOT NULL DEFAULT 'system',
    ai_generated BOOLEAN DEFAULT TRUE,
    human_reviewed BOOLEAN DEFAULT FALSE,
    confidence_score NUMERIC(3, 2),

    -- Content DNA
    content_dna JSONB,
    atomization_chain UUID[],
    adaptation_history JSONB DEFAULT '[]',

    -- Soft delete
    deleted_at TIMESTAMPTZ,

    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(transcript, '')), 'C')
    ) STORED
);

-- ----------------------------------------------------------------------------
-- STEP 4: CREATE PLATFORM METADATA TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE platform_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    platform platform_type UNIQUE NOT NULL,

    -- API configuration
    api_endpoint TEXT,
    api_version TEXT,
    rate_limit_per_minute INTEGER,
    rate_limit_per_day INTEGER,

    -- Content specifications
    max_duration_seconds INTEGER,
    min_duration_seconds INTEGER,
    optimal_duration_seconds INTEGER[],
    max_file_size_bytes BIGINT,
    supported_formats TEXT[],
    required_dimensions TEXT[],

    -- Algorithm signals
    algorithm_signals JSONB NOT NULL DEFAULT '{}',
    optimal_posting_times JSONB,
    trending_hashtags TEXT[],

    -- Psychological preferences
    color_preferences JSONB,
    hook_preferences JSONB,
    audio_preferences JSONB,

    -- Fees and limits
    api_cost_per_1000_calls NUMERIC(10, 2),
    storage_cost_per_gb NUMERIC(10, 2),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_checked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- STEP 5: CREATE CONTENT PERFORMANCE TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE content_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    content_id UUID NOT NULL REFERENCES content_inventory(id) ON DELETE CASCADE,

    -- Metric source
    metric_source metric_source NOT NULL,
    source_name TEXT,

    -- Timestamp
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Engagement metrics
    views BIGINT,
    impressions BIGINT,
    reach BIGINT,
    likes BIGINT,
    shares BIGINT,
    comments BIGINT,
    saves BIGINT,
    clicks BIGINT,

    -- Video-specific
    views_25_percent INTEGER,
    views_50_percent INTEGER,
    views_75_percent INTEGER,
    views_100_percent INTEGER,
    avg_view_duration_seconds NUMERIC(10, 2),
    retention_rate NUMERIC(5, 4),
    rewatch_rate NUMERIC(5, 4),

    -- Engagement calculations
    engagement_rate NUMERIC(5, 4),
    viral_coefficient NUMERIC(5, 4),

    -- Conversion metrics
    conversions INTEGER,
    conversion_rate NUMERIC(5, 4),
    revenue NUMERIC(12, 2),

    -- Platform-specific signals
    algorithm_signals JSONB,

    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- STEP 6: CREATE SWARM WORKFLOWS TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE swarm_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    content_id UUID NOT NULL REFERENCES content_inventory(id) ON DELETE CASCADE,

    -- Workflow identification
    workflow_name TEXT NOT NULL,
    workflow_type TEXT NOT NULL,

    -- Swarm participation
    primary_swarm swarm_role NOT NULL,
    participating_swarms swarm_role[] NOT NULL,

    -- Task tracking
    tasks JSONB NOT NULL DEFAULT '[]',
    task_count INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,

    -- Timing
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    estimated_duration_seconds INTEGER,
    actual_duration_seconds INTEGER,

    -- Status
    status task_status NOT NULL DEFAULT 'pending',

    -- Quality metrics
    quality_score NUMERIC(3, 2),
    revision_count INTEGER DEFAULT 0,
    approval_required BOOLEAN DEFAULT TRUE,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,

    -- Performance
    cost_usd NUMERIC(10, 2),
    tokens_used INTEGER,

    -- Errors and issues
    errors JSONB DEFAULT '[]',
    warnings JSONB DEFAULT '[]',

    metadata JSONB DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- STEP 7: CREATE TOOL INTEGRATIONS TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE tool_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    tool_name TEXT NOT NULL,
    tool_type TEXT NOT NULL,
    api_endpoint TEXT,

    -- Authentication
    api_key_encrypted TEXT,
    oauth_token_encrypted TEXT,

    -- Rate limiting
    rate_limit_per_minute INTEGER,
    rate_limit_per_hour INTEGER,
    calls_last_minute INTEGER DEFAULT 0,
    calls_last_hour INTEGER DEFAULT 0,
    rate_limit_reset_at TIMESTAMPTZ,

    -- Configuration
    config JSONB NOT NULL DEFAULT '{}',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_health_check TIMESTAMPTZ,
    health_status TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- STEP 8: CREATE TOOL USAGE LOG TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE tool_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    tool_integration_id UUID NOT NULL REFERENCES tool_integrations(id),

    -- Request details
    request_type TEXT NOT NULL,
    request_params JSONB,

    -- Response details
    response_status INTEGER,
    response_data JSONB,

    -- Performance
    response_time_ms INTEGER,

    -- Cost tracking
    api_cost_usd NUMERIC(10, 2),

    -- Timestamp
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- STEP 9: CREATE MONETIZATION RECORDS TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE monetization_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    content_id UUID NOT NULL REFERENCES content_inventory(id),

    -- Monetization details
    monetization_type monetization_type NOT NULL,
    sponsor_name TEXT,
    affiliate_link TEXT,
    product_name TEXT,

    -- Revenue
    revenue_usd NUMERIC(12, 2),
    revenue_share_percentage NUMERIC(5, 2),

    -- Attribution
    conversion_count INTEGER,
    click_count INTEGER,

    -- Timing
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- STEP 10: CREATE CONTENT NOTES TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE content_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    content_id UUID NOT NULL REFERENCES content_inventory(id) ON DELETE CASCADE,

    -- Note details
    note_text TEXT NOT NULL,
    note_type TEXT NOT NULL,

    -- Author
    author_id TEXT NOT NULL,
    author_type TEXT,

    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- STEP 11: INSERT SAMPLE PLATFORM METADATA
-- ----------------------------------------------------------------------------

INSERT INTO platform_metadata (platform, api_endpoint, max_duration_seconds, optimal_duration_seconds, supported_formats, algorithm_signals, color_preferences, hook_preferences) VALUES
('tiktok', 'https://api.tiktok.com', 90, ARRAY[21, 34], ARRAY['mp4', 'mov'], '{"watch_time": 1.0, "rewatch_rate": 0.9, "shares": 0.8, "comments": 0.6, "likes": 0.4}', '{"primary": ["red", "orange"], "high_contrast": true}', '{"best": ["pattern_interrupt", "curiosity_gap"]}'),
('instagram', 'https://graph.instagram.com', 90, ARRAY[7, 15], ARRAY['mp4', 'mov', 'jpg', 'png'], '{"engagement_rate": 1.0, "saves": 0.9, "shares": 0.8, "profile_visits": 0.7}', '{"primary": ["warm", "aesthetic"], "consistency": "grid"}', '{"best": ["social_proof", "emotional_arousal"]}'),
('youtube', 'https://www.googleapis.com/youtube/v3', 7200, ARRAY[600, 1200], ARRAY['mp4', 'mov', 'mkv'], '{"retention_rate": 1.0, "ctr": 0.9, "subscriber_growth": 0.8, "watch_time": 0.7}', '{"thumbnail": ["high_contrast", "warm"]}', '{"best": ["information_gap", "authority_signal"]}');

COMMIT;

-- ----------------------------------------------------------------------------
-- STEP 12: VERIFY CREATION
-- ----------------------------------------------------------------------------

-- List all tables
\dt

-- List all enums
SELECT enumlabel FROM pg_enum WHERE enumtypid IN (
    SELECT oid FROM pg_type WHERE typtype = 'e'
) ORDER BY enumlabel;

-- Count records in each table
SELECT 'content_inventory' as table_name, COUNT(*) as count FROM content_inventory
UNION ALL
SELECT 'platform_metadata', COUNT(*) FROM platform_metadata
UNION ALL
SELECT 'content_performance', COUNT(*) FROM content_performance
UNION ALL
SELECT 'swarm_workflows', COUNT(*) FROM swarm_workflows
UNION ALL
SELECT 'tool_integrations', COUNT(*) FROM tool_integrations
UNION ALL
SELECT 'tool_usage_log', COUNT(*) FROM tool_usage_log
UNION ALL
SELECT 'monetization_records', COUNT(*) FROM monetization_records
UNION ALL
SELECT 'content_notes', COUNT(*) FROM content_notes;

-- ----------------------------------------------------------------------------
-- END OF MIGRATION
-- ----------------------------------------------------------------------------
