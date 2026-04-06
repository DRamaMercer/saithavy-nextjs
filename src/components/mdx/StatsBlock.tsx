interface StatsBlockProps {
  stats: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  className?: string;
}

export default function StatsBlock({ stats, className = '' }: StatsBlockProps) {
  return (
    <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map((stat, i) => (
        <div key={i} className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
            {stat.value}
          </div>
          <div className="text-sm font-medium mb-1" style={{ color: 'var(--heading)' }}>
            {stat.label}
          </div>
          {stat.description && (
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {stat.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
