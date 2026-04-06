# Resources Content

This directory contains MDX files for resources displayed on the `/resources` page.

## Resource Frontmatter Schema

Each resource MDX file should include the following frontmatter:

```yaml
---
title: "Resource Title"
description: "A brief description of the resource"
thumbnail: "/path/to/thumbnail.jpg"
type: "guide" | "template" | "tool" | "ebook"
downloadUrl: "/downloads/file.pdf" # Optional - for downloadable resources
externalUrl: "https://example.com" # Optional - for external links
fileSize: "2.5 MB" # Optional - display file size
publishedAt: "2024-01-20" # Publication date
tags: ["tag1", "tag2"] # Optional - for SEO
---
```

## Resource Types

- **guide**: Comprehensive guides and tutorials
- **template**: Ready-to-use templates (Notion, spreadsheets, etc.)
- **tool**: Web-based tools and utilities
- **ebook**: Downloadable ebooks and long-form content

## Example Resource

See `productivity-guide.mdx` for a complete example.

## Adding New Resources

1. Create a new `.mdx` file in this directory
2. Add the required frontmatter fields
3. Include either `downloadUrl` or `externalUrl` (or both)
4. The resource will automatically appear on the resources page
