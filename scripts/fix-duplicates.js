/**
 * Properly fix duplicate isPremium entries and ensure all resources have both properties
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/resourcesData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Remove ALL isPremium duplicates
content = content.replace(/,\s*isPremium: false,\s*isPremium: false/g, ',\n    isPremium: false');

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

// Split into resources and process each
const resources = content.split(/},\s*{/);
const processed = resources.map((resource, idx) => {
  let res = resource;
  if (idx === 0) res = resource; // Keep header
  else res = '{' + resource;

  // Skip if not a resource object
  if (!res.includes("id: '")) return res + (idx === resources.length - 1 ? '' : '},');

  // Extract type
  const typeMatch = res.match(/type:\s*'([^']+)'/);
  const type = typeMatch ? typeMatch[1] : null;

  // Check for duplicate isPremium and remove
  if ((res.match(/isPremium: false/g) || []).length > 1) {
    res = res.replace(/,\s*isPremium: false,\s*isPremium: false/g, ',\n    isPremium: false');
  }

  // Add isPremium after featured if missing
  if (!res.includes('isPremium')) {
    res = res.replace(/(featured:\s*(?:true|false)),/g, '$1,\n    isPremium: false,');
  }

  // Check for fileSize
  if (!res.includes('fileSize') && type && sizeByType[type]) {
    // Add after downloads
    res = res.replace(/(downloads:\s*\d+),/g, `$1,\n    fileSize: '${sizeByType[type]}',`);
  }

  return res + (idx === resources.length - 1 ? '' : '},');
});

content = processed.join('\n');

fs.writeFileSync(filePath, content, 'utf8');

// Count final state
const finalIsPremium = (content.match(/isPremium: false/g) || []).length;
const finalFileSize = (content.match(/fileSize:/g) || []).length;

console.log(`✅ Final count:`);
console.log(`   isPremium: ${finalIsPremium}`);
console.log(`   fileSize: ${finalFileSize}`);
