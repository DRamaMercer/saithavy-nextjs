const fs = require('fs');
const path = require('path');

const blogDir = 'src/content/blog';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx') && !f.startsWith('_'));

let fixed = 0;
let errorCount = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Find the closing --- (second occurrence of ---)
  const firstDash = content.indexOf('---');
  const secondDash = content.indexOf('---', firstDash + 3);
  
  if (firstDash === -1 || secondDash === -1) {
    console.log('SKIP (no frontmatter):', file);
    continue;
  }
  
  // Get the frontmatter
  const frontmatter = content.substring(firstDash, secondDash + 3);
  const afterFrontmatter = content.substring(secondDash + 3);
  
  // Check if frontmatter has proper closing
  const frontmatterLines = frontmatter.split('\n');
  const lastLine = frontmatterLines[frontmatterLines.length - 1];
  
  // If last line of frontmatter is just --- or has content before ---, it's okay
  const isProperlyClosed = lastLine.trim() === '---' || lastLine.trim().startsWith('---');
  
  if (!isProperlyClosed) {
    console.log('ERROR: Cannot determine frontmatter for:', file);
    errorCount++;
    continue;
  }
  
  // Check if there's proper newline after frontmatter
  const firstCharAfter = afterFrontmatter.charAt(0);
  const secondCharAfter = afterFrontmatter.charAt(1);
  
  // We need at least one newline, preferably two
  if (firstCharAfter !== '\n' || secondCharAfter !== '\n') {
    // Fix: ensure proper newlines after frontmatter
    content = frontmatter + '\n\n' + afterFrontmatter.trimStart();
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', file);
    fixed++;
  }
}

console.log('\nTotal fixed:', fixed);
console.log('Errors:', errorCount);
