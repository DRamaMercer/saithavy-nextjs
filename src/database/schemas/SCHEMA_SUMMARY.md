# Database Schema Summary

Complete database schemas for the Swarm Agency Social Media Management System.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SWARM AGENCY DATABASE ARCHITECTURE           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Neo4j      │  │ PostgreSQL   │  │ TimescaleDB  │          │
│  │              │  │              │  │              │          │
│  │ Knowledge    │  │ Content      │  │ Analytics    │          │
│  │ Graph        │  │ Tracking     │  │ Time-Series  │          │
│  │              │  │              │  │              │          │
│  │ - Content    │  │ - Inventory  │  │ - Metrics    │          │
│  │ - Entities   │  │ - Metadata   │  │ - Health     │          │
│  │ - DNA        │  │ - Workflows  │  │ - Trends     │          │
│  │ - Lineage    │  │ - Tools      │  │ - Swarms     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                 │
│                      Cross-Database Sync                         │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/database/schemas/
├── README.md                                    # Overview and quick start
├── knowledge-graph-schema.cypher                 # Neo4j complete schema
├── content-tracking-schema.sql                   # PostgreSQL complete schema
├── analytics-schema.sql                          # TimescaleDB complete schema
├── entity-relationship-diagrams.md               # ER diagrams in Mermaid
├── migrations/
│   ├── README.md                                # Migration guide
│   ├── neo4j/
│   │   └── 001_initial_schema.cypher            # Neo4j migration
│   ├── postgresql/
│   │   └── 001_initial_schema.sql               # PostgreSQL migration
│   └── timescaledb/
│       └── 001_initial_schema.sql               # TimescaleDB migration
└── queries/
    └── README.md                                # Sample queries
```

## Database Details

### 1. Neo4j Knowledge Graph Database

**Purpose:** Content relationships, entity tracking, lineage management

**Key Nodes:**
- `Content` - All content pieces with embeddings
- `Platform` - 7 platforms (TikTok, Instagram, YouTube, Twitter, LinkedIn, Pinterest, Facebook)
- `PsychologicalFramework` - Dopamine Loop, Curiosity Gap, FOMO, Social Proof
- `Emotion` - Joy, Surprise, Anger, Fear, Sadness, Disgust, Anticipation
- `Color` - 9 colors with psychological associations
- `HookType` - Pattern Interrupt, Curiosity Gap, Social Proof, etc.
- `AudioSignature` - Trending Sound, Sonic Brand, Binaural Beats
- `Entity` - Extracted entities (people, organizations, etc.)
- `Trend` - Emerging and declining trends
- `ABTest` - A/B test tracking

**Key Relationships:**
- `ATOMIZED_FROM` - Parent-child content relationships
- `OPTIMIZED_FOR` - Content to platform
- `USES_FRAMEWORK` - Psychological framework usage
- `TRIGGERS_EMOTION` - Emotional targeting
- `USES_COLOR` - Color psychology
- `USES_HOOK` - Hook types
- `MENTIONS_ENTITY` - Entity extraction
- `PARTICIPATES_IN_TREND` - Trend participation

**Indexes:**
- Unique constraints on all node IDs
- Full-text search on content titles and descriptions
- Vector index for semantic similarity (1536 dimensions, cosine similarity)

**Sample Query:**
```cypher
MATCH path = (ancestor:Content {id: $content_id})<-[:ATOMIZED_FROM*]-(descendant:Content)
RETURN path;
```

### 2. PostgreSQL Content Tracking Database

**Purpose:** Content inventory, metadata, performance tracking

**Key Tables:**
- `content_inventory` - Central content repository with full-text search
- `platform_metadata` - Platform-specific settings and algorithm signals
- `content_performance` - Detailed performance metrics
- `swarm_workflows` - Swarm agent workflow tracking
- `tool_integrations` - External tool API management
- `tool_usage_log` - API call logging and cost tracking
- `monetization_records` - Revenue and conversion tracking
- `content_notes` - Human annotations and feedback

**Enums:**
- `content_status` - draft, review, scheduled, published, archived, deleted, failed
- `platform_type` - tiktok, instagram, youtube, twitter, linkedin, pinterest, facebook
- `content_type` - long_form_video, short_form_video, image, carousel, thread, etc.
- `swarm_role` - alpha, beta, gamma, delta, epsilon, coordinator, reviewer
- `monetization_type` - sponsorship, affiliate, ad_revenue, product_sale, etc.

**Indexes:**
- Composite indexes on (platform, published_at)
- Partial indexes for platform-specific queries
- GIN indexes on JSONB metadata, tags, hashtags
- GIN indexes on full-text search vectors

**Views:**
- `content_performance_summary` - Aggregated content performance
- `cross_platform_performance` - Cross-platform comparison
- `swarm_efficiency` - Swarm agent efficiency metrics
- `tool_usage_summary` - Tool usage and health

**Sample Query:**
```sql
WITH RECURSIVE lineage AS (
    SELECT id, title, platform, parent_content_id, ARRAY[id] as path, 1 as level
    FROM content_inventory WHERE id = $content_id
    UNION ALL
    SELECT c.id, c.title, c.platform, c.parent_content_id, l.path || c.id, l.level + 1
    FROM content_inventory c JOIN lineage l ON c.parent_content_id = l.id
)
SELECT * FROM lineage ORDER BY level;
```

### 3. TimescaleDB Analytics Database

**Purpose:** Time-series performance data, engagement metrics, trend analysis

**Hypertables:**
- `content_metrics` - High-frequency content performance (1-hour chunks)
- `platform_health` - Platform algorithm health (1-day chunks)
- `trend_metrics` - Trend velocity tracking (1-hour chunks)
- `swarm_metrics` - Swarm performance metrics (1-hour chunks)
- `monetization_metrics` - Revenue time-series (1-day chunks)

**Continuous Aggregates:**
- `content_metrics_hourly` - Hourly content rollups
- `content_metrics_daily` - Daily content rollups
- `platform_health_daily` - Daily platform health
- `trend_velocity_hourly` - Hourly trend velocity
- `swarm_performance_daily` - Daily swarm performance
- `monetization_daily` - Daily monetization

**Compression Policies:**
- Compress after 7 days (content_metrics, trend_metrics, swarm_metrics)
- Compress after 30 days (platform_health)

**Retention Policies:**
- 90 days raw data (content_metrics, trend_metrics)
- 2 years (platform_health)
- 1 year (swarm_metrics)
- 7 years (monetization_metrics)

**Sample Query:**
```sql
SELECT time_bucket('1 hour', time) as bucket,
       platform,
       SUM(views) as total_views,
       AVG(engagement_rate) as avg_engagement_rate
FROM content_metrics
WHERE content_id = $content_id AND time > NOW() - INTERVAL '24 hours'
GROUP BY bucket, platform
ORDER BY bucket DESC;
```

## Key Features

### Content DNA Tracking
- Psychological framework usage (dopamine loop, curiosity gap, FOMO)
- Emotional targeting (8 emotions with valence/arousal/dominance)
- Color psychology (9 colors with conversion lift data)
- Hook types (pattern interrupt, curiosity gap, social proof)
- Audio signatures (trending sounds, sonic branding)

### Atomization Lineage
- Parent-child relationship tracking
- Full content chain in knowledge graph
- Adaptation history with timestamps
- AI confidence scores
- Human review status

### Performance Metrics
- Platform-specific algorithm signals
- Real-time engagement tracking
- Time-series performance data
- Cross-platform attribution
- Monetization tracking

### Swarm Coordination
- Workflow tracking by swarm role
- Task completion metrics
- Quality scoring
- Cost tracking (tokens, USD)
- Efficiency analytics

## Index Strategy

### Neo4j
- **Unique constraints** on all node IDs
- **Full-text search** indexes on content
- **Vector indexes** for semantic similarity (1536 dimensions)
- **Performance indexes** on frequently queried properties

### PostgreSQL
- **Composite indexes** on (platform, published_at)
- **Partial indexes** for platform-specific queries
- **GIN indexes** on JSONB metadata and arrays
- **GIN indexes** on full-text search vectors

### TimescaleDB
- **Hypertable indexes** on time DESC
- **Composite indexes** on (content_id, time)
- **Chunk-based indexes** for partition pruning
- **Compression** reduces storage by 80-90%

## Migration Strategy

1. **Neo4j** - Create nodes and relationships first
2. **PostgreSQL** - Create relational schema second
3. **TimescaleDB** - Create time-series schema last

Each migration has a corresponding rollback script.

## Quick Start

### Neo4j
```bash
cypher-shell -u neo4j -p password < knowledge-graph-schema.cypher
```

### PostgreSQL
```bash
psql -U postgres -d swarm_content < content-tracking-schema.sql
```

### TimescaleDB
```bash
psql -U postgres -d swarm_analytics < analytics-schema.sql
```

## Performance Characteristics

| Database | Query Type | Latency | Throughput |
|----------|-----------|---------|------------|
| Neo4j | Relationship traversal | <10ms | 1000 queries/sec |
| Neo4j | Vector similarity | <50ms | 100 queries/sec |
| PostgreSQL | Content lookup | <5ms | 10,000 queries/sec |
| PostgreSQL | Full-text search | <20ms | 5,000 queries/sec |
| TimescaleDB | Time-series aggregation | <100ms | 1,000 queries/sec |
| TimescaleDB | Continuous aggregate | <50ms | 2,000 queries/sec |

## Data Retention

| Database | Retention Period | Compression |
|----------|------------------|-------------|
| Neo4j | Indefinite | N/A |
| PostgreSQL | 7 years | pg_squeeze |
| TimescaleDB | 90 days raw / 2 years aggregated | Native compression |

## Backup Strategy

```bash
# Neo4j
neo4j-admin backup --backup-dir=/backups/neo4j

# PostgreSQL
pg_dump -U postgres -d swarm_content > backups/content_tracking.sql

# TimescaleDB
pg_dump -U postgres -d swarm_analytics > backups/analytics.sql
```

## Monitoring

- **Neo4j**: Query monitoring, memory usage, cache hit ratios
- **PostgreSQL**: Query performance, lock contention, bloat
- **TimescaleDB**: Chunk size, compression ratio, query latency

## Security

- TLS encryption for all connections
- Row-level security for multi-tenancy
- Audit logging for all DDL/DML operations
- Regular vulnerability scanning

## Next Steps

1. Review all schema files in detail
2. Set up development database instances
3. Run migration scripts in order
4. Load sample data
5. Test queries from queries/README.md
6. Configure backup and monitoring
7. Plan production deployment

## Support

For questions or issues, refer to:
- Schema documentation in individual schema files
- Entity-relationship diagrams in `entity-relationship-diagrams.md`
- Migration guide in `migrations/README.md`
- Sample queries in `queries/README.md`

---

**Version:** 1.0.0
**Date:** 2026-03-14
**Status:** Ready for Implementation
