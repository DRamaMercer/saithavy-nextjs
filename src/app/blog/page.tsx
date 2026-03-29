import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { format, parseISO } from "date-fns";
import BlogClient from "./BlogClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// ISR: Revalidate every hour for blog index updates
export const revalidate = 3600;

export const metadata = {
  title: "Blog & Insights | Saithavy",
  description:
    "Read my latest thoughts on remote work, authentic leadership, and AI automation.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <ErrorBoundary>
      <BlogClient posts={posts} categories={categories} />
    </ErrorBoundary>
  );
}
