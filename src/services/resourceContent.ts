import { Resource } from '@/types/resources';

const resourceContentCache: Record<string, string> = {};

export const getResourceContent = async (resource: Resource): Promise<string> => {
  const cacheKey = `${resource.category}/${resource.id}`;
  
  if (resourceContentCache[cacheKey]) {
    return resourceContentCache[cacheKey];
  }

  const slugMap: Record<string, string> = {
    '1': 'inclusive-automation-readiness-kit',
    '2': 'mindful-leadership-reflection-journal',
    '3': 'remote-work-productivity-masterclass',
    '4': 'anti-fragility-workbook',
    '5': 'ai-strategy-templates-small-business',
    '6': 'resilience-audio-series',
    '7': 'team-mindfulness-meditation-pack',
    '8': 'digital-nomad-workspace-setup-guide',
    '9': 'goal-setting-framework-canvas',
    '10': 'overcoming-burnout-recovery-plan',
    '11': 'ai-email-automation-templates',
    '12': 'leadership-presence-workshop-video',
    '13': 'mindful-decision-making-blueprint',
    '14': 'conscious-communication-playbook',
    '15': 'weekly-leadership-reflection-template',
    '16': 'meeting-presence-checklist',
    '17': 'strategic-pause-audio-practice',
    '18': 'values-aligned-leadership-workbook',
    '19': 'executive-presence-video-mini-course',
    '20': 'leadership-one-on-one-agenda-template',
    '21': 'mindful-team-rituals-guide',
    '22': 'burnout-prevention-for-leaders-checklist',
    '23': 'ai-opportunity-mapping-canvas',
    '24': 'no-code-automation-starter-guide',
    '25': 'ai-prompt-library-for-founders',
    '26': 'lead-capture-automation-checklist',
    '27': 'automated-content-workflow-template',
    '28': 'ai-tool-evaluation-framework',
    '29': 'automation-sop-builder-pdf',
    '30': 'ai-systems-weekly-audit-checklist',
    '31': 'voice-ai-assistant-setup-audio',
    '32': 'automation-stack-architecture-video',
    '33': 'personal-vision-clarity-workbook',
    '34': 'growth-mindset-reframe-guide',
    '35': '90-day-habit-tracker-template',
    '36': 'self-reflection-sunday-checklist',
    '37': 'confidence-building-through-action-template',
    '38': 'identity-upgrade-field-guide',
    '39': 'emotional-resilience-journal',
    '40': 'monthly-reset-checklist',
    '41': 'morning-momentum-audio-practice',
    '42': 'personal-reinvention-video-series',
    '43': 'remote-work-focus-planner',
    '44': 'async-communication-guide-for-teams',
    '45': 'remote-onboarding-checklist',
    '46': 'weekly-sprint-planning-template',
    '47': 'distributed-team-productivity-playbook',
    '48': 'home-office-ergonomics-pdf',
    '49': 'remote-team-rituals-template',
    '50': 'deep-work-environment-checklist',
    '51': 'remote-leadership-audio-coaching',
    '52': 'virtual-collaboration-tools-video-guide',
    '53': 'resilience-under-pressure-workbook',
    '54': 'adversity-response-framework',
    '55': 'bounce-back-plan-template',
    '56': 'crisis-clarity-checklist',
    '57': 'post-setback-reflection-template',
    '58': 'inner-strength-building-guide',
    '59': 'healing-through-journaling',
    '60': 'recovery-routine-checklist',
    '61': 'grounding-practices-audio',
    '62': 'resilience-stories-video-series',
  };

  const slug = slugMap[resource.id];
  if (!slug) {
    return '';
  }

  const path = `/resources/${resource.category}/${slug}.md`;

  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`Failed to load resource content: ${path}`);
      return '';
    }
    const content = await response.text();
    resourceContentCache[cacheKey] = content;
    return content;
  } catch (error) {
    console.warn(`Error loading resource content: ${path}`, error);
    return '';
  }
};

export const getResourceContentSync = (resource: Resource): string => {
  const cacheKey = `${resource.category}/${resource.id}`;
  return resourceContentCache[cacheKey] || '';
};

export const clearContentCache = (): void => {
  Object.keys(resourceContentCache).forEach(key => {
    delete resourceContentCache[key];
  });
};
