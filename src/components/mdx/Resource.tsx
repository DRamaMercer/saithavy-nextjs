interface ResourceProps {
  title: string;
  url: string;
  description?: string;
  type?: string;
  className?: string;
}

export default function Resource({ title, url, description, type, className = '' }: ResourceProps) {
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 rounded-lg border transition-colors hover:border-amber-500 ${className}`}
      style={{ 
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface)'
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {type && (
          <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">
            {type}
          </span>
        )}
        <span className="font-medium" style={{ color: 'var(--heading)' }}>
          {title}
        </span>
      </div>
      {description && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {description}
        </p>
      )}
    </a>
  );
}
