/**
 * PDF Generation API Route
 *
 * Generates PDF downloads for resources
 * Uses server-side PDF generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { getResourceBySlug } from '@/lib/resourcesData';
import { getResourceContent } from '@/lib/resourceContent';

/**
 * POST /api/pdf
 *
 * Request body:
 * {
 *   "resourceId": string,
 *   "title": string
 * }
 *
 * Returns: PDF file as blob
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resourceId, title } = body;

    if (!resourceId) {
      return NextResponse.json(
        { error: 'resourceId is required' },
        { status: 400 }
      );
    }

    // Get resource by ID (legacy ID support)
    const resource = getResourceByIdLegacy(resourceId);

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Get content
    let content = '';
    try {
      const withContent = await getResourceContent(resource);
      content = withContent.content;
    } catch (error) {
      console.error(`[PDF API] Failed to load content for ${resource.slug}:`, error);
      content = `# ${resource.title}\n\n${resource.description}`;
    }

    // Generate HTML for PDF
    const html = generatePDFHTML(resource, content);

    // For now, return HTML that can be printed
    // In production, you'd use a library like puppeteer or jsPDF
    return NextResponse.json({
      success: true,
      html,
      title: resource.title,
      message: 'PDF generation endpoint - integrate with puppeteer or similar for actual PDF generation',
    });

    // TODO: Implement actual PDF generation
    // Option 1: Use puppeteer (requires server-side setup)
    // Option 2: Use jsPDF (client-side or server-side)
    // Option 3: Use external API (e.g., CloudConvert, HTML2PDF)

    // Example puppeteer implementation (commented out):
    /*
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resource.slug}.pdf"`,
      },
    });
    */

  } catch (error) {
    console.error('[PDF API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

/**
 * Get resource by legacy ID (numeric string)
 * Maps old v2 ID system to new slug-based system
 */
function getResourceByIdLegacy(id: string) {
  const { resources } = await import('@/lib/resourcesData');
  return resources.find(r => r.id === id);
}

/**
 * Generate HTML for PDF
 * Creates a clean, printable version of the resource
 */
function generatePDFHTML(resource: any, content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resource.title}</title>
  <style>
    @page {
      margin: 2cm;
      size: A4;
    }

    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 21cm;
      margin: 0 auto;
      padding: 2cm;
    }

    h1 {
      font-size: 32pt;
      font-weight: 700;
      margin-bottom: 0.5em;
      color: #1a1a1a;
      page-break-after: avoid;
    }

    h2 {
      font-size: 24pt;
      font-weight: 600;
      margin-top: 1.5em;
      margin-bottom: 0.75em;
      color: #2d2d2d;
      page-break-after: avoid;
    }

    h3 {
      font-size: 18pt;
      font-weight: 600;
      margin-top: 1.25em;
      margin-bottom: 0.5em;
      color: #3d3d3d;
      page-break-after: avoid;
    }

    p {
      margin-bottom: 1em;
      text-align: justify;
    }

    ul, ol {
      margin-bottom: 1em;
      padding-left: 2em;
    }

    li {
      margin-bottom: 0.5em;
    }

    blockquote {
      border-left: 4px solid #667eea;
      padding-left: 1em;
      margin: 1.5em 0;
      font-style: italic;
      color: #4a4a4a;
    }

    code {
      background: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }

    pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
      margin-bottom: 1em;
    }

    pre code {
      background: none;
      padding: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1em;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 0.75em;
      text-align: left;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
    }

    .header {
      border-bottom: 2px solid #667eea;
      padding-bottom: 1em;
      margin-bottom: 2em;
    }

    .footer {
      margin-top: 3em;
      padding-top: 1em;
      border-top: 1px solid #ddd;
      font-size: 10pt;
      color: #666;
      text-align: center;
    }

    @media print {
      body {
        padding: 0;
      }

      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${resource.title}</h1>
    <p style="font-size: 14pt; color: #666;">${resource.description}</p>
  </div>

  <div class="content">
    ${markdownToHTML(content)}
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} Mindful Leadership Resources</p>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Simple markdown to HTML converter
 * For production, use a proper library like marked or remark
 */
function markdownToHTML(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p><(h[1-6]|ul|ol|pre|blockquote)/g, '<$1');
  html = html.replace(/<\/(h[1-6]|ul|ol|pre|blockquote)><\/p>/g, '</$1>');

  return html;
}
