"use client";

import { MetadataStrip } from "@/components/metadata-strip";
import { useAppState } from "@/components/app-state-provider";

export function MetadataStripContainer() {
  const controller = useAppState();

  return (
    <MetadataStrip
      title={controller.outputTitle}
      model={controller.outputModel}
      provider={controller.outputProvider}
      language={controller.language}
      learnerLevel={controller.learnerLevel}
      status={controller.status}
    />
  );
}
