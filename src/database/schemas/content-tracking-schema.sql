-- ============================================================================
-- Swarm Agency Content Tracking Database Schema
-- Database: PostgreSQL 16+
-- Version: 1.0.0
-- Description: Content inventory, metadata, performance tracking
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- For text similarity
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- For composite indexes
CREATE EXTENSION IF NOT EXISTS "btree_gist";     -- For exclusion constraints
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- For query performance
CREATE EXTENSION IF NOT EXISTS "pg_cron";        -- For scheduled tasks

-- ----------------------------------------------------------------------------
-- ENUMS
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

CREATE METRIC TYPE metric_source AS ENUM (
    'platform_api', 'analytics_tool', 'manual_entry',
    'estimated', 'aggregated'
);

-- ----------------------------------------------------------------------------
-- CORE TABLES
-- ----------------------------------------------------------------------------

-- Content inventory table
-- Central repository for all content pieces across platforms
CREATE TABLE content_inventory (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    external_id TEXT UNIQUE,                 -- Platform-specific content ID
    parent_content_id UUID REFERENCES content_inventory(id), -- For atomized content

    -- Content metadata
    title TEXT NOT NULL,
    description TEXT,
    transcript TEXT,
    content_type content_type NOT NULL,
    platform platform_type NOT NULL,

    -- Content URLs
    content_url TEXT,
    thumbnail_url TEXT,
    download_url TEXT,                       -- Internal storage URL

    -- Timing
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,

    -- Status
    status content_status NOT NULL DEFAULT 'draft',

    -- Dimensions (for visual content)
    width INTEGER,
    height INTEGER,
    aspect_ratio TEXT,

    -- File info
    file_size_bytes BIGINT,
    file_format TEXT,

    -- Metadata
    metadata JSONB NOT NULL DEFAULT '{}',    -- Platform-specific metadata
    tags TEXT[],
    hashtags TEXT[],

    -- Performance snapshot (cached)
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
    confidence_score NUMERIC(3, 2),          -- AI confidence (0.00-1.00)

    -- Content DNA
    content_dna JSONB,                       -- Psychological profile
    atomization_chain UUID[],                -- Lineage tracking
    adaptation_history JSONB DEFAULT '[]',   -- Adaptation records

    -- Soft delete
    deleted_at TIMESTAMPTZ,

    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(transcript, '')), 'C')
    ) STORED
);

-- Platform-specific metadata table
-- Stores detailed platform-specific settings and requirements
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
    optimal_posting_times JSONB,             -- Platform-specific best times
    trending_hashtags TEXT[],

    -- Psychological preferences
    color_preferences JSONB,                 -- High-performing colors
    hook_preferences JSONB,                  -- Effective hook types
    audio_preferences JSONB,                 -- Audio requirements

    -- Fees and limits
    api_cost_per_1000_calls NUMERIC(10, 2),
    storage_cost_per_gb NUMERIC(10, 2),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_checked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance metrics table
-- Detailed performance data for each content piece
CREATE TABLE content_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    content_id UUID NOT NULL REFERENCES content_inventory(id) ON DELETE CASCADE,

    -- Metric source
    metric_source metric_source NOT NULL,
    source_name TEXT,                        -- Tool name (e.g., 'Google Analytics')

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
    algorithm_signals JSONB,                 -- Platform algorithm metrics

    -- Metadata
    metadata JSONB DEFAULT '{}'
);

-- Swarm workflow tracking table
-- Tracks which swarm worked on which content
CREATE TABLE swarm_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    content_id UUID NOT NULL REFERENCES content_inventory(id) ON DELETE CASCADE,

    -- Workflow identification
    workflow_name TEXT NOT NULL,
    workflow_type TEXT NOT NULL,             -- 'atomization', 'creation', 'optimization'

    -- Swarm participation
    primary_swarm swarm_role NOT NULL,
    participating_swarms swarm_role[] NOT NULL,

    -- Task tracking
    tasks JSONB NOT NULL DEFAULT '[]',       -- Array of task objects
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
    quality_score NUMERIC(3, 2),             -- 0.00-1.00
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

-- Tool integration table
-- Tracks all external tool integrations and API calls
CREATE TABLE tool_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    tool_name TEXT NOT NULL,
    tool_type TEXT NOT NULL,                 -- 'seo', 'analytics', 'creation', etc.
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
    health_status TEXT,                      -- 'healthy', 'degraded', 'down'

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tool usage log table
CREATE TABLE tool_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    tool_integration_id UUID NOT NULL REFERENCES tool_integrations(id),

    -- Request details
    request_type TEXT NOT NULL,              -- 'rank_check', 'content_analysis', etc.
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

-- Monetization tracking table
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

-- Content notes table
-- For human annotations and feedback
CREATE TABLE content_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    content_id UUID NOT NULL REFERENCES content_inventory(id) ON DELETE CASCADE,

    -- Note details
    note_text TEXT NOT NULL,
    note_type TEXT NOT NULL,                 -- 'feedback', 'lesson', 'issue', 'idea'

    -- Author
    author_id TEXT NOT NULL,
    author_type TEXT,                        -- 'human', 'ai', 'system'

    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- INDEXES
-- ----------------------------------------------------------------------------

-- Content inventory indexes
CREATE INDEX idx_content_platform ON content_inventory(platform);
CREATE INDEX idx_content_status ON content_inventory(status);
CREATE INDEX idx_content_type ON content_inventory(content_type);
CREATE INDEX idx_content_parent ON content_inventory(parent_content_id) WHERE parent_content_id IS NOT NULL;
CREATE INDEX idx_content_created ON content_inventory(created_at DESC);
CREATE INDEX idx_content_published ON content_inventory(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX idx_content_tags ON content_inventory USING GIN(tags);
CREATE INDEX idx_content_hashtags ON content_inventory USING GIN(hashtags);
CREATE INDEX idx_content_search ON content_inventory USING GIN(search_vector);
CREATE INDEX idx_content_metadata ON content_inventory USING GIN(metadata);
CREATE INDEX idx_content_atomization_chain ON content_inventory USING GIN(atomization_chain);

-- Platform-specific partial indexes for common queries
CREATE INDEX idx_content_tiktok_published ON content_inventory(platform, published_at DESC)
    WHERE platform = 'tiktok' AND status = 'published';
CREATE INDEX idx_content_instagram_published ON content_inventory(platform, published_at DESC)
    WHERE platform = 'instagram' AND status = 'published';
CREATE INDEX idx_content_youtube_published ON content_inventory(platform, published_at DESC)
    WHERE platform = 'youtube' AND status = 'published';

-- Performance indexes
CREATE INDEX idx_performance_content ON content_performance(content_id, recorded_at DESC);
CREATE INDEX idx_performance_recorded ON content_performance(recorded_at DESC);
CREATE INDEX idx_performance_platform ON content_performance(content_id)
    INCLUDE (recorded_at, views, engagement_rate);

-- Swarm workflow indexes
CREATE INDEX idx_workflow_content ON swarm_workflows(content_id);
CREATE INDEX idx_workflow_status ON swarm_workflows(status);
CREATE INDEX idx_workflow_started ON swarm_workflows(started_at DESC);
CREATE INDEX idx_workflow_swarm ON swarm_workflows(primary_swarm);

-- Tool integration indexes
CREATE INDEX idx_tool_name ON tool_integrations(tool_name);
CREATE INDEX idx_tool_active ON tool_integrations(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_tool_health ON tool_integrations(health_status);

-- Tool usage log indexes
CREATE INDEX idx_tool_usage_tool ON tool_usage_log(tool_integration_id);
CREATE INDEX idx_tool_usage_time ON tool_usage_log(requested_at DESC);
CREATE INDEX idx_tool_usage_type ON tool_usage_log(request_type);

-- Monetization indexes
CREATE INDEX idx_monetization_content ON monetization_records(content_id);
CREATE INDEX idx_monetization_period ON monetization_records(period_start, period_end);
CREATE INDEX idx_monetization_type ON monetization_records(monetization_type);

-- Content notes indexes
CREATE INDEX idx_notes_content ON content_notes(content_id, created_at DESC);
CREATE INDEX idx_notes_type ON content_notes(note_type);

-- ----------------------------------------------------------------------------
-- TRIGGERS
-- ----------------------------------------------------------------------------

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_metadata_updated_at
    BEFORE UPDATE ON platform_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_content_inventory_updated_at
    BEFORE UPDATE ON content_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tool_integrations_updated_at
    BEFORE UPDATE ON tool_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Calculate engagement rate trigger
CREATE OR REPLACE FUNCTION calculate_engagement_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.views > 0 THEN
        NEW.engagement_rate = (
            (COALESCE(NEW.likes, 0) +
             COALESCE(NEW.comments, 0) +
             COALESCE(NEW.shares, 0) * 2)::NUMERIC / NEW.views
        )::NUMERIC(5, 4);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_content_engagement
    BEFORE INSERT OR UPDATE OF views, likes, comments, shares
    ON content_inventory
    FOR EACH ROW
    EXECUTE FUNCTION calculate_engagement_rate();

-- ----------------------------------------------------------------------------
-- VIEWS
-- ----------------------------------------------------------------------------

-- Content performance summary view
CREATE OR REPLACE VIEW content_performance_summary AS
SELECT
    ci.id,
    ci.title,
    ci.platform,
    ci.content_type,
    ci.status,
    ci.published_at,
    ci.views,
    ci.engagement_rate,
    cp.avg_view_duration_seconds,
    cp.retention_rate,
    cp.viral_coefficient,
    cp.revenue,
    ci.monetization_type,
    ci.atomization_chain,
    ci.content_dna
FROM content_inventory ci
LEFT JOIN LATERAL (
    SELECT
        avg_view_duration_seconds,
        retention_rate,
        viral_coefficient,
        revenue
    FROM content_performance
    WHERE content_id = ci.id
    ORDER BY recorded_at DESC
    LIMIT 1
) cp ON true;

-- Cross-platform performance comparison view
CREATE OR REPLACE VIEW cross_platform_performance AS
SELECT
    parent.id AS parent_id,
    parent.title AS parent_title,
    parent.platform AS parent_platform,
    COUNT(child.id) AS adaptation_count,
    ARRAY_AGG(DISTINCT child.platform) AS platforms,
    AVG(child.views) AS avg_views,
    AVG(child.engagement_rate) AS avg_engagement,
    MAX(child.views) AS max_views,
    SUM(cp.revenue) FILTER (WHERE cp.revenue IS NOT NULL) AS total_revenue
FROM content_inventory parent
LEFT JOIN content_inventory child ON child.parent_content_id = parent.id
LEFT JOIN content_performance cp ON cp.content_id = child.id
WHERE parent.parent_content_id IS NULL
GROUP BY parent.id, parent.title, parent.platform;

-- Swarm efficiency view
CREATE OR REPLACE VIEW swarm_efficiency AS
SELECT
    primary_swarm,
    COUNT(*) AS total_workflows,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed_workflows,
    AVG(actual_duration_seconds) FILTER (WHERE actual_duration_seconds IS NOT NULL) AS avg_duration_seconds,
    AVG(quality_score) FILTER (WHERE quality_score IS NOT NULL) AS avg_quality_score,
    AVG(cost_usd) FILTER (WHERE cost_usd IS NOT NULL) AS avg_cost_usd,
    SUM(cost_usd) FILTER (WHERE cost_usd IS NOT NULL) AS total_cost_usd
FROM swarm_workflows
GROUP BY primary_swarm;

-- Tool usage summary view
CREATE OR REPLACE VIEW tool_usage_summary AS
SELECT
    ti.tool_name,
    ti.tool_type,
    ti.health_status,
    COUNT(tul.id) AS total_calls,
    AVG(tul.response_time_ms) AS avg_response_time_ms,
    SUM(tul.api_cost_usd) AS total_cost_usd,
    COUNT(*) FILTER (WHERE tul.response_status >= 400) AS error_count,
    MAX(tul.requested_at) AS last_call
FROM tool_integrations ti
LEFT JOIN tool_usage_log tul ON tul.tool_integration_id = ti.id
    AND tul.requested_at > NOW() - INTERVAL '7 days'
GROUP BY ti.id, ti.tool_name, ti.tool_type, ti.health_status;

-- ----------------------------------------------------------------------------
-- SAMPLE DATA
-- ----------------------------------------------------------------------------

-- Insert sample platform metadata
INSERT INTO platform_metadata (platform, api_endpoint, max_duration_seconds, optimal_duration_seconds, supported_formats, algorithm_signals) VALUES
('tiktok', 'https://api.tiktok.com', 90, ARRAY[21, 34], ARRAY['mp4', 'mov'], '{"watch_time": 1.0, "rewatch_rate": 0.9, "shares": 0.8, "comments": 0.6, "likes": 0.4}'),
('instagram', 'https://graph.instagram.com', 90, ARRAY[7, 15], ARRAY['mp4', 'mov', 'jpg', 'png'], '{"engagement_rate": 1.0, "saves": 0.9, "shares": 0.8, "profile_visits": 0.7}'),
('youtube', 'https://www.googleapis.com/youtube/v3', 7200, ARRAY[600, 1200], ARRAY['mp4', 'mov', 'mkv'], '{"retention_rate": 1.0, "ctr": 0.9, "subscriber_growth": 0.8, "watch_time": 0.7}');

-- Insert sample content
INSERT INTO content_inventory (title, description, platform, content_type, status, published_at, views, likes, shares, comments) VALUES
('Complete Guide to Content Atomization', 'Learn how to repurpose content across platforms', 'youtube', 'long_form_video', 'published', NOW() - INTERVAL '2 days', 10000, 500, 100, 50),
('Content Atomization Hack #1', 'First tip from the guide', 'tiktok', 'short_form_video', 'published', NOW() - INTERVAL '1 day', 50000, 5000, 5000, 200),
('Content Atomization Thread', 'Thread version of the guide', 'twitter', 'thread', 'published', NOW() - INTERVAL '1 day', 25000, 2000, 150, 80);

-- ----------------------------------------------------------------------------
-- USEFUL QUERIES
-- ----------------------------------------------------------------------------

-- Query 1: Get content atomization lineage
-- WITH RECURSIVE lineage AS (
--     SELECT id, title, platform, parent_content_id, 1 as level
--     FROM content_inventory
--     WHERE id = $1
--     UNION ALL
--     SELECT c.id, c.title, c.platform, c.parent_content_id, l.level + 1
--     FROM content_inventory c
--     JOIN lineage l ON c.parent_content_id = l.id
-- )
-- SELECT * FROM lineage ORDER BY level;

-- Query 2: Find top-performing content by platform and type
-- SELECT platform, content_type,
--        AVG(engagement_rate) as avg_engagement,
--        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY views) as median_views
-- FROM content_inventory
-- WHERE status = 'published' AND published_at > NOW() - INTERVAL '30 days'
-- GROUP BY platform, content_type
-- ORDER BY avg_engagement DESC;

-- Query 3: Get content needing review
-- SELECT ci.id, ci.title, ci.platform, ci.status, ci.created_at
-- FROM content_inventory ci
-- WHERE ci.status = 'review'
--    OR (ci.status = 'draft' AND ci.created_at < NOW() - INTERVAL '24 hours')
-- ORDER BY ci.created_at;

-- Query 4: Full-text search for content
-- SELECT id, title, platform,
--        ts_rank(search_vector, query) as rank
-- FROM content_inventory,
--      to_tsquery('english', 'atomization & content') query
-- WHERE search_vector @@ query
-- ORDER BY rank DESC;

-- Query 5: Get monetization summary by content
-- SELECT ci.id, ci.title, ci.platform,
--        SUM(mr.revenue_usd) as total_revenue,
--        ARRAY_AGG(DISTINCT mr.monetization_type) as monetization_types
-- FROM content_inventory ci
-- LEFT JOIN monetization_records mr ON mr.content_id = ci.id
-- WHERE ci.status = 'published'
-- GROUP BY ci.id, ci.title, ci.platform
-- ORDER BY total_revenue DESC NULLS LAST;

-- ----------------------------------------------------------------------------
-- END OF SCHEMA
-- ----------------------------------------------------------------------------
