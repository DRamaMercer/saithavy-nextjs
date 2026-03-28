// ============================================================================
// Migration 001: Initial Neo4j Knowledge Graph Schema
// Database: Neo4j 5.x
// Version: 1.0.0
// Date: 2026-03-14
// Description: Create initial schema with nodes, relationships, and indexes
// ============================================================================

// ----------------------------------------------------------------------------
// STEP 1: CREATE UNIQUE CONSTRAINTS
// ----------------------------------------------------------------------------

CREATE CONSTRAINT content_id_unique IF NOT EXISTS FOR (c:Content) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT asset_id_unique IF NOT EXISTS FOR (a:Asset) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (e:Entity) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT platform_id_unique IF NOT EXISTS FOR (p:Platform) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT creator_id_unique IF NOT EXISTS FOR (c:Creator) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT trend_id_unique IF NOT EXISTS FOR (t:Trend) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT abtest_id_unique IF NOT EXISTS FOR (t:ABTest) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT emotion_id_unique IF NOT EXISTS FOR (e:Emotion) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT color_id_unique IF NOT EXISTS FOR (c:Color) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT hook_id_unique IF NOT EXISTS FOR (h:HookType) REQUIRE h.id IS UNIQUE;
CREATE CONSTRAINT audio_id_unique IF NOT EXISTS FOR (a:AudioSignature) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT framework_id_unique IF NOT EXISTS FOR (f:PsychologicalFramework) REQUIRE f.id IS UNIQUE;

// ----------------------------------------------------------------------------
// STEP 2: CREATE FULL-TEXT SEARCH INDEXES
// ----------------------------------------------------------------------------

CREATE INDEX content_fulltext IF NOT EXISTS FOR (c:Content) ON EACH [c.title, c.description, c.transcript];
CREATE INDEX entity_fulltext IF NOT EXISTS FOR (e:Entity) ON EACH [e.name, e.aliases];
CREATE INDEX trend_fulltext IF NOT EXISTS FOR (t:Trend) ON EACH [t.name, t.category];

// ----------------------------------------------------------------------------
// STEP 3: CREATE PERFORMANCE INDEXES
// ----------------------------------------------------------------------------

CREATE INDEX content_created_at IF NOT EXISTS FOR (c:Content) ON (c.created_at);
CREATE INDEX content_status IF NOT EXISTS FOR (c:Content) ON (c.status);
CREATE INDEX content_platform IF NOT EXISTS FOR (c:Content) ON (c.platform);
CREATE INDEX content_type IF NOT EXISTS FOR (c:Content) ON (c.content_type);
CREATE INDEX entity_type IF NOT EXISTS FOR (e:Entity) ON (e.type);
CREATE INDEX trend_velocity IF NOT EXISTS FOR (t:Trend) ON (t.velocity_score DESC);
CREATE INDEX trend_platform IF NOT EXISTS FOR (t:Trend) ON (t.platform);
CREATE INDEX trend_category IF NOT EXISTS FOR (t:Trend) ON (t.category);

// ----------------------------------------------------------------------------
// STEP 4: CREATE VECTOR INDEX FOR SEMANTIC SIMILARITY
// ----------------------------------------------------------------------------

CREATE VECTOR INDEX content_embeddings IF NOT EXISTS FOR (c:Content) ON c.embedding OPTIONS {
  indexConfig: {
    `vector.dimensions`: 1536,
    `vector.similarity_function`: 'cosine'
  }
};

// ----------------------------------------------------------------------------
// STEP 5: CREATE PLATFORM NODES
// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------
// STEP 6: CREATE PSYCHOLOGICAL FRAMEWORK NODES
// ----------------------------------------------------------------------------

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

CREATE (:PsychologicalFramework {
  id: 'framework_social_proof',
  name: 'Social Proof',
  category: 'trust',
  triggers: ['testimonials', 'user_count', 'ratings'],
  effectiveness_score: 0.76,
  created_at: datetime()
});

// ----------------------------------------------------------------------------
// STEP 7: CREATE EMOTION NODES
// ----------------------------------------------------------------------------

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

CREATE (:Emotion {
  id: 'emotion_sadness',
  name: 'Sadness',
  valence: -0.9,
  arousal: 0.3,
  dominance: 0.2,
  color_primary: '#4169E1',
  created_at: datetime()
});

CREATE (:Emotion {
  id: 'emotion_disgust',
  name: 'Disgust',
  valence: -0.6,
  arousal: 0.5,
  dominance: 0.4,
  color_primary: '#228B22',
  created_at: datetime()
});

CREATE (:Emotion {
  id: 'emotion_anticipation',
  name: 'Anticipation',
  valence: 0.5,
  arousal: 0.6,
  dominance: 0.5,
  color_primary: '#FFA500',
  created_at: datetime()
});

// ----------------------------------------------------------------------------
// STEP 8: CREATE COLOR PSYCHOLOGY NODES
// ----------------------------------------------------------------------------

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
  id: 'color_yellow',
  name: 'Yellow',
  hex: '#FFFF00',
  rgb: [255, 255, 0],
  psychological_associations: ['optimism', 'happiness', 'attention', 'caution'],
  conversion_lift: 0.12,
  created_at: datetime()
});

CREATE (:Color {
  id: 'color_green',
  name: 'Green',
  hex: '#008000',
  rgb: [0, 128, 0],
  psychological_associations: ['growth', 'health', 'money', 'nature'],
  conversion_lift: 0.15,
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

CREATE (:Color {
  id: 'color_purple',
  name: 'Purple',
  hex: '#800080',
  rgb: [128, 0, 128],
  psychological_associations: ['luxury', 'creativity', 'wisdom', 'mystery'],
  conversion_lift: 0.14,
  created_at: datetime()
});

CREATE (:Color {
  id: 'color_pink',
  name: 'Pink',
  hex: '#FFC0CB',
  rgb: [255, 192, 203],
  psychological_associations: ['femininity', 'softness', 'playfulness', 'romance'],
  conversion_lift: 0.16,
  created_at: datetime()
});

CREATE (:Color {
  id: 'color_black',
  name: 'Black',
  hex: '#000000',
  rgb: [0, 0, 0],
  psychological_associations: ['sophistication', 'power', 'elegance', 'mystery'],
  conversion_lift: 0.19,
  created_at: datetime()
});

CREATE (:Color {
  id: 'color_white',
  name: 'White',
  hex: '#FFFFFF',
  rgb: [255, 255, 255],
  psychological_associations: ['purity', 'cleanliness', 'simplicity', 'minimalism'],
  conversion_lift: 0.08,
  created_at: datetime()
});

// ----------------------------------------------------------------------------
// STEP 9: CREATE HOOK TYPE NODES
// ----------------------------------------------------------------------------

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

CREATE (:HookType {
  id: 'hook_authority_signal',
  name: 'Authority Signal',
  category: 'credibility',
  description: 'Establish expertise immediately',
  effectiveness_score: 0.68,
  optimal_placement: '0-2s',
  created_at: datetime()
});

CREATE (:HookType {
  id: 'hook_emotional_arousal',
  name: 'Emotional Arousal',
  category: 'emotional',
  description: 'High energy opening with strong emotion',
  effectiveness_score: 0.74,
  optimal_placement: '0-1s',
  created_at: datetime()
});

CREATE (:HookType {
  id: 'hook_information_gap',
  name: 'Information Gap',
  category: 'curiosity',
  description: 'Promise specific value, withhold delivery',
  effectiveness_score: 0.69,
  optimal_placement: '0-2s',
  created_at: datetime()
});

// ----------------------------------------------------------------------------
// STEP 10: CREATE AUDIO SIGNATURE NODES
// ----------------------------------------------------------------------------

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

CREATE (:AudioSignature {
  id: 'audio_silence',
  name: 'Strategic Silence',
  type: 'technique',
  duration: [0.3, 0.5],
  effectiveness_multiplier: 1.6,
  created_at: datetime()
});

CREATE (:AudioSignature {
  id: 'audio_music_bed',
  name: 'Background Music',
  type: 'background',
  bpm_range: [120, 128],
  effectiveness_multiplier: 1.1,
  created_at: datetime()
});

// ----------------------------------------------------------------------------
// STEP 11: CREATE SYSTEM CREATOR NODE
// ----------------------------------------------------------------------------

CREATE (:Creator {
  id: 'creator_system',
  name: 'System AI',
  type: 'ai_agent',
  tier: 'internal',
  status: 'active',
  metadata: {}
});

// ----------------------------------------------------------------------------
// STEP 12: VERIFY CREATION
// ----------------------------------------------------------------------------

// Count nodes by type
MATCH (n) RETURN labels(n) as node_type, count(*) as count;

// Verify platform nodes
MATCH (p:Platform) RETURN p.id, p.name;

// Verify psychological frameworks
MATCH (pf:PsychologicalFramework) RETURN pf.id, pf.name;

// Verify emotions
MATCH (e:Emotion) RETURN e.id, e.name;

// Verify colors
MATCH (c:Color) RETURN c.id, c.name;

// Verify hooks
MATCH (h:HookType) RETURN h.id, h.name;

// Verify audio signatures
MATCH (a:AudioSignature) RETURN a.id, a.name;

// ----------------------------------------------------------------------------
// END OF MIGRATION
// ----------------------------------------------------------------------------
