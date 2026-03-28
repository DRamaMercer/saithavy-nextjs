# Database Migration Scripts

This directory contains migration scripts for all three databases in the Swarm Agency system.

## Migration Strategy

### Migration Order
1. **Neo4j Knowledge Graph** - Create nodes and relationships first
2. **PostgreSQL Content Tracking** - Create relational schema second
3. **TimescaleDB Analytics** - Create time-series schema last

### Rollback Strategy
Each migration has a corresponding rollback script in the `rollback/` subdirectory.

---

## Migration Files

### Knowledge Graph Migrations

| Migration | Description | Date |
|-----------|-------------|------|
| `001_initial_schema.cypher` | Initial Neo4j schema with nodes and relationships | 2026-03-14 |
| `002_add_color_psychology.cypher` | Add color psychology nodes and relationships | Future |
| `003_add_audio_signatures.cypher` | Add audio signature tracking | Future |

### PostgreSQL Migrations

| Migration | Description | Date |
|-----------|-------------|------|
| `001_initial_schema.sql` | Initial PostgreSQL schema with core tables | 2026-03-14 |
| `002_add_indexes.sql` | Add performance indexes | 2026-03-14 |
| `003_add_triggers.sql` | Add engagement rate calculation triggers | 2026-03-14 |
| `004_add_views.sql` | Add materialized views for analytics | 2026-03-14 |

### TimescaleDB Migrations

| Migration | Description | Date |
|-----------|-------------|------|
| `001_initial_schema.sql` | Initial TimescaleDB schema with hypertables | 2026-03-14 |
| `002_continuous_aggregates.sql` | Add continuous aggregates | 2026-03-14 |
| `003_compression_policies.sql` | Add compression and retention policies | 2026-03-14 |

---

## Running Migrations

### Neo4j Migrations

```bash
# Run all migrations
for file in migrations/neo4j/*.cypher; do
    cypher-shell -u neo4j -p password < "$file"
done

# Run specific migration
cypher-shell -u neo4j -p password < migrations/neo4j/001_initial_schema.cypher

# Rollback migration
cypher-shell -u neo4j -p password < migrations/neo4j/rollback/001_initial_schema.cypher
```

### PostgreSQL Migrations

```bash
# Run all migrations
for file in migrations/postgresql/*.sql; do
    psql -U postgres -d swarm_content < "$file"
done

# Run specific migration
psql -U postgres -d swarm_content < migrations/postgresql/001_initial_schema.sql

# Rollback migration
psql -U postgres -d swarm_content < migrations/postgresql/rollback/001_initial_schema.sql
```

### TimescaleDB Migrations

```bash
# Run all migrations
for file in migrations/timescaledb/*.sql; do
    psql -U postgres -d swarm_analytics < "$file"
done

# Run specific migration
psql -U postgres -d swarm_analytics < migrations/timescaledb/001_initial_schema.sql

# Rollback migration
psql -U postgres -d swarm_analytics < migrations/timescaledb/rollback/001_initial_schema.sql
```

---

## Migration Best Practices

1. **Always test migrations** in a development environment first
2. **Create backups** before running migrations
3. **Use transactions** for multi-step migrations
4. **Document breaking changes** in migration files
5. **Version control** all migration scripts
6. **Create rollback scripts** for every migration

---

## Backup Before Migration

```bash
# Neo4j backup
neo4j-admin backup --backup-dir=/backups/neo4j --from=neo4j://localhost:7687

# PostgreSQL backup
pg_dump -U postgres -d swarm_content > backups/swarm_content_$(date +%Y%m%d).sql

# TimescaleDB backup
pg_dump -U postgres -d swarm_analytics > backups/swarm_analytics_$(date +%Y%m%d).sql
```

---

## Validation After Migration

```bash
# Neo4j validation
cypher-shell "MATCH (n) RETURN count(n) as node_count"

# PostgreSQL validation
psql -U postgres -d swarm_content -c "\dt"  # List tables
psql -U postgres -d swarm_content -c "SELECT COUNT(*) FROM content_inventory"

# TimescaleDB validation
psql -U postgres -d swarm_analytics -c "\dt"  # List tables
psql -U postgres -d swarm_analytics -c "SELECT COUNT(*) FROM content_metrics"
```

---

## Automated Migration Runner

For automated migrations, use this bash script:

```bash
#!/bin/bash
# migrate.sh - Automated migration runner

set -e

DB_TYPE=${1:-"all"}
MIGRATION_DIR="migrations"

case $DB_TYPE in
    neo4j)
        echo "Running Neo4j migrations..."
        for file in $MIGRATION_DIR/neo4j/*.cypher; do
            echo "Running: $file"
            cypher-shell -u neo4j -p password < "$file"
        done
        ;;
    postgresql)
        echo "Running PostgreSQL migrations..."
        for file in $MIGRATION_DIR/postgresql/*.sql; do
            echo "Running: $file"
            psql -U postgres -d swarm_content < "$file"
        done
        ;;
    timescaledb)
        echo "Running TimescaleDB migrations..."
        for file in $MIGRATION_DIR/timescaledb/*.sql; do
            echo "Running: $file"
            psql -U postgres -d swarm_analytics < "$file"
        done
        ;;
    all)
        echo "Running all migrations..."
        $0 neo4j
        $0 postgresql
        $0 timescaledb
        ;;
    *)
        echo "Usage: $0 [neo4j|postgresql|timescaledb|all]"
        exit 1
        ;;
esac

echo "Migrations completed successfully!"
```

---

## Troubleshooting

### Migration Fails Partway Through
1. Check which migrations have been applied
2. Identify the failed migration
3. Fix the issue in the migration script
4. Rollback if needed
5. Re-run from the failed migration

### Lock Contention
1. Check for long-running queries
2. Ensure no application writes during migration
3. Use `LOCK_TIMEOUT` to prevent indefinite waits

### Performance Issues
1. Add indexes before loading data
2. Use batch inserts for large datasets
3. Disable triggers during bulk loads
4. Analyze and vacuum after migration

---

## Migration Checklist

Before running migrations:
- [ ] Create full backup
- [ ] Test in development environment
- [ ] Review migration scripts
- [ ] Schedule maintenance window
- [ ] Notify stakeholders

After running migrations:
- [ ] Validate data integrity
- [ ] Run test queries
- [ ] Check application logs
- [ ] Monitor performance
- [ ] Update documentation

---

**Last Updated:** 2026-03-14
