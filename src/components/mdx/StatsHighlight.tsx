import React from "react";

interface StatsHighlightProps {
  stat: string | number;
  description: string;
  trend?: "up" | "down" | "neutral";
}

/**
 * StatsHighlight - Display highlighted statistics with optional trend indicators
 *
 * @example
 * <StatsHighlight stat="98%" description="Customer satisfaction rate" trend="up" />
 */
export const StatsHighlight: React.FC<StatsHighlightProps> = ({
  stat,
  description,
  trend = "neutral",
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="my-8 p-6 rounded-lg border-2 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-bold" style={{ color: "var(--heading)" }}>
          {stat}
        </span>
        {trend !== "neutral" && (
          <span className={`text-2xl ${getTrendColor()}`}>{getTrendIcon()}</span>
        )}
      </div>
      <p
        className="text-sm font-medium mt-2"
        style={{ color: "var(--foreground)" }}
      >
        {description}
      </p>
    </div>
  );
};

export default StatsHighlight;
