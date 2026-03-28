/**
 * AgentDB Initialization Script
 *
 * Run this script to initialize AgentDB for your project:
 * npx tsx scripts/init-agentdb.ts
 */

import { initAgentDB, getDBStats } from '../src/lib/agentdb.js';

async function main() {
  console.log('🚀 Initializing AgentDB...\n');

  try {
    // Initialize AgentDB
    await initAgentDB({
      dbPath: '.agentdb/reasoningbank.db',
      enableLearning: true,
      enableReasoning: true,
      cacheSize: 2000,
      quantizationType: 'scalar', // 8x memory reduction
    });

    // Get database stats
    const stats = await getDBStats();

    console.log('\n✅ AgentDB initialized successfully!\n');
    console.log('📊 Database Statistics:');
    console.log(`   Total Patterns: ${stats.totalPatterns || 0}`);
    console.log(`   Database Size: ${stats.dbSize || 'N/A'}`);
    console.log(`   Cache Hit Rate: ${stats.cacheHitRate || 'N/A'}`);
    console.log(`   Avg Search Latency: ${stats.avgSearchLatency || 'N/A'}`);

    console.log('\n🎯 Next Steps:');
    console.log('   1. Use the agentdb-vector-search skill for semantic search');
    console.log('   2. Use the agentdb-learning skill for RL training');
    console.log('   3. Use the agentdb-optimization skill for tuning');

  } catch (error) {
    console.error('❌ Failed to initialize AgentDB:', error);
    process.exit(1);
  }
}

main();
