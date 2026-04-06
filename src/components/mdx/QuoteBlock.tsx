interface QuoteBlockProps {
  quote: string;
  author?: string;
  role?: string;
  className?: string;
}

export default function QuoteBlock({ quote, author, role, className = '' }: QuoteBlockProps) {
  return (
    <blockquote 
      className={`my-8 p-6 rounded-lg border-l-4 ${className}`}
      style={{ 
        borderColor: 'var(--accent)',
        backgroundColor: 'var(--surface)'
      }}
    >
      <p className="text-lg italic mb-4" style={{ color: 'var(--foreground)' }}>
        &ldquo;{quote}&rdquo;
      </p>
      {(author || role) && (
        <footer className="text-sm" style={{ color: 'var(--muted)' }}>
          {author && <cite className="font-medium">{author}</cite>}
          {role && <span> — {role}</span>}
        </footer>
      )}
    </blockquote>
  );
}
