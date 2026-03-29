#!/usr/bin/env python3
"""
Comprehensive YAML frontmatter fixer for blog MDX files.
Version 2 - More robust fixing
"""

import os
import re
from pathlib import Path

def fix_yaml_frontmatter(file_path):
    """Fix YAML frontmatter issues in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False

    # Split frontmatter and content
    if not content.startswith('---'):
        return False

    parts = content.split('---', 2)
    if len(parts) < 3:
        return False

    frontmatter = parts[1]
    body = parts[2]

    lines = frontmatter.split('\n')
    i = 0
    fixed = False

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Fix featuredImage object to string (remove nested url, alt, width, height)
        if stripped == 'featuredImage:' and i + 1 < len(lines):
            next_line = lines[i + 1]
            if 'url:' in next_line:
                # Extract URL from next line
                url_match = re.search(r"url:\s*['\"]([^'\"]+)['\"]", next_line)
                if url_match:
                    url = url_match.group(1)
                    lines[i] = f"featuredImage: '{url}'"
                    # Remove nested properties
                    j = i + 1
                    while j < len(lines) and j < i + 5:
                        next_stripped = lines[j].strip()
                        if next_stripped.startswith(('url:', 'alt:', 'width:', 'height:')):
                            lines.pop(j)
                            fixed = True
                        else:
                            break
        # Remove orphan alt/width/height lines (leftover from featuredImage objects)
        elif stripped in ('alt:', 'width:', 'height:'):
            if i > 0 and not lines[i-1].strip().endswith(':'):
                lines.pop(i)
                fixed = True
                continue

        # Fix unquoted publishedAt dates
        elif re.match(r'^publishedAt:\s*\d{4}-\d{2}-\d{2}\s*$', line):
            date_match = re.search(r'(\d{4}-\d{2}-\d{2})', line)
            if date_match:
                lines[i] = f"publishedAt: '{date_match.group(1)}'"
                fixed = True

        # Fix unquoted readingTime numbers
        elif re.match(r'^readingTime:\s*\d+\s*$', line):
            time_match = re.search(r'(\d+)', line)
            if time_match:
                lines[i] = f"readingTime: \"{time_match.group(1)} minutes\""
                fixed = True

        # Fix tags starting with special characters
        elif stripped.startswith('- ') and re.match(r'^\s*-\s*[^\w]', line):
            tag = stripped[2:]
            if not (tag.startswith("'") or tag.startswith('"')):
                lines[i] = line.replace(stripped, f"- '{tag}'")
                fixed = True

        i += 1

    if fixed:
        # Reassemble the file
        new_content = '---' + '\n'.join(lines) + '---' + body
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        except:
            return False

    return False

def main():
    """Fix all blog MDX files."""
    blog_dir = Path('src/content/blog')
    fixed_count = 0

    for mdx_file in blog_dir.rglob('*.mdx'):
        if fix_yaml_frontmatter(mdx_file):
            print(f"Fixed: {mdx_file}")
            fixed_count += 1

    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
