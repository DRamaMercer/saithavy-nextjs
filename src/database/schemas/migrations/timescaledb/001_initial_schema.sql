-- ============================================================================
-- Migration 001: Initial TimescaleDB Analytics Schema
-- Database: TimescaleDB (PostgreSQL extension)
-- Version: 1.0.0
-- Date: 2026-03-14
-- Description: Create initial schema with hypertables and time-series data
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- STEP 1: CREATE EXTENSIONS
-- ----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- ----------------------------------------------------------------------------
-- STEP 2: CONFIGURE TIMESCALEDB
-- ----------------------------------------------------------------------------

ALTER DATABASE postgres SET timescaledb.max_background_workers = 8;

-- ----------------------------------------------------------------------------
-- STEP 3: CREATE ENUMS
-- ----------------------------------------------------------------------------

CREATE TYPE metric_category AS ENUM (
    'engagement', 'reach', 'conversion', 'retention',
    'viral', 'algorithm', 'revenue', 'health'
);

CREATE TYPE aggregation_type AS ENUM (
    'raw', 'minute', 'hour', 'day', 'week', 'month'
);

CREATE TYPE trend_direction AS ENUM (
    'rising', 'falling', 'stable', 'volatile'
);

-- ----------------------------------------------------------------------------
-- STEP 4: CREATE CONTENT METRICS HYPERTABLE
-- ----------------------------------------------------------------------------

CREATE TABLE content_metrics (
    time TIMESTAMPTZ NOT NULL,
    content_id UUID NOT NULL,
    platform TEXT NOT NULL,

    -- View metrics
    views BIGINT DEFAULT 0,
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    unique_viewers BIGINT DEFAULT 0,

    -- Engagement metrics
    likes BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    saves BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,

    -- Video-specific metrics
    views_25s BIGINT DEFAULT 0,
    views_50s BIGINT DEFAULT 0,
    views_75s BIGINT DEFAULT 0,
    views_100s BIGINT DEFAULT 0,
    avg_watch_time_seconds NUMERIC(10, 2),
    total_watch_time_seconds BIGINT DEFAULT 0,

    -- Calculated metrics
    engagement_rate NUMERIC(5, 4),
    retention_rate NUMERIC(5, 4),
    completion_rate NUMERIC(5, 4),

    -- Platform-specific algorithm signals
    signal_strength NUMERIC(3, 2),
    algorithm_score NUMERIC(3, 2),

    -- Metadata
    metadata JSONB DEFAULT '{}',

    PRIMARY KEY (time, content_id, platform)
);

-- Convert to hypertable
SELECT create_hypertable('content_metrics', 'time',
    chunk_time_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

-- ----------------------------------------------------------------------------
-- STEP 5: CREATE PLATFORM HEALTH HYPERTABLE
-- ----------------------------------------------------------------------------

CREATE TABLE platform_health (
    time TIMESTAMPTZ NOT NULL,
    platform TEXT NOT NULL,

    -- Health indicators
    api_response_time_ms INTEGER,
    api_success_rate NUMERIC(5, 4),
    content_reach_rate NUMERIC(5, 4),
    avg_engagement_rate NUMERIC(5, 4),
    viral_coefficient NUMERIC(5, 4),

    -- Algorithm signals
    algorithm_stability TEXT,
    last_algorithm_change TIMESTAMPTZ,
    algorithm_change_impact TEXT,

    -- Reach trends
    total_reach BIGINT,
    reach_growth_rate NUMERIC(5, 4),

    -- Cost metrics
    cost_per_1000_impressions NUMERIC(10, 2),
    cost_per_engagement NUMERIC(10, 2),

    -- Health score
    health_score NUMERIC(3, 2),

    metadata JSONB DEFAULT '{}',

    PRIMARY KEY (time, platform)
);

SELECT create_hypertable('platform_health', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- ----------------------------------------------------------------------------
-- STEP 6: CREATE TREND METRICS HYPERTABLE
-- ----------------------------------------------------------------------------

CREATE TABLE trend_metrics (
    time TIMESTAMPTZ NOT NULL,
    trend_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    trend_category TEXT NOT NULL,

    -- Velocity indicators
    velocity_score NUMERIC(3, 2),
    momentum NUMERIC(10, 2),
    acceleration NUMERIC(10, 2),

    -- Adoption metrics
    adoption_rate NUMERIC(5, 4),
    total_adoptions BIGINT,
    new_adoptions BIGINT,

    -- Engagement
    avg_engagement_rate NUMERIC(5, 4),
    total_engagement BIGINT,

    -- Lifecycle
    lifecycle_stage TEXT,
    peak_predicted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    -- Viral potential
    viral_potential NUMERIC(3, 2),
    saturation_point NUMERIC(5, 4),

    metadata JSONB DEFAULT '{}',

    PRIMARY KEY (time, trend_id, platform)
);

SELECT create_hypertable('trend_metrics', 'time',
    chunk_time_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

-- ----------------------------------------------------------------------------
-- STEP 7: CREATE SWARM METRICS HYPERTABLE
-- ----------------------------------------------------------------------------

CREATE TABLE swarm_metrics (
    time TIMESTAMPTZ NOT NULL,
    swarm_id TEXT NOT NULL,
    swarm_role TEXT NOT NULL,
    task_type TEXT NOT NULL,

    -- Performance metrics
    tasks_completed INTEGER DEFAULT 0,
    tasks_failed INTEGER DEFAULT 0,
    tasks_total INTEGER DEFAULT 0,

    -- Timing
    avg_task_duration_seconds NUMERIC(10, 2),
    max_task_duration_seconds INTEGER,
    min_task_duration_seconds INTEGER,

    -- Quality
    avg_quality_score NUMERIC(3, 2),
    revision_rate NUMERIC(5, 4),
    approval_rate NUMERIC(5, 4),

    -- Cost
    tokens_used INTEGER DEFAULT 0,
    cost_usd NUMERIC(10, 2),

    -- Throughput
    throughput_per_hour NUMERIC(10, 2),

    metadata JSONB DEFAULT '{}',

    PRIMARY KEY (time, swarm_id, swarm_role)
);

SELECT create_hypertable('swarm_metrics', 'time',
    chunk_time_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

-- ----------------------------------------------------------------------------
-- STEP 8: CREATE MONETIZATION METRICS HYPERTABLE
-- ----------------------------------------------------------------------------

CREATE TABLE monetization_metrics (
    time TIMESTAMPTZ NOT NULL,
    content_id UUID NOT NULL,
    monetization_type TEXT NOT NULL,

    -- Revenue
    revenue_usd NUMERIC(12, 2),
    revenue_cumulative_usd NUMERIC(12, 2),

    -- Conversions
    conversions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversion_rate NUMERIC(5, 4),

    -- Attribution
    attributed_views BIGINT,
    attributed_engagements BIGINT,

    -- Cost
    cost_usd NUMERIC(10, 2),
    profit_usd NUMERIC(12, 2),
    roi NUMERIC(5, 2),

    metadata JSONB DEFAULT '{}',

    PRIMARY KEY (time, content_id, monetization_type)
);

SELECT create_hypertable('monetization_metrics', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- ----------------------------------------------------------------------------
-- STEP 9: CREATE INDEXES
-- ----------------------------------------------------------------------------

-- Content metrics indexes
CREATE INDEX idx_content_metrics_content_time
    ON content_metrics(content_id, time DESC);

CREATE INDEX idx_content_metrics_platform_time
    ON content_metrics(platform, time DESC);

-- Platform health indexes
CREATE INDEX idx_platform_health_platform_time
    ON platform_health(platform, time DESC);

CREATE INDEX idx_platform_health_score
    ON platform_health(health_score DESC, time DESC);

-- Trend metrics indexes
CREATE INDEX idx_trend_metrics_trend_time
    ON trend_metrics(trend_id, time DESC);

CREATE INDEX idx_trend_metrics_velocity
    ON trend_metrics(velocity_score DESC, time DESC);

-- Swarm metrics indexes
CREATE INDEX idx_swarm_metrics_swarm_time
    ON swarm_metrics(swarm_id, time DESC);

-- Monetization metrics indexes
CREATE INDEX idx_monetization_metrics_content_time
    ON monetization_metrics(content_id, time DESC);

-- ----------------------------------------------------------------------------
-- STEP 10: INSERT SAMPLE DATA
-- ----------------------------------------------------------------------------

-- Sample content metrics
INSERT INTO content_metrics (time, content_id, platform, views, impressions, likes, comments, shares, engagement_rate, signal_strength) VALUES
(NOW() - INTERVAL '2 hours', 'content_youtube_parent_001'::uuid, 'youtube', 10000, 50000, 500, 50, 100, 0.065, 0.85),
(NOW() - INTERVAL '1 hour', 'content_tiktok_child_001'::uuid, 'tiktok', 50000, 200000, 5000, 200, 5000, 0.204, 0.92),
(NOW() - INTERVAL '1 hour', 'content_twitter_child_001'::uuid, 'twitter', 25000, 100000, 2000, 80, 150, 0.089, 0.78);

-- Sample platform health
INSERT INTO platform_health (time, platform, api_response_time_ms, api_success_rate, avg_engagement_rate, viral_coefficient, health_score) VALUES
(NOW() - INTERVAL '1 hour', 'tiktok', 150, 0.99, 0.15, 2.3, 0.92),
(NOW() - INTERVAL '1 hour', 'instagram', 200, 0.98, 0.12, 1.8, 0.88),
(NOW() - INTERVAL '1 hour', 'youtube', 180, 0.99, 0.08, 1.2, 0.85);

-- Sample trend metrics
INSERT INTO trend_metrics (time, trend_id, platform, trend_category, velocity_score, adoption_rate, total_adoptions, viral_potential) VALUES
(NOW() - INTERVAL '30 minutes', 'trend_dance_001', 'tiktok', 'audio', 0.92, 0.15, 50000, 0.88),
(NOW() - INTERVAL '30 minutes', 'trend_hashtag_001', 'twitter', 'hashtag', 0.78, 0.08, 25000, 0.65),
(NOW() - INTERVAL '30 minutes', 'trend_format_001', 'instagram', 'format', 0.65, 0.05, 10000, 0.52);

COMMIT;

-- ----------------------------------------------------------------------------
-- STEP 11: VERIFY CREATION
-- ----------------------------------------------------------------------------

-- List all tables
\dt

-- Show hypertable information
SELECT hypertable_name, time_column_name, chunk_time_interval
  FROM timescaledb_information.hypertables;

-- Count records in each table
SELECT 'content_metrics' as table_name, COUNT(*) as count FROM content_metrics
UNION ALL
SELECT 'platform_health', COUNT(*) FROM platform_health
UNION ALL
SELECT 'trend_metrics', COUNT(*) FROM trend_metrics
UNION ALL
SELECT 'swarm_metrics', COUNT(*) FROM swarm_metrics
UNION ALL
SELECT 'monetization_metrics', COUNT(*) FROM monetization_metrics;

-- ----------------------------------------------------------------------------
-- END OF MIGRATION
-- ----------------------------------------------------------------------------
