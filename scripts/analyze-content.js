const fs = require('fs');

const resourcesPath = './src/lib/resourcesData.ts';
const content = fs.readFileSync(resourcesPath, 'utf8');

// Extract all resources
const resourceMatches = content.match(/\{\s*id:\s*'[^']+',[\s\S]*?title:\s*'[^']+'/g) || [];

const resources = resourceMatches.map(match => {
  const idMatch = match.match(/id:\s*'([^']+)'/);
  const slugMatch = match.match(/slug:\s*'([^']+)'/);
  const titleMatch = match.match(/title:\s*'([^']+)'/);
  const categoryMatch = match.match(/category:\s*'([^']+)'/);

  return {
    id: idMatch ? idMatch[1] : null,
    slug: slugMatch ? slugMatch[1] : null,
    title: titleMatch ? titleMatch[1] : null,
    category: categoryMatch ? categoryMatch[1] : null
  };
}).filter(r => r.id);

// Extract contentPaths
const contentPathMatches = content.match(/contentPath:\s*'([^']+)'/g) || [];
const contentPaths = contentPathMatches.map(path => path.match(/contentPath:\s*'([^']+)'/)[1]);

console.log('=== RESOURCES WITH CONTENT PATH (' + contentPaths.length + ') ===\n');
contentPaths.forEach(path => {
  const res = resources.find(r => path.includes(r.slug) || path.includes(r.id));
  if (res) {
    console.log(`${res.id}: ${res.title}`);
    console.log(`   Category: ${res.category}`);
    console.log(`   Path: ${path}\n`);
  }
});

console.log('\n=== RESOURCES WITHOUT CONTENT PATH (' + (resources.length - contentPaths.length) + ') ===\n');
resources.forEach(res => {
  const hasPath = contentPaths.some(path => path.includes(res.slug) || path.includes(res.id));
  if (!hasPath) {
    console.log(`${res.id}: ${res.title}`);
    console.log(`   Category: ${res.category}`);
    console.log(`   Slug: ${res.slug}\n`);
  }
});

console.log('\n=== SUMMARY ===');
console.log(`Total resources: ${resources.length}`);
console.log(`With contentPath: ${contentPaths.length}`);
console.log(`Without contentPath: ${resources.length - contentPaths.length}`);
