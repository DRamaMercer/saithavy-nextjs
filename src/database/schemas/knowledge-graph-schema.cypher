// ============================================================================
// Swarm Agency Knowledge Graph Schema
// Database: Neo4j 5.x
// Version: 1.0.0
// Description: Content relationships, entity tracking, lineage management
// ============================================================================

// ----------------------------------------------------------------------------
// CONSTRAINTS & INDEXES
// ----------------------------------------------------------------------------

// Unique constraints for content nodes
CREATE CONSTRAINT content_id_unique IF NOT EXISTS FOR (c:Content) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT asset_id_unique IF NOT EXISTS FOR (a:Asset) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT platform_id_unique IF NOT EXISTS FOR (p:Platform) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT creator_id_unique IF NOT EXISTS FOR (c:Creator) REQUIRE c.id IS UNIQUE;

// Full-text search indexes
CREATE INDEX content_fulltext IF NOT EXISTS FOR (c:Content) ON EACH [c.title, c.description, c.transcript];
CREATE INDEX entity_fulltext IF NOT EXISTS FOR (e:Entity) ON EACH [e.name, e.aliases];

// Performance indexes
CREATE INDEX content_created_at IF NOT EXISTS FOR (c:Content) ON (c.created_at);
CREATE INDEX content_status IF NOT EXISTS FOR (c:Content) ON (c.status);
CREATE INDEX content_platform IF NOT EXISTS FOR (c:Content) ON (c.platform);
CREATE INDEX entity_type IF NOT EXISTS FOR (e:Entity) ON (e.type);
CREATE INDEX trend_velocity IF NOT EXISTS FOR (t:Trend) ON (t.velocity_score DESC);

// Vector indexes for semantic similarity (Neo4j 5.x+)
CREATE VECTOR INDEX content_embeddings IF NOT EXISTS FOR (c:Content) ON c.embedding OPTIONS {
  indexConfig: {
    `vector.dimensions`: 1536,
    `vector.similarity_function`: 'cosine'
  }
};

// ----------------------------------------------------------------------------
// NODE DEFINITIONS
// ----------------------------------------------------------------------------

// Content nodes represent all content pieces across platforms
CREATE CONSTRAINT content_platform_unique IF NOT EXISTS FOR (c:Content) REQUIRE (c.id, c.platform) IS UNIQUE;

// Platform nodes (TikTok, Instagram, YouTube, etc.)
CREATE (:Platform {
  id: 'platform_tiktok',
  name: 'TikTok',
  type: 'short_form_video',
  api_endpoint: 'https://api.tiktok.com',
  supports: ['video', 'audio', 'text', 'hashtags'],
  algorithm_signals: ['watch_time', 'rewatch_rate', 'shares', 'comments', 'likes'],
  optimal_duration: [21, 34],
  created_at: datetime(),
  metadata: {}
});

CREATE (:Platform {
  id: 'platform_instagram',
  name: 'Instagram',
  type: 'visual_ecosystem',
  api_endpoint: 'https://graph.instagram.com',
  supports: ['video', 'image', 'carousel', 'story', 'reels'],
  algorithm_signals: ['engagement_rate', 'saves', 'shares', 'profile_visits'],
  optimal_duration: [7, 15],
  created_at: datetime(),
  metadata: {}
});

CREATE (:Platform {
  id: 'platform_youtube',
  name: 'YouTube',
  type: 'video_platform',
  api_endpoint: 'https://www.googleapis.com/youtube/v3',
  supports: ['long_form_video', 'shorts', 'live_stream'],
  algorithm_signals: ['retention_rate', 'ctr', 'subscriber_growth', 'watch_time'],
  optimal_duration: [600, 1200],
  created_at: datetime(),
  metadata: {}
});

CREATE (:Platform {
  id: 'platform_twitter',
  name: 'Twitter/X',
  type: 'microblogging',
  api_endpoint: 'https://api.twitter.com/2',
  supports: ['text', 'image', 'video', 'thread', 'spaces'],
  algorithm_signals: ['impressions', 'engagement_rate', 'quote_tweets', 'list_additions'],
  optimal_duration: [280, 0],
  created_at: datetime(),
  metadata: {}
});

CREATE (:Platform {
  id: 'platform_linkedin',
  name: 'LinkedIn',
  type: 'professional_network',
  api_endpoint: 'https://api.linkedin.com/v2',
  supports: ['text', 'image', 'document', 'video', 'article'],
  algorithm_signals: ['impressions', 'engagement_rate', 'connection_requests', 'ssi_score'],
  optimal_duration: [3000, 0],
  created_at: datetime(),
  metadata: {}
});

CREATE (:Platform {
  id: 'platform_pinterest',
  name: 'Pinterest',
  type: 'visual_discovery',
  api_endpoint: 'https://api.pinterest.com/v5',
  supports: ['image', 'video', 'carousel', 'idea_pins'],
  algorithm_signals: ['saves', 'outbound_clicks', 'pin_repin_rate'],
  optimal_duration: [0, 0],
  created_at: datetime(),
  metadata: {}
});

CREATE (:Platform {
  id: 'platform_facebook',
  name: 'Facebook',
  type: 'social_network',
  api_endpoint: 'https://graph.facebook.com/v18.0',
  supports: ['text', 'image', 'video', 'live_stream', 'group_post'],
  algorithm_signals: ['engagement_rate', 'shares', 'comments', 'reach'],
  optimal_duration: [60, 240],
  created_at: datetime(),
  metadata: {}
});

// Creator nodes (content creators, clients, etc.)
CREATE (:Creator {
  id: 'creator_system',
  name: 'System AI',
  type: 'ai_agent',
  tier: 'internal',
  status: 'active',
  metadata: {}
});

// ----------------------------------------------------------------------------
// CONTENT DNA NODES
// ----------------------------------------------------------------------------

// Psychological Framework nodes
CREATE (:PsychologicalFramework {
  id: 'framework_dopamine',
  name: 'Dopamine Loop',
  category: 'engagement',
  triggers: ['pattern_interrupt', 'variable_reward', 'social_proof'],
  effectiveness_score: 0.85,
  created_at: datetime()
});

CREATE (:PsychologicalFramework {
  id: 'framework_curiosity_gap',
  name: 'Curiosity Gap',
  category: 'retention',
  triggers: ['open_loop', 'information_gap', 'mystery'],
  effectiveness_score: 0.78,
  created_at: datetime()
});

CREATE (:PsychologicalFramework {
  id: 'framework_fomo',
  name: 'Fear of Missing Out',
  category: 'urgency',
  triggers: ['scarcity', 'exclusivity', 'time_pressure'],
  effectiveness_score: 0.72,
  created_at: datetime()
});

// Emotion nodes
CREATE (:Emotion {
  id: 'emotion_joy',
  name: 'Joy',
  valence: 0.9,
  arousal: 0.7,
  dominance: 0.6,
  color_primary: '#FFD700',
  created_at: datetime()
});

CREATE (:Emotion {
  id: 'emotion_surprise',
  name: 'Surprise',
  valence: 0.4,
  arousal: 0.9,
  dominance: 0.3,
  color_primary: '#FF6B6B',
  created_at: datetime()
});

CREATE (:Emotion {
  id: 'emotion_anger',
  name: 'Anger',
  valence: -0.8,
  arousal: 0.8,
  dominance: 0.7,
  color_primary: '#FF4444',
  created_at: datetime()
});

CREATE (:Emotion {
  id: 'emotion_fear',
  name: 'Fear',
  valence: -0.7,
  arousal: 0.7,
  dominance: 0.2,
  color_primary: '#800080',
  created_at: datetime()
});

// Color nodes for color psychology tracking
CREATE (:Color {
  id: 'color_red',
  name: 'Red',
  hex: '#FF0000',
  rgb: [255, 0, 0],
  psychological_associations: ['urgency', 'passion', 'excitement', 'danger'],
  conversion_lift: 0.21,
  created_at: datetime()
});

CREATE (:Color {
  id: 'color_orange',
  name: 'Orange',
  hex: '#FFA500',
  rgb: [255, 165, 0],
  psychological_associations: ['energy', 'enthusiasm', 'warmth', 'action'],
  conversion_lift: 0.18,
  created_at: datetime()
});

CREATE (:Color {
  id: 'color_blue',
  name: 'Blue',
  hex: '#0000FF',
  rgb: [0, 0, 255],
  psychological_associations: ['trust', 'professionalism', 'calm', 'security'],
  conversion_lift: 0.12,
  created_at: datetime()
});

// Hook Type nodes
CREATE (:HookType {
  id: 'hook_pattern_interrupt',
  name: 'Pattern Interrupt',
  category: 'visual',
  description: 'Violate expectations in first 0.5 seconds',
  effectiveness_score: 0.82,
  optimal_placement: '0-0.5s',
  created_at: datetime()
});

CREATE (:HookType {
  id: 'hook_curiosity_gap',
  name: 'Curiosity Gap',
  category: 'narrative',
  description: 'Open loop in first 1 second',
  effectiveness_score: 0.76,
  optimal_placement: '0-1s',
  created_at: datetime()
});

CREATE (:HookType {
  id: 'hook_social_proof',
  name: 'Social Proof',
  category: 'psychological',
  description: 'Show results before process',
  effectiveness_score: 0.71,
  optimal_placement: '0-3s',
  created_at: datetime()
});

// Audio Signature nodes
CREATE (:AudioSignature {
  id: 'audio_trending',
  name: 'Trending Sound',
  type: 'trending',
  adoption_window: 24,
  effectiveness_multiplier: 2.3,
  created_at: datetime()
});

CREATE (:AudioSignature {
  id: 'audio_sonic_brand',
  name: 'Sonic Brand',
  type: 'branded',
  duration: [0.5, 1.0],
  effectiveness_multiplier: 1.4,
  created_at: datetime()
});

CREATE (:AudioSignature {
  id: 'audio_binaural',
  name: 'Binaural Beats',
  type: 'background',
  frequency: 40,
  effectiveness_multiplier: 1.2,
  created_at: datetime()
});

// ----------------------------------------------------------------------------
// ENTITY DEFINITIONS
// ----------------------------------------------------------------------------

// Entity nodes for extracting and tracking mentioned entities
CREATE (:Entity {
  id: 'entity_template',
  name: 'Entity Name',
  type: 'person|organization|location|product|concept|event',
  aliases: [],
  confidence: 1.0,
  created_at: datetime(),
  metadata: {}
});

// Trend nodes for tracking emerging trends
CREATE (:Trend {
  id: 'trend_template',
  name: 'Trend Name',
  platform: 'platform_id',
  category: 'hashtag|audio|format|challenge',
  velocity_score: 0.0,
  adoption_rate: 0.0,
  peak_predicted: datetime(),
  detected_at: datetime(),
  expires_at: datetime(),
  metadata: {}
});

// A/B Test nodes
CREATE (:ABTest {
  id: 'ab_test_template',
  name: 'Test Name',
  hypothesis: '',
  variants: 2,
  status: 'draft|running|completed|failed',
  started_at: datetime(),
  completed_at: datetime(),
  winner_id: '',
  confidence_level: 0.95,
  created_at: datetime(),
  metadata: {}
});

// ----------------------------------------------------------------------------
// RELATIONSHIP DEFINITIONS
// ----------------------------------------------------------------------------

// Content lineage relationships
// (:Content)-[:ADAPTED_FROM]->(:Content)
// (:Content)-[:ATOMIZED_FROM]->(:Content)
// (:Content)-[:PARENT_OF]->(:Content)

// Content to Platform
// (:Content)-[:OPTIMIZED_FOR]->(:Platform)

// Content to Creator
// (:Content)-[:CREATED_BY]->(:Creator)

// Content to Psychological Framework
// (:Content)-[:USES_FRAMEWORK]->(:PsychologicalFramework)

// Content to Emotion
// (:Content)-[:TRIGGERS_EMOTION]->(:Emotion)

// Content to Color
// (:Content)-[:USES_COLOR]->(:Color)

// Content to Hook Type
// (:Content)-[:USES_HOOK]->(:HookType)

// Content to Audio Signature
// (:Content)-[:INCLUDES_AUDIO]->(:AudioSignature)

// Content to Entity (mentioned entities)
// (:Content)-[:MENTIONS_ENTITY]->(:Entity)

// Content to Trend
// (:Content)-[:PARTICIPATES_IN_TREND]->(:Trend)

// Content to A/B Test
// (:Content)-[:TEST_VARIANT_OF]->(:ABTest)

// Asset relationships
// (:Content)-[:USES_ASSET]->(:Asset)

// Creator to Platform
// (:Creator)-[:HAS_PRESENCE_ON]->(:Platform)

// ----------------------------------------------------------------------------
// SAMPLE DATA
// ----------------------------------------------------------------------------

// Sample content atomization lineage
CREATE (parent:Content {
  id: 'content_youtube_parent_001',
  title: 'Complete Guide to Content Atomization',
  description: 'Learn how to repurpose content across platforms',
  platform: 'platform_youtube',
  content_type: 'long_form_video',
  duration_seconds: 1200,
  url: 'https://youtube.com/watch?v=xxx',
  status: 'published',
  created_at: datetime('2026-03-14T10:00:00Z'),
  published_at: datetime('2026-03-14T12:00:00Z'),
  embedding: [], // Vector embedding placeholder
  metadata: {
    views: 10000,
    retention_rate: 0.65,
    algorithm_signals: {
      watch_time: 780,
      ctr: 0.08,
      subscriber_growth: 50
    }
  }
})

CREATE (child1:Content {
  id: 'content_tiktok_child_001',
  title: 'Content Atomization Hack #1',
  description: 'First tip from the guide',
  platform: 'platform_tiktok',
  content_type: 'short_form_video',
  duration_seconds: 28,
  url: 'https://tiktok.com/@user/video/xxx',
  status: 'published',
  created_at: datetime('2026-03-14T14:00:00Z'),
  published_at: datetime('2026-03-14T14:30:00Z'),
  embedding: [],
  metadata: {
    views: 50000,
    engagement_rate: 0.15,
    algorithm_signals: {
      watch_time: 22,
      rewatch_rate: 0.45,
      shares: 5000
    }
  }
})

CREATE (child2:Content {
  id: 'content_twitter_child_001',
  title: 'Content Atomization Thread',
  description: 'Thread version of the guide',
  platform: 'platform_twitter',
  content_type: 'thread',
  duration_seconds: 0,
  url: 'https://twitter.com/user/status/xxx',
  status: 'published',
  created_at: datetime('2026-03-14T15:00:00Z'),
  published_at: datetime('2026-03-14T15:15:00Z'),
  embedding: [],
  metadata: {
    impressions: 25000,
    engagement_rate: 0.08,
    algorithm_signals: {
      quote_tweets: 150,
      likes: 2000
    }
  }
})

// Create relationships
CREATE (child1)-[:ATOMIZED_FROM {
  adaptation_type: 'clip_extraction',
  timestamp: datetime('2026-03-14T13:00:00Z'),
  ai_confidence: 0.96,
  human_reviewed: true
}]->(parent);

CREATE (child2)-[:ATOMIZED_FROM {
  adaptation_type: 'thread_summary',
  timestamp: datetime('2026-03-14T14:00:00Z'),
  ai_confidence: 0.89,
  human_reviewed: true
}]->(parent);

// Add psychological framework
MATCH (content:Content {id: 'content_tiktok_child_001'})
MATCH (framework:PsychologicalFramework {id: 'framework_curiosity_gap'})
CREATE (content)-[:USES_FRAMEWORK {
  strength: 0.85,
  detected_at: datetime()
}]->(framework);

// Add emotion
MATCH (content:Content {id: 'content_tiktok_child_001'})
MATCH (emotion:Emotion {id: 'emotion_surprise'})
CREATE (content)-[:TRIGGERS_EMOTION {
  intensity: 0.75,
  duration_seconds: 2.0,
  detected_at: datetime()
}]->(emotion);

// Add hook type
MATCH (content:Content {id: 'content_tiktok_child_001'})
MATCH (hook:HookType {id: 'hook_pattern_interrupt'})
CREATE (content)-[:USES_HOOK {
  position: 0.3,
  duration: 0.5,
  effectiveness: 0.92
}]->(hook);

// Add color
MATCH (content:Content {id: 'content_tiktok_child_001'})
MATCH (color:Color {id: 'color_red'})
CREATE (content)-[:USES_COLOR {
  prominence: 'primary',
  coverage_percent: 35.0,
  hex: '#FF0000'
}]->(color);

// ----------------------------------------------------------------------------
// USEFUL QUERIES
// ----------------------------------------------------------------------------

// Query 1: Get full content lineage
// MATCH path = (ancestor:Content {id: 'content_youtube_parent_001'})-[:ATOMIZED_FROM*]->(descendant:Content)
// RETURN path;

// Query 2: Find high-performing content using specific psychological framework
// MATCH (content:Content)-[:USES_FRAMEWORK]->(framework:PsychologicalFramework {name: 'Curiosity Gap'})
// WHERE content.metadata.engagement_rate > 0.1
// RETURN content.title, content.platform, content.metadata.engagement_rate
// ORDER BY content.metadata.engagement_rate DESC
// LIMIT 10;

// Query 3: Find content by emotional targeting
// MATCH (content:Content)-[:TRIGGERS_EMOTION]->(emotion:Emotion {name: 'Surprise'})
// WHERE content.created_at > datetime('2026-03-01')
// RETURN content.title, content.platform, emotion.valence, emotion.arousal;

// Query 4: Semantic similarity search (Neo4j 5.x+)
// CALL db.index.vector.queryNodes('content_embeddings', 10, $queryEmbedding)
// YIELD node, score
// RETURN node.title, node.platform, score;

// Query 5: Find trending content participating in high-velocity trends
// MATCH (content:Content)-[:PARTICIPATES_IN_TREND]->(trend:Trend)
// WHERE trend.velocity_score > 0.7
// AND trend.peak_predicted > datetime()
// RETURN content.title, content.platform, trend.name, trend.velocity_score
// ORDER BY trend.velocity_score DESC;

// Query 6: Get content performance by color psychology
// MATCH (content:Content)-[:USES_COLOR]->(color:Color)
// WITH color, avg(content.metadata.engagement_rate) as avg_engagement
// RETURN color.name, color.hex, color.psychological_associations, avg_engagement
// ORDER BY avg_engagement DESC;

// Query 7: Find A/B test winners
// MATCH (test:ABTest {status: 'completed'})<-[:TEST_VARIANT_OF]-(content:Content)
// RETURN test.name, content.title, content.metadata.engagement_rate, test.winner_id;

// Query 8: Cross-platform content performance comparison
// MATCH (parent:Content)-[:ATOMIZED_FROM]->(child:Content)
// RETURN parent.platform, child.platform,
//        count(child) as adaptation_count,
//        avg(child.metadata.engagement_rate) as avg_engagement
// GROUP BY parent.platform, child.platform;

// ----------------------------------------------------------------------------
// END OF SCHEMA
// ----------------------------------------------------------------------------
