import { createStore } from "zustand/vanilla";
import type { WorkedExampleStreamResult } from "@/client/api-client";
import { streamWorkedExampleFromApi } from "@/client/api-client";
import {
  loadGenerationHistory,
  persistGenerationHistory,
} from "@/client/browser-history";
import {
  createGenerationRecord,
  prependGenerationRecord,
  toggleGenerationBookmark,
} from "@/lib/generation/history";
import {
  describeWorkedExampleValidationFailure,
  validateWorkedExampleMarkdown,
} from "@/lib/generation/validation";
import { slugifyForFilename, titleFromProblemQuery } from "@/lib/problem/input";
import {
  DEFAULT_LEARNER_LEVEL,
  DEFAULT_SOLUTION_LANGUAGE,
  type GenerationRecord,
  type GenerationStatus,
  type LearnerLevel,
  type SidebarFilter,
  type SolutionLanguage,
} from "@/lib/types";

export type WorkedExampleState = {
  query: string;
  markdown: string;
  status: GenerationStatus;
  error: string | null;
  learnerLevel: LearnerLevel;
  language: SolutionLanguage;
  history: GenerationRecord[];
  activeId: string | null;
  sidebarFilter: SidebarFilter;
  historyError: string | null;
};

export type WorkedExampleActions = {
  setQuery: (query: string) => void;
  setLearnerLevel: (learnerLevel: LearnerLevel) => void;
  setLanguage: (language: SolutionLanguage) => void;
  setSidebarFilter: (filter: SidebarFilter) => void;
  loadHistory: (storage: Storage) => void;
  generateWorkedExample: () => Promise<void>;
  stopGeneration: () => void;
  startFresh: () => void;
  selectRecord: (record: GenerationRecord) => void;
  toggleBookmark: (recordId: string) => void;
  copyMarkdown: () => Promise<void>;
  downloadMarkdown: () => void;
};

export type WorkedExampleStore = WorkedExampleState & WorkedExampleActions;

export const defaultWorkedExampleState: WorkedExampleState = {
  query: "",
  markdown: "",
  status: "idle",
  error: null,
  learnerLevel: DEFAULT_LEARNER_LEVEL,
  language: DEFAULT_SOLUTION_LANGUAGE,
  history: [],
  activeId: null,
  sidebarFilter: "all",
  historyError: null,
};

export function createWorkedExampleStore(
  initialState: WorkedExampleState = defaultWorkedExampleState,
) {
  let abortController: AbortController | null = null;

  return createStore<WorkedExampleStore>()((set, get) => {
    function persistAndSetHistory(
      storage: Storage,
      nextHistory: GenerationRecord[],
    ) {
      const result = persistGenerationHistory(storage, nextHistory);

      if (!result.ok) {
        set({ historyError: result.error.message });
        return false;
      }

      set({ history: nextHistory, historyError: null });
      return true;
    }

    function completeGeneration(
      trimmedQuery: string,
      learnerLevel: LearnerLevel,
      language: SolutionLanguage,
      streamResult: WorkedExampleStreamResult,
    ) {
      const validation = validateWorkedExampleMarkdown(streamResult.markdown);

      if (!validation.valid) {
        set({
          error: describeWorkedExampleValidationFailure(validation),
          status: "error",
        });
        return;
      }

      const { history } = get();
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
      const nextHistory = prependGenerationRecord(history, nextRecord);

      if (!persistAndSetHistory(window.localStorage, nextHistory)) {
        set({ status: "error" });
        return;
      }

      set({ activeId: nextRecord.id, status: "idle" });
    }

    function handleGenerationError(caught: unknown, signal: AbortSignal) {
      if (signal.aborted) {
        set({ status: "idle" });
        return;
      }

      set({
        error: caught instanceof Error ? caught.message : "Generation failed.",
        status: "error",
      });
    }

    return {
      ...initialState,
      setQuery: (query) => set({ query }),
      setLearnerLevel: (learnerLevel) => set({ learnerLevel }),
      setLanguage: (language) => set({ language }),
      setSidebarFilter: (sidebarFilter) => set({ sidebarFilter }),
      loadHistory: (storage) => {
        set({ history: loadGenerationHistory(storage) });
      },
      generateWorkedExample: async () => {
        const { query, status, learnerLevel, language } = get();
        const trimmedQuery = query.trim();

        if (!trimmedQuery || status === "streaming") {
          return;
        }

        abortController?.abort();
        abortController = new AbortController();
        const currentAbortController = abortController;

        set({
          status: "streaming",
          error: null,
          markdown: "",
          activeId: null,
          historyError: null,
        });

        try {
          const streamResult = await streamWorkedExampleFromApi({
            request: { query: trimmedQuery, learnerLevel, language },
            signal: currentAbortController.signal,
            onMarkdown: (markdown) => set({ markdown }),
          });
          if (currentAbortController !== abortController) {
            return;
          }

          completeGeneration(
            trimmedQuery,
            learnerLevel,
            language,
            streamResult,
          );
        } catch (caught) {
          if (currentAbortController !== abortController) {
            return;
          }

          handleGenerationError(caught, currentAbortController.signal);
        }
      },
      stopGeneration: () => {
        abortController?.abort();
        set({ status: "idle" });
      },
      startFresh: () => {
        abortController?.abort();
        set({
          query: "",
          markdown: "",
          error: null,
          activeId: null,
          historyError: null,
          status: "idle",
        });
      },
      selectRecord: (record) => {
        abortController?.abort();
        set({
          query: record.query,
          markdown: record.markdown,
          learnerLevel: record.learnerLevel,
          language: record.language,
          activeId: record.id,
          error: null,
          historyError: null,
          status: "idle",
        });
      },
      toggleBookmark: (recordId) => {
        const nextHistory = toggleGenerationBookmark(get().history, recordId);

        if (!persistAndSetHistory(window.localStorage, nextHistory)) {
          set({ status: "error" });
        }
      },
      copyMarkdown: async () => {
        const { markdown } = get();

        if (markdown) {
          await navigator.clipboard.writeText(markdown);
        }
      },
      downloadMarkdown: () => {
        const { markdown, query, activeId, history } = get();

        if (!markdown) {
          return;
        }

        const activeRecord =
          history.find((record) => record.id === activeId) ?? null;
        const blob = new Blob([markdown], {
          type: "text/markdown;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${slugifyForFilename(activeRecord?.title ?? query)}.md`;
        anchor.click();
        URL.revokeObjectURL(url);
      },
    };
  });
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}
