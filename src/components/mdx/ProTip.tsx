import React from "react";
import { Lightbulb, LucideIcon } from "lucide-react";

interface ProTipProps {
  title: string;
  tip: string;
  icon?: LucideIcon;
}

/**
 * ProTip - Professional tip callout component
 * Visually distinct from Callout with business/professional context styling
 *
 * @example
 * <ProTip title="Pro Tip" tip="Always test your changes before deploying" />
 */
export const ProTip: React.FC<ProTipProps> = ({ title, tip, icon: Icon = Lightbulb }) => {
  return (
    <div className="my-6 p-5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-l-4 border-blue-500">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm uppercase tracking-wide text-blue-900 dark:text-blue-100 mb-2">
            {title}
          </h4>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--foreground)" }}
          >
            {tip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProTip;
