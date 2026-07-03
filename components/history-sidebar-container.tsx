"use client";

import { useAppState } from "@/components/app-state-provider";
import { HistorySidebar } from "@/components/history-sidebar";

export function HistorySidebarContainer() {
  const controller = useAppState();

  return (
    <HistorySidebar
      activeId={controller.activeId}
      filter={controller.sidebarFilter}
      records={controller.filteredHistory}
      onChangeFilter={controller.setSidebarFilter}
      onNew={controller.startFresh}
      onSelectRecord={controller.selectRecord}
      onToggleBookmark={controller.toggleBookmark}
    />
  );
}
