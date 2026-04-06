import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_PATH = path.join(process.cwd(), "src/content/blog");

interface CategoryObject {
  name?: string;
  slug?: string;
}

interface DateWithValue {
  __value: string;
}

interface FrontmatterData {
  category?: string;
  categories?: (string | CategoryObject)[];
  date?: string | DateWithValue;
  publishedAt?: string | DateWithValue;
  title?: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
  readingTime: string;
}

export function getPostSlugs() {
  if (!fs.existsSync(POSTS_PATH)) return [];
  return fs.readdirSync(POSTS_PATH).filter((file) => {
    if (!/\.mdx$/.test(file) || file.startsWith('_')) return false;
    const problematicPosts = [
      '2025-01-20-cultivating-presence-virtual-meetings.mdx',
      '2025-05-05-breaking-stigma-leader-mental-health.mdx',
      '2025-05-19-mindful-delegation-leader-well-being.mdx',
      '2026-06-02-mid-year-reviews-mindfulness.mdx',
      '2025-04-21-mindful-leadership-growth-periods.mdx',
      '2026-01-20-micro-integrity-habit.mdx',
      '2026-03-03-stay-focused-distracting-world.mdx',
    ];
    return !problematicPosts.includes(file);
  });
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.mdx?$/, "");
  const fullPath = path.join(POSTS_PATH, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents) as { data: FrontmatterData; content: string };

  const stats = readingTime(content);

  let category = "Uncategorized";
  if (typeof data.category === "string") {
    category = data.category;
  } else if (Array.isArray(data.categories) && data.categories.length > 0) {
    const firstCategory = data.categories[0];
    if (typeof firstCategory === "string") {
      category = firstCategory;
    } else if (firstCategory && typeof firstCategory === "object") {
      category = firstCategory.name || firstCategory.slug || "Uncategorized";
    }
  }

  let dateValue = data.date || data.publishedAt;
  if (dateValue && typeof dateValue === 'object' && '__value' in dateValue) {
    dateValue = (dateValue as DateWithValue).__value;
  }
  const date = String(dateValue || '');
  return {
    slug: realSlug,
    title: data.title as string,
    date,
    description: (data.description || data.excerpt) as string,
    category,
    tags: (data.tags as string[]) || [],
    content,
    readingTime: stats.text,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}
