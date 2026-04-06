interface ComparisonTableProps {
  title?: string;
  methods: Array<{
    method: string;
    description: string;
    bestFor: string;
    difficulty: string;
    timeInvestment: string;
  }>;
}

export default function ComparisonTable({ title, methods }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto">
      {title && (
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--heading)' }}>
          {title}
        </h3>
      )}
      <table className="w-full rounded-lg overflow-hidden" style={{ 
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface)'
      }}>
        <thead>
          <tr className="border-b" style={{ 
            borderColor: 'var(--border)',
            backgroundColor: 'var(--background)'
          }}>
            <th className="p-3 text-left font-medium" style={{ color: 'var(--accent)' }}>Method</th>
            <th className="p-3 text-left font-medium" style={{ color: 'var(--accent)' }}>Description</th>
            <th className="p-3 text-left font-medium" style={{ color: 'var(--accent)' }}>Best For</th>
            <th className="p-3 text-left font-medium" style={{ color: 'var(--accent)' }}>Difficulty</th>
            <th className="p-3 text-left font-medium" style={{ color: 'var(--accent)' }}>Time Investment</th>
          </tr>
        </thead>
        <tbody>
          {methods.map((m, i) => (
            <tr key={i} className="border-b" style={{ borderColor: 'var(--border)' }}>
              <td className="p-3 font-medium" style={{ color: 'var(--heading)' }}>{m.method}</td>
              <td className="p-3" style={{ color: 'var(--foreground)' }}>{m.description}</td>
              <td className="p-3" style={{ color: 'var(--foreground)' }}>{m.bestFor}</td>
              <td className="p-3">
                <span 
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: m.difficulty === 'Easy' ? 'var(--accent)' : 'var(--border)',
                    color: m.difficulty === 'Easy' ? 'white' : 'var(--foreground)'
                  }}
                >
                  {m.difficulty}
                </span>
              </td>
              <td className="p-3" style={{ color: 'var(--foreground)' }}>{m.timeInvestment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
