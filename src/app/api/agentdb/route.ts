/**
 * AgentDB API Route
 *
 * Example API endpoints for interacting with AgentDB.
 * This demonstrates common patterns for vector search
 * and pattern storage.
 */

import { NextRequest, NextResponse } from "next/server";
import { storePattern, retrievePatterns, getDBStats } from "@/lib/agentdb";
import { logger } from "@/lib/logger";

/**
 * POST /api/agentdb/store
 * Store a pattern in AgentDB
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, domain, pattern, confidence } = body;

    if (!type || !domain || !pattern) {
      return NextResponse.json(
        { error: "Missing required fields: type, domain, pattern" },
        { status: 400 },
      );
    }

    await storePattern(type, domain, pattern, confidence || 1.0);

    return NextResponse.json({
      success: true,
      message: "Pattern stored successfully",
    });
  } catch (error) {
    logger.error(
      "[AgentDB API] Store error",
      { endpoint: "POST agentdb" },
      error as Error,
    );
    return NextResponse.json(
      { error: "Failed to store pattern" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/agentdb
 * Search for similar patterns or get database statistics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const action = searchParams.get("action");

    // Handle stats request
    if (action === "stats") {
      const stats = await getDBStats();
      return NextResponse.json({
        success: true,
        stats,
      });
    }

    // Handle search request
    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 },
      );
    }

    const domain = searchParams.get("domain") || undefined;
    const k = parseInt(searchParams.get("k") || "10");

    // For demo purposes, create a simple embedding
    // In production, use a proper embedding model
    const queryEmbedding = createSimpleEmbedding(query);

    const results = await retrievePatterns(queryEmbedding, {
      domain,
      k,
      useMMR: true,
      synthesizeContext: true,
    });

    return NextResponse.json({
      success: true,
      results: {
        memories: results.memories,
        context: results.context,
        patterns: results.patterns,
      },
    });
  } catch (error) {
    logger.error(
      "[AgentDB API] Error",
      { endpoint: "GET agentdb" },
      error as Error,
    );
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

/**
 * Simple embedding function for demonstration
 * In production, use a proper embedding model like OpenAI, Cohere, or local models
 */
function createSimpleEmbedding(text: string): number[] {
  // This is a placeholder - replace with actual embedding model
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(1536).fill(0);

  words.forEach((word, i) => {
    const hash = simpleHash(word);
    embedding[i % embedding.length] = (hash % 100) / 100;
  });

  return embedding;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
