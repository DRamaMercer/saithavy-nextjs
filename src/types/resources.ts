/**
 * Resource Type Definitions
 *
 * Defines the shape of resource data throughout the application.
 * Follows strict TypeScript patterns for type safety.
 */

import { LucideIcon } from 'lucide-react';

/**
 * Resource categories with their display metadata
 */
export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  resourceCount: number;
}

/**
 * Main resource type
 */
export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ResourceCategoryType;
  type: ResourceType;
  icon?: LucideIcon;
  featured: boolean;
  downloads: number;
  isPremium?: boolean;

  // Content metadata
  fileSize?: string;
  difficulty?: DifficultyLevel;
  timeToRead?: string;
  targetAudience?: string;

  // Learning outcomes
  whatYoullLearn?: string[];

  // SEO metadata
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];

  // Content file path (relative to /content/resources/)
  contentPath?: string;
}

/**
 * Resource category types
 */
export type ResourceCategoryType =
  | 'mindful-leadership'
  | 'ai-automation'
  | 'personal-growth'
  | 'remote-work'
  | 'overcoming-adversity';

/**
 * Resource format types
 */
export type ResourceType =
  | 'PDF'
  | 'Template'
  | 'Guide'
  | 'Audio'
  | 'Video'
  | 'Checklist'
  | 'Workbook'
  | 'Assessment'
  | 'Framework';

/**
 * Difficulty levels
 */
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * Download format options
 */
export type DownloadFormat = 'pdf' | 'web' | 'print';

/**
 * Resource content metadata (from frontmatter)
 */
export interface ResourceContentMetadata {
  title: string;
  description: string;
  category: ResourceCategoryType;
  type: ResourceType;
  featured?: boolean;
  difficulty?: DifficultyLevel;
  timeToRead?: string;
  targetAudience?: string;
  keywords?: string[];
  lastUpdated?: string;
}

/**
 * Complete resource with content
 */
export interface ResourceWithContent extends Resource {
  content: string;
  metadata: ResourceContentMetadata;
}

/**
 * Email capture data
 */
export interface EmailCaptureData {
  firstName?: string;
  email: string;
  resourceId: string;
  format: DownloadFormat;
}

/**
 * Download tracking data
 */
export interface DownloadTrackingData {
  resourceId: string;
  resourceTitle: string;
  category: ResourceCategoryType;
  format: DownloadFormat;
  timestamp: Date;
  emailCaptured: boolean;
}
