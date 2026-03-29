import React from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  filename?: string;
}

/**
 * CodeBlock - Syntax-highlighted code block with optional filename
 *
 * @example
 * <CodeBlock language="typescript" filename="example.ts">
 *   console.log("Hello, World!");
 * </CodeBlock>
 */
export default function CodeBlock({
  children,
  language = "text",
  filename,
}: CodeBlockProps) {
  return (
    <div className="my-6">
      {filename && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg text-sm font-mono">
          {filename}
        </div>
      )}
      <pre
        className={`p-4 overflow-x-auto bg-gray-900 text-gray-100 rounded-lg ${
          filename ? "rounded-t-none" : ""
        }`}
      >
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}
