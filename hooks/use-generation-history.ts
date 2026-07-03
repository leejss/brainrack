"use client";

import { useEffect, useMemo, useState } from "react";

import {
  loadGenerationHistory,
  persistGenerationHistory,
} from "@/client/browser-history";
import {
  prependGenerationRecord,
  toggleGenerationBookmark,
} from "@/lib/generation/history";
import type { GenerationRecord, SidebarFilter } from "@/lib/types";

export function useGenerationHistory() {
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<SidebarFilter>("all");
  const [historyError, setHistoryError] = useState<string | null>(null);

  const activeRecord = useMemo(
    () => history.find((record) => record.id === activeId) ?? null,
    [activeId, history],
  );
  const filteredHistory = useMemo(
    () => filterGenerationHistory(history, filter),
    [history, filter],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(loadGenerationHistory(window.localStorage));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function addRecord(record: GenerationRecord) {
    return persistAndSetHistory(prependGenerationRecord(history, record));
  }

  function toggleBookmark(recordId: string) {
    return persistAndSetHistory(toggleGenerationBookmark(history, recordId));
  }

  function activateRecord(recordId: string) {
    setActiveId(recordId);
    setHistoryError(null);
  }

  function clearActiveRecord() {
    setActiveId(null);
    setHistoryError(null);
  }

  function persistAndSetHistory(nextHistory: GenerationRecord[]) {
    const result = persistGenerationHistory(window.localStorage, nextHistory);

    if (!result.ok) {
      setHistoryError(result.error.message);
      return false;
    }

    setHistory(nextHistory);
    setHistoryError(null);
    return true;
  }

  return {
    activeId,
    activeRecord,
    filter,
    filteredHistory,
    historyError,
    setFilter,
    addRecord,
    activateRecord,
    clearActiveRecord,
    toggleBookmark,
  };
}

function filterGenerationHistory(
  history: GenerationRecord[],
  filter: SidebarFilter,
) {
  return filter === "bookmarked"
    ? history.filter((record) => record.bookmarked)
    : history;
}
