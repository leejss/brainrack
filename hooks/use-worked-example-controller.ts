"use client";

import { useRef, useState } from "react";
import { streamWorkedExampleFromApi } from "@/client/api-client";
import { useGenerationHistory } from "@/hooks/use-generation-history";
import { createGenerationRecord } from "@/lib/generation/history";
import {
  describeWorkedExampleValidationFailure,
  validateWorkedExampleMarkdown,
} from "@/lib/generation/validation";
import { slugifyForFilename, titleFromProblemQuery } from "@/lib/problem/input";
import {
  DEFAULT_AI_MODEL,
  DEFAULT_AI_PROVIDER,
  DEFAULT_LEARNER_LEVEL,
  DEFAULT_SOLUTION_LANGUAGE,
  type GenerationRecord,
  type GenerationStatus,
  type LearnerLevel,
  type SolutionLanguage,
} from "@/lib/types";

export function useWorkedExampleController() {
  const [query, setQuery] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [learnerLevel, setLearnerLevel] = useState<LearnerLevel>(
    DEFAULT_LEARNER_LEVEL,
  );
  const [language, setLanguage] = useState<SolutionLanguage>(
    DEFAULT_SOLUTION_LANGUAGE,
  );
  const abortRef = useRef<AbortController | null>(null);
  const history = useGenerationHistory();
  const visibleError = error ?? history.historyError;
  const outputTitle =
    history.activeRecord?.title ??
    (query.trim() ? titleFromProblemQuery(query) : "New Worked Example");
  const outputModel = history.activeRecord?.model ?? DEFAULT_AI_MODEL;
  const outputProvider = history.activeRecord?.provider ?? DEFAULT_AI_PROVIDER;

  async function generateWorkedExample() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || status === "streaming") {
      return;
    }

    const abortController = beginGeneration();

    try {
      const streamResult = await streamWorkedExampleFromApi({
        request: { query: trimmedQuery, learnerLevel, language },
        signal: abortController.signal,
        onMarkdown: setMarkdown,
      });
      completeGeneration(trimmedQuery, streamResult);
    } catch (caught) {
      handleGenerationError(caught, abortController.signal);
    }
  }

  function stopGeneration() {
    abortRef.current?.abort();
    setStatus("idle");
  }

  function startFresh() {
    abortRef.current?.abort();
    setQuery("");
    setMarkdown("");
    setError(null);
    history.clearActiveRecord();
    setStatus("idle");
  }

  function selectRecord(record: GenerationRecord) {
    abortRef.current?.abort();
    setQuery(record.query);
    setMarkdown(record.markdown);
    setLearnerLevel(record.learnerLevel);
    setLanguage(record.language);
    history.activateRecord(record.id);
    setError(null);
    setStatus("idle");
  }

  function toggleBookmark(recordId: string) {
    if (!history.toggleBookmark(recordId)) {
      setStatus("error");
    }
  }

  async function copyMarkdown() {
    if (markdown) {
      await navigator.clipboard.writeText(markdown);
    }
  }

  function downloadMarkdown() {
    if (!markdown) {
      return;
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugifyForFilename(history.activeRecord?.title ?? query)}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function beginGeneration() {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;
    setStatus("streaming");
    setError(null);
    setMarkdown("");
    history.clearActiveRecord();
    return abortController;
  }

  function completeGeneration(
    trimmedQuery: string,
    streamResult: { markdown: string; model: string; provider: string },
  ) {
    const validation = validateWorkedExampleMarkdown(streamResult.markdown);

    if (!validation.valid) {
      setError(describeWorkedExampleValidationFailure(validation));
      setStatus("error");
      return;
    }

    const nextRecord = createGenerationRecord({
      id: createId(),
      query: trimmedQuery,
      title: titleFromProblemQuery(trimmedQuery),
      markdown: streamResult.markdown,
      createdAt: new Date().toISOString(),
      model: streamResult.model,
      provider: streamResult.provider,
      bookmarked: false,
      learnerLevel,
      language,
    });
    if (!history.addRecord(nextRecord)) {
      setStatus("error");
      return;
    }

    history.activateRecord(nextRecord.id);
    setStatus("idle");
  }

  function handleGenerationError(caught: unknown, signal: AbortSignal) {
    if (signal.aborted) {
      setStatus("idle");
      return;
    }

    setError(caught instanceof Error ? caught.message : "Generation failed.");
    setStatus("error");
  }

  return {
    query,
    setQuery,
    markdown,
    status,
    error: visibleError,
    filteredHistory: history.filteredHistory,
    activeRecord: history.activeRecord,
    activeId: history.activeId,
    sidebarFilter: history.filter,
    setSidebarFilter: history.setFilter,
    learnerLevel,
    setLearnerLevel,
    language,
    setLanguage,
    outputTitle,
    outputModel,
    outputProvider,
    hasOutput: Boolean(markdown),
    generateWorkedExample,
    stopGeneration,
    startFresh,
    selectRecord,
    toggleBookmark,
    copyMarkdown,
    downloadMarkdown,
  };
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}
