#!/usr/bin/env python3
"""
Fix YAML frontmatter issues in blog MDX files.
- Converts featuredImage objects to strings
- Quotes unquoted publishedAt dates
- Quotes unquoted readingTime numbers
- Quotes tags starting with special characters
"""

import os
import re
from pathlib import Path

def fix_yaml_frontmatter(file_path):
    """Fix YAML frontmatter issues in a single file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split frontmatter and content
    if not content.startswith('---'):
        return False

    parts = content.split('---', 2)
    if len(parts) < 3:
        return False

    frontmatter = parts[1]
    body = parts[2]

    original_frontmatter = frontmatter
    lines = frontmatter.split('\n')
    i = 0
    fixed = False

    while i < len(lines):
        line = lines[i]

        # Fix featuredImage object to string
        if line.strip() == 'featuredImage:' and i + 1 < len(lines):
            next_line = lines[i + 1]
            if next_line.strip().startswith('url:'):
                # Extract the URL
                url_match = re.search(r"url:\s*['\"]([^'\"]+)['\"]", next_line)
                if url_match:
                    lines[i] = f"featuredImage: '{url_match.group(1)}'"
                    # Remove the nested properties
                    lines.pop(i + 1)  # Remove url line
                    if i + 1 < len(lines) and lines[i + 1].strip().startswith('alt:'):
                        lines.pop(i + 1)  # Remove alt line
                    if i + 1 < len(lines) and lines[i + 1].strip().startswith('width:'):
                        lines.pop(i + 1)  # Remove width line
                    if i + 1 < len(lines) and lines[i + 1].strip().startswith('height:'):
                        lines.pop(i + 1)  # Remove height line
                    fixed = True

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
        elif line.strip().startswith('- ') and re.match(r'^\s*-\s*[^\w]', line):
            tag = line.strip()[2:]
            if not tag.startswith("'") and not tag.startswith('"'):
                lines[i] = f"  - '{tag}'"
                fixed = True

        i += 1

    if fixed:
        # Reassemble the file
        new_content = '---' + '\n'.join(lines) + '---' + body
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True

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
