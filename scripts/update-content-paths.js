/**
 * Script to update contentPath values in resourcesData.ts
 * This adds proper contentPath to all 62 resources based on the target structure
 */

const fs = require('fs');
const path = require('path');

// Content path mappings based on user-provided locations and target structure
const contentPathMappings = {
  // Mindful Leadership (13 resources)
  '2': 'mindful-leadership/mindful-leadership-reflection-journal.md', // Already exists, update to new location
  '13': 'mindful-leadership/mindful-decision-making-blueprint.md', // Update to new location
  '14': 'mindful-leadership/conscious-communication-playbook.md',
  '15': 'mindful-leadership/weekly-leadership-reflection-template.md',
  '16': 'mindful-leadership/meeting-presence-checklist.md', // Update to new location
  '17': 'mindful-leadership/strategic-pause-audio-practice.md',
  '18': 'mindful-leadership/values-aligned-leadership-workbook.md',
  '19': 'mindful-leadership/executive-presence-video-mini-course.md',
  '20': 'mindful-leadership/leadership-one-on-one-agenda-template.md',
  '21': 'mindful-leadership/mindful-team-rituals-guide.md',
  '22': 'mindful-leadership/burnout-prevention-for-leaders-checklist.md', // Update to new location
  '12': 'mindful-leadership/leadership-presence-workshop-video.md',
  '7': 'mindful-leadership/team-mindfulness-meditation-pack.md',

  // AI + Automation (13 resources)
  '1': 'ai-automation/inclusive-automation-readiness-kit.md', // Update to new location
  '5': 'ai-automation/ai-strategy-templates-small-business.md',
  '11': 'ai-automation/ai-email-automation-templates.md',
  '23': 'ai-automation/ai-opportunity-mapping-canvas.md',
  '24': 'ai-automation/no-code-automation-starter-guide.md',
  '25': 'ai-automation/ai-prompt-library-for-founders.md',
  '26': 'ai-automation/lead-capture-automation-checklist.md',
  '27': 'ai-automation/automated-content-workflow-template.md',
  '28': 'ai-automation/ai-tool-evaluation-framework.md', // Update to new location
  '29': 'ai-automation/automation-sop-builder-pdf.md',
  '30': 'ai-automation/ai-systems-weekly-audit-checklist.md',
  '31': 'ai-automation/voice-ai-assistant-setup-audio.md', // Mark as coming soon
  '32': 'ai-automation/automation-stack-architecture-video.md',

  // Personal Growth (12 resources)
  '4': 'personal-growth/anti-fragility-workbook.md', // Update to new location
  '9': 'personal-growth/goal-setting-framework-canvas.md',
  '33': 'personal-growth/personal-vision-clarity-workbook.md',
  '34': 'personal-growth/growth-mindset-reframe-guide.md',
  '35': 'personal-growth/90-day-habit-tracker-template.md',
  '36': 'personal-growth/self-reflection-sunday-checklist.md',
  '37': 'personal-growth/confidence-building-through-action-template.md',
  '38': 'personal-growth/identity-upgrade-field-guide.md',
  '39': 'personal-growth/emotional-resilience-journal.md',
  '40': 'personal-growth/monthly-reset-checklist.md',
  '41': 'personal-growth/morning-momentum-audio-practice.md',
  '42': 'personal-growth/personal-reinvention-video-series.md',

  // Remote Work (11 resources)
  '3': 'remote-work/remote-work-productivity-masterclass.md',
  '8': 'remote-work/digital-nomad-workspace-setup-guide.md',
  '43': 'remote-work/remote-work-focus-planner.md',
  '44': 'remote-work/async-communication-guide-for-teams.md',
  '45': 'remote-work/remote-onboarding-checklist.md',
  '46': 'remote-work/weekly-sprint-planning-template.md',
  '47': 'remote-work/distributed-team-productivity-playbook.md',
  '48': 'remote-work/home-office-ergonomics-pdf.md',
  '49': 'remote-work/remote-team-rituals-template.md',
  '50': 'remote-work/deep-work-environment-checklist.md',
  '52': 'remote-work/virtual-collaboration-tools-video-guide.md',
  '51': 'remote-work/remote-leadership-audio-coaching.md',

  // Overcoming Adversity (12 resources)
  '6': 'overcoming-adversity/resilience-audio-series.md',
  '10': 'overcoming-adversity/overcoming-burnout-recovery-plan.md',
  '53': 'overcoming-adversity/resilience-under-pressure-workbook.md',
  '54': 'overcoming-adversity/adversity-response-framework.md',
  '55': 'overcoming-adversity/bounce-back-plan-template.md',
  '56': 'overcoming-adversity/crisis-clarity-checklist.md',
  '57': 'overcoming-adversity/post-setback-reflection-template.md',
  '58': 'overcoming-adversity/inner-strength-building-guide.md',
  '59': 'overcoming-adversity/healing-through-journaling.md',
  '60': 'overcoming-adversity/recovery-routine-checklist.md',
  '61': 'overcoming-adversity/grounding-practices-audio.md',
  '62': 'overcoming-adversity/resilience-stories-video-series.md',
};

const filePath = path.join(__dirname, '../src/lib/resourcesData.ts');
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Function to add contentPath to a resource object
function addContentPath(resourceText, resourceId) {
  const contentPath = contentPathMappings[resourceId];

  if (!contentPath) {
    console.warn(`No contentPath mapping for resource ID ${resourceId}`);
    return resourceText;
  }

  // Check if contentPath already exists
  if (resourceText.includes('contentPath:')) {
    // Replace existing contentPath
    return resourceText.replace(
      /contentPath:\s*['"`]([^'"`]+)['"`]/,
      `contentPath: '${contentPath}'`
    );
  }

  // Find the position to insert contentPath (before the closing brace)
  // Look for common properties that appear near the end
  const insertBeforePatterns = [
    /,\s*seoTitle:/,
    /,\s*seoDescription:/,
    /,\s*keywords:/,
    /\}\s*,\s*\/\//,
    /\}\s*,\s*\n/,
  ];

  for (const pattern of insertBeforePatterns) {
    const match = resourceText.match(pattern);
    if (match) {
      const insertPosition = resourceText.indexOf(match[0]);
      const before = resourceText.substring(0, insertPosition);
      const after = resourceText.substring(insertPosition);
      return before + `,\n    contentPath: '${contentPath}'` + after;
    }
  }

  // Fallback: add at the end before closing brace
  return resourceText.replace(/(\s+)\},\s*$/m, `$1,\n    contentPath: '${contentPath}'\n  },`);
}

// Process each resource
let updatedContent = fileContent;
const resourcePattern = /{\s*id:\s*['"](\d+)['"]/g;

let match;
let lastEnd = 0;
let newContent = '';

while ((match = resourcePattern.exec(fileContent)) !== null) {
  const resourceId = match[1];
  const resourceStart = match.index;

  // Find the end of this resource object (next resource or end of array)
  let resourceEnd = fileContent.indexOf('  },', resourceStart + 100);
  if (resourceEnd === -1) resourceEnd = fileContent.indexOf('}\n];', resourceStart);
  if (resourceEnd === -1) resourceEnd = fileContent.length;

  // Extract the resource text
  const resourceText = fileContent.substring(resourceStart, resourceEnd + 4);

  // Add contentPath
  const updatedResourceText = addContentPath(resourceText, resourceId);

  // Build new content
  newContent += fileContent.substring(lastEnd, resourceStart) + updatedResourceText;
  lastEnd = resourceEnd + 4;

  // Reset regex to avoid infinite loop
  resourcePattern.lastIndex = resourceEnd + 4;
}

// Add remaining content
newContent += fileContent.substring(lastEnd);

// Write updated content
fs.writeFileSync(filePath, newContent, 'utf-8');

console.log('✅ Updated resourcesData.ts with contentPath values');
console.log('📊 Processed', Object.keys(contentPathMappings).length, 'resources');
