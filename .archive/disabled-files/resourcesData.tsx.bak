import { 
  LayoutTemplate, 
  Briefcase, 
  Users, 
  Target, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Filter,
  BookOpen,
  BarChart3,
  Zap,
  TrendingUp,
  Lightbulb,
  Shield,
  Calendar,
  FileCheck,
  Award,
} from "lucide-react";
import React from 'react';

// Resource categories with icons and colors
export const categories = [
  { id: "all", name: "All Resources", icon: Filter, color: "text-gray-600" },
  { id: "leadership", name: "Leadership", icon: Award, color: "text-purple-600" },
  { id: "team-management", name: "Team Management", icon: Users, color: "text-blue-600" },
  { id: "productivity", name: "Productivity", icon: Zap, color: "text-amber-600" },
  { id: "communication", name: "Communication", icon: MessageSquare, color: "text-emerald-600" },
  { id: "templates", name: "Templates", icon: LayoutTemplate, color: "text-pink-600" },
  { id: "assessments", name: "Assessments", icon: BarChart3, color: "text-indigo-600" },
];

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  icon: React.ReactNode;
  url: string;
  fileSize: string;
  difficulty: string;
  timeToRead: string;
  targetAudience: string;
  whatYoullLearn: string[];
  featured: boolean;
  downloads: number;
  isPremium?: boolean;
};

// Comprehensive resources data
export const resources: Resource[] = [
  // LEADERSHIP RESOURCES
  {
    id: "remote-work-playbook",
    title: "The Authentic Remote Team Playbook",
    description: "A comprehensive 40-page guide on building culture, asynchronous communication, and trust in distributed teams.",
    category: "leadership",
    type: "E-Book",
    icon: <BookOpen className="w-8 h-8 mb-4 text-purple-600 dark:text-purple-500" />,
    url: "#",
    fileSize: "4.2 MB PDF",
    difficulty: "Intermediate",
    timeToRead: "45 min",
    targetAudience: "Team Leads, Managers",
    whatYoullLearn: [
      "Building trust in remote teams",
      "Asynchronous communication strategies",
      "Culture creation without physical presence",
      "Onboarding remote team members"
    ],
    featured: true,
    downloads: 12500,
    isPremium: true,
  },
  {
    id: "authentic-leadership-guide",
    title: "Authentic Leadership Framework",
    description: "A deep dive into leading with vulnerability, transparency, and genuine connection in modern organizations.",
    category: "leadership",
    type: "Guide",
    icon: <Award className="w-8 h-8 mb-4 text-purple-600 dark:text-purple-500" />,
    url: "#",
    fileSize: "2.8 MB PDF",
    difficulty: "Advanced",
    timeToRead: "60 min",
    targetAudience: "Senior Leaders, Executives",
    whatYoullLearn: [
      "The psychology of authentic leadership",
      "Balancing vulnerability with authority",
      "Building psychological safety",
      "Leading through change and uncertainty"
    ],
    featured: false,
    downloads: 8300
  },
  {
    id: "decision-making-framework",
    title: "Executive Decision-Making Framework",
    description: "A systematic approach to making high-stakes decisions with confidence and clarity.",
    category: "leadership",
    type: "Framework",
    icon: <Target className="w-8 h-8 mb-4 text-purple-600 dark:text-purple-500" />,
    url: "#",
    fileSize: "1.5 MB PDF",
    difficulty: "Advanced",
    timeToRead: "30 min",
    targetAudience: "Executives, Founders",
    whatYoullLearn: [
      "Decision matrices for complex choices",
      "Risk assessment methodologies",
      "Stakeholder alignment strategies",
      "Post-decision review processes"
    ],
    featured: false,
    downloads: 6200
  },

  // TEAM MANAGEMENT RESOURCES
  {
    id: "performance-review-templates",
    title: "Performance Review Template Suite",
    description: "Comprehensive templates for 360° reviews, self-assessments, and goal-setting conversations.",
    category: "team-management",
    type: "Template Suite",
    icon: <FileCheck className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-500" />,
    url: "#",
    fileSize: "Notion + PDF",
    difficulty: "Beginner",
    timeToRead: "20 min",
    targetAudience: "Managers, HR Professionals",
    whatYoullLearn: [
      "Structuring effective performance conversations",
      "Setting meaningful goals and KPIs",
      "Giving and receiving feedback",
      "Creating development plans"
    ],
    featured: true,
    downloads: 15800
  },
  {
    id: "team-health-check",
    title: "Team Health Diagnostic Tool",
    description: "A comprehensive assessment to identify strengths, weaknesses, and improvement areas in your team.",
    category: "team-management",
    type: "Assessment Tool",
    icon: <Shield className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-500" />,
    url: "#",
    fileSize: "Interactive PDF",
    difficulty: "Beginner",
    timeToRead: "15 min",
    targetAudience: "Team Leaders, Managers",
    whatYoullLearn: [
      "Measuring team collaboration effectiveness",
      "Identifying communication bottlenecks",
      "Assessing psychological safety",
      "Action planning for improvements"
    ],
    featured: false,
    downloads: 9400
  },
  {
    id: "remote-hiring-playbook",
    title: "Remote Hiring Playbook",
    description: "End-to-end guide for recruiting, interviewing, and onboarding remote team members successfully.",
    category: "team-management",
    type: "Playbook",
    icon: <Briefcase className="w-8 h-8 mb-4 text-blue-600 dark:text-blue-500" />,
    url: "#",
    fileSize: "3.2 MB PDF",
    difficulty: "Intermediate",
    timeToRead: "40 min",
    targetAudience: "Hiring Managers, Recruiters",
    whatYoullLearn: [
      "Writing remote-friendly job descriptions",
      "Conducting effective remote interviews",
      "Assessing remote work readiness",
      "Designing remote onboarding programs"
    ],
    featured: false,
    downloads: 7800
  },

  // PRODUCTIVITY RESOURCES
  {
    id: "ai-prompt-library",
    title: "Executive AI Prompt Library",
    description: "50+ curated ChatGPT & Claude prompts designed to save leaders 10+ hours a week on routine communication.",
    category: "productivity",
    type: "Cheatsheet",
    icon: <Zap className="w-8 h-8 mb-4 text-amber-600 dark:text-amber-500" />,
    url: "#",
    fileSize: "1.1 MB PDF",
    difficulty: "Beginner",
    timeToRead: "10 min",
    targetAudience: "All Leaders",
    whatYoullLearn: [
      "AI-assisted email drafting",
      "Meeting preparation and summaries",
      "Report generation and analysis",
      "Creative problem-solving prompts"
    ],
    featured: true,
    downloads: 22100,
    isPremium: true,
  },
  {
    id: "time-management-system",
    title: "Executive Time Management System",
    description: "A proven system for prioritizing, scheduling, and protecting your most valuable resource: time.",
    category: "productivity",
    type: "System",
    icon: <Clock className="w-8 h-8 mb-4 text-amber-600 dark:text-amber-500" />,
    url: "#",
    fileSize: "Notion Template",
    difficulty: "Intermediate",
    timeToRead: "25 min",
    targetAudience: "Busy Executives, Founders",
    whatYoullLearn: [
      "Time blocking and deep work strategies",
      "Meeting optimization techniques",
      "Delegation frameworks",
      "Energy management principles"
    ],
    featured: false,
    downloads: 11200
  },
  {
    id: "focus-rituals-guide",
    title: "Daily Focus Rituals Guide",
    description: "Morning and evening routines designed to maximize productivity and maintain work-life balance.",
    category: "productivity",
    type: "Guide",
    icon: <TrendingUp className="w-8 h-8 mb-4 text-amber-600 dark:text-amber-500" />,
    url: "#",
    fileSize: "1.8 MB PDF",
    difficulty: "Beginner",
    timeToRead: "15 min",
    targetAudience: "All Professionals",
    whatYoullLearn: [
      "Science-backed morning routines",
      "Evening wind-down practices",
      "Focus-enhancing techniques",
      "Sustainable productivity habits"
    ],
    featured: false,
    downloads: 8900
  },

  // COMMUNICATION RESOURCES
  {
    id: "async-communication-guide",
    title: "Asynchronous Communication Mastery",
    description: "Transform how your team communicates with async-first principles and best practices.",
    category: "communication",
    type: "Guide",
    icon: <MessageSquare className="w-8 h-8 mb-4 text-emerald-600 dark:text-emerald-500" />,
    url: "#",
    fileSize: "2.4 MB PDF",
    difficulty: "Intermediate",
    timeToRead: "35 min",
    targetAudience: "Remote Teams",
    whatYoullLearn: [
      "Writing clear async messages",
      "Choosing the right communication channel",
      "Documentation best practices",
      "Reducing meeting dependency"
    ],
    featured: true,
    downloads: 14500
  },
  {
    id: "meeting-templates",
    title: "Essential Meeting Templates",
    description: "Ready-to-use templates for standups, retrospectives, 1:1s, and strategic planning sessions.",
    category: "communication",
    type: "Template Suite",
    icon: <Calendar className="w-8 h-8 mb-4 text-emerald-600 dark:text-emerald-500" />,
    url: "#",
    fileSize: "Notion Template",
    difficulty: "Beginner",
    timeToRead: "20 min",
    targetAudience: "All Teams",
    whatYoullLearn: [
      "Running effective standups",
      "Facilitating retrospectives",
      "Conducting meaningful 1:1s",
      "Planning strategic sessions"
    ],
    featured: false,
    downloads: 10600
  },
  {
    id: "crisis-communication-playbook",
    title: "Crisis Communication Playbook",
    description: "A step-by-step guide for communicating effectively during organizational challenges and uncertainty.",
    category: "communication",
    type: "Playbook",
    icon: <Shield className="w-8 h-8 mb-4 text-emerald-600 dark:text-emerald-500" />,
    url: "#",
    fileSize: "1.9 MB PDF",
    difficulty: "Advanced",
    timeToRead: "30 min",
    targetAudience: "Leaders, PR Teams",
    whatYoullLearn: [
      "Crisis messaging frameworks",
      "Stakeholder communication strategies",
      "Transparency vs. reassurance balance",
      "Post-crisis recovery communication"
    ],
    featured: false,
    downloads: 5400
  },

  // TEMPLATES
  {
    id: "notion-okr-template",
    title: "Personal & Team OKR Dashboard",
    description: "My personal Notion template for tracking Objectives and Key Results without the corporate overhead.",
    category: "templates",
    type: "Notion Template",
    icon: <LayoutTemplate className="w-8 h-8 mb-4 text-pink-600 dark:text-pink-500" />,
    url: "#",
    fileSize: "Notion Template",
    difficulty: "Beginner",
    timeToRead: "10 min",
    targetAudience: "Individuals, Teams",
    whatYoullLearn: [
      "Setting meaningful objectives",
      "Defining measurable key results",
      "Tracking progress visually",
      "Conducting OKR reviews"
    ],
    featured: true,
    downloads: 18900
  },
  {
    id: "project-planning-template",
    title: "Project Planning Suite",
    description: "Comprehensive templates for project kickoff, timeline planning, risk assessment, and delivery tracking.",
    category: "templates",
    type: "Template Suite",
    icon: <LayoutTemplate className="w-8 h-8 mb-4 text-pink-600 dark:text-pink-500" />,
    url: "#",
    fileSize: "Notion + Google Sheets",
    difficulty: "Intermediate",
    timeToRead: "25 min",
    targetAudience: "Project Managers",
    whatYoullLearn: [
      "Creating project charters",
      "Building realistic timelines",
      "Identifying and mitigating risks",
      "Tracking project milestones"
    ],
    featured: false,
    downloads: 9200
  },
  {
    id: "onboarding-checklist",
    title: "Remote Onboarding Checklist",
    description: "A comprehensive 90-day onboarding checklist for new remote team members.",
    category: "templates",
    type: "Checklist",
    icon: <CheckCircle2 className="w-8 h-8 mb-4 text-pink-600 dark:text-pink-500" />,
    url: "#",
    fileSize: "Notion Template",
    difficulty: "Beginner",
    timeToRead: "15 min",
    targetAudience: "HR, Managers",
    whatYoullLearn: [
      "Pre-boarding preparation",
      "First week essentials",
      "30-60-90 day milestones",
      "Cultural integration activities"
    ],
    featured: false,
    downloads: 11700
  },

  // ASSESSMENTS
  {
    id: "leadership-style-assessment",
    title: "Leadership Style Assessment",
    description: "Discover your natural leadership style and learn how to adapt it for different situations.",
    category: "assessments",
    type: "Assessment",
    icon: <BarChart3 className="w-8 h-8 mb-4 text-indigo-600 dark:text-indigo-500" />,
    url: "#",
    fileSize: "Interactive PDF",
    difficulty: "Beginner",
    timeToRead: "20 min",
    targetAudience: "All Leaders",
    whatYoullLearn: [
      "Your dominant leadership style",
      "Strengths and blind spots",
      "When to adapt your approach",
      "Developing leadership versatility"
    ],
    featured: true,
    downloads: 13400
  },
  {
    id: "team-culture-audit",
    title: "Team Culture Audit Tool",
    description: "A comprehensive framework for assessing and improving your team's culture.",
    category: "assessments",
    type: "Assessment Tool",
    icon: <Lightbulb className="w-8 h-8 mb-4 text-indigo-600 dark:text-indigo-500" />,
    url: "#",
    fileSize: "Interactive PDF + Workbook",
    difficulty: "Intermediate",
    timeToRead: "45 min",
    targetAudience: "Team Leaders",
    whatYoullLearn: [
      "Measuring cultural alignment",
      "Identifying cultural gaps",
      "Creating cultural initiatives",
      "Tracking cultural evolution"
    ],
    featured: false,
    downloads: 7100
  },
  {
    id: "remote-readiness-score",
    title: "Remote Work Readiness Scorecard",
    description: "Assess your organization's readiness for remote or hybrid work arrangements.",
    category: "assessments",
    type: "Scorecard",
    icon: <Shield className="w-8 h-8 mb-4 text-indigo-600 dark:text-indigo-500" />,
    url: "#",
    fileSize: "Interactive PDF",
    difficulty: "Beginner",
    timeToRead: "15 min",
    targetAudience: "Leaders, HR",
    whatYoullLearn: [
      "Technology infrastructure readiness",
      "Policy and process gaps",
      "Team preparedness assessment",
      "Actionable improvement roadmap"
    ],
    featured: false,
    downloads: 8600
  },
];
