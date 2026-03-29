/**
 * DeliverableCard Component
 * Displays "What's Included" items with checkmark
 */

"use client";

import { CheckCircle2 } from "lucide-react";

interface DeliverableCardProps {
  title: string;
  description?: string;
}

export default function DeliverableCard({
  title,
  description,
}: DeliverableCardProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center mt-0.5">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <div>
        <h4 className="font-semibold text-lg mb-1 text-white dark:text-slate-100">
          {title}
        </h4>
        {description && (
          <p className="text-blue-200 dark:text-blue-300 text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
