interface IconGridProps {
  items: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  columns?: number;
  className?: string;
}

export default function IconGrid({ items, columns = 3, className = '' }: IconGridProps) {
  return (
    <div className={`grid gap-6 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center p-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            <span className="text-xl">{item.icon}</span>
          </div>
          <h4 className="font-semibold mb-2" style={{ color: 'var(--heading)' }}>
            {item.title}
          </h4>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
