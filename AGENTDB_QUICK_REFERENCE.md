# AgentDB Quick Reference

## 🚀 Quick Start

```bash
# 1. Initialize database
npm run agentdb:init

# 2. Use in code
import { initAgentDB, storePattern, retrievePatterns } from '@/lib/agentdb';
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/agentdb.ts` | Core integration layer |
| `scripts/init-agentdb.ts` | Database initialization |
| `src/app/api/agentdb/route.ts` | Example API endpoints |
| `docs/AGENTDB_IMPLEMENTATION_GUIDE.md` | Full documentation |

## 🎯 Common Tasks

### Store a Pattern
```typescript
await storePattern('document', 'knowledge', {
  embedding: [0.1, 0.2, ...],
  pattern: { text: 'Hello world' }
}, 0.95);
```

### Search Patterns
```typescript
const results = await retrievePatterns(queryEmbedding, {
  domain: 'knowledge',
  k: 10,
  useMMR: true,
  synthesizeContext: true,
});
```

### Train Model
```typescript
const metrics = await trainAgentDB({
  epochs: 50,
  batchSize: 32,
});
```

## 🔧 NPM Scripts

```bash
npm run agentdb:init    # Initialize database
npm run agentdb:stats   # Show statistics
npm run agentdb:export  # Export to JSON
npm run agentdb:import  # Import from JSON
```

## 🎨 Skills

```bash
/skill agentdb                    # Master skill
/skill agentdb-vector-search      # Semantic search
/skill agentdb-learning           # RL algorithms
/skill agentdb-optimization       # Performance tuning
/skill agentdb-advanced           # Distributed systems
/skill reasoningbank-intelligence # Meta-cognitive
```

## ⚡ Performance

| Feature | Improvement |
|---------|-------------|
| HNSW Search | 150x-12,500x faster |
| Binary Quantization | 32x memory reduction |
| Scalar Quantization | 8x memory reduction |
| Batch Operations | 500x faster |

## 🔗 Links

- **Full Guide**: `docs/AGENTDB_IMPLEMENTATION_GUIDE.md`
- **Next Steps**: `docs/NEXT_STEPS_SUMMARY.md`
- **Skill Test**: `docs/SKILL_ACTIVATION_TEST.md`
- **GitHub**: https://github.com/ruvnet/agentic-flow
- **Website**: https://agentdb.ruv.io

## 📝 Environment Variables

```bash
AGENTDB_PATH=.agentdb/reasoningbank.db
AGENTDB_ENABLED=true
AGENTDB_QUANTIZATION=scalar
AGENTDB_CACHE_SIZE=2000
AGENTDB_LEARNING=true
AGENTDB_REASONING=true
```

---

**Version**: 1.0.0 | **Updated**: 2026-03-24
