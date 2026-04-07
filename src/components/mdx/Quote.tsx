import React from "react";

interface QuoteProps {
  text: string;
  author?: string;
  source?: string;
  /** Alias for source */
  citation?: string;
}

/**
 * Quote - Styled blockquote with attribution
 *
 * @example
 * <Quote text="Quote text" author="Author Name" source="Book Title" />
 *
 * @example
 * <Quote text="Quote text" author="Author Name" citation="Book Title" />
 */
export default function Quote({ text, author, source, citation }: QuoteProps) {
  const attribution = source || citation;

  return (
    <blockquote
      className="my-8 pl-6 border-l-4 italic"
      style={{ borderColor: 'var(--accent)' }}
    >
      <p className="text-lg" style={{ color: "var(--foreground)" }}>
        &ldquo;{text}&rdquo;
      </p>
      {(author || attribution) && (
        <footer className="mt-4 text-sm font-medium">
          {author && <span>— {author}</span>}
          {attribution && (
            <span style={{ color: "var(--muted)" }}>, {attribution}</span>
          )}
        </footer>
      )}
    </blockquote>
  );
}
