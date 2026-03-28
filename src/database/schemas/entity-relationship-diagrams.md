# Entity-Relationship Diagrams

This document contains Mermaid diagrams for all three databases in the Swarm Agency system.

## Table of Contents
1. [Knowledge Graph Database (Neo4j)](#knowledge-graph-database)
2. [Content Tracking Database (PostgreSQL)](#content-tracking-database)
3. [Analytics Database (TimescaleDB)](#analytics-database)

---

## Knowledge Graph Database (Neo4j)

### Main Content Relationships

```mermaid
graph LR
    A[Content: Parent Video]
    B[Content: TikTok Clip 1]
    C[Content: TikTok Clip 2]
    D[Content: Twitter Thread]
    E[Content: LinkedIn Carousel]

    A --ATOMIZED_FROM--> B
    A --ATOMIZED_FROM--> C
    A --ATOMIZED_FROM--> D
    A --ATOMIZED_FROM--> E

    B --USES_HOOK--> H[Hook: Pattern Interrupt]
    B --TRIGGERS_EMOTION--> E1[Emotion: Surprise]
    B --USES_COLOR--> C1[Color: Red]
    B --INCLUDES_AUDIO--> A1[Audio: Trending Sound]

    D --MENTIONS_ENTITY--> ENT[Entity: Creator]
    D --PARTICIPATES_IN_TREND--> T[Trend: Topic]
```

### Content DNA and Lineage

```mermaid
graph TB
    subgraph Content Lineage
        P[Parent Content]
        C1[Child 1: TikTok]
        C2[Child 2: Instagram]
        C3[Child 3: Twitter]
        C4[Child 4: LinkedIn]

        P --ATOMIZED_FROM--> C1
        P --ATOMIZED_FROM--> C2
        P --ATOMIZED_FROM--> C3
        P --ATOMIZED_FROM--> C4
    end

    subgraph Content DNA
        C1 --USES_FRAMEWORK--> F1[Framework: Curiosity Gap]
        C1 --TRIGGERS_EMOTION--> E1[Emotion: Joy]
        C1 --USES_COLOR--> Col1[Color: Red]
        C1 --USES_HOOK--> H1[Hook: Pattern Interrupt]
        C1 --INCLUDES_AUDIO--> A1[Audio: Trending]

        C2 --USES_FRAMEWORK--> F2[Framework: FOMO]
        C2 --TRIGGERS_EMOTION--> E2[Emotion: Surprise]
        C2 --USES_COLOR--> Col2[Color: Orange]
    end

    subgraph Platforms
        TikTok[TikTok Platform]
        Insta[Instagram Platform]
        Twit[Twitter Platform]
        In[LinkedIn Platform]

        C1 --OPTIMIZED_FOR--> TikTok
        C2 --OPTIMIZED_FOR--> Insta
        C3 --OPTIMIZED_FOR--> Twit
        C4 --OPTIMIZED_FOR--> In
    end
```

### A/B Test Relationships

```mermaid
graph TB
    AB[ABTest: Title Test]
    V1[Variant A: Control]
    V2[Variant B: Experimental]
    V3[Variant C: Experimental]

    AB --TEST_VARIANT_OF--> V1
    AB --TEST_VARIANT_OF--> V2
    AB --TEST_VARIANT_OF--> V3

    V1 --USES_HOOK--> H1[Hook: Social Proof]
    V2 --USES_HOOK--> H2[Hook: Curiosity Gap]
    V3 --USES_HOOK--> H3[Hook: Pattern Interrupt]

    V1 --TRIGGERS_EMOTION--> E1[Emotion: Joy]
    V2 --TRIGGERS_EMOTION--> E2[Emotion: Surprise]

    style AB fill:#f9f,stroke:#333,stroke-width:2px
    style V1 fill:#bbf,stroke:#333,stroke-width:1px
    style V2 fill:#bbf,stroke:#333,stroke-width:1px
    style V3 fill:#bbf,stroke:#333,stroke-width:1px
```

---

## Content Tracking Database (PostgreSQL)

### Core Schema

```mermaid
erDiagram
    content_inventory ||--o{ content_inventory : "atomizes to"
    content_inventory ||--o{ content_performance : "has metrics"
    content_inventory ||--o{ swarm_workflows : "tracked by"
    content_inventory ||--o{ monetization_records : "generates revenue"
    content_inventory ||--o{ content_notes : "has notes"

    content_inventory {
        uuid id PK
        uuid parent_content_id FK
        text title
        text description
        platform_type platform
        content_type content_type
        timestamptz created_at
        content_status status
        bigint views
        numeric engagement_rate
        jsonb metadata
        uuid[] atomization_chain
    }

    platform_metadata {
        uuid id PK
        platform_type platform UK
        text api_endpoint
        integer max_duration_seconds
        jsonb algorithm_signals
        jsonb color_preferences
    }

    content_performance {
        uuid id PK
        uuid content_id FK
        metric_source metric_source
        bigint views
        bigint likes
        bigint shares
        numeric engagement_rate
        numeric viral_coefficient
        jsonb algorithm_signals
    }

    swarm_workflows {
        uuid id PK
        uuid content_id FK
        swarm_role primary_swarm
        task_status status
        timestamptz started_at
        numeric quality_score
        numeric cost_usd
    }

    tool_integrations {
        uuid id PK
        text tool_name
        text tool_type
        text api_endpoint
        boolean is_active
        text health_status
    }

    tool_usage_log {
        uuid id PK
        uuid tool_integration_id FK
        text request_type
        integer response_status
        numeric api_cost_usd
    }

    monetization_records {
        uuid id PK
        uuid content_id FK
        monetization_type monetization_type
        numeric revenue_usd
        integer conversion_count
    }

    content_notes {
        uuid id PK
        uuid content_id FK
        text note_text
        text note_type
        text author_id
    }
```

### Content Atomization Flow

```mermaid
flowchart TD
    A[Create Parent Content] --> B[Save to content_inventory]
    B --> C{Atomize?}
    C -->|Yes| D[Create Child Content Records]
    C -->|No| E[Publish Directly]

    D --> F[Link via parent_content_id]
    F --> G[Update atomization_chain]
    G --> H[Track in swarm_workflows]

    H --> I{Platform Type?}
    I -->|TikTok| J[Apply TikTok Metadata]
    I -->|Instagram| K[Apply Instagram Metadata]
    I -->|YouTube| L[Apply YouTube Metadata]

    J --> M[Schedule/Publish]
    K --> M
    L --> M

    M --> N[Track Performance]
    N --> O[Update content_performance]

    E --> N
```

### Swarm Workflow Integration

```mermaid
sequenceDiagram
    participant System
    participant SwarmCoordinator
    participant AlphaSwarm
    participant BetaSwarm
    participant ContentDB

    System->>SwarmCoordinator: Request content atomization
    SwarmCoordinator->>AlphaSwarm: Research trends & competitors
    AlphaSwarm-->>SwarmCoordinator: Return intelligence

    SwarmCoordinator->>BetaSwarm: Create adapted content
    BetaSwarm->>ContentDB: Save content_inventory records
    BetaSwarm->>ContentDB: Create swarm_workflows entry

    BetaSwarm-->>SwarmCoordinator: Return created content
    SwarmCoordinator-->>System: Return atomized content

    loop Performance Tracking
        ContentDB->>ContentDB: Update content_performance
        ContentDB->>ContentDB: Update engagement_rate
    end
```

---

## Analytics Database (TimescaleDB)

### Hypertable Architecture

```mermaid
graph TB
    subgraph Raw Data Hypertables
        CM[content_metrics<br/>(1-hour chunks)]
        PH[platform_health<br/>(1-day chunks)]
        TM[trend_metrics<br/>(1-hour chunks)]
        SM[swarm_metrics<br/>(1-hour chunks)]
        MM[monetization_metrics<br/>(1-day chunks)]
    end

    subgraph Continuous Aggregates
        CMH[content_metrics_hourly]
        CMD[content_metrics_daily]
        PHD[platform_health_daily]
        TVH[trend_velocity_hourly]
        SPD[swarm_performance_daily]
        MD[monetization_daily]
    end

    subgraph Compression & Retention
        C1[Compress after 7 days]
        C2[Compress after 30 days]
        R1[Retain 90 days]
        R2[Retain 2 years]
        R3[Retain 7 years]
    end

    CM -->|rollup| CMH
    CM -->|rollup| CMD
    CM --> C1
    CM --> R1

    PH -->|rollup| PHD
    PH --> C2
    PH --> R2

    TM -->|rollup| TVH
    TM --> C1
    TM --> R1

    SM -->|rollup| SPD
    SM --> C1

    MM -->|rollup| MD
    MM --> R3

    style CM fill:#f96,stroke:#333
    style PH fill:#f96,stroke:#333
    style TM fill:#f96,stroke:#333
    style SM fill:#f96,stroke:#333
    style MM fill:#f96,stroke:#333
    style CMH fill:#9f6,stroke:#333
    style CMD fill:#9f6,stroke:#333
    style PHD fill:#9f6,stroke:#333
    style TVH fill:#9f6,stroke:#333
    style SPD fill:#9f6,stroke:#333
    style MD fill:#9f6,stroke:#333
```

### Time-Series Data Flow

```mermaid
flowchart LR
    A[Ingest Metrics] --> B{Metric Type?}

    B -->|Content Performance| C[content_metrics<br/>Hypertable]
    B -->|Platform Health| D[platform_health<br/>Hypertable]
    B -->|Trend Velocity| E[trend_metrics<br/>Hypertable]
    B -->|Swarm Performance| F[swarm_metrics<br/>Hypertable]
    B -->|Monetization| G[monetization_metrics<br/>Hypertable]

    C --> H[content_metrics_hourly<br/>Continuous Aggregate]
    C --> I[content_metrics_daily<br/>Continuous Aggregate]

    E --> J[trend_velocity_hourly<br/>Continuous Aggregate]

    D --> K[platform_health_daily<br/>Continuous Aggregate]

    F --> L[swarm_performance_daily<br/>Continuous Aggregate]

    G --> M[monetization_daily<br/>Continuous Aggregate]

    H --> N[Query Layer]
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N

    N --> O[Analytics Dashboard]

    style C fill:#f96
    style D fill:#f96
    style E fill:#f96
    style F fill:#f96
    style G fill:#f96
    style H fill:#9f6
    style I fill:#9f6
    style J fill:#9f6
    style K fill:#9f6
    style L fill:#9f6
    style M fill:#9f6
```

### Cross-Database Relationships

```mermaid
graph TB
    subgraph Neo4j Knowledge Graph
        KG_Content[Content Nodes]
        KG_Rel[Relationships]
        KG_Ent[Entities]
    end

    subgraph PostgreSQL Content Tracking
        PG_CI[content_inventory]
        PG_CP[content_performance]
        PG_SW[swarm_workflows]
    end

    subgraph TimescaleDB Analytics
        TS_CM[content_metrics]
        TS_PH[platform_health]
        TS_TM[trend_metrics]
    end

    KG_Content -.->|sync| PG_CI
    PG_CI -.->|metrics| TS_CM
    PG_CP -.->|aggregated| TS_CM

    KG_Ent -.->|mentioned| PG_CI
    PG_CI -.->|performance| TS_CM

    PG_SW -.->|efficiency| TS_CM

    TS_CM -.->|insights| KG_Rel
    TS_TM -.->|trends| KG_Ent

    style KG_Content fill:#e1f5ff
    style KG_Rel fill:#e1f5ff
    style KG_Ent fill:#e1f5ff
    style PG_CI fill:#f0e1ff
    style PG_CP fill:#f0e1ff
    style PG_SW fill:#f0e1ff
    style TS_CM fill:#ffe1f0
    style TS_PH fill:#ffe1f0
    style TS_TM fill:#ffe1f0
```

---

## Index Strategy Summary

### Neo4j Indexes
- **Unique constraints** on all node IDs
- **Full-text search** on content titles and descriptions
- **Vector indexes** for semantic similarity (1536 dimensions)
- **Performance indexes** on created_at, status, platform
- **Relationship indexes** for fast traversal

### PostgreSQL Indexes
- **Composite indexes** on (platform, published_at) for common queries
- **Partial indexes** for platform-specific queries (only published content)
- **GIN indexes** on JSONB metadata, tags, hashtags
- **GIN indexes** on full-text search vectors
- **BRIN indexes** on time-series data (for future TimescaleDB migration)

### TimescaleDB Indexes
- **Hypertable indexes** on time DESC for time-series queries
- **Composite indexes** on (content_id, time) for content-specific queries
- **Chunk-based indexes** for efficient partition pruning
- **Compression** reduces storage by 80-90%

---

## Performance Characteristics

| Database | Query Type | Latency | Throughput |
|----------|-----------|---------|------------|
| Neo4j | Relationship traversal | <10ms | 1000 queries/sec |
| Neo4j | Vector similarity search | <50ms | 100 queries/sec |
| PostgreSQL | Content lookup | <5ms | 10,000 queries/sec |
| PostgreSQL | Full-text search | <20ms | 5,000 queries/sec |
| TimescaleDB | Time-series aggregation | <100ms | 1,000 queries/sec |
| TimescaleDB | Continuous aggregate | <50ms | 2,000 queries/sec |

---

## Schema Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-14 | Initial schema design with all three databases |
