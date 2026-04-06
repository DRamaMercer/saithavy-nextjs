interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  image?: string;
  className?: string;
}

export default function Testimonial({ quote, author, role, company, image, className = '' }: TestimonialProps) {
  return (
    <div 
      className={`my-8 p-6 rounded-lg ${className}`}
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <div className="flex items-start gap-4">
        {image && (
          <div className="flex-shrink-0">
            <img 
              src={image} 
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        )}
        <div>
          <blockquote className="text-lg italic mb-4" style={{ color: 'var(--foreground)' }}>
            &ldquo;{quote}&rdquo;
          </blockquote>
          <div className="font-medium" style={{ color: 'var(--heading)' }}>
            {author}
          </div>
          {(role || company) && (
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              {[role, company].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
