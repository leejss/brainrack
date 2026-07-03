"use client";

import { useEffect, useState } from "react";
import { type BundledLanguage, codeToHtml } from "shiki";

type ShikiCodeBlockProps = {
  code: string;
  language: string;
};

type HighlightResult = {
  key: string;
  html: string;
};

const LANGUAGE_ALIASES: Record<string, BundledLanguage | "text"> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  python: "python",
  typescript: "typescript",
  javascript: "javascript",
  json: "json",
  bash: "bash",
  shell: "bash",
  text: "text",
  plaintext: "text",
};

export function ShikiCodeBlock({ code, language }: ShikiCodeBlockProps) {
  const normalizedLanguage = normalizeLanguage(language);
  const highlightKey = `${normalizedLanguage}:${code}`;
  const [highlight, setHighlight] = useState<HighlightResult | null>(null);
  const html = highlight?.key === highlightKey ? highlight.html : null;

  useEffect(() => {
    let cancelled = false;

    codeToHtml(code, {
      lang: normalizedLanguage,
      theme: "github-dark",
    })
      .then((value) => {
        if (!cancelled) {
          setHighlight({ key: highlightKey, html: value });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHighlight(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, highlightKey, normalizedLanguage]);

  if (!html) {
    return (
      <pre className="overflow-x-auto rounded-lg bg-code p-4 text-sm leading-6 text-code-ink">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div className="shiki-code" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function normalizeLanguage(language: string): BundledLanguage | "text" {
  return LANGUAGE_ALIASES[language.toLowerCase()] ?? "text";
}
