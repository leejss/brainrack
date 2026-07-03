"use client";

import { useAppState } from "@/components/app-state-provider";
import { DocumentPanel } from "@/components/document-panel";
import {
  findActiveRecord,
  visibleError,
} from "@/store/worked-example-selectors";

export function DocumentPanelContainer() {
  const activeId = useAppState((state) => state.activeId);
  const history = useAppState((state) => state.history);
  const error = useAppState((state) => state.error);
  const historyError = useAppState((state) => state.historyError);
  const markdown = useAppState((state) => state.markdown);
  const query = useAppState((state) => state.query);
  const status = useAppState((state) => state.status);
  const copyMarkdown = useAppState((state) => state.copyMarkdown);
  const downloadMarkdown = useAppState((state) => state.downloadMarkdown);
  const generateWorkedExample = useAppState(
    (state) => state.generateWorkedExample,
  );
  const toggleBookmark = useAppState((state) => state.toggleBookmark);
  const activeRecord = findActiveRecord(history, activeId);

  return (
    <DocumentPanel
      activeRecord={activeRecord}
      activeId={activeId}
      error={visibleError(error, historyError)}
      hasOutput={Boolean(activeId && markdown.trim())}
      markdown={markdown}
      query={query}
      status={status}
      onCopy={copyMarkdown}
      onDownload={downloadMarkdown}
      onRegenerate={generateWorkedExample}
      onToggleBookmark={toggleBookmark}
    />
  );
}
