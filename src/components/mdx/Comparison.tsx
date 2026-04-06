interface ComparisonProps {
  title?: string;
  columns: Array<{
    title: string;
    description?: string;
  }>;
  rows: Array<{
    category: string;
    items: string[];
  }>;
}

export default function Comparison({ title, columns, rows }: ComparisonProps) {
  return (
    <div className="my-8 p-6 rounded-lg border" style={{ 
      borderColor: 'var(--border)',
      backgroundColor: 'var(--surface)'
    }}>
      {title && (
        <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--heading)' }}>
          {title}
        </h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="p-3 text-left font-medium" style={{ color: 'var(--foreground)' }}></th>
              {columns.map((col, i) => (
                <th key={i} className="p-3 text-center font-medium" style={{ color: 'var(--accent)' }}>
                  <div className="font-semibold">{col.title}</div>
                  {col.description && (
                    <div className="text-sm font-normal mt-1" style={{ color: 'var(--muted)' }}>
                      {col.description}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b" style={{ borderColor: 'var(--border)' }}>
                <td className="p-3 font-medium" style={{ color: 'var(--foreground)' }}>
                  {row.category}
                </td>
                {row.items.map((item, j) => (
                  <td key={j} className="p-3 text-center" style={{ color: 'var(--foreground)' }}>
                    {item}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
