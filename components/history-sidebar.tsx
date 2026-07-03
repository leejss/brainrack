"use client";

import { Bookmark, BookmarkCheck, Plus, Terminal } from "lucide-react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { SidebarEmptyState } from "@/components/ui/sidebar-empty-state";
import { formatGenerationDate, languageLabel } from "@/lib/labels";
import type { GenerationRecord, SidebarFilter } from "@/lib/types";

type HistorySidebarProps = {
  activeId: string | null;
  filter: SidebarFilter;
  records: GenerationRecord[];
  onChangeFilter: (filter: SidebarFilter) => void;
  onNew: () => void;
  onSelectRecord: (record: GenerationRecord) => void;
  onToggleBookmark: (recordId: string) => void;
};

export function HistorySidebar({
  activeId,
  filter,
  records,
  onChangeFilter,
  onNew,
  onSelectRecord,
  onToggleBookmark,
}: HistorySidebarProps) {
  return (
    <aside className="border-r border-sidebar-soft bg-sidebar text-sidebar-ink lg:sticky lg:top-0 lg:h-screen transition-all duration-300 ease-snappy">
      <div className="flex h-full flex-col">
        <SidebarHeader onNew={onNew} />
        <div className="px-4 pb-4">
          <SegmentedControl
            ariaLabel="문서 목록 필터"
            value={filter}
            onChange={onChangeFilter}
            options={[
              ["all", "History"],
              ["bookmarked", "Bookmarks"],
            ]}
            variant="sidebar"
          />
        </div>
        <SidebarHistoryList
          activeId={activeId}
          filter={filter}
          records={records}
          onSelectRecord={onSelectRecord}
          onToggleBookmark={onToggleBookmark}
        />
      </div>
    </aside>
  );
}

function SidebarHeader({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-6 border-b border-sidebar-soft/40 mb-4">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-sidebar-muted">
          Brainrack
        </p>
        <p className="mt-0.5 text-sm font-semibold tracking-tight text-sidebar-ink/90">
          Worked Examples
        </p>
      </div>
      <button
        type="button"
        onClick={onNew}
        className="grid size-11 shrink-0 place-items-center rounded-lg bg-sidebar-soft text-sidebar-ink shadow-soft transition-all duration-200 ease-spring border border-sidebar-soft/60 hover:bg-sidebar-hover hover:border-sidebar-muted active:scale-[0.94]"
        aria-label="Start new generation"
        title="New Generation"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function SidebarHistoryList({
  activeId,
  filter,
  records,
  onSelectRecord,
  onToggleBookmark,
}: Omit<HistorySidebarProps, "onChangeFilter" | "onNew">) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
      {records.length === 0 ? (
        <SidebarEmptyState filter={filter} />
      ) : (
        <ul className="flex gap-3 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:overflow-x-visible lg:pb-0">
          {records.map((record) => (
            <HistoryItem
              key={record.id}
              active={record.id === activeId}
              record={record}
              onSelect={() => onSelectRecord(record)}
              onToggleBookmark={() => onToggleBookmark(record.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function HistoryItem({
  active,
  record,
  onSelect,
  onToggleBookmark,
}: {
  active: boolean;
  record: GenerationRecord;
  onSelect: () => void;
  onToggleBookmark: () => void;
}) {
  return (
    <li className="w-64 shrink-0 lg:w-auto list-none">
      <div
        className={`group flex rounded-lg border transition-all duration-200 ease-snappy ${itemBorderAndBg(
          active,
        )}`}
      >
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 px-3 py-2.5 text-left transition-transform duration-100 active:translate-x-0.5"
        >
          <span className="flex items-center gap-2">
            <Terminal
              size={13}
              className={`shrink-0 transition-colors ${
                active
                  ? "text-accent"
                  : "text-sidebar-muted group-hover:text-accent"
              }`}
            />
            <span className="truncate text-xs font-semibold tracking-tight">
              {record.title}
            </span>
          </span>
          <span className="mt-1 flex items-center gap-2 text-[0.68rem] text-sidebar-muted font-medium">
            <span>{formatGenerationDate(record.createdAt)}</span>
            <span className="opacity-40">•</span>
            <span>{languageLabel(record.language)}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onToggleBookmark}
          className={`grid size-11 shrink-0 place-items-center self-center rounded-md text-sidebar-muted transition-all duration-200 hover:text-accent hover:bg-sidebar-soft/50 ${
            active ? "mr-1" : "mr-1"
          }`}
          aria-label={
            record.bookmarked ? "Remove bookmark" : "Bookmark generation"
          }
        >
          {record.bookmarked ? (
            <BookmarkCheck size={14} className="text-accent scale-110" />
          ) : (
            <Bookmark
              size={14}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          )}
        </button>
      </div>
    </li>
  );
}

function itemBorderAndBg(active: boolean) {
  return active
    ? "bg-sidebar-soft text-sidebar-ink border-sidebar-hover shadow-soft"
    : "border-transparent text-sidebar-muted hover:bg-sidebar-soft/50 hover:text-sidebar-ink hover:border-sidebar-soft";
}
