#!/usr/bin/env node

/**
 * Script to add frontmatter to all markdown files in src/content/resources
 */

const fs = require('fs');
const path = require('path');

const resourcesDir = path.join(__dirname, '../src/content/resources');

// Category mapping based on directory structure
const categoryMap = {
  'mindful-leadership': 'mindful-leadership',
  'ai-automation': 'ai-automation',
  'ai-innovation-playbook': 'ai-automation',
  'personal-growth': 'personal-growth',
  'remote-work': 'remote-work',
  'overcoming-adversity': 'overcoming-adversity',
  'email-sequences': 'ai-automation',
  'production': 'mindful-leadership',
};

// Type mapping based on filename patterns
const typeMap = {
  'checklist': 'Checklist',
  'template': 'Template',
  'guide': 'Guide',
  'workbook': 'Workbook',
  'framework': 'Framework',
  'journal': 'Template',
  'audio': 'Audio',
  'video': 'Video',
  'pdf': 'PDF',
  'assessment': 'Assessment',
  'playbook': 'Guide',
  'series': 'Audio',
  'course': 'Video',
  'pack': 'Workbook',
  'kit': 'PDF',
  'library': 'PDF',
  'canvas': 'Template',
  'map': 'Template',
  'matrix': 'Template',
  'roadmap': 'Guide',
  'plan': 'Template',
  'summary': 'Guide',
  'exercise': 'Template',
  'practice': 'Template',
  'worksheet': 'Workbook',
};

function getCategoryFromPath(filePath) {
  const parts = filePath.split(path.sep);
  for (const part of parts) {
    if (categoryMap[part]) {
      return categoryMap[part];
    }
  }
  const parentDir = parts[parts.indexOf('resources') + 1];
  return categoryMap[parentDir] || 'personal-growth';
}

function getTypeFromFilename(filename) {
  const lowerFilename = filename.toLowerCase();
  for (const [keyword, type] of Object.entries(typeMap)) {
    if (lowerFilename.includes(keyword)) {
      return type;
    }
  }
  return 'Guide';
}

function getDifficultyFromFilename(filename) {
  const lowerFilename = filename.toLowerCase();
  if (lowerFilename.includes('beginner') || lowerFilename.includes('starter') || lowerFilename.includes('introduction')) {
    return 'Beginner';
  } else if (lowerFilename.includes('advanced') || lowerFilename.includes('executive') || lowerFilename.includes('masterclass')) {
    return 'Advanced';
  }
  return 'Intermediate';
}

function hasFrontmatter(content) {
  const trimmed = content.trimStart();
  return trimmed.startsWith('---');
}

function generateFrontmatter(filePath, content) {
  const filename = path.basename(filePath, '.md');
  const category = getCategoryFromPath(filePath);
  const type = getTypeFromFilename(filename);
  const difficulty = getDifficultyFromFilename(filename);

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : filename
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const descMatch = content.match(/## Description\s*\n\s*([^\n]+)/);
  const description = descMatch
    ? descMatch[1].trim()
    : `A comprehensive ${type.toLowerCase()} for ${category.replace('-', ' ')}`;

  const frontmatter = `---
title: "${title}"
description: "${description}"
category: "${category}"
type: "${type}"
featured: false
difficulty: "${difficulty}"
timeToRead: "15 min"
targetAudience: "All Professionals"
keywords:
  - ${category.replace('-', ' ')}
  - ${type.toLowerCase()}
  - ${filename.replace(/-/g, ' ')}
lastUpdated: "2026-03-28"
isPremium: false
downloads: 0
fileSize: "0.5 MB PDF"
---

`;

  return frontmatter;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    if (hasFrontmatter(content)) {
      return { status: 'skipped', reason: 'Already has frontmatter' };
    }

    const frontmatter = generateFrontmatter(filePath, content);
    const newContent = frontmatter + content;

    fs.writeFileSync(filePath, newContent, 'utf8');

    return { status: 'success', filePath };
  } catch (error) {
    return { status: 'error', filePath, error: error.message };
  }
}

function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (path.extname(file) === '.md') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Main execution
console.log('🔍 Scanning for markdown files...');
const markdownFiles = getAllMarkdownFiles(resourcesDir);
console.log(`📄 Found ${markdownFiles.length} markdown files\n`);

let processed = 0;
let skipped = 0;
let errors = 0;

markdownFiles.forEach((filePath) => {
  const result = processFile(filePath);
  const relativePath = path.relative(resourcesDir, filePath);

  if (result.status === 'success') {
    processed++;
    console.log(`✅ ${relativePath}`);
  } else if (result.status === 'skipped') {
    skipped++;
    console.log(`⏭️  ${relativePath} - ${result.reason}`);
  } else {
    errors++;
    console.error(`❌ ${relativePath} - ${result.error}`);
  }
});

console.log('\n📊 Summary:');
console.log(`   Processed: ${processed}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Errors: ${errors}`);
console.log(`   Total: ${markdownFiles.length}`);
