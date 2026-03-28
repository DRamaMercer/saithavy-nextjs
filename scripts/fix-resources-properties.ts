/**
 * Script to add missing properties to all resources
 * This adds: isPremium, fileSize
 */

import { resources } from '../src/lib/resourcesData';
import { writeFileSync } from 'fs';
import { join } from 'path';

// File size mapping by type
const sizeByType: Record<string, string> = {
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

// Add missing properties to each resource
const updatedResources = resources.map(resource => ({
  ...resource,
  isPremium: resource.isPremium ?? false,
  fileSize: resource.fileSize ?? sizeByType[resource.type] ?? '1.0 MB PDF',
}));

console.log(`Updated ${updatedResources.length} resources with missing properties`);

// Output the updated resources array for copy-paste
console.log('\n=== UPDATED RESOURCES ARRAY ===\n');
console.log(JSON.stringify(updatedResources, null, 2));
