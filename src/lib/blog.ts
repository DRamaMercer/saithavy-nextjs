import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_PATH = path.join(process.cwd(), "src/content/blog");

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
  return fs.readdirSync(POSTS_PATH).filter((file) => /\.mdx?$/.test(file));
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.mdx?$/, "");
  const fullPath = path.join(POSTS_PATH, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const stats = readingTime(content);

  // Extract category from either data.category (string) or data.categories (array of objects)
  let category = "Uncategorized";
  if (typeof data.category === "string") {
    category = data.category;
  } else if (Array.isArray(data.categories) && data.categories.length > 0) {
    // categories is an array of objects like [{slug, name}]
    const firstCategory = data.categories[0];
    if (typeof firstCategory === "string") {
      category = firstCategory;
    } else if (firstCategory && typeof firstCategory === "object") {
      // Use the name if available, otherwise the slug
      category = (firstCategory as any).name || (firstCategory as any).slug || "Uncategorized";
    }
  }

  // Handle date - could be string or object (with __value in some cases)
  let dateValue = data.date || data.publishedAt;
  if (dateValue && typeof dateValue === 'object' && '__value' in dateValue) {
    dateValue = (dateValue as any).__value;
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
