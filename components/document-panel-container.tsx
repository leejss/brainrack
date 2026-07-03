"use client";

import { DocumentPanel } from "@/components/document-panel";
import { useAppState } from "@/components/app-state-provider";

export function DocumentPanelContainer() {
  const controller = useAppState();

  return (
    <DocumentPanel
      activeRecord={controller.activeRecord}
      activeId={controller.activeId}
      error={controller.error}
      hasOutput={controller.hasOutput}
      markdown={controller.markdown}
      query={controller.query}
      status={controller.status}
      onCopy={controller.copyMarkdown}
      onDownload={controller.downloadMarkdown}
      onRegenerate={controller.generateWorkedExample}
      onToggleBookmark={controller.toggleBookmark}
    />
  );
}
