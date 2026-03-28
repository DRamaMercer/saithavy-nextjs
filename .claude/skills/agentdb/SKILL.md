---
name: agentdb
description: "Comprehensive AgentDB integration for intelligent AI memory systems. Provides vector search (150x faster), learning plugins (9 RL algorithms), optimization (4-32x memory reduction), advanced features (QUIC sync, hybrid search), memory patterns, and ReasoningBank integration. Use when implementing persistent memory, semantic search, reinforcement learning, or distributed AI systems."
version: 1.0.0
category: database
---

# AgentDB

## What This Skill Does

AgentDB is a high-performance vector database and learning system for AI agents. This skill provides access to all AgentDB capabilities including:

- **Vector Search**: Semantic search with HNSW indexing (150x-12,500x faster)
- **Learning Plugins**: 9 reinforcement learning algorithms for self-learning agents
- **Performance Optimization**: Quantization, caching, and batch operations (4-32x memory reduction)
- **Advanced Features**: QUIC synchronization, hybrid search, multi-database management
- **Memory Patterns**: Session memory, long-term storage, pattern learning
- **ReasoningBank Integration**: Adaptive learning with trajectory tracking and verdict judgment

## Prerequisites

- Node.js 18+
- AgentDB v1.0.7+ (via agentic-flow package)
- Basic understanding of vector databases (optional)

---

## Quick Start

### Installation

```bash
# Install agentic-flow (includes AgentDB)
npm install agentic-flow

# Or using CLI directly
npx agentdb@latest --help
```

### Initialize AgentDB

```typescript
import { createAgentDBAdapter } from 'agentic-flow/reasoningbank';

// Initialize with default settings
const adapter = await createAgentDBAdapter({
  dbPath: '.agentdb/vectors.db',
  enableLearning: true,
  enableReasoning: true,
  cacheSize: 1000,
});

// Store patterns
await adapter.insertPattern({
  id: '',
  type: 'memory',
  domain: 'knowledge',
  pattern_data: JSON.stringify({
    embedding: await computeEmbedding('your text here'),
    pattern: { /* your data */ }
  }),
  confidence: 1.0,
  usage_count: 0,
  success_count: 0,
  created_at: Date.now(),
  last_used: Date.now(),
});

// Search with reasoning
const result = await adapter.retrieveWithReasoning(queryEmbedding, {
  domain: 'knowledge',
  k: 10,
});
```

---

## Specialized Skills

AgentDB functionality is organized into specialized skills for specific use cases:

### Core Skills

| Skill | Purpose |
|-------|---------|
| `agentdb-vector-search` | Semantic vector search for RAG systems and intelligent knowledge bases |
| `agentdb-learning` | 9 reinforcement learning algorithms for self-learning agents |
| `agentdb-optimization` | Performance tuning, quantization, and caching strategies |
| `agentdb-memory-patterns` | Session memory, long-term storage, and pattern learning |

### Advanced Skills

| Skill | Purpose |
|-------|---------|
| `agentdb-advanced` | QUIC sync, hybrid search, multi-database, distributed systems |
| `reasoningbank-agentdb` | Adaptive learning with trajectory tracking and verdict judgment |
| `reasoningbank-intelligence` | Pattern recognition, strategy optimization, meta-cognitive systems |

---

## Usage Guide

### When to Use Each Skill

**Use `agentdb-vector-search` when:**
- Building RAG (Retrieval Augmented Generation) systems
- Implementing semantic search engines
- Creating intelligent knowledge bases
- Need fast similarity matching (150x-12,500x faster with HNSW)

**Use `agentdb-learning` when:**
- Building self-learning agents
- Implementing reinforcement learning
- Training agents from experience
- Need Decision Transformer, Q-Learning, SARSA, or Actor-Critic

**Use `agentdb-optimization` when:**
- Reducing memory usage (4-32x with quantization)
- Improving search speed
- Scaling to millions of vectors
- Implementing caching strategies

**Use `agentdb-advanced` when:**
- Building distributed AI systems
- Need sub-millisecond QUIC synchronization
- Implementing hybrid search (vector + metadata)
- Managing multiple databases

**Use `agentdb-memory-patterns` when:**
- Building stateful agents
- Creating chat systems with memory
- Implementing context management
- Need long-term pattern storage

**Use `reasoningbank-agentdb` when:**
- Implementing adaptive learning
- Need trajectory tracking and verdict judgment
- Building experience replay systems
- Optimizing decision-making

**Use `reasoningbank-intelligence` when:**
- Building meta-cognitive systems
- Implementing strategy optimization
- Need pattern recognition
- Creating self-improving workflows

---

## CLI Commands

```bash
# Initialize AgentDB
npx agentdb@latest init

# Store patterns
npx agentdb@latest store ./vectors.db "your text" --domain knowledge

# Search patterns
npx agentdb@latest search ./vectors.db "query text" --domain knowledge --top 10

# Train learning model
npx agentdb@latest train ./vectors.db --epochs 50 --batch-size 32

# Create learning plugin
npx agentdb@latest create-plugin -t decision-transformer -n my-agent

# List plugins
npx agentdb@latest list-plugins

# Database statistics
npx agentdb@latest stats ./vectors.db

# Export database
npx agentdb@latest export ./vectors.db ./backup.json

# Import database
npx agentdb@latest import ./backup.json
```

---

## Performance Targets

| Feature | Improvement |
|---------|-------------|
| HNSW Search | 150x-12,500x faster |
| Memory Reduction | 4-32x with quantization |
| Flash Attention | 2.49x-7.47x speedup |
| QUIC Sync | <1ms latency between nodes |
| Batch Operations | 500x faster inserts |

---

## Environment Variables

```bash
# Core configuration
AGENTDB_PATH=.agentdb/reasoningbank.db
AGENTDB_ENABLED=true

# Performance tuning
AGENTDB_QUANTIZATION=binary     # binary|scalar|product|none
AGENTDB_CACHE_SIZE=2000
AGENTDB_HNSW_M=16
AGENTDB_HNSW_EF=100

# Learning plugins
AGENTDB_LEARNING=true
AGENTDB_REASONING=true

# QUIC synchronization
AGENTDB_QUIC_SYNC=true
AGENTDB_QUIC_PORT=4433
AGENTDB_QUIC_PEERS=host1:4433,host2:4433
```

---

## Architecture

### Data Flow

```
User Input
    ↓
Compute Embedding
    ↓
Store in AgentDB
    ↓
HNSW Indexing (150x faster)
    ↓
Retrieve with Reasoning
    ↓
Context Synthesis
    ↓
AI Decision
```

### Components

- **Vector Database**: SQLite-backed storage with HNSW indexing
- **Learning System**: 9 RL algorithms with WASM acceleration
- **Reasoning Engine**: Trajectory tracking and verdict judgment
- **QUIC Sync**: Sub-millisecond multi-node synchronization
- **Memory Patterns**: Session and long-term memory management

---

## Integration Examples

### RAG System

```typescript
// Store documents
await adapter.insertPattern({
  type: 'document',
  domain: 'knowledge-base',
  pattern_data: JSON.stringify({
    embedding: await computeEmbedding(documentText),
    pattern: { text: documentText, metadata: {} }
  }),
  // ... other fields
});

// Retrieve relevant context
const result = await adapter.retrieveWithReasoning(queryEmbedding, {
  domain: 'knowledge-base',
  k: 5,
  useMMR: true,  // Diverse results
});

// Use context in LLM prompt
const context = result.memories.map(m => m.pattern.text).join('\n');
```

### Self-Learning Agent

```typescript
// Store experience
await adapter.insertPattern({
  type: 'experience',
  domain: 'game-playing',
  pattern_data: JSON.stringify({
    embedding: await computeEmbedding(JSON.stringify(stateActionReward)),
    pattern: { state, action, reward, nextState, done }
  }),
  // ... other fields
});

// Train model
const metrics = await adapter.train({
  epochs: 50,
  batchSize: 32,
});

// Use trained model for decisions
const result = await adapter.retrieveWithReasoning(stateEmbedding, {
  domain: 'game-playing',
  k: 10,
});
```

### Chat System with Memory

```typescript
// Store conversation
await adapter.insertPattern({
  type: 'conversation',
  domain: 'chat-history',
  pattern_data: JSON.stringify({
    embedding: await computeEmbedding(userMessage),
    pattern: { user: userMessage, assistant: assistantResponse }
  }),
  // ... other fields
});

// Retrieve relevant context
const result = await adapter.retrieveWithReasoning(queryEmbedding, {
  domain: 'chat-history',
  k: 10,
  synthesizeContext: true,  // Rich context
});

// Use context in response
const context = result.context;
```

---

## Troubleshooting

### Issue: Skill not recognized

**Solution**: Use the specific skill name:
- `agentdb` (this skill - overview)
- `agentdb-vector-search` (semantic search)
- `agentdb-learning` (RL algorithms)
- `agentdb-optimization` (performance)
- `agentdb-advanced` (distributed systems)
- `agentdb-memory-patterns` (memory management)
- `reasoningbank-agentdb` (adaptive learning)
- `reasoningbank-intelligence` (meta-cognitive)

### Issue: Slow search performance

**Solution**: Enable HNSW indexing and quantization:
```typescript
const adapter = await createAgentDBAdapter({
  dbPath: '.agentdb/vectors.db',
  quantizationType: 'binary',  // 32x faster
  enableHNSW: true,            // 150x faster
  cacheSize: 2000,
});
```

### Issue: Memory usage too high

**Solution**: Use quantization:
```typescript
const adapter = await createAgentDBAdapter({
  quantizationType: 'binary',  // 32x reduction
  // or 'scalar' for 8x reduction
  // or 'product' for 16x reduction
});
```

### Issue: Learning not converging

**Solution**: Adjust training parameters:
```typescript
await adapter.train({
  epochs: 100,
  batchSize: 64,
  learningRate: 0.0001,  // Lower learning rate
  validationSplit: 0.2,  // Use validation
});
```

---

## Learn More

- **GitHub**: https://github.com/ruvnet/agentic-flow/tree/main/packages/agentdb
- **Website**: https://agentdb.ruv.io
- **Documentation**: See specialized skills for detailed guides
- **MCP Integration**: `npx agentdb@latest mcp`

---

**Related Skills**:
- `agentdb-vector-search` - Semantic vector search
- `agentdb-learning` - Reinforcement learning plugins
- `agentdb-optimization` - Performance tuning
- `agentdb-advanced` - Distributed systems
- `agentdb-memory-patterns` - Memory management
- `reasoningbank-agentdb` - Adaptive learning
- `reasoningbank-intelligence` - Meta-cognitive systems

**Category**: Database / Vector Search / Machine Learning
**Difficulty**: Beginner to Advanced
**Estimated Time**: 30-60 minutes (depending on use case)
