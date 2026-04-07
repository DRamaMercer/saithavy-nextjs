import React from "react";

interface StatItem {
  label: string;
  value: string | number;
}

interface StatsProps {
  title?: string;
  items?: StatItem[];
  /** Alias for items */
  stats?: StatItem[];
}

/**
 * Stats - Grid of statistics
 *
 * @example
 * <Stats items={[
 *   { label: "Users", value: "10K+" },
 *   { label: "Revenue", value: "$1M" }
 * ]} />
 *
 * @example
 * <Stats stats={[
 *   { label: "Users", value: "10K+" },
 *   { label: "Revenue", value: "$1M" }
 * ]} />
 */
export default function Stats({ title, items, stats }: StatsProps) {
  const data = items || stats || [];

  if (!data || data.length === 0) {
    return <div>No stats available</div>;
  }

  return (
    <div className="my-8">
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--heading)" }}>
          {title}
        </h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-lg"
            style={{ background: "var(--surface)" }}
          >
            <div
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--accent)" }}
            >
              {item.value}
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
