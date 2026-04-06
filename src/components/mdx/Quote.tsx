import React from "react";

interface QuoteProps {
  text: string;
  author?: string;
  source?: string;
}

/**
 * Quote - Styled blockquote with attribution
 *
 * @example
 * <Quote text="Quote text" author="Author Name" source="Book Title" />
 */
export default function Quote({ text, author, source }: QuoteProps) {
  return (
    <blockquote className="my-8 pl-6 border-l-4 border-amber-500 italic">
      <p className="text-lg" style={{ color: "var(--foreground)" }}>
        &ldquo;{text}&rdquo;
      </p>
      {(author || source) && (
        <footer className="mt-4 text-sm font-medium">
          {author && <span>— {author}</span>}
          {source && <span className="text-gray-600 dark:text-gray-400">, {source}</span>}
        </footer>
      )}
    </blockquote>
  );
}
