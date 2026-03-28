# AgentDB Implementation Guide

## Overview

This guide covers the implementation of AgentDB in the Saithavy Next.js project, providing high-performance vector search, learning plugins, and adaptive reasoning capabilities.

## Installation Status

✅ **Skills Created**: 8 AgentDB and ReasoningBank skills active
✅ **Package Installed**: agentic-flow added to dependencies
✅ **Integration Layer**: `src/lib/agentdb.ts` created
✅ **Initialization Script**: `scripts/init-agentdb.ts` created
✅ **NPM Scripts**: Added AgentDB commands to package.json

## Quick Start

### 1. Initialize AgentDB

```bash
npm run agentdb:init
```

This will:
- Create the AgentDB database at `.agentdb/reasoningbank.db`
- Enable learning and reasoning plugins
- Configure scalar quantization (8x memory reduction)
- Set up HNSW indexing (150x faster search)

### 2. Use AgentDB in Your Code

```typescript
import { storePattern, retrievePatterns } from '@/lib/agentdb';

// Store a pattern
await storePattern(
  'document',
  'knowledge-base',
  {
    embedding: [0.1, 0.2, ...], // Your embedding vector
    pattern: {
      text: 'Your document text here',
      metadata: { title: 'Doc Title' }
    }
  },
  0.95 // confidence
);

// Retrieve similar patterns
const results = await retrievePatterns(queryEmbedding, {
  domain: 'knowledge-base',
  k: 10,
  useMMR: true, // Diverse results
  synthesizeContext: true, // Rich context
});
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run agentdb:init` | Initialize AgentDB database |
| `npm run agentdb:stats` | Show database statistics |
| `npm run agentdb:export` | Export database to JSON |
| `npm run agentdb:import` | Import database from JSON |

## Architecture

### File Structure

```
saithavy-nextjs/
├── .agentdb/                    # Database directory
│   └── reasoningbank.db         # Vector database
├── src/
│   └── lib/
│       └── agentdb.ts           # Integration layer
├── scripts/
│   └── init-agentdb.ts          # Initialization script
├── docs/
│   ├── AGENTDB_IMPLEMENTATION_GUIDE.md
│   └── SKILL_ACTIVATION_TEST.md
└── .claude/
    └── skills/
        ├── agentdb/             # Master skill
        ├── agentdb-vector-search/
        ├── agentdb-learning/
        ├── agentdb-optimization/
        ├── agentdb-advanced/
        ├── agentdb-memory-patterns/
        ├── reasoningbank-agentdb/
        └── reasoningbank-intelligence/
```

### Integration Layer

The `src/lib/agentdb.ts` file provides:

- **Singleton Pattern**: One adapter instance per application
- **Type Safety**: Full TypeScript types
- **Error Handling**: Graceful error handling
- **Performance Optimization**: Configurable caching and quantization

## Usage Examples

### RAG System

```typescript
import { storePattern, retrievePatterns } from '@/lib/agentdb';

// Store documents
async function indexDocument(text: string, metadata: any) {
  const embedding = await computeEmbedding(text);
  await storePattern('document', 'knowledge-base', {
    embedding,
    pattern: { text, metadata }
  });
}

// Search documents
async function searchDocuments(query: string) {
  const embedding = await computeEmbedding(query);
  const results = await retrievePatterns(embedding, {
    domain: 'knowledge-base',
    k: 5,
    useMMR: true,
  });

  return results.memories.map(m => m.pattern.text);
}
```

### Chat System with Memory

```typescript
import { storePattern, retrievePatterns } from '@/lib/agentdb';

async function storeMessage(userMsg: string, botResponse: string) {
  const embedding = await computeEmbedding(userMsg);
  await storePattern('conversation', 'chat-history', {
    embedding,
    pattern: { user: userMsg, assistant: botResponse }
  });
}

async function getRelevantContext(query: string) {
  const embedding = await computeEmbedding(query);
  const results = await retrievePatterns(embedding, {
    domain: 'chat-history',
    k: 10,
    synthesizeContext: true,
  });

  return results.context; // Synthesized context
}
```

### Self-Learning Agent

```typescript
import { storePattern, trainAgentDB } from '@/lib/agentdb';

async function recordExperience(
  task: string,
  approach: string,
  outcome: any
) {
  const embedding = await computeEmbedding(
    JSON.stringify({ task, approach })
  );

  await storePattern('experience', task, {
    embedding,
    pattern: { task, approach, outcome }
  }, outcome.success ? 0.9 : 0.3);
}

async function learnFromExperiences() {
  const metrics = await trainAgentDB({
    epochs: 50,
    batchSize: 32,
  });

  console.log('Training completed:', metrics);
}
```

## Performance Optimization

### Quantization

| Type | Memory Reduction | Speed Impact | Quality Loss |
|------|------------------|--------------|--------------|
| `binary` | 32x | 32x faster | Minimal |
| `scalar` | 8x | 8x faster | Very low |
| `product` | 16x | 16x faster | Low |
| `none` | 1x | Baseline | None |

```typescript
import { initAgentDB } from '@/lib/agentdb';

await initAgentDB({
  quantizationType: 'binary', // 32x memory reduction
  cacheSize: 2000,
});
```

### HNSW Indexing

```typescript
await initAgentDB({
  // HNSW provides 150x-12,500x faster search
  enableHNSW: true,
  cacheSize: 2000,
});
```

## Environment Variables

Add to `.env.local`:

```bash
# AgentDB Configuration
AGENTDB_PATH=.agentdb/reasoningbank.db
AGENTDB_ENABLED=true

# Performance Tuning
AGENTDB_QUANTIZATION=scalar
AGENTDB_CACHE_SIZE=2000
AGENTDB_HNSW_M=16
AGENTDB_HNSW_EF=100

# Learning Plugins
AGENTDB_LEARNING=true
AGENTDB_REASONING=true
```

## Troubleshooting

### Issue: Database locked

```typescript
// Use connection pooling
await initAgentDB({
  dbPath: '.agentdb/reasoningbank.db',
  cacheSize: 1000, // Reduce cache size
});
```

### Issue: Memory usage too high

```typescript
// Enable quantization
await initAgentDB({
  quantizationType: 'binary', // 32x reduction
});
```

### Issue: Slow search performance

```typescript
// Enable HNSW indexing
await initAgentDB({
  enableHNSW: true,
  cacheSize: 2000,
});
```

## Next Steps

1. **Initialize Database**: Run `npm run agentdb:init`
2. **Test Vector Search**: Use the `agentdb-vector-search` skill
3. **Implement Learning**: Use the `agentdb-learning` skill
4. **Optimize Performance**: Use the `agentdb-optimization` skill
5. **Deploy**: Monitor stats with `npm run agentdb:stats`

## Resources

- **GitHub**: https://github.com/ruvnet/agentic-flow
- **Website**: https://agentdb.ruv.io
- **Skills**: Use `/skill agentdb-*` commands
- **Docs**: See `.claude/skills/` for detailed guides

---

**Status**: ✅ Implementation Complete
**Version**: 1.0.0
**Last Updated**: 2026-03-24
