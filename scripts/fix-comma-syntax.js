/**
 * Fix all missing commas between resource objects
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/resourcesData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix: Add comma before standalone { that starts a resource object (with id:)
// Pattern: },\n{ becomes },\n  {
content = content.replace(/},\n\{/g, '},\n  {');

// Also fix: },\n    { should stay as is
content = content.replace(/},\n    \{/g, '},\n  {');

// Also fix cases where it's just },{ on same line or close
content = content.replace(/},\{/g, '},\n  {');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed comma syntax between resource objects');

// Verify no more syntax errors
const remaining = content.match(/},\n\{/g);
if (remaining) {
  console.log(`⚠️  Still found ${remaining.length} instances of },\\n{`);
} else {
  console.log('✅ All instances fixed');
}
