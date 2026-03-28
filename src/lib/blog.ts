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

  return {
    slug: realSlug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    category: (data.category as string) || "Uncategorized",
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
