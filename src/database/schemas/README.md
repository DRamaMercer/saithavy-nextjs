# Swarm Agency Database Schemas

This directory contains comprehensive database schemas for the Swarm Agency Social Media Management System.

## Database Architecture

The system uses a polyglot persistence architecture with three specialized databases:

### 1. Knowledge Graph Database (Neo4j)
**Purpose:** Content relationships, entity tracking, lineage management

**Key Features:**
- Content DNA tracking with parent-child relationships
- Entity extraction and relationship mapping
- Psychological framework and emotion tracking
- A/B test relationship management
- Atomization lineage with full provenance

**File:** `knowledge-graph-schema.cypher`

### 2. Content Tracking Database (PostgreSQL)
**Purpose:** Content inventory, metadata, performance tracking

**Key Features:**
- Centralized content inventory
- Platform-specific metadata storage
- Performance metrics and analytics
- Swarm attribution and workflow tracking
- Tool integration records
- Monetization tracking

**File:** `content-tracking-schema.sql`

### 3. Analytics Database (TimescaleDB)
**Purpose:** Time-series data, performance metrics, trend analysis

**Key Features:**
- High-frequency performance metrics
- Engagement time-series data
- Platform health scoring
- Trend velocity tracking
- Real-time analytics

**File:** `analytics-schema.sql`

## Schema Files

| File | Description | Database |
|------|-------------|----------|
| `knowledge-graph-schema.cypher` | Neo4j graph schema | Neo4j |
| `content-tracking-schema.sql` | PostgreSQL relational schema | PostgreSQL |
| `analytics-schema.sql` | TimescaleDB time-series schema | TimescaleDB |
| `migrations/` | Database migration scripts | All |
| `queries/` | Sample queries for common operations | All |

## Entity-Relationship Diagrams

See individual schema files for detailed ER diagrams in Mermaid format.

## Quick Start

### Neo4j Knowledge Graph

```bash
# Start Neo4j
docker-compose up -d neo4j

# Load schema
cypher-shell -u neo4j -p password < knowledge-graph-schema.cypher
```

### PostgreSQL Content Tracking

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Load schema
psql -U postgres -d swarm_content < content-tracking-schema.sql
```

### TimescaleDB Analytics

```bash
# Start TimescaleDB
docker-compose up -d timescaledb

# Load schema
psql -U postgres -d swarm_analytics < analytics-schema.sql
```

## Migration Strategy

See `migrations/README.md` for detailed migration procedures.

## Performance Optimization

### Neo4j Indexes
- Full-text search indexes on content nodes
- Relationship indexes for fast traversal
- Vector indexes for semantic similarity

### PostgreSQL Indexes
- Composite indexes on frequently filtered columns
- Partial indexes for status-based queries
- BRIN indexes for time-series data

### TimescaleDB Hypertables
- Automatic partitioning by time
- Compression policies for old data
- Continuous aggregates for pre-computed metrics

## Query Examples

See `queries/` directory for:
- Content lineage queries
- Performance analytics queries
- Relationship traversal queries
- Attribution modeling queries

## Data Retention

| Database | Retention Policy | Compression |
|----------|------------------|-------------|
| Neo4j | Indefinite | N/A |
| PostgreSQL | 7 years | pg_squeeze |
| TimescaleDB | 90 days raw, 2 years aggregated | Native compression |

## Backup Strategy

```bash
# Neo4j backup
neo4j-admin backup --backup-dir=/backups/neo4j

# PostgreSQL backup
pg_dump -U postgres swarm_content > backups/content_tracking.sql

# TimescaleDB backup
pg_dump -U postgres swarm_analytics > backups/analytics.sql
```

## Monitoring

- **Neo4j:** Query monitoring, memory usage, cache hit ratios
- **PostgreSQL:** Query performance, lock contention, bloat
- **TimescaleDB:** Chunk size, compression ratio, query latency

## Security

- All databases use TLS encryption
- Row-level security for multi-tenancy
- Audit logging for all DDL/DML operations
- Regular vulnerability scanning

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-14 | Initial schema design |
