"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface AIMarkdownProps {
  content: string;
  className?: string;
}

export function AIMarkdown({ content, className }: AIMarkdownProps) {
  return (
    <div className={cn("ai-markdown text-[15px] leading-relaxed text-foreground", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-4 mb-2 text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mt-3 mb-1.5 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-2 mb-1 text-foreground">{children}</h3>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 text-[15px] leading-relaxed text-foreground">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-2 pl-1 text-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-2 pl-1 text-foreground">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[15px] leading-relaxed text-foreground">{children}</li>
          ),
          // Emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-muted-foreground">{children}</em>
          ),
          // Code
          code: ({ children, className: codeClass }) => {
            const isBlock = codeClass?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-muted rounded-lg px-4 py-3 text-sm font-mono overflow-x-auto text-foreground my-2 whitespace-pre">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted rounded-lg overflow-x-auto my-2">{children}</pre>
          ),
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-2">
              {children}
            </blockquote>
          ),
          // Table
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/60">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-foreground">{children}</td>
          ),
          // Horizontal rule
          hr: () => <hr className="border-border my-3" />,
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
