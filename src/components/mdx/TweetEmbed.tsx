interface TweetEmbedProps {
  id: string;
  className?: string;
}

export default function TweetEmbed({ id, className = '' }: TweetEmbedProps) {
  return (
    <div className={`my-6 p-4 rounded-lg border ${className}`} style={{ 
      borderColor: 'var(--border)',
      backgroundColor: 'var(--surface)'
    }}>
      <div className="text-center text-sm" style={{ color: 'var(--muted)' }}>
        Tweet embed: {id}
      </div>
    </div>
  );
}
