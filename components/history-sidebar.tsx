"use client";

import { Bookmark, BookmarkCheck, Plus, SquareCode } from "lucide-react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { SidebarEmptyState } from "@/components/ui/sidebar-empty-state";
import {
  formatGenerationDate,
  languageLabel,
} from "@/lib/labels";
import type {
  GenerationRecord,
  SidebarFilter,
} from "@/lib/types";

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
    <aside className="bg-sidebar text-sidebar-ink lg:sticky lg:top-0 lg:h-screen">
      <div className="flex h-full flex-col">
        <SidebarHeader onNew={onNew} />
        <div className="px-3 pb-4">
          <SegmentedControl
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
    <div className="flex items-start justify-between gap-4 px-5 py-5">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
          Brainrack
        </p>
        <h1 className="mt-1 text-base font-semibold">Worked Examples</h1>
      </div>
      <button
        type="button"
        onClick={onNew}
        className="grid size-10 shrink-0 place-items-center rounded-lg bg-sidebar-soft text-sidebar-ink shadow-soft transition-transform duration-150 ease-snappy hover:bg-sidebar-hover active:scale-[0.96]"
        aria-label="Start new generation"
        title="New"
      >
        <Plus size={18} />
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
    <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
      {records.length === 0 ? (
        <SidebarEmptyState filter={filter} />
      ) : (
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1.5 lg:overflow-x-visible lg:pb-0">
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
    <li className="w-64 shrink-0 lg:w-auto">
      <div className={`group flex rounded-lg transition-colors duration-150 ease-snappy ${itemColor(active)}`}>
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 px-3 py-3 text-left">
          <span className="flex items-center gap-2">
            <SquareCode size={15} className="shrink-0 text-accent" />
            <span className="truncate text-sm font-medium">{record.title}</span>
          </span>
          <span className="mt-1.5 flex items-center gap-2 text-[0.72rem] text-sidebar-muted">
            <span>{formatGenerationDate(record.createdAt)}</span>
            <span>{languageLabel(record.language)}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onToggleBookmark}
          className="grid size-10 shrink-0 place-items-center self-center rounded-md text-sidebar-muted transition-colors duration-150 ease-snappy hover:text-accent"
          aria-label={record.bookmarked ? "Remove bookmark" : "Bookmark generation"}
        >
          {record.bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        </button>
      </div>
    </li>
  );
}

function itemColor(active: boolean) {
  return active
    ? "bg-sidebar-hover text-sidebar-ink"
    : "text-sidebar-muted hover:bg-sidebar-soft hover:text-sidebar-ink";
}
