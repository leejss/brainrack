"use client";

import { useAppState } from "@/components/app-state-provider";
import { HistorySidebar } from "@/components/history-sidebar";
import { filterGenerationHistory } from "@/store/worked-example-selectors";

export function HistorySidebarContainer() {
  const activeId = useAppState((state) => state.activeId);
  const filter = useAppState((state) => state.sidebarFilter);
  const history = useAppState((state) => state.history);
  const setSidebarFilter = useAppState((state) => state.setSidebarFilter);
  const startFresh = useAppState((state) => state.startFresh);
  const selectRecord = useAppState((state) => state.selectRecord);
  const toggleBookmark = useAppState((state) => state.toggleBookmark);
  const records = filterGenerationHistory(history, filter);

  return (
    <HistorySidebar
      activeId={activeId}
      filter={filter}
      records={records}
      onChangeFilter={setSidebarFilter}
      onNew={startFresh}
      onSelectRecord={selectRecord}
      onToggleBookmark={toggleBookmark}
    />
  );
}
