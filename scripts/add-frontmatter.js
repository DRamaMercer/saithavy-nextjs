/**
 * Script to add YAML frontmatter to resource markdown files
 * Extracts metadata from resourcesData.ts and adds it to each markdown file
 */

const fs = require('fs');
const path = require('path');

// Read the resources data file
const resourcesDataPath = path.join(__dirname, '../src/lib/resourcesData.ts');
const resourcesContent = fs.readFileSync(resourcesDataPath, 'utf-8');

// Extract resource objects from the TypeScript file
function extractResources(tsContent) {
  const resources = [];
  const resourcePattern = /{\s*id:\s*['"](\d+)['"][\s\S]*?\n\s*},/g;
  let match;

  while ((match = resourcePattern.exec(tsContent)) !== null) {
    const resourceText = match[0];
    const resource = parseResource(resourceText);
    if (resource) {
      resources.push(resource);
    }
  }

  return resources;
}

// Parse individual resource object
function parseResource(resourceText) {
  try {
    return {
      id: extractField(resourceText, 'id'),
      slug: extractField(resourceText, 'slug'),
      title: extractField(resourceText, 'title'),
      description: extractField(resourceText, 'description'),
      category: extractField(resourceText, 'category'),
      type: extractField(resourceText, 'type'),
      featured: extractField(resourceText, 'featured') === 'true',
      isPremium: extractField(resourceText, 'isPremium') === 'true',
      downloads: extractField(resourceText, 'downloads') || '0',
      fileSize: extractField(resourceText, 'fileSize'),
      difficulty: extractField(resourceText, 'difficulty'),
      timeToRead: extractField(resourceText, 'timeToRead'),
      targetAudience: extractField(resourceText, 'targetAudience'),
      contentPath: extractField(resourceText, 'contentPath'),
      keywords: extractArray(resourceText, 'keywords'),
      whatYoullLearn: extractArray(resourceText, 'whatYoullLearn'),
      seoTitle: extractField(resourceText, 'seoTitle'),
      seoDescription: extractField(resourceText, 'seoDescription'),
    };
  } catch (error) {
    console.warn('Error parsing resource:', error.message);
    return null;
  }
}

// Extract a field value from resource text
function extractField(text, fieldName) {
  const pattern1 = new RegExp(fieldName + ':\\s*["\']([^"\']*)["\']', 's');
  const pattern2 = new RegExp(fieldName + ':\\s*([^,\\n]+)');

  let match = text.match(pattern1);
  if (!match) {
    match = text.match(pattern2);
  }

  if (match) {
    return match[1].trim();
  }
  return null;
}

// Extract array field
function extractArray(text, fieldName) {
  const pattern = new RegExp(fieldName + ':\\s*\\[([\\s\\S]*?)\\]');
  const match = text.match(pattern);
  if (match) {
    const arrayContent = match[1];
    const items = arrayContent.match(/["']([^"\']+)["']/g);
    if (items) {
      return items.map(item => item.replace(/["']/g, ''));
    }
  }
  return null;
}

// Generate YAML frontmatter
function generateFrontmatter(resource) {
  const lines = [];

  lines.push('---');
  lines.push('title: "' + resource.title + '"');
  lines.push('description: "' + resource.description + '"');
  lines.push('category: "' + resource.category + '"');
  lines.push('slug: "' + resource.slug + '"');
  lines.push('type: "' + resource.type + '"');
  lines.push('difficulty: "' + resource.difficulty + '"');
  lines.push('timeToRead: "' + resource.timeToRead + '"');
  lines.push('targetAudience: "' + resource.targetAudience + '"');
  lines.push('featured: ' + resource.featured);
  lines.push('isPremium: ' + resource.isPremium);
  lines.push('downloads: ' + resource.downloads);
  lines.push('fileSize: "' + resource.fileSize + '"');

  if (resource.keywords && resource.keywords.length > 0) {
    lines.push('keywords:');
    resource.keywords.forEach(kw => {
      lines.push('  - "' + kw + '"');
    });
  }

  if (resource.whatYoullLearn && resource.whatYoullLearn.length > 0) {
    lines.push('whatYoullLearn:');
    resource.whatYoullLearn.forEach(item => {
      lines.push('  - "' + item + '"');
    });
  }

  if (resource.seoTitle) {
    lines.push('seoTitle: "' + resource.seoTitle + '"');
  }

  if (resource.seoDescription) {
    lines.push('seoDescription: "' + resource.seoDescription + '"');
  }

  lines.push('---');

  return lines.join('\n');
}

// Add frontmatter to a markdown file
function addFrontmatterToMarkdown(filePath, resource) {
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️  File not found: ' + filePath);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if frontmatter already exists
  if (content.startsWith('---')) {
    console.log('✓ ' + resource.id + ': ' + resource.title + ' - Already has frontmatter');
    return false;
  }

  const frontmatter = generateFrontmatter(resource);
  const newContent = frontmatter + '\n\n' + content;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('✓ ' + resource.id + ': ' + resource.title + ' - Frontmatter added');
  return true;
}

// Main execution
function main() {
  console.log('🔍 Extracting resources from resourcesData.ts...');
  const resources = extractResources(resourcesContent);

  console.log('📊 Found ' + resources.length + ' resources');

  const contentBasePath = path.join(__dirname, '../src/content/resources');
  let processed = 0;
  let skipped = 0;

  for (const resource of resources) {
    if (!resource.contentPath) {
      console.log('⏭️  ' + resource.id + ': ' + resource.title + ' - No contentPath');
      continue;
    }

    const fullPath = path.join(contentBasePath, resource.contentPath);

    if (fs.existsSync(fullPath)) {
      const added = addFrontmatterToMarkdown(fullPath, resource);
      if (added) processed++;
      else skipped++;
    } else {
      console.warn('⚠️  ' + resource.id + ': ' + resource.title + ' - File not found: ' + fullPath);
    }
  }

  console.log('\n✅ Frontmatter addition complete!');
  console.log('📝 Processed: ' + processed + ' files');
  console.log('⏭️  Skipped (already had frontmatter): ' + skipped + ' files');
}

main();
