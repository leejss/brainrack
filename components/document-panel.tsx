"use client";

import { Bookmark, BookmarkCheck, Copy, Download, RotateCcw } from "lucide-react";

import {
  EmptyState,
  StreamingSkeleton,
} from "@/components/ui/empty-states";
import { IconButton } from "@/components/ui/icon-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { GenerationRecord, GenerationStatus } from "@/lib/types";

type DocumentPanelProps = {
  activeRecord: GenerationRecord | null;
  activeId: string | null;
  error: string | null;
  hasOutput: boolean;
  markdown: string;
  query: string;
  status: GenerationStatus;
  onCopy: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  onToggleBookmark: (recordId: string) => void;
};

export function DocumentPanel({
  activeRecord,
  activeId,
  error,
  hasOutput,
  markdown,
  query,
  status,
  onCopy,
  onDownload,
  onRegenerate,
  onToggleBookmark,
}: DocumentPanelProps) {
  return (
    <section className="mt-4 min-h-0 flex-1">
      <DocumentToolbar
        activeRecord={activeRecord}
        activeId={activeId}
        hasOutput={hasOutput}
        query={query}
        status={status}
        onCopy={onCopy}
        onDownload={onDownload}
        onRegenerate={onRegenerate}
        onToggleBookmark={onToggleBookmark}
      />
      <DocumentReader error={error} markdown={markdown} status={status} />
    </section>
  );
}

function DocumentToolbar({
  activeRecord,
  activeId,
  hasOutput,
  query,
  status,
  onCopy,
  onDownload,
  onRegenerate,
  onToggleBookmark,
}: Omit<DocumentPanelProps, "error" | "markdown">) {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-ink">Document</p>
        <p className="mt-1 text-sm text-muted">Markdown output. Code blocks use Shiki highlighting.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <BookmarkButton
          bookmarked={Boolean(activeRecord?.bookmarked)}
          disabled={!activeId}
          onClick={() => activeId && onToggleBookmark(activeId)}
        />
        <IconButton label="Copy Markdown" disabled={!hasOutput} onClick={onCopy}>
          <Copy size={16} />
        </IconButton>
        <IconButton label="Download Markdown" disabled={!hasOutput} onClick={onDownload}>
          <Download size={16} />
        </IconButton>
        <IconButton
          label="Regenerate"
          disabled={!query.trim() || status === "streaming"}
          onClick={onRegenerate}
        >
          <RotateCcw size={16} />
        </IconButton>
      </div>
    </div>
  );
}

function BookmarkButton({
  bookmarked,
  disabled,
  onClick,
}: {
  bookmarked: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-10 items-center gap-2 rounded-md bg-panel px-3 text-sm font-medium text-muted shadow-soft transition-transform duration-150 ease-snappy hover:text-ink disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.96]"
    >
      {bookmarked ? <BookmarkCheck size={16} className="text-accent" /> : <Bookmark size={16} />}
      Bookmark
    </button>
  );
}

function DocumentReader({
  error,
  markdown,
  status,
}: {
  error: string | null;
  markdown: string;
  status: GenerationStatus;
}) {
  return (
    <div className="min-h-[34rem] rounded-lg bg-output shadow-soft">
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-7 sm:py-7">
        {status === "streaming" && !markdown ? (
          <StreamingSkeleton />
        ) : error ? (
          <div className="rounded-lg bg-danger-soft p-4 text-sm leading-6 text-danger-ink">
            {error}
          </div>
        ) : markdown ? (
          <MarkdownRenderer markdown={markdown} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
