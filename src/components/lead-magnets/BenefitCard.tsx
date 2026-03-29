/**
 * BenefitCard Component
 * Reusable card for displaying benefits/features
 */

"use client";

import {
  Star,
  Shield,
  Heart,
  Sunrise,
  Users,
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
  Award,
  BookOpen,
  Lightbulb,
  Clock,
  Home,
  Globe,
  Calendar,
  Sparkles,
  Bot,
  Brain,
} from "lucide-react";

// Icon map for dynamic icon resolution (only imports used icons)
const iconMap: Record<string, React.ElementType> = {
  Star,
  Shield,
  Heart,
  Sunrise,
  Users,
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
  Award,
  BookOpen,
  Lightbulb,
  Clock,
  Home,
  Globe,
  Calendar,
  Sparkles,
  Bot,
  Brain,
};

interface BenefitCardProps {
  iconName: string;
  title: string;
  description: string;
  color?: string;
}

export default function BenefitCard({
  iconName,
  title,
  description,
  color = "text-[#E07A5F]",
}: BenefitCardProps) {
  // Get the icon component from map, or fallback to Star
  const IconComponent = iconMap[iconName] || Star;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/20 dark:from-slate-800/50 dark:to-slate-700/30 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
      <div className={`${color} mb-4`}>
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
