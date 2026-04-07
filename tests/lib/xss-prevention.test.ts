/**
 * XSS Prevention Tests
 * Tests for JSON-LD sanitization, HTML validation, and safe prop generation
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeJsonLd,
  validateDangerousHtml,
  createJsonLdProps,
} from '@/lib/xss-prevention';

describe('XSS Prevention', () => {
  describe('sanitizeJsonLd', () => {
    it('should serialize valid JSON-LD data', () => {
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'My Article',
      };
      const result = sanitizeJsonLd(data);

      expect(result).toBe(JSON.stringify(data));
    });

    it('should handle nested objects', () => {
      const data = {
        '@context': 'https://schema.org',
        author: {
          '@type': 'Person',
          name: 'John Doe',
        },
      };
      const result = sanitizeJsonLd(data);

      expect(result).toBe(JSON.stringify(data));
    });

    it('should handle arrays', () => {
      const data = {
        '@context': 'https://schema.org',
        keywords: ['tech', 'javascript'],
      };
      const result = sanitizeJsonLd(data);

      expect(result).toBe(JSON.stringify(data));
    });

    it('should throw on data containing script tags', () => {
      const data = {
        name: '<script>alert("xss")</script>',
      };

      expect(() => sanitizeJsonLd(data)).toThrow('Potentially dangerous pattern detected');
    });

    it('should throw on data containing javascript: protocol', () => {
      const data = {
        url: 'javascript:alert(1)',
      };

      expect(() => sanitizeJsonLd(data)).toThrow('Potentially dangerous pattern detected');
    });

    it('should throw on data containing event handlers', () => {
      const data = {
        name: 'test',
        handler: 'onerror=alert(1)',
      };

      expect(() => sanitizeJsonLd(data)).toThrow('Potentially dangerous pattern detected');
    });

    it('should throw on data containing onclick', () => {
      const data = {
        attr: 'onclick=malicious()',
      };

      expect(() => sanitizeJsonLd(data)).toThrow('Potentially dangerous pattern detected');
    });

    it('should throw on data containing onload', () => {
      const data = {
        attr: 'onload=malicious()',
      };

      expect(() => sanitizeJsonLd(data)).toThrow('Potentially dangerous pattern detected');
    });

    it('should handle non-object data (primitives)', () => {
      expect(sanitizeJsonLd('string')).toBe('"string"');
      expect(sanitizeJsonLd(42)).toBe('42');
      expect(sanitizeJsonLd(true)).toBe('true');
      expect(sanitizeJsonLd(null)).toBe('null');
    });
  });

  describe('validateDangerousHtml', () => {
    it('should sanitize object content via sanitizeJsonLd', () => {
      const data = { '@context': 'https://schema.org', name: 'Test' };
      const result = validateDangerousHtml(data, 'markdown-frontmatter');

      expect(result).toBe(JSON.stringify(data));
    });

    it('should allow string content from trusted source', () => {
      const safeHtml = '<p>Safe content</p>';
      const result = validateDangerousHtml(safeHtml, 'markdown-frontmatter');

      expect(result).toBe(safeHtml);
    });

    it('should allow string content from static-content source', () => {
      const safeHtml = '<div>Static</div>';
      const result = validateDangerousHtml(safeHtml, 'static-content');

      expect(result).toBe(safeHtml);
    });

    it('should reject string content from untrusted source', () => {
      expect(() => {
        validateDangerousHtml('<p>content</p>', 'user-input');
      }).toThrow('must be from trusted source');
    });

    it('should reject string with script tags even from trusted source', () => {
      expect(() => {
        validateDangerousHtml('<script>alert(1)</script>', 'markdown-frontmatter');
      }).toThrow('Potentially dangerous HTML pattern detected');
    });

    it('should reject string with javascript: protocol', () => {
      expect(() => {
        validateDangerousHtml('<a href="javascript:alert(1)">click</a>', 'markdown-frontmatter');
      }).toThrow('Potentially dangerous HTML pattern detected');
    });

    it('should reject string with event handlers', () => {
      expect(() => {
        validateDangerousHtml('<img onerror="alert(1)">', 'markdown-frontmatter');
      }).toThrow('Potentially dangerous HTML pattern detected');
    });

    it('should reject string with iframe tags', () => {
      expect(() => {
        validateDangerousHtml('<iframe src="evil.com"></iframe>', 'markdown-frontmatter');
      }).toThrow('Potentially dangerous HTML pattern detected');
    });

    it('should reject string with object tags', () => {
      expect(() => {
        validateDangerousHtml('<object data="evil.swf"></object>', 'markdown-frontmatter');
      }).toThrow('Potentially dangerous HTML pattern detected');
    });

    it('should reject string with embed tags', () => {
      expect(() => {
        validateDangerousHtml('<embed src="evil.swf">', 'markdown-frontmatter');
      }).toThrow('Potentially dangerous HTML pattern detected');
    });

    it('should throw on invalid content type', () => {
      expect(() => {
        validateDangerousHtml(42, 'markdown-frontmatter');
      }).toThrow('Invalid content type');
    });

    it('should throw on undefined content', () => {
      expect(() => {
        validateDangerousHtml(undefined, 'markdown-frontmatter');
      }).toThrow('Invalid content type');
    });
  });

  describe('createJsonLdProps', () => {
    it('should return dangerouslySetInnerHTML props with sanitized JSON', () => {
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Test Article',
      };
      const props = createJsonLdProps(data);

      expect(props).toHaveProperty('__html');
      expect(props.__html).toBe(JSON.stringify(data));
    });

    it('should use default source when not specified', () => {
      const data = { name: 'Test' };
      const props = createJsonLdProps(data);

      expect(props.__html).toBe(JSON.stringify(data));
    });

    it('should accept custom source', () => {
      const data = { name: 'Test' };
      const props = createJsonLdProps(data, 'static-content');

      expect(props.__html).toBe(JSON.stringify(data));
    });

    it('should reject dangerous data', () => {
      const data = { name: '<script>alert(1)</script>' };

      expect(() => createJsonLdProps(data)).toThrow();
    });
  });
});
