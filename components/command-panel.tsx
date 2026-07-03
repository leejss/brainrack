"use client";

import { type FormEvent } from "react";
import { Send, StopCircle } from "lucide-react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import type {
  GenerationStatus,
  LearnerLevel,
  SolutionLanguage,
} from "@/lib/types";

const EXAMPLE_INPUTS = ["1", "424", "Binary Search"];

type CommandPanelProps = {
  query: string;
  status: GenerationStatus;
  learnerLevel: LearnerLevel;
  language: SolutionLanguage;
  onChangeQuery: (query: string) => void;
  onChangeLearnerLevel: (learnerLevel: LearnerLevel) => void;
  onChangeLanguage: (language: SolutionLanguage) => void;
  onGenerate: () => void;
  onStop: () => void;
};

export function CommandPanel({
  query,
  status,
  learnerLevel,
  language,
  onChangeQuery,
  onChangeLearnerLevel,
  onChangeLanguage,
  onGenerate,
  onStop,
}: CommandPanelProps) {
  function submitGeneration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onGenerate();
  }

  return (
    <form onSubmit={submitGeneration} className="py-5">
      <div className="rounded-lg bg-panel p-2 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <ProblemInput query={query} onChangeQuery={onChangeQuery} />
          <GenerationControls
            query={query}
            status={status}
            learnerLevel={learnerLevel}
            language={language}
            onChangeLearnerLevel={onChangeLearnerLevel}
            onChangeLanguage={onChangeLanguage}
            onStop={onStop}
          />
        </div>
      </div>
      <ExampleInputChips onSelectExample={onChangeQuery} />
    </form>
  );
}

function ProblemInput({
  query,
  onChangeQuery,
}: {
  query: string;
  onChangeQuery: (query: string) => void;
}) {
  return (
    <div className="min-w-0 flex-1">
      <label
        htmlFor="problem-query"
        className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted"
      >
        Problem
      </label>
      <textarea
        id="problem-query"
        value={query}
        onChange={(event) => onChangeQuery(event.target.value)}
        placeholder="LeetCode URL, number, title, or pasted statement"
        className="min-h-24 w-full resize-none rounded-md bg-control/50 px-3 py-3 text-base leading-7 text-ink outline-none transition-colors duration-150 ease-snappy placeholder:text-muted focus:bg-panel"
      />
    </div>
  );
}

function GenerationControls({
  query,
  status,
  learnerLevel,
  language,
  onChangeLearnerLevel,
  onChangeLanguage,
  onStop,
}: Omit<CommandPanelProps, "onChangeQuery" | "onGenerate">) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] lg:w-[30rem]">
      <SegmentedControl
        value={language}
        onChange={onChangeLanguage}
        options={[
          ["typescript", "TS"],
          ["python", "Python"],
        ]}
      />
      <SegmentedControl
        value={learnerLevel}
        onChange={onChangeLearnerLevel}
        options={[
          ["novice-intermediate", "Guided"],
          ["advanced", "Advanced"],
        ]}
      />
      {status === "streaming" ? (
        <StopButton onStop={onStop} />
      ) : (
        <GenerateButton disabled={!query.trim()} />
      )}
    </div>
  );
}

function StopButton({ onStop }: { onStop: () => void }) {
  return (
    <button
      type="button"
      onClick={onStop}
      className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-md bg-danger px-4 text-sm font-semibold text-white transition-transform duration-150 ease-snappy active:scale-[0.96]"
    >
      <StopCircle size={16} />
      Stop
    </button>
  );
}

function GenerateButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink shadow-accent transition-transform duration-150 ease-snappy hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.96]"
    >
      <Send size={16} />
      Generate
    </button>
  );
}

function ExampleInputChips({
  onSelectExample,
}: {
  onSelectExample: (example: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {EXAMPLE_INPUTS.map((example) => (
        <button
          key={example}
          type="button"
          onClick={() => onSelectExample(example)}
          className="min-h-10 rounded-md bg-panel px-3 text-xs font-medium text-muted shadow-soft transition-colors duration-150 ease-snappy hover:text-ink"
        >
          {example}
        </button>
      ))}
    </div>
  );
}
