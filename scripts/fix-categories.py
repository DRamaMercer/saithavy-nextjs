#!/usr/bin/env python3
"""
Fix corrupted categories in blog posts.
"""

from pathlib import Path
import re

def fix_categories(file_path):
    """Fix corrupted category structures."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Fix corrupted categories like "- 'slug: 'mindful-leadership'" followed by name
    # Replace with just the name value
    content = re.sub(
        r"  - 'slug: '[^']*''\n    name: '([^']+)'",
        r"  - '\1'",
        content
    )

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    blog_dir = Path('src/content/blog')
    fixed = 0

    for mdx_file in blog_dir.rglob('*.mdx'):
        if fix_categories(mdx_file):
            print(f"Fixed: {mdx_file}")
            fixed += 1

    print(f"Total files fixed: {fixed}")

if __name__ == '__main__':
    main()
