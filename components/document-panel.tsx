"use client";

import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Download,
  FileText,
  RotateCcw,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { EmptyState, StreamingSkeleton } from "@/components/ui/empty-states";
import { IconButton } from "@/components/ui/icon-button";
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
    <section className="mt-2 min-h-0 flex-1 flex flex-col gap-4">
      <DocumentToolbar
        activeRecord={activeRecord}
        activeId={activeId}
        error={error}
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
  error,
  hasOutput,
  query,
  status,
  onCopy,
  onDownload,
  onRegenerate,
  onToggleBookmark,
}: Omit<DocumentPanelProps, "markdown">) {
  const canRetryAfterError = Boolean(error && query.trim());
  const canRegenerate =
    status !== "streaming" && (hasOutput || canRetryAfterError);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-3">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-muted/80" />
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            생성된 학습 문서
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <BookmarkButton
          bookmarked={Boolean(activeRecord?.bookmarked)}
          disabled={!activeId || !hasOutput || status === "streaming"}
          onClick={() => activeId && onToggleBookmark(activeId)}
        />

        <div className="h-4 w-px bg-line/80 mx-1 hidden sm:block" />

        <IconButton
          label="Markdown 복사"
          disabled={!hasOutput}
          onClick={onCopy}
        >
          <Copy size={14} />
        </IconButton>
        <IconButton
          label="Markdown 다운로드"
          disabled={!hasOutput}
          onClick={onDownload}
        >
          <Download size={14} />
        </IconButton>
        <IconButton
          label={canRetryAfterError ? "다시 시도" : "다시 생성"}
          disabled={!canRegenerate}
          onClick={onRegenerate}
        >
          <RotateCcw size={14} />
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
      className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-panel px-3 text-xs font-bold tracking-tight text-muted/80 shadow-soft transition-all duration-200 hover:text-ink hover:border-muted/80 hover:bg-control/20 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none disabled:bg-panel disabled:border-line/60 active:scale-[0.95] cursor-pointer"
    >
      {bookmarked ? (
        <BookmarkCheck size={14} className="text-accent scale-110" />
      ) : (
        <Bookmark size={14} className="opacity-80" />
      )}
      <span>{bookmarked ? "북마크됨" : "북마크"}</span>
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
    <div className="min-h-[20rem] rounded-xl border border-line bg-output shadow-soft overflow-hidden transition-all duration-300 xl:min-h-[35rem]">
      <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10 sm:py-10">
        {status === "streaming" && !markdown ? (
          <StreamingSkeleton />
        ) : error ? (
          <div className="rounded-xl border border-danger/20 bg-danger-soft p-4 text-xs font-semibold leading-6 text-danger-ink shadow-inner">
            <p className="font-bold mb-1">문제가 발생했습니다</p>
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
