"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { ShikiCodeBlock } from "@/components/shiki-code-block";

type MarkdownRendererProps = {
  markdown: string;
};

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  return (
    <article className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </article>
  );
}

const components: Components = {
  pre({ children }) {
    return <>{children}</>;
  },
  code({ className, children, ...props }) {
    const language = className?.replace("language-", "");
    const code = String(children).replace(/\n$/, "");

    if (!language) {
      return (
        <code
          className="rounded-md bg-code-inline border border-line px-1.5 py-0.5 font-mono text-[0.85em] font-semibold text-code-inline-ink"
          {...props}
        >
          {children}
        </code>
      );
    }

    return <ShikiCodeBlock code={code} language={language} />;
  },
  a({ children, href }) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
};
