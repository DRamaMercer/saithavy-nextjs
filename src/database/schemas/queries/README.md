# Sample Queries for Common Operations

This directory contains sample queries for common operations across all three databases.

## Table of Contents
1. [Neo4j Knowledge Graph Queries](#neo4j-queries)
2. [PostgreSQL Content Tracking Queries](#postgresql-queries)
3. [TimescaleDB Analytics Queries](#timescaledb-queries)
4. [Cross-Database Queries](#cross-database-queries)

---

## Neo4j Queries

### Content Lineage Tracking

**Get full atomization chain for a content piece:**
```cypher
MATCH path = (ancestor:Content {id: $content_id})<-[:ATOMIZED_FROM*]-(descendant:Content)
RETURN ancestor.title as parent_title,
       collect({
         title: descendant.title,
         platform: descendant.platform,
         adaptation_type: [(descendant)-[r:ATOMIZED_FROM]->(a) WHERE a.id = $content_id | r.adaptation_type][0]
       }) as adaptations
ORDER BY descendant.created_at;
```

**Find all parent content that hasn't been atomized yet:**
```cypher
MATCH (parent:Content)
WHERE NOT (parent)<-[:ATOMIZED_FROM]-(:Content)
  AND parent.platform = 'youtube'
  AND parent.status = 'published'
  AND parent.published_at > datetime() - duration('P30D')
RETURN parent.title, parent.published_at, parent.views
ORDER BY parent.published_at DESC;
```

### Content DNA Analysis

**Find content using specific psychological frameworks:**
```cypher
MATCH (content:Content)-[:USES_FRAMEWORK]->(framework:PsychologicalFramework {name: $framework_name})
WHERE content.status = 'published'
  AND content.published_at > datetime() - duration('P7D')
RETURN content.title, content.platform, content.metadata.engagement_rate
ORDER BY content.metadata.engagement_rate DESC
LIMIT 20;
```

**Analyze emotional targeting by platform:**
```cypher
MATCH (content:Content)-[:TRIGGERS_EMOTION]->(emotion:Emotion)
WHERE content.platform = $platform
  AND content.published_at > datetime() - duration('P30D')
RETURN emotion.name, emotion.valence, emotion.arousal,
       count(content) as content_count,
       avg(content.metadata.engagement_rate) as avg_engagement
ORDER BY avg_engagement DESC;
```

**Find high-performing color combinations:**
```cypher
MATCH (content:Content)-[:USES_COLOR]->(color:Color)
WHERE content.metadata.engagement_rate > 0.10
  AND content.published_at > datetime() - duration('P30D')
WITH color, collect(content.metadata.engagement_rate) as engagement_rates
RETURN color.name, color.hex,
       size(engagement_rates) as content_count,
       avg(engagement_rates) as avg_engagement,
       percentileCont(engagement_rates, 0.5) as median_engagement
ORDER BY avg_engagement DESC;
```

### Semantic Similarity Search

**Find similar content using vector embeddings (Neo4j 5.x+):**
```cypher
CALL db.index.vector.queryNodes('content_embeddings', 10, $query_embedding)
YIELD node, score
RETURN node.title, node.platform, node.description, score
WHERE node.status = 'published'
  AND node.published_at > datetime() - duration('P90D')
ORDER BY score DESC;
```

### Trend Analysis

**Find trending content with high velocity:**
```cypher
MATCH (content:Content)-[:PARTICIPATES_IN_TREND]->(trend:Trend)
WHERE trend.velocity_score > 0.7
  AND trend.peak_predicted > datetime()
  AND trend.expires_at > datetime()
RETURN content.title, content.platform, trend.name, trend.velocity_score
ORDER BY trend.velocity_score DESC, content.published_at DESC;
```

### A/B Test Analysis

**Get A/B test results:**
```cypher
MATCH (test:ABTest {id: $test_id})<-[:TEST_VARIANT_OF]-(content:Content)
RETURN test.name, content.title,
       content.metadata.engagement_rate,
       content.metadata.views,
       content.id = test.winner_id as is_winner
ORDER BY content.metadata.engagement_rate DESC;
```

---

## PostgreSQL Queries

### Content Inventory Queries

**Get content atomization lineage with CTE:**
```sql
WITH RECURSIVE lineage AS (
    -- Base case: parent content
    SELECT
        id,
        title,
        platform,
        parent_content_id,
        ARRAY[id] as path,
        1 as level
    FROM content_inventory
    WHERE id = $content_id

    UNION ALL

    -- Recursive case: child content
    SELECT
        c.id,
        c.title,
        c.platform,
        c.parent_content_id,
        l.path || c.id,
        l.level + 1
    FROM content_inventory c
    JOIN lineage l ON c.parent_content_id = l.id
)
SELECT
    l.id,
    l.title,
    l.platform,
    l.level,
    l.path,
    ci.views,
    ci.engagement_rate
FROM lineage l
JOIN content_inventory ci ON ci.id = l.id
ORDER BY l.level;
```

**Find content needing review:**
```sql
SELECT
    ci.id,
    ci.title,
    ci.platform,
    ci.status,
    ci.created_at,
    ci.atomization_chain
FROM content_inventory ci
WHERE ci.status = 'review'
   OR (ci.status = 'draft' AND ci.created_at < NOW() - INTERVAL '24 hours')
ORDER BY ci.created_at;
```

**Full-text search for content:**
```sql
SELECT
    ci.id,
    ci.title,
    ci.platform,
    ci.content_type,
    ci.views,
    ci.engagement_rate,
    ts_rank(ci.search_vector, query) as rank
FROM content_inventory,
     to_tsquery('english', $search_query) query
WHERE ci.search_vector @@ query
  AND ci.status = 'published'
  AND ci.deleted_at IS NULL
ORDER BY rank DESC
LIMIT 20;
```

### Performance Analytics

**Cross-platform performance comparison:**
```sql
SELECT
    parent.platform as parent_platform,
    child.platform as child_platform,
    COUNT(child.id) as adaptation_count,
    AVG(child.views) as avg_views,
    AVG(child.engagement_rate) as avg_engagement,
    MAX(child.views) as max_views,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY child.views) as median_views
FROM content_inventory parent
JOIN content_inventory child ON child.parent_content_id = parent.id
WHERE parent.status = 'published'
  AND child.status = 'published'
  AND child.published_at > NOW() - INTERVAL '30 days'
GROUP BY parent.platform, child.platform
ORDER BY avg_engagement DESC;
```

**Top-performing content by platform and type:**
```sql
SELECT
    platform,
    content_type,
    COUNT(*) as content_count,
    AVG(engagement_rate) as avg_engagement_rate,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY views) as median_views,
    PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY views) as p90_views
FROM content_inventory
WHERE status = 'published'
  AND published_at > NOW() - INTERVAL '30 days'
GROUP BY platform, content_type
ORDER BY avg_engagement_rate DESC;
```

### Swarm Efficiency

**Swarm performance summary:**
```sql
SELECT
    primary_swarm,
    workflow_type,
    COUNT(*) as total_workflows,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_workflows,
    AVG(actual_duration_seconds) FILTER (WHERE actual_duration_seconds IS NOT NULL) as avg_duration_seconds,
    AVG(quality_score) FILTER (WHERE quality_score IS NOT NULL) as avg_quality_score,
    SUM(cost_usd) FILTER (WHERE cost_usd IS NOT NULL) as total_cost_usd
FROM swarm_workflows
WHERE started_at > NOW() - INTERVAL '7 days'
GROUP BY primary_swarm, workflow_type
ORDER BY completed_workflows DESC;
```

### Tool Usage Monitoring

**Tool health and performance:**
```sql
SELECT
    ti.tool_name,
    ti.tool_type,
    ti.health_status,
    ti.is_active,
    COUNT(tul.id) as calls_last_24h,
    AVG(tul.response_time_ms) as avg_response_time_ms,
    SUM(tul.api_cost_usd) as total_cost_usd,
    COUNT(*) FILTER (WHERE tul.response_status >= 400) as error_count,
    MAX(tul.requested_at) as last_call
FROM tool_integrations ti
LEFT JOIN tool_usage_log tul
    ON tul.tool_integration_id = ti.id
    AND tul.requested_at > NOW() - INTERVAL '24 hours'
WHERE ti.is_active = TRUE
GROUP BY ti.id, ti.tool_name, ti.tool_type, ti.health_status, ti.is_active
ORDER BY avg_response_time_ms DESC NULLS LAST;
```

### Monetization Tracking

**Revenue by content and monetization type:**
```sql
SELECT
    ci.title,
    ci.platform,
    mr.monetization_type,
    SUM(mr.revenue_usd) as total_revenue,
    SUM(mr.conversion_count) as total_conversions,
    AVG(mr.conversion_count) as avg_conversions_per_period,
    SUM(mr.click_count) as total_clicks,
    CASE
        WHEN SUM(mr.click_count) > 0
        THEN SUM(mr.revenue_usd) / SUM(mr.click_count)
        ELSE 0
    END as revenue_per_click
FROM content_inventory ci
JOIN monetization_records mr ON mr.content_id = ci.id
WHERE ci.status = 'published'
  AND mr.recorded_at > NOW() - INTERVAL '30 days'
GROUP BY ci.id, ci.title, ci.platform, mr.monetization_type
ORDER BY total_revenue DESC NULLS LAST;
```

---

## TimescaleDB Queries

### Time-Series Performance

**Content performance over time with time_bucket:**
```sql
SELECT
    time_bucket('1 hour', time) as bucket,
    platform,
    SUM(views) as total_views,
    SUM(impressions) as total_impressions,
    AVG(engagement_rate) as avg_engagement_rate,
    SUM(shares) as total_shares
FROM content_metrics
WHERE content_id = $content_id
  AND time > NOW() - INTERVAL '24 hours'
GROUP BY bucket, platform
ORDER BY bucket DESC;
```

**Real-time engagement spike detection:**
```sql
WITH hourly_metrics AS (
    SELECT
        time_bucket('1 hour', time) as hour,
        content_id,
        AVG(engagement_rate) as avg_engagement
    FROM content_metrics
    WHERE time > NOW() - INTERVAL '24 hours'
    GROUP BY hour, content_id
),
baseline AS (
    SELECT
        content_id,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY avg_engagement) as baseline_engagement
    FROM hourly_metrics
    GROUP BY content_id
)
SELECT
    hm.content_id,
    hm.hour,
    hm.avg_engagement,
    b.baseline_engagement,
    (hm.avg_engagement - b.baseline_engagement) / b.baseline_engagement as engagement_spike
FROM hourly_metrics hm
JOIN baseline b ON b.content_id = hm.content_id
WHERE (hm.avg_engagement - b.baseline_engagement) / b.baseline_engagement > 0.5
ORDER BY engagement_spike DESC;
```

### Platform Health Monitoring

**Platform health dashboard:**
```sql
SELECT
    platform,
    AVG(api_response_time_ms) as avg_response_time,
    AVG(api_success_rate) as avg_success_rate,
    AVG(health_score) as avg_health_score,
    AVG(avg_engagement_rate) as avg_engagement_rate,
    AVG(viral_coefficient) as avg_viral_coefficient,
    SUM(total_reach) as total_reach
FROM platform_health
WHERE time > NOW() - INTERVAL '24 hours'
GROUP BY platform
ORDER BY avg_health_score DESC;
```

**Algorithm change detection:**
```sql
SELECT
    platform,
    time_bucket('1 day', time) as day,
    AVG(avg_engagement_rate) as avg_engagement,
    AVG(viral_coefficient) as avg_viral_coefficient,
    algorithm_stability,
    algorithm_change_impact
FROM platform_health
WHERE time > NOW() - INTERVAL '30 days'
GROUP BY day, platform, algorithm_stability, algorithm_change_impact
HAVing AVG(avg_engagement_rate) < LAG(AVG(avg_engagement_rate)) OVER (PARTITION BY platform ORDER BY day) * 0.8
ORDER BY platform, day DESC;
```

### Trend Velocity Tracking

**High-velocity trend detection:**
```sql
SELECT
    trend_id,
    platform,
    trend_category,
    AVG(velocity_score) as avg_velocity,
    LAST(velocity_score, time) as current_velocity,
    MAX(velocity_score) as peak_velocity,
    SUM(new_adoptions) as total_new_adoptions,
    AVG(avg_engagement_rate) as avg_engagement,
    lifecycle_stage,
    peak_predicted_at
FROM trend_metrics
WHERE time > NOW() - INTERVAL '6 hours'
GROUP BY trend_id, platform, trend_category, lifecycle_stage, peak_predicted_at
HAVING AVG(velocity_score) > 0.7
ORDER BY avg_velocity DESC;
```

**Trend lifecycle analysis:**
```sql
WITH trend_lifecycle AS (
    SELECT
        trend_id,
        platform,
        time_bucket('1 hour', time) as hour,
        AVG(velocity_score) as velocity,
        FIRST_VALUE(velocity_score) OVER (PARTITION BY trend_id ORDER BY time) as initial_velocity,
        LAST_VALUE(velocity_score) OVER (PARTITION BY trend_id ORDER BY time) as final_velocity
    FROM trend_metrics
    WHERE time > NOW() - INTERVAL '7 days'
    GROUP BY hour, trend_id, platform, time
)
SELECT
    trend_id,
    platform,
    CASE
        WHEN final_velocity > initial_velocity * 1.5 THEN 'growing'
        WHEN final_velocity < initial_velocity * 0.5 THEN 'declining'
        WHEN ABS(final_velocity - initial_velocity) / initial_velocity < 0.2 THEN 'stable'
        ELSE 'volatile'
    END as lifecycle_direction,
    initial_velocity,
    final_velocity,
    (final_velocity - initial_velocity) / initial_velocity as velocity_change_pct
FROM (
    SELECT DISTINCT
        trend_id,
        platform,
        initial_velocity,
        final_velocity
    FROM trend_lifecycle
) sub
ORDER BY velocity_change_pct DESC;
```

### Swarm Performance

**Swarm efficiency comparison:**
```sql
SELECT
    swarm_role,
    task_type,
    SUM(tasks_completed) as total_completed,
    SUM(tasks_failed) as total_failed,
    AVG(avg_quality_score) as avg_quality_score,
    AVG(avg_task_duration_seconds) as avg_duration_seconds,
    SUM(cost_usd) as total_cost_usd,
    AVG(throughput_per_hour) as avg_throughput
FROM swarm_metrics
WHERE time > NOW() - INTERVAL '7 days'
GROUP BY swarm_role, task_type
ORDER BY total_completed DESC;
```

---

## Cross-Database Queries

### Content Performance Report

**Combine data from all three databases for comprehensive content analysis:**

```sql
-- Step 1: Get content lineage from PostgreSQL
WITH lineage AS (
    SELECT
        parent.id as parent_id,
        parent.title as parent_title,
        child.id as child_id,
        child.title as child_title,
        child.platform,
        child.views,
        child.engagement_rate
    FROM content_inventory parent
    JOIN content_inventory child ON child.parent_content_id = parent.id
    WHERE parent.id = $parent_content_id
)

-- Step 2: Join with TimescaleDB metrics
SELECT
    l.*,
    cm.total_views as time_series_views,
    cm.total_shares,
    cm.avg_engagement_rate as time_series_engagement
FROM lineage l
LEFT JOIN LATERAL (
    SELECT
        SUM(views) as total_views,
        SUM(shares) as total_shares,
        AVG(engagement_rate) as avg_engagement_rate
    FROM content_metrics
    WHERE content_id = l.child_id
      AND time > NOW() - INTERVAL '7 days'
) cm ON true;
```

Then use Neo4j to get content DNA:

```cypher
MATCH (content:Content {id: $content_id})
OPTIONAL MATCH (content)-[:USES_FRAMEWORK]->(framework:PsychologicalFramework)
OPTIONAL MATCH (content)-[:TRIGGERS_EMOTION]->(emotion:Emotion)
OPTIONAL MATCH (content)-[:USES_COLOR]->(color:Color)
OPTIONAL MATCH (content)-[:USES_HOOK]->(hook:HookType)
RETURN content.title,
       collect(DISTINCT framework.name) as frameworks,
       collect(DISTINCT emotion.name) as emotions,
       collect(DISTINCT color.name) as colors,
       collect(DISTINCT hook.name) as hooks;
```

---

## Performance Tips

1. **Use CTEs** for complex queries - they're easier to read and optimize
2. **Index appropriately** - see schema files for index recommendations
3. **Use time_bucket** for TimescaleDB time-series queries
4. **Use full-text search** for content discovery in PostgreSQL
5. **Use vector similarity** for semantic search in Neo4j
6. **Batch queries** when fetching large datasets
7. **Use materialized views** for frequently accessed aggregations

---

**Last Updated:** 2026-03-14
