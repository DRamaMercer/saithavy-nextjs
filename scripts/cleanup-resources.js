/**
 * Fix duplicate isPremium and add missing fileSize
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/resourcesData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Remove duplicate isPremium entries
content = content.replace(/,?\s*isPremium: false,\s*isPremium: false/g, ',\n    isPremium: false');

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

// Add fileSize after downloads if missing
let updatedCount = 0;
content = content.replace(/(downloads:\s+\d+),\s*(difficulty)/g, (match, downloads, difficulty) => {
  // Check if fileSize already exists nearby
  const beforeMatch = content.substring(0, content.indexOf(match));
  const afterMatch = content.substring(content.indexOf(match));

  // Look ahead to see if fileSize is already there
  const nextLines = afterMatch.split('\n').slice(0, 5).join('\n');
  if (nextLines.includes('fileSize')) {
    return match;
  }

  // Find the type from earlier in the resource
  const typeMatch = beforeMatch.substring(beforeMatch.lastIndexOf('{')).match(/type:\s*'([^']+)'/);
  const type = typeMatch ? typeMatch[1] : null;

  if (type && sizeByType[type]) {
    updatedCount++;
    return `${downloads},\n    fileSize: '${sizeByType[type]}',\n    ${difficulty}`;
  }

  return match;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✅ Cleaned up and added ${updatedCount} fileSize properties`);
