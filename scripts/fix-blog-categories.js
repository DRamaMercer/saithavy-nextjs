const fs = require('fs');
const path = require('path');

const blogDir = 'src/content/blog';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx') && !f.startsWith('_'));

let fixed = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Normalize line endings
  content = content.replace(/\r\n/g, '\n');
  
  // Pattern 1: '- 'slug: "..."'\n    name: "..."\n'
  // Convert to: '- slug: "..."\n    name: "..."\n'
  let match = content.match(/- 'slug: "([^"]+)"'\n\s+name: "([^"]+)"\n/);
  if (match) {
    content = content.replace(/- 'slug: "([^"]+)"'\n\s+name: "([^"]+)"\n/g, (match, slug, name) => {
      return `- slug: "${slug}"\n    name: "${name}"\n`;
    });
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', file);
    fixed++;
    continue;
  }
  
  skipped++;
}

console.log('\nTotal fixed:', fixed);
console.log('Skipped:', skipped);
