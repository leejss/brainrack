"use client";

import { Hash, Play, StopCircle } from "lucide-react";
import type { FormEvent } from "react";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { EXAMPLE_INPUTS } from "@/lib/problem/examples";
import type {
  GenerationStatus,
  LearnerLevel,
  SolutionLanguage,
} from "@/lib/types";

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
    <form
      onSubmit={submitGeneration}
      className="w-full flex flex-col gap-4 py-2"
    >
      <div className="rounded-xl border border-line bg-panel p-4 shadow-soft hover:shadow-raised focus-within:border-accent/40 focus-within:ring-3 focus-within:ring-accent/8 focus-within:shadow-raised transition-all duration-300 ease-snappy">
        <div className="flex flex-col gap-4">
          <ProblemInput query={query} onChangeQuery={onChangeQuery} />

          <div className="h-px bg-line/80 w-full" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-full sm:w-auto">
                <SegmentedControl
                  ariaLabel="코드 언어 선택"
                  value={language}
                  onChange={onChangeLanguage}
                  options={[
                    ["typescript", "TypeScript"],
                    ["python", "Python"],
                  ]}
                />
              </div>
              <div className="w-full sm:w-auto">
                <SegmentedControl
                  ariaLabel="학습 모드 선택"
                  value={learnerLevel}
                  onChange={onChangeLearnerLevel}
                  options={[
                    ["novice-intermediate", "가이드 모드"],
                    ["advanced", "고급 모드"],
                  ]}
                />
              </div>
            </div>

            <div className="flex justify-end">
              {status === "streaming" ? (
                <StopButton onStop={onStop} />
              ) : (
                <GenerateButton disabled={!query.trim()} />
              )}
            </div>
          </div>
        </div>
      </div>

      <ExampleInputChips query={query} onSelectExample={onChangeQuery} />
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
    <div className="flex flex-col w-full">
      <label
        htmlFor="problem-query"
        className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-1.5"
      >
        <span>문제 입력</span>
      </label>
      <textarea
        id="problem-query"
        value={query}
        onChange={(event) => onChangeQuery(event.target.value)}
        placeholder="LeetCode URL, 번호(예: 1), 제목(예: Two Sum) 또는 문제 본문을 직접 붙여넣으세요..."
        className="min-h-24 w-full resize-none bg-transparent px-1 py-1 text-sm font-medium leading-6 text-ink placeholder:text-muted/70 outline-none border-none focus:ring-0 focus:outline-none"
      />
    </div>
  );
}

function StopButton({ onStop }: { onStop: () => void }) {
  return (
    <button
      type="button"
      onClick={onStop}
      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-danger px-4 text-xs font-bold uppercase tracking-wider text-white shadow-soft transition-all duration-200 hover:bg-danger-ink active:scale-[0.95] cursor-pointer sm:w-40"
    >
      <StopCircle size={14} className="animate-pulse" />
      생성 중지
    </button>
  );
}

function GenerateButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-xs font-bold uppercase tracking-wider text-accent-ink shadow-accent transition-all duration-200 hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none active:scale-[0.95] cursor-pointer sm:w-40"
    >
      <Play size={12} fill="currentColor" />
      학습 문서 생성
    </button>
  );
}

function ExampleInputChips({
  query,
  onSelectExample,
}: {
  query: string;
  onSelectExample: (example: string) => void;
}) {
  const normalizedQuery = query.trim();

  return (
    <div className="flex flex-wrap items-center gap-2 px-1">
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-muted mr-1">
        빠른 예시
      </span>
      {EXAMPLE_INPUTS.map((example) => {
        const isActive = normalizedQuery === example.query;

        return (
          <button
            key={example.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectExample(example.query)}
            className={`flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold shadow-soft transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
              isActive
                ? "border-accent bg-accent-soft text-accent-ink"
                : "border-line/80 bg-panel text-muted hover:text-accent hover:border-accent"
            }`}
            title={example.displayTitle}
          >
            <Hash size={11} className="text-muted/60" />
            {example.label}
          </button>
        );
      })}
    </div>
  );
}
