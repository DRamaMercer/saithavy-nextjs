import React from "react";

interface TimelineItem {
  year?: string;
  date?: string;
  title: string;
  description?: string;
  icon?: string;
  content?: string;
  estimatedTime?: string;
}

interface TimelineProps {
  title?: string;
  events: TimelineItem[];
}

/**
 * Timeline - Vertical timeline of events
 *
 * @example
 * <Timeline events={[
 *   { year: "2020", title: "Event 1", description: "Description" },
 *   { year: "2021", title: "Event 2" }
 * ]} />
 */
export default function Timeline({ title, events }: TimelineProps) {
  if (!events || events.length === 0) {
    return <div>No timeline events available</div>;
  }

  return (
    <div className="my-8 relative">
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--heading)" }}>
          {title}
        </h3>
      )}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="relative pl-10">
            <div className="absolute left-2.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-gray-900" />
            <div
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                {event.year || event.date}
              </span>
              <h4
                className="font-semibold mt-1"
                style={{ color: "var(--heading)" }}
              >
                {event.title}
              </h4>
              {event.description && (
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
