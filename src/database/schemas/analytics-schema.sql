-- ============================================================================
-- Swarm Agency Analytics Database Schema
-- Database: TimescaleDB (PostgreSQL extension)
-- Version: 1.0.0
-- Description: Time-series performance data, engagement metrics, trend analysis
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSIONS
-- ----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- ----------------------------------------------------------------------------
-- CONFIGURATION
-- ----------------------------------------------------------------------------

-- Configure TimescaleDB for optimal performance
ALTER DATABASE postgres SET timescaledb.max_background_workers = 8;

-- ----------------------------------------------------------------------------
-- ENUMS
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
-- HYPERTABLES (Time-series tables)
-- ----------------------------------------------------------------------------

-- Content engagement metrics
-- High-frequency time-series data for content performance
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
    signal_strength NUMERIC(3, 2),           -- 0.00-1.00
    algorithm_score NUMERIC(3, 2),

    -- Metadata
    metadata JSONB DEFAULT '{}',

    PRIMARY KEY (time, content_id, platform)
);

-- Convert to hypertable with 1-hour chunks
SELECT create_hypertable('content_metrics', 'time',
    chunk_time_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

-- Platform health metrics
-- Track platform algorithm health and performance
CREATE TABLE platform_health (
    time TIMESTAMPTZ NOT NULL,
    platform TEXT NOT NULL,

    -- Health indicators
    api_response_time_ms INTEGER,
    api_success_rate NUMERIC(5, 4),
    content_reach_rate NUMERIC(5, 4),        -- Reach / Impressions
    avg_engagement_rate NUMERIC(5, 4),
    viral_coefficient NUMERIC(5, 4),

    -- Algorithm signals
    algorithm_stability TEXT,                -- 'stable', 'changing', 'volatile'
    last_algorithm_change TIMESTAMPTZ,
    algorithm_change_impact TEXT,            -- 'positive', 'negative', 'neutral'

    -- Reach trends
    total_reach BIGINT,
    reach_growth_rate NUMERIC(5, 4),

    -- Cost metrics
    cost_per_1000_impressions NUMERIC(10, 2),
    cost_per_engagement NUMERIC(10, 2),

    -- Health score
    health_score NUMERIC(3, 2),              -- 0.00-1.00

    metadata JSONB DEFAULT '{}',

    PRIMARY KEY (time, platform)
);

SELECT create_hypertable('platform_health', 'time',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

-- Trend velocity metrics
-- Track emerging and declining trends
CREATE TABLE trend_metrics (
    time TIMESTAMPTZ NOT NULL,
    trend_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    trend_category TEXT NOT NULL,            -- 'hashtag', 'audio', 'format', etc.

    -- Velocity indicators
    velocity_score NUMERIC(3, 2),            -- 0.00-1.00
    momentum NUMERIC(10, 2),                 -- Rate of change
    acceleration NUMERIC(10, 2),             -- Change in momentum

    -- Adoption metrics
    adoption_rate NUMERIC(5, 4),
    total_adoptions BIGINT,
    new_adoptions BIGINT,

    -- Engagement
    avg_engagement_rate NUMERIC(5, 4),
    total_engagement BIGINT,

    -- Lifecycle
    lifecycle_stage TEXT,                     -- 'emerging', 'growing', 'peak', 'declining'
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

-- Swarm performance metrics
-- Track swarm agent efficiency and performance
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

-- Monetization metrics
-- Track revenue and conversion over time
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
-- CONTINUOUS AGGREGATES (Materialized views)
-- ----------------------------------------------------------------------------

-- Hourly content metrics aggregate
CREATE MATERIALIZED VIEW content_metrics_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    content_id,
    platform,
    SUM(views) AS views,
    SUM(impressions) AS impressions,
    SUM(reach) AS reach,
    SUM(likes) AS likes,
    SUM(comments) AS comments,
    SUM(shares) AS shares,
    SUM(saves) AS saves,
    SUM(clicks) AS clicks,
    AVG(engagement_rate) AS avg_engagement_rate,
    AVG(retention_rate) AS avg_retention_rate,
    AVG(signal_strength) AS avg_signal_strength
FROM content_metrics
WHERE time > NOW() - INTERVAL '7 days'
GROUP BY bucket, content_id, platform;

-- Daily content metrics aggregate
CREATE MATERIALIZED VIEW content_metrics_daily
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS bucket,
    content_id,
    platform,
    SUM(views) AS views,
    SUM(impressions) AS impressions,
    SUM(reach) AS reach,
    SUM(likes) AS likes,
    SUM(comments) AS comments,
    SUM(shares) AS shares,
    SUM(saves) AS saves,
    SUM(clicks) AS clicks,
    AVG(engagement_rate) AS avg_engagement_rate,
    AVG(retention_rate) AS avg_retention_rate,
    MAX(views) - MIN(views) AS view_growth,
    SUM(total_watch_time_seconds) AS total_watch_time
FROM content_metrics
GROUP BY bucket, content_id, platform;

-- Daily platform health aggregate
CREATE MATERIALIZED VIEW platform_health_daily
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS bucket,
    platform,
    AVG(api_response_time_ms) AS avg_api_response_time,
    AVG(api_success_rate) AS avg_api_success_rate,
    AVG(content_reach_rate) AS avg_reach_rate,
    AVG(avg_engagement_rate) AS avg_engagement_rate,
    AVG(viral_coefficient) AS avg_viral_coefficient,
    AVG(health_score) AS avg_health_score,
    SUM(total_reach) AS total_reach,
    AVG(reach_growth_rate) AS avg_reach_growth_rate
FROM platform_health
GROUP BY bucket, platform;

-- Hourly trend velocity aggregate
CREATE MATERIALIZED VIEW trend_velocity_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS bucket,
    trend_id,
    platform,
    trend_category,
    AVG(velocity_score) AS avg_velocity,
    LAST(velocity_score, time) AS current_velocity,
    MAX(velocity_score) AS peak_velocity,
    SUM(new_adoptions) AS new_adoptions,
    AVG(avg_engagement_rate) AS avg_engagement
FROM trend_metrics
WHERE time > NOW() - INTERVAL '7 days'
GROUP BY bucket, trend_id, platform, trend_category;

-- Daily swarm performance aggregate
CREATE MATERIALIZED VIEW swarm_performance_daily
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS bucket,
    swarm_id,
    swarm_role,
    SUM(tasks_completed) AS tasks_completed,
    SUM(tasks_failed) AS tasks_failed,
    AVG(avg_quality_score) AS avg_quality_score,
    SUM(cost_usd) AS total_cost_usd,
    AVG(throughput_per_hour) AS avg_throughput
FROM swarm_metrics
GROUP BY bucket, swarm_id, swarm_role;

-- Daily monetization aggregate
CREATE MATERIALIZED VIEW monetization_daily
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS bucket,
    content_id,
    monetization_type,
    SUM(revenue_usd) AS revenue,
    SUM(conversions) AS conversions,
    SUM(clicks) AS clicks,
    AVG(conversion_rate) AS avg_conversion_rate,
    SUM(cost_usd) AS total_cost,
    SUM(profit_usd) AS total_profit
FROM monetization_metrics
GROUP BY bucket, content_id, monetization_type;

-- ----------------------------------------------------------------------------
-- COMPRESSION POLICIES
-- ----------------------------------------------------------------------------

-- Compress raw metrics older than 7 days
ALTER TABLE content_metrics SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'content_id, platform',
    timescaledb.compress_orderby = 'time DESC'
);

SELECT add_compression_policy('content_metrics',
    INTERVAL '7 days',
    if_not_exists => TRUE
);

ALTER TABLE platform_health SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'platform',
    timescaledb.compress_orderby = 'time DESC'
);

SELECT add_compression_policy('platform_health',
    INTERVAL '30 days',
    if_not_exists => TRUE
);

ALTER TABLE trend_metrics SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'trend_id, platform',
    timescaledb.compress_orderby = 'time DESC'
);

SELECT add_compression_policy('trend_metrics',
    INTERVAL '7 days',
    if_not_exists => TRUE
);

-- ----------------------------------------------------------------------------
-- RETENTION POLICIES
-- ----------------------------------------------------------------------------

-- Drop raw data older than 90 days (keep aggregates)
SELECT add_retention_policy('content_metrics',
    INTERVAL '90 days',
    if_not_exists => TRUE
);

SELECT add_retention_policy('trend_metrics',
    INTERVAL '90 days',
    if_not_exists => TRUE
);

-- Keep platform health for 2 years
SELECT add_retention_policy('platform_health',
    INTERVAL '2 years',
    if_not_exists => TRUE
);

-- Keep swarm metrics for 1 year
SELECT add_retention_policy('swarm_metrics',
    INTERVAL '1 year',
    if_not_exists => TRUE
);

-- Keep monetization data for 7 years
SELECT add_retention_policy('monetization_metrics',
    INTERVAL '7 years',
    if_not_exists => TRUE
);

-- ----------------------------------------------------------------------------
-- RECREATE POLICIES FOR CONTINUOUS AGGREGATES
-- ----------------------------------------------------------------------------

-- Refresh continuous aggregates
SELECT add_continuous_aggregate_policy('content_metrics_hourly',
    start_offset => INTERVAL '3 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

SELECT add_continuous_aggregate_policy('content_metrics_daily',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day',
    if_not_exists => TRUE
);

SELECT add_continuous_aggregate_policy('trend_velocity_hourly',
    start_offset => INTERVAL '3 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '30 minutes',
    if_not_exists => TRUE
);

-- ----------------------------------------------------------------------------
-- INDEXES
-- ----------------------------------------------------------------------------

-- Content metrics indexes
CREATE INDEX idx_content_metrics_content_time
    ON content_metrics(content_id, time DESC);

CREATE INDEX idx_content_metrics_platform_time
    ON content_metrics(platform, time DESC);

CREATE INDEX idx_content_metrics_time
    ON content_metrics(time DESC);

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

CREATE INDEX idx_trend_metrics_platform_time
    ON trend_metrics(platform, time DESC);

-- Swarm metrics indexes
CREATE INDEX idx_swarm_metrics_swarm_time
    ON swarm_metrics(swarm_id, time DESC);

CREATE INDEX idx_swarm_metrics_role_time
    ON swarm_metrics(swarm_role, time DESC);

-- Monetization metrics indexes
CREATE INDEX idx_monetization_metrics_content_time
    ON monetization_metrics(content_id, time DESC);

CREATE INDEX idx_monetization_metrics_type_time
    ON monetization_metrics(monetization_type, time DESC);

-- ----------------------------------------------------------------------------
-- VIEWS
-- ----------------------------------------------------------------------------

-- Real-time performance dashboard
CREATE OR REPLACE VIEW realtime_performance AS
SELECT
    cm.content_id,
    cm.platform,
    cm.views,
    cm.engagement_rate,
    cm.retention_rate,
    cm.signal_strength,
    cm.time as last_update,
    LAG(cm.views) OVER (PARTITION BY cm.content_id ORDER BY cm.time) as prev_views,
    cm.views - LAG(cm.views) OVER (PARTITION BY cm.content_id ORDER BY cm.time) as views_delta
FROM content_metrics cm
WHERE cm.time > NOW() - INTERVAL '1 hour'
ORDER BY cm.content_id, cm.time DESC;

-- Platform health summary
CREATE OR REPLACE VIEW platform_health_summary AS
SELECT
    platform,
    AVG(api_response_time_ms) as avg_response_time,
    AVG(api_success_rate) as avg_success_rate,
    AVG(health_score) as avg_health_score,
    AVG(viral_coefficient) as avg_viral_coefficient,
    COUNT(DISTINCT time) as data_points
FROM platform_health
WHERE time > NOW() - INTERVAL '24 hours'
GROUP BY platform
ORDER BY avg_health_score DESC;

-- Trending topics view
CREATE OR REPLACE VIEW trending_topics AS
SELECT
    trend_id,
    platform,
    trend_category,
    AVG(velocity_score) as avg_velocity,
    LAST(velocity_score, time) as current_velocity,
    SUM(new_adoptions) as total_new_adoptions,
    MAX(lifecycle_stage) as lifecycle_stage
FROM trend_metrics
WHERE time > NOW() - INTERVAL '24 hours'
GROUP BY trend_id, platform, trend_category
HAVING AVG(velocity_score) > 0.5
ORDER BY avg_velocity DESC;

-- Content performance comparison (cross-platform)
CREATE OR REPLACE VIEW cross_platform_comparison AS
WITH content_stats AS (
    SELECT
        content_id,
        platform,
        SUM(views) as total_views,
        AVG(engagement_rate) as avg_engagement,
        AVG(retention_rate) as avg_retention,
        SUM(total_watch_time_seconds) as total_watch_time
    FROM content_metrics
    WHERE time > NOW() - INTERVAL '7 days'
    GROUP BY content_id, platform
)
SELECT
    platform,
    COUNT(*) as content_count,
    AVG(total_views) as avg_views,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_views) as median_views,
    AVG(avg_engagement) as avg_engagement,
    AVG(avg_retention) as avg_retention
FROM content_stats
GROUP BY platform;

-- Swarm efficiency view
CREATE OR REPLACE VIEW swarm_efficiency_summary AS
SELECT
    swarm_role,
    SUM(tasks_completed) as total_completed,
    SUM(tasks_failed) as total_failed,
    AVG(avg_quality_score) as avg_quality,
    AVG(avg_task_duration_seconds) as avg_duration,
    SUM(cost_usd) as total_cost,
    AVG(throughput_per_hour) as avg_throughput
FROM swarm_metrics
WHERE time > NOW() - INTERVAL '7 days'
GROUP BY swarm_role
ORDER BY total_completed DESC;

-- ----------------------------------------------------------------------------
-- SAMPLE DATA
-- ----------------------------------------------------------------------------

-- Insert sample content metrics
INSERT INTO content_metrics (time, content_id, platform, views, impressions, likes, comments, shares, engagement_rate, signal_strength) VALUES
(NOW() - INTERVAL '2 hours', 'content_youtube_parent_001'::uuid, 'youtube', 10000, 50000, 500, 50, 100, 0.065, 0.85),
(NOW() - INTERVAL '1 hour', 'content_tiktok_child_001'::uuid, 'tiktok', 50000, 200000, 5000, 200, 5000, 0.204, 0.92),
(NOW() - INTERVAL '1 hour', 'content_twitter_child_001'::uuid, 'twitter', 25000, 100000, 2000, 80, 150, 0.089, 0.78);

-- Insert sample platform health
INSERT INTO platform_health (time, platform, api_response_time_ms, api_success_rate, avg_engagement_rate, viral_coefficient, health_score) VALUES
(NOW() - INTERVAL '1 hour', 'tiktok', 150, 0.99, 0.15, 2.3, 0.92),
(NOW() - INTERVAL '1 hour', 'instagram', 200, 0.98, 0.12, 1.8, 0.88),
(NOW() - INTERVAL '1 hour', 'youtube', 180, 0.99, 0.08, 1.2, 0.85);

-- Insert sample trend metrics
INSERT INTO trend_metrics (time, trend_id, platform, trend_category, velocity_score, adoption_rate, total_adoptions, viral_potential) VALUES
(NOW() - INTERVAL '30 minutes', 'trend_dance_001', 'tiktok', 'audio', 0.92, 0.15, 50000, 0.88),
(NOW() - INTERVAL '30 minutes', 'trend_hashtag_001', 'twitter', 'hashtag', 0.78, 0.08, 25000, 0.65),
(NOW() - INTERVAL '30 minutes', 'trend_format_001', 'instagram', 'format', 0.65, 0.05, 10000, 0.52);

-- ----------------------------------------------------------------------------
-- USEFUL QUERIES
-- ----------------------------------------------------------------------------

-- Query 1: Get content performance over time
-- SELECT time_bucket('1 hour', time) as bucket,
--        platform,
--        AVG(engagement_rate) as avg_engagement,
--        SUM(views) as total_views
-- FROM content_metrics
-- WHERE content_id = $1 AND time > NOW() - INTERVAL '24 hours'
-- GROUP BY bucket, platform
-- ORDER BY bucket DESC;

-- Query 2: Find high-velocity trends
-- SELECT trend_id, platform, trend_category,
--        AVG(velocity_score) as avg_velocity,
--        MAX(velocity_score) as peak_velocity
-- FROM trend_metrics
-- WHERE time > NOW() - INTERVAL '6 hours'
-- GROUP BY trend_id, platform, trend_category
-- HAVING AVG(velocity_score) > 0.7
-- ORDER BY avg_velocity DESC;

-- Query 3: Platform health monitoring
-- SELECT platform,
--        AVG(api_response_time_ms) as avg_response_time,
--        AVG(api_success_rate) as success_rate,
--        AVG(health_score) as health_score
-- FROM platform_health
-- WHERE time > NOW() - INTERVAL '1 hour'
-- GROUP BY platform
-- ORDER BY health_score DESC;

-- Query 4: Compare swarm performance
-- SELECT swarm_role,
--        SUM(tasks_completed) as completed,
--        SUM(tasks_failed) as failed,
--        AVG(avg_quality_score) as quality,
--        SUM(cost_usd) as cost
-- FROM swarm_metrics
-- WHERE time > NOW() - INTERVAL '24 hours'
-- GROUP BY swarm_role
-- ORDER BY completed DESC;

-- Query 5: Time-series comparison (content A vs content B)
-- WITH metrics_a AS (
--     SELECT time_bucket('1 hour', time) as bucket, SUM(views) as views
--     FROM content_metrics
--     WHERE content_id = $1 AND time > NOW() - INTERVAL '24 hours'
--     GROUP BY bucket
-- ),
-- metrics_b AS (
--     SELECT time_bucket('1 hour', time) as bucket, SUM(views) as views
--     FROM content_metrics
--     WHERE content_id = $2 AND time > NOW() - INTERVAL '24 hours'
--     GROUP BY bucket
-- )
-- SELECT COALESCE(a.bucket, b.bucket) as time,
--        COALESCE(a.views, 0) as content_a_views,
--        COALESCE(b.views, 0) as content_b_views
-- FROM metrics_a a FULL OUTER JOIN metrics_b b ON a.bucket = b.bucket
-- ORDER BY time;

-- ----------------------------------------------------------------------------
-- END OF SCHEMA
-- ----------------------------------------------------------------------------
