import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { format, parseISO } from "date-fns";
import ReadingProgress from "@/components/ReadingProgress";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Callout from "@/components/mdx/Callout";
import Checklist from "@/components/mdx/Checklist";
import ChecklistItem from "@/components/mdx/ChecklistItem";
import Accordion, { AccordionItem } from "@/components/mdx/Accordion";
import Tabs, { Tab } from "@/components/mdx/Tabs";
import StepGuide from "@/components/mdx/StepGuide";
import StepGuideStep from "@/components/mdx/StepGuideStep";
import ImageGallery from "@/components/mdx/ImageGallery";
import Timeline from "@/components/mdx/Timeline";
import Quote from "@/components/mdx/Quote";
import Stats from "@/components/mdx/Stats";
import CodeBlock from "@/components/mdx/CodeBlock";
import VideoEmbed from "@/components/mdx/VideoEmbed";
import ProgressBar from "@/components/mdx/ProgressBar";
import TwoColumn from "@/components/mdx/TwoColumn";
import ToolRecommendation from "@/components/mdx/ToolRecommendation";
import StatsHighlight from "@/components/mdx/StatsHighlight";
import ProTip from "@/components/mdx/ProTip";

const mdxComponents = {
  Callout,
  Checklist,
  ChecklistItem,
  Accordion,
  AccordionItem,
  Tabs,
  Tab,
  StepGuide,
  StepGuideStep,
  ImageGallery,
  Timeline,
  Quote,
  Stats,
  CodeBlock,
  VideoEmbed,
  ProgressBar,
  TwoColumn,
  ToolRecommendation,
  StatsHighlight,
  ProTip,
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalidate every 24 hours for blog posts (rarely edited)
export const revalidate = 86400;

// Generate static routes at build time
export function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, ""),
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  try {
    const post = getPostBySlug(resolvedParams.slug);
    return {
      title: `${post.title} | Saithavy`,
      description: post.description,
    };
  } catch {
    return {
      title: "Post Not Found | Saithavy",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  let post;

  try {
    post = getPostBySlug(resolvedParams.slug);
  } catch {
    notFound();
  }

  return (
    <>
      <ReadingProgress />

      <article className="min-h-screen pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center mb-10 text-sm font-medium transition-colors hover:text-amber-500"
            style={{ color: "var(--foreground)" }}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to all articles
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--accent)",
                }}
              >
                {post.category}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {post.date ? format(parseISO(post.date), "MMMM d, yyyy") : "Unknown date"}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                • {post.readingTime}
              </span>
            </div>

            <h1
              className="font-[family-name:var(--font-poppins)] font-bold text-4xl md:text-5xl leading-tight mb-6"
              style={{ color: "var(--heading)" }}
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded border"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            style={{ color: "var(--foreground)" }}
          >
            {/* 
              Tailwind typography plugin is required for prose to work correctly.
              It will be installed via npm in the next step to properly style the MDX.
            */}
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [],
                  rehypePlugins: [],
                },
                parseFrontmatter: true,
              }}
            />
          </div>

          <hr className="my-12" style={{ borderColor: "var(--border)" }} />

          <div
            className="p-8 rounded-2xl text-center"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <h3
              className="font-bold text-xl mb-3"
              style={{ color: "var(--heading)" }}
            >
              Enjoyed this article?
            </h3>
            <p
              className="mb-6 max-w-md mx-auto"
              style={{ color: "var(--foreground)" }}
            >
              Subscribe to my newsletter for more insights on authentic remote
              work and AI automation.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
