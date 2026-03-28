import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/blog";
import { format, parseISO } from "date-fns";

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
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1
            className="font-[family-name:var(--font-poppins)] font-bold text-4xl md:text-5xl mb-6"
            style={{ color: "var(--heading)" }}
          >
            Insights & <span className="text-gradient">Reflections</span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            Deep dives into authentic leadership, the future of remote work, and
            how to harness AI for personal growth.
          </p>
        </header>

        {/* Categories (Static UI for now, can be made interactive later) */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <span
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--accent)", color: "white" }}
          >
            All
          </span>
          {categories.map((category) => (
            <span
              key={category}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--heading)",
              }}
            >
              {category}
            </span>
          ))}
        </div>

        {/* Blog Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 shadow-sm hover:shadow-xl"
              style={{ backgroundColor: "var(--surface)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--accent)",
                  }}
                >
                  {post.category}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--foreground)" }}
                >
                  {post.readingTime}
                </span>
              </div>
              <h2
                className="font-[family-name:var(--font-poppins)] font-bold text-xl mb-3 group-hover:text-amber-500 transition-colors"
                style={{ color: "var(--heading)" }}
              >
                {post.title}
              </h2>
              <p
                className="text-sm mb-4 line-clamp-3"
                style={{ color: "var(--foreground)" }}
              >
                {post.description}
              </p>
              <div
                className="flex items-center text-sm font-medium mt-auto border-t pt-4"
                style={{ borderColor: "var(--border)" }}
              >
                <span style={{ color: "var(--foreground)" }}>
                  {format(parseISO(post.date), "MMMM d, yyyy")}
                </span>
                <span
                  className="ml-auto inline-flex items-center"
                  style={{ color: "var(--accent)" }}
                >
                  Read Article
                  <svg
                    className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
