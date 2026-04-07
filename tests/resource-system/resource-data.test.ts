/**
 * Resource Data Integrity Tests
 * Tests for the resources data structure and content
 */

import { describe, it, expect } from 'vitest';
import { resources, categories, Resource } from '@/lib/resourcesData';

describe('Resource Data Integrity', () => {
  describe('Resource Count', () => {
    it('should have exactly 83 resources', () => {
      expect(resources).toHaveLength(83);
    });

    it('should have 5 categories plus "all"', () => {
      expect(categories).toHaveLength(6);
      expect(categories[0].id).toBe('all');
    });

    it('should have resources in all categories', () => {
      const categoryCounts = resources.reduce((acc, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Verify each category has resources
      expect(Object.keys(categoryCounts).length).toBeGreaterThan(0);
      expect(Object.keys(categoryCounts)).toContain('mindful-leadership');
      expect(Object.keys(categoryCounts)).toContain('ai-automation');
      expect(Object.keys(categoryCounts)).toContain('personal-growth');
      expect(Object.keys(categoryCounts)).toContain('remote-work');
      expect(Object.keys(categoryCounts)).toContain('overcoming-adversity');
    });
  });

  describe('Category Structure', () => {
    it('should have all required category fields', () => {
      categories.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('gradient');
        expect(category).toHaveProperty('resourceCount');

        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.description).toBe('string');
        expect(typeof category.resourceCount).toBe('number');
      });
    });

    it('should have unique category IDs', () => {
      const ids = categories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid category IDs', () => {
      const validIds = ['all', 'mindful-leadership', 'ai-automation', 'personal-growth', 'remote-work', 'overcoming-adversity'];
      categories.forEach((category) => {
        expect(validIds).toContain(category.id);
      });
    });
  });

  describe('Resource Structure', () => {
    it('should have all required fields for each resource', () => {
      const requiredFields: (keyof Resource)[] = [
        'id',
        'slug',
        'title',
        'description',
        'category',
        'type',
        'featured',
        'downloads',
        'difficulty',
        'timeToRead',
        'targetAudience',
      ];

      resources.forEach((resource) => {
        requiredFields.forEach((field) => {
          expect(resource).toHaveProperty(field);
        });
      });
    });

    it('should have unique resource IDs', () => {
      const ids = resources.map((r) => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid difficulty levels', () => {
      const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
      resources.forEach((resource) => {
        expect(validDifficulties).toContain(resource.difficulty);
      });
    });

    it('should have valid categories', () => {
      const validCategories = ['mindful-leadership', 'ai-automation', 'personal-growth', 'remote-work', 'overcoming-adversity'];
      resources.forEach((resource) => {
        expect(validCategories).toContain(resource.category);
      });
    });

    it('should have at least 3 learning outcomes for featured resources', () => {
      const featuredResources = resources.filter((r) => r.featured);
      featuredResources.forEach((resource) => {
        expect(resource.whatYoullLearn).toBeDefined();
        expect(Array.isArray(resource.whatYoullLearn)).toBe(true);
        expect(resource.whatYoullLearn.length).toBeGreaterThanOrEqual(3);
        expect(resource.whatYoullLearn.length).toBeLessThanOrEqual(7);
      });
    });

    it('should have download counts as numbers', () => {
      resources.forEach((resource) => {
        expect(typeof resource.downloads).toBe('number');
        expect(resource.downloads).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have featured as boolean', () => {
      resources.forEach((resource) => {
        expect(typeof resource.featured).toBe('boolean');
      });
    });

    it('should have non-empty required string fields', () => {
      resources.forEach((resource) => {
        expect(resource.title.length).toBeGreaterThan(0);
        expect(resource.description.length).toBeGreaterThan(0);
        expect(resource.type.length).toBeGreaterThan(0);
        expect(resource.slug.length).toBeGreaterThan(0);
      });
    });

    it('should have featured resources distributed across categories', () => {
      const featured = resources.filter((r) => r.featured);
      expect(featured.length).toBeGreaterThan(0);

      // Featured resources should be distributed across categories
      const featuredByCategory = featured.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Should have featured resources in multiple categories
      expect(Object.keys(featuredByCategory).length).toBeGreaterThanOrEqual(2);
    });

    it('should have optional whatYoullLearn for featured resources', () => {
      const featuredResources = resources.filter((r) => r.featured);
      featuredResources.forEach((resource) => {
        // Featured resources should have whatYoullLearn
        expect(resource.whatYoullLearn).toBeDefined();
        expect(Array.isArray(resource.whatYoullLearn)).toBe(true);
      });
    });
  });

  describe('Content Quality', () => {
    it('should have descriptive titles (5-100 chars)', () => {
      resources.forEach((resource) => {
        expect(resource.title.length).toBeGreaterThanOrEqual(5);
        expect(resource.title.length).toBeLessThanOrEqual(100);
      });
    });

    it('should have meaningful descriptions (20-500 chars)', () => {
      resources.forEach((resource) => {
        expect(resource.description.length).toBeGreaterThanOrEqual(20);
        expect(resource.description.length).toBeLessThanOrEqual(500);
      });
    });

    it('should have reasonable time to read (5-180 min)', () => {
      resources.forEach((resource) => {
        const match = resource.timeToRead.match(/(\d+)\s*min/);
        expect(match).not.toBeNull();

        const minutes = parseInt(match![1]);
        expect(minutes).toBeGreaterThanOrEqual(5);
        expect(minutes).toBeLessThanOrEqual(180);
      });
    });

    it('should have valid resource types', () => {
      const validTypes = ['PDF', 'Template', 'Guide', 'Audio', 'Video', 'Checklist', 'Workbook', 'Assessment', 'Framework'];
      resources.forEach((resource) => {
        expect(validTypes).toContain(resource.type);
      });
    });
  });

  describe('Slug Validation', () => {
    it('should have valid slug formats', () => {
      resources.forEach((resource) => {
        // Slugs should be lowercase with hyphens
        expect(resource.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      });
    });

    it('should have unique slugs', () => {
      const slugs = resources.map((r) => r.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe('Data Consistency', () => {
    it('should match categories to category definitions', () => {
      const categoryIds = categories.map((c) => c.id);
      resources.forEach((resource) => {
        expect(categoryIds).toContain(resource.category);
      });
    });

    it('should have matching category resource counts', () => {
      categories.forEach((category) => {
        if (category.id !== 'all') {
          const actualCount = resources.filter((r) => r.category === category.id).length;
          expect(actualCount).toBe(category.resourceCount);
        }
      });
    });
  });

  describe('Statistics', () => {
    it('should calculate correct total downloads', () => {
      const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);
      expect(totalDownloads).toBeGreaterThanOrEqual(0);
    });

    it('should have valid download counts', () => {
      resources.forEach((resource) => {
        expect(resource.downloads).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(resource.downloads)).toBe(true);
      });
    });

    it('should have featured resources with good visibility', () => {
      const featuredResources = resources.filter((r) => r.featured);
      if (featuredResources.length === 0) return;
      const avgFeaturedDownloads = featuredResources.reduce((sum, r) => sum + r.downloads, 0) / featuredResources.length;
      const avgAllDownloads = resources.reduce((sum, r) => sum + r.downloads, 0) / resources.length;
      expect(avgFeaturedDownloads).toBeGreaterThanOrEqual(avgAllDownloads);
    });
  });
});
