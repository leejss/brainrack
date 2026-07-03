"use client";

import { useAppState } from "@/components/app-state-provider";
import { MetadataStrip } from "@/components/metadata-strip";
import {
  findActiveRecord,
  outputModel,
  outputProvider,
  outputTitle,
} from "@/store/worked-example-selectors";

export function MetadataStripContainer() {
  const query = useAppState((state) => state.query);
  const history = useAppState((state) => state.history);
  const activeId = useAppState((state) => state.activeId);
  const language = useAppState((state) => state.language);
  const learnerLevel = useAppState((state) => state.learnerLevel);
  const status = useAppState((state) => state.status);
  const activeRecord = findActiveRecord(history, activeId);

  return (
    <MetadataStrip
      title={outputTitle(activeRecord, query)}
      model={outputModel(activeRecord)}
      provider={outputProvider(activeRecord)}
      language={language}
      learnerLevel={learnerLevel}
      status={status}
    />
  );
}
