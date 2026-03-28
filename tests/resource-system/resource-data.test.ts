/**
 * Resource Data Integrity Tests
 * Tests for the resources data structure and content
 */

import { describe, it, expect } from 'vitest';
import { resources, categories, Resource } from '@/lib/resourcesData';

describe('Resource Data Integrity', () => {
  describe('Resource Count', () => {
    it('should have exactly 18 resources', () => {
      expect(resources).toHaveLength(18);
    });

    it('should have 6 categories plus "all"', () => {
      expect(categories).toHaveLength(7);
      expect(categories[0].id).toBe('all');
    });

    it('should have exactly 3 resources per category', () => {
      const categoryCounts = resources.reduce((acc, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Each category should have exactly 3 resources
      Object.entries(categoryCounts).forEach(([category, count]) => {
        expect(count).toBe(3);
      });
    });
  });

  describe('Category Structure', () => {
    it('should have all required category fields', () => {
      categories.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('color');

        expect(typeof category.id).toBe('string');
        expect(typeof category.name).toBe('string');
        expect(typeof category.color).toBe('string');
      });
    });

    it('should have unique category IDs', () => {
      const ids = categories.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid category IDs', () => {
      const validIds = ['all', 'leadership', 'team-management', 'productivity', 'communication', 'templates', 'assessments'];
      categories.forEach((category) => {
        expect(validIds).toContain(category.id);
      });
    });
  });

  describe('Resource Structure', () => {
    it('should have all required fields for each resource', () => {
      const requiredFields: (keyof Resource)[] = [
        'id',
        'title',
        'description',
        'category',
        'type',
        'icon',
        'url',
        'fileSize',
        'difficulty',
        'timeToRead',
        'targetAudience',
        'whatYoullLearn',
        'featured',
        'downloads'
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
      const validCategories = ['leadership', 'team-management', 'productivity', 'communication', 'templates', 'assessments'];
      resources.forEach((resource) => {
        expect(validCategories).toContain(resource.category);
      });
    });

    it('should have at least 3 learning outcomes', () => {
      resources.forEach((resource) => {
        expect(resource.whatYoullLearn.length).toBeGreaterThanOrEqual(3);
        expect(resource.whatYoullLearn.length).toBeLessThanOrEqual(5);
      });
    });

    it('should have download counts as numbers', () => {
      resources.forEach((resource) => {
        expect(typeof resource.downloads).toBe('number');
        expect(resource.downloads).toBeGreaterThan(0);
      });
    });

    it('should have featured as boolean', () => {
      resources.forEach((resource) => {
        expect(typeof resource.featured).toBe('boolean');
      });
    });

    it('should have non-empty required string fields', () => {
      resources.forEach((resource) => {
        expect(resource.title.trim()).length.toBeGreaterThan(0);
        expect(resource.description.trim()).length.toBeGreaterThan(0);
        expect(resource.type.trim()).length.toBeGreaterThan(0);
        expect(resource.url.trim()).length.toBeGreaterThan(0);
      });
    });

    it('should have exactly 6 featured resources', () => {
      const featured = resources.filter((r) => r.featured);
      expect(featured.length).toBe(6);

      // One per category
      const featuredByCategory = featured.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.values(featuredByCategory).forEach((count) => {
        expect(count).toBe(1);
      });
    });

    it('should have isPremium as optional boolean', () => {
      resources.forEach((resource) => {
        if (resource.isPremium !== undefined) {
          expect(typeof resource.isPremium).toBe('boolean');
        }
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

    it('should have meaningful descriptions (50-300 chars)', () => {
      resources.forEach((resource) => {
        expect(resource.description.length).toBeGreaterThanOrEqual(50);
        expect(resource.description.length).toBeLessThanOrEqual(300);
      });
    });

    it('should have reasonable time to read (5-90 min)', () => {
      resources.forEach((resource) => {
        const match = resource.timeToRead.match(/(\d+)\s*min/);
        expect(match).not.toBeNull();

        const minutes = parseInt(match![1]);
        expect(minutes).toBeGreaterThanOrEqual(5);
        expect(minutes).toBeLessThanOrEqual(90);
      });
    });

    it('should have valid file size formats', () => {
      const validPatterns = [
        /^\d+(\.\d+)?\s*MB\s*PDF$/,
        /^Notion\s*Template$/,
        /^Interactive\s*PDF$/,
        /^Notion\s*\+\s*PDF$/,
        /^Notion\s*\+\s*Google\s*Sheets$/,
        /^Interactive\s*PDF\s*\+\s*Workbook$/,
        /^Template\s*Suite$/,
        /^Scorecard$/,
        /^Cheatsheet$/,
        /^System$/,
        /^Guide$/,
        /^Framework$/,
        /^Playbook$/,
        /^Assessment$/,
        /^Assessment\s*Tool$/,
        /^Checklist$/,
        /^E-Book$/
      ];

      resources.forEach((resource) => {
        const matches = validPatterns.some((pattern) =>
          pattern.test(resource.fileSize)
        );
        expect(matches).toBe(true);
      });
    });
  });

  describe('URL Validation', () => {
    it('should have valid URL formats', () => {
      resources.forEach((resource) => {
        // For now, URLs can be "#" or valid URLs
        if (resource.url !== '#') {
          try {
            new URL(resource.url);
          } catch (e) {
            fail(`Invalid URL for resource ${resource.id}: ${resource.url}`);
          }
        }
      });
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent icon components', () => {
      resources.forEach((resource) => {
        expect(resource.icon).toBeDefined();
        // Icon should be a React element (object with type, props, key)
        expect(typeof resource.icon).toBe('object');
      });
    });

    it('should match category to icon colors', () => {
      const colorMap: Record<string, string> = {
        leadership: 'purple',
        'team-management': 'blue',
        productivity: 'amber',
        communication: 'emerald',
        templates: 'pink',
        assessments: 'indigo'
      };

      resources.forEach((resource) => {
        const expectedColor = colorMap[resource.category];
        const iconHtml = String(resource.icon);
        expect(iconHtml).toContain(expectedColor);
      });
    });
  });

  describe('Statistics', () => {
    it('should calculate correct total downloads', () => {
      const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);
      expect(totalDownloads).toBeGreaterThan(100000);
    });

    it('should have resources with good download counts', () => {
      resources.forEach((resource) => {
        expect(resource.downloads).toBeGreaterThanOrEqual(1000);
      });
    });

    it('should have premium resources with higher download counts', () => {
      const premiumAvg = resources
        .filter((r) => r.isPremium)
        .reduce((sum, r) => sum + r.downloads, 0) /
        resources.filter((r) => r.isPremium).length;

      const freeAvg = resources
        .filter((r) => !r.isPremium)
        .reduce((sum, r) => sum + r.downloads, 0) /
        resources.filter((r) => !r.isPremium).length;

      expect(premiumAvg).toBeGreaterThanOrEqual(freeAvg);
    });
  });
});
