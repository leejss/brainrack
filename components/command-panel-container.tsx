"use client";

import { useAppState } from "@/components/app-state-provider";
import { CommandPanel } from "@/components/command-panel";

export function CommandPanelContainer() {
  const query = useAppState((state) => state.query);
  const status = useAppState((state) => state.status);
  const learnerLevel = useAppState((state) => state.learnerLevel);
  const language = useAppState((state) => state.language);
  const setQuery = useAppState((state) => state.setQuery);
  const setLearnerLevel = useAppState((state) => state.setLearnerLevel);
  const setLanguage = useAppState((state) => state.setLanguage);
  const generateWorkedExample = useAppState(
    (state) => state.generateWorkedExample,
  );
  const stopGeneration = useAppState((state) => state.stopGeneration);

  return (
    <CommandPanel
      query={query}
      status={status}
      learnerLevel={learnerLevel}
      language={language}
      onChangeQuery={setQuery}
      onChangeLearnerLevel={setLearnerLevel}
      onChangeLanguage={setLanguage}
      onGenerate={generateWorkedExample}
      onStop={stopGeneration}
    />
  );
}
