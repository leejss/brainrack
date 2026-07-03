"use client";

import { useAppState } from "@/components/app-state-provider";
import { CommandPanel } from "@/components/command-panel";

export function CommandPanelContainer() {
  const controller = useAppState();

  return (
    <CommandPanel
      query={controller.query}
      status={controller.status}
      learnerLevel={controller.learnerLevel}
      language={controller.language}
      onChangeQuery={controller.setQuery}
      onChangeLearnerLevel={controller.setLearnerLevel}
      onChangeLanguage={controller.setLanguage}
      onGenerate={controller.generateWorkedExample}
      onStop={controller.stopGeneration}
    />
  );
}
