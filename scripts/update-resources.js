/**
 * Script to add isPremium and fileSize to all resources in resourcesData.ts
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/resourcesData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// File size mapping by type
const sizeByType = {
  'PDF': '2.5 MB PDF',
  'Template': '1.2 MB PDF',
  'Guide': '1.8 MB PDF',
  'Audio': '12.4 MB MP3',
  'Video': '45.2 MB MP4',
  'Checklist': '650 KB PDF',
  'Workbook': '4.2 MB PDF',
  'Assessment': '1.5 MB PDF',
  'Framework': '2.1 MB PDF',
};

// Process each resource block
let updatedCount = 0;
const lines = content.split('\n');
const result = [];
let inResource = false;
let currentResource = [];
let resourceType = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect start of resource
  if (line.trim().startsWith('{')) {
    inResource = true;
    currentResource = [line];
    resourceType = null;
    result.push(line);
    continue;
  }

  // Track resource type
  if (line.includes("type: '")) {
    const match = line.match(/type: '([^']+)'/);
    if (match) resourceType = match[1];
  }

  // Add isPremium after featured if not present
  if (line.includes('featured:') && !line.includes('isPremium')) {
    result.push(line);
    const indent = line.match(/^(\s*)/)[1];
    result.push(`${indent}isPremium: false,`);
    updatedCount++;
    continue;
  }

  // Add fileSize after downloads if not present and we have type
  if (line.includes('downloads:') && !content.substring(0, content.indexOf(line) + line.length).includes('fileSize')) {
    result.push(line);
    const indent = line.match(/^(\s*)/)[1];
    if (resourceType && sizeByType[resourceType]) {
      result.push(`${indent}fileSize: '${sizeByType[resourceType]}',`);
      updatedCount++;
    }
    continue;
  }

  result.push(line);

  // End of resource
  if (line.trim().startsWith('},')) {
    inResource = false;
    currentResource = [];
    resourceType = null;
  }
}

// Write back
fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log(`✅ Updated ${updatedCount} properties in resourcesData.ts`);
