"use client";

import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Download,
  Loader2,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  SquareCode,
  StopCircle,
} from "lucide-react";
import {
  FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MarkdownRenderer } from "@/components/worked-example/markdown-renderer";

type GenerationStatus = "idle" | "streaming" | "error";
type LearnerLevel = "novice-intermediate" | "advanced";
type SolutionLanguage = "typescript" | "python";
type SidebarFilter = "all" | "bookmarked";

type GenerationRecord = {
  id: string;
  query: string;
  title: string;
  markdown: string;
  createdAt: string;
  model: string;
  provider: string;
  bookmarked: boolean;
  learnerLevel: LearnerLevel;
  language: SolutionLanguage;
};

const STORAGE_KEY = "brainrack.workedExamples.v1";
const EXAMPLE_INPUTS = ["1", "424", "Binary Search"];

export function WorkedExampleApp() {
  const [query, setQuery] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>("all");
  const [learnerLevel, setLearnerLevel] =
    useState<LearnerLevel>("novice-intermediate");
  const [language, setLanguage] = useState<SolutionLanguage>("typescript");
  const abortRef = useRef<AbortController | null>(null);

  const activeRecord = useMemo(
    () => history.find((record) => record.id === activeId) ?? null,
    [activeId, history],
  );

  const filteredHistory = useMemo(
    () =>
      sidebarFilter === "bookmarked"
        ? history.filter((record) => record.bookmarked)
        : history,
    [history, sidebarFilter],
  );

  const outputTitle =
    activeRecord?.title ?? (query.trim() ? titleFromQuery(query) : "New Worked Example");
  const outputModel = activeRecord?.model ?? "gemini-3.5-flash";
  const outputProvider = activeRecord?.provider ?? "google";
  const hasOutput = Boolean(markdown);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(readHistory());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function generate(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery || status === "streaming") {
      return;
    }

    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setStatus("streaming");
    setError(null);
    setMarkdown("");
    setActiveId(null);

    let nextMarkdown = "";
    let response: Response;

    try {
      response = await fetch("/api/worked-example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedQuery,
          learnerLevel,
          language,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      if (!response.body) {
        throw new Error("Streaming response body is empty.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          nextMarkdown += decoder.decode();
          break;
        }

        nextMarkdown += decoder.decode(value, { stream: true });
        setMarkdown(nextMarkdown);
      }

      const nextRecord: GenerationRecord = {
        id: createId(),
        query: trimmedQuery,
        title: titleFromQuery(trimmedQuery),
        markdown: nextMarkdown,
        createdAt: new Date().toISOString(),
        model: response.headers.get("X-AI-Model") ?? "gemini-3.5-flash",
        provider: response.headers.get("X-AI-Provider") ?? "google",
        bookmarked: false,
        learnerLevel,
        language,
      };

      setHistory((currentHistory) => {
        const nextHistory = [nextRecord, ...currentHistory].slice(0, 30);
        persistHistory(nextHistory);
        return nextHistory;
      });
      setActiveId(nextRecord.id);
      setStatus("idle");
    } catch (caught) {
      if (abortController.signal.aborted) {
        setStatus("idle");
        return;
      }

      setError(caught instanceof Error ? caught.message : "Generation failed.");
      setStatus("error");
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
    setActiveId(null);
    setStatus("idle");
  }

  function selectRecord(record: GenerationRecord) {
    abortRef.current?.abort();
    setQuery(record.query);
    setMarkdown(record.markdown);
    setLearnerLevel(record.learnerLevel);
    setLanguage(record.language);
    setActiveId(record.id);
    setError(null);
    setStatus("idle");
  }

  function toggleBookmark(recordId: string) {
    const nextHistory = history.map((record) =>
      record.id === recordId
        ? { ...record, bookmarked: !record.bookmarked }
        : record,
    );

    persistHistory(nextHistory);
    setHistory(nextHistory);
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
    anchor.download = `${slugify(activeRecord?.title ?? query) || "worked-example"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="bg-sidebar text-sidebar-ink lg:sticky lg:top-0 lg:h-screen">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 px-5 py-5">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
                Brainrack
              </p>
              <h1 className="mt-1 text-base font-semibold">
                Worked Examples
              </h1>
            </div>
            <button
              type="button"
              onClick={startFresh}
              className="grid size-10 shrink-0 place-items-center rounded-lg bg-sidebar-soft text-sidebar-ink shadow-soft transition-transform duration-150 ease-snappy hover:bg-sidebar-hover active:scale-[0.96]"
              aria-label="Start new generation"
              title="New"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="px-3 pb-4">
            <SegmentedControl
              value={sidebarFilter}
              onChange={setSidebarFilter}
              options={[
                ["all", "History"],
                ["bookmarked", "Bookmarks"],
              ]}
              variant="sidebar"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-5">
            {filteredHistory.length === 0 ? (
              <SidebarEmptyState filter={sidebarFilter} />
            ) : (
              <ul className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1.5 lg:overflow-x-visible lg:pb-0">
                {filteredHistory.map((record) => (
                  <li key={record.id} className="w-64 shrink-0 lg:w-auto">
                    <div
                      className={`group flex rounded-lg transition-colors duration-150 ease-snappy ${
                        record.id === activeId
                          ? "bg-sidebar-hover text-sidebar-ink"
                          : "text-sidebar-muted hover:bg-sidebar-soft hover:text-sidebar-ink"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => selectRecord(record)}
                        className="min-w-0 flex-1 px-3 py-3 text-left"
                      >
                        <span className="flex items-center gap-2">
                          <SquareCode
                            size={15}
                            className="shrink-0 text-accent"
                          />
                          <span className="truncate text-sm font-medium">
                            {record.title}
                          </span>
                        </span>
                        <span className="mt-1.5 flex items-center gap-2 text-[0.72rem] text-sidebar-muted">
                          <span>{formatDate(record.createdAt)}</span>
                          <span>{languageLabel(record.language)}</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(record.id)}
                        className="grid size-10 shrink-0 place-items-center self-center rounded-md text-sidebar-muted transition-colors duration-150 ease-snappy hover:text-accent"
                        aria-label={
                          record.bookmarked
                            ? "Remove bookmark"
                            : "Bookmark generation"
                        }
                      >
                        {record.bookmarked ? (
                          <BookmarkCheck size={15} />
                        ) : (
                          <Bookmark size={15} />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                AI Tutor
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal text-balance sm:text-[1.7rem]">
                LeetCode → Worked Example
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">
              problem을 입력하면 pattern, invariant, code, reflection까지 하나의
              Markdown document로 생성합니다.
            </p>
          </header>

          <form onSubmit={generate} className="py-5">
            <div className="rounded-lg bg-panel p-2 shadow-soft">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
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
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="LeetCode URL, number, title, or pasted statement"
                    className="min-h-24 w-full resize-none rounded-md bg-control/50 px-3 py-3 text-base leading-7 text-ink outline-none transition-colors duration-150 ease-snappy placeholder:text-muted focus:bg-panel"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] lg:w-[30rem]">
                  <SegmentedControl
                    value={language}
                    onChange={setLanguage}
                    options={[
                      ["typescript", "TS"],
                      ["python", "Python"],
                    ]}
                  />
                  <SegmentedControl
                    value={learnerLevel}
                    onChange={setLearnerLevel}
                    options={[
                      ["novice-intermediate", "Guided"],
                      ["advanced", "Advanced"],
                    ]}
                  />
                  {status === "streaming" ? (
                    <button
                      type="button"
                      onClick={stopGeneration}
                      className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-md bg-danger px-4 text-sm font-semibold text-white transition-transform duration-150 ease-snappy active:scale-[0.96]"
                    >
                      <StopCircle size={16} />
                      Stop
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!query.trim()}
                      className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink shadow-accent transition-transform duration-150 ease-snappy hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.96]"
                    >
                      <Send size={16} />
                      Generate
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLE_INPUTS.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setQuery(example)}
                  className="min-h-10 rounded-md bg-panel px-3 text-xs font-medium text-muted shadow-soft transition-colors duration-150 ease-snappy hover:text-ink"
                >
                  {example}
                </button>
              ))}
            </div>
          </form>

          <MetadataStrip
            title={outputTitle}
            model={outputModel}
            provider={outputProvider}
            language={language}
            learnerLevel={learnerLevel}
            status={status}
          />

          <section className="mt-4 min-h-0 flex-1">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Document</p>
                <p className="mt-1 text-sm text-muted">
                  Markdown output. Code blocks use Shiki highlighting.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => activeId && toggleBookmark(activeId)}
                  disabled={!activeId}
                  className="flex min-h-10 items-center gap-2 rounded-md bg-panel px-3 text-sm font-medium text-muted shadow-soft transition-transform duration-150 ease-snappy hover:text-ink disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.96]"
                >
                  {activeRecord?.bookmarked ? (
                    <BookmarkCheck size={16} className="text-accent" />
                  ) : (
                    <Bookmark size={16} />
                  )}
                  Bookmark
                </button>
                <IconButton
                  label="Copy Markdown"
                  disabled={!hasOutput}
                  onClick={copyMarkdown}
                >
                  <Copy size={16} />
                </IconButton>
                <IconButton
                  label="Download Markdown"
                  disabled={!hasOutput}
                  onClick={downloadMarkdown}
                >
                  <Download size={16} />
                </IconButton>
                <IconButton
                  label="Regenerate"
                  disabled={!query.trim() || status === "streaming"}
                  onClick={() => void generate()}
                >
                  <RotateCcw size={16} />
                </IconButton>
              </div>
            </div>

            <div className="min-h-[34rem] rounded-lg bg-output shadow-soft">
              <div className="mx-auto max-w-3xl px-4 py-5 sm:px-7 sm:py-7">
                {status === "streaming" && !markdown ? (
                  <StreamingSkeleton />
                ) : error ? (
                  <div className="rounded-lg bg-danger-soft p-4 text-sm leading-6 text-danger-ink">
                    {error}
                  </div>
                ) : markdown ? (
                  <MarkdownRenderer markdown={markdown} />
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Array<readonly [T, string]>;
  variant?: "default" | "sidebar";
};

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  variant = "default",
}: SegmentedControlProps<T>) {
  const isSidebar = variant === "sidebar";

  return (
    <div
      className={`grid grid-cols-2 rounded-md p-1 ${
        isSidebar ? "bg-sidebar-soft" : "bg-control"
      }`}
    >
      {options.map(([optionValue, label]) => (
        <button
          key={optionValue}
          type="button"
          onClick={() => onChange(optionValue)}
          className={`min-h-9 rounded-[0.375rem] px-2 text-xs font-semibold transition-colors duration-150 ease-snappy ${
            value === optionValue
              ? isSidebar
                ? "bg-sidebar-hover text-sidebar-ink shadow-soft"
                : "bg-panel text-ink shadow-soft"
              : isSidebar
                ? "text-sidebar-muted hover:text-sidebar-ink"
                : "text-muted hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

type MetadataStripProps = {
  title: string;
  model: string;
  provider: string;
  language: SolutionLanguage;
  learnerLevel: LearnerLevel;
  status: GenerationStatus;
};

function MetadataStrip({
  title,
  model,
  provider,
  language,
  learnerLevel,
  status,
}: MetadataStripProps) {
  return (
    <div className="grid gap-2 rounded-lg bg-panel p-3 text-xs text-muted shadow-soft sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{title}</p>
        <p className="mt-1 truncate">
          {statusLabel(status)} · {languageLabel(language)} ·{" "}
          {modeLabel(learnerLevel)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>{provider}</Badge>
        <Badge>{model}</Badge>
        {status === "streaming" ? (
          <Badge tone="accent">
            <Loader2 size={12} className="animate-spin" />
            Streaming
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
}) {
  return (
    <span
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 font-medium ${
        tone === "accent"
          ? "bg-accent-soft text-accent-ink"
          : "bg-control text-muted"
      }`}
    >
      {children}
    </span>
  );
}

function IconButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid size-10 place-items-center rounded-md bg-panel text-muted shadow-soft transition-transform duration-150 ease-snappy hover:text-ink disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.96]"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

function SidebarEmptyState({ filter }: { filter: SidebarFilter }) {
  return (
    <div className="mx-2 rounded-lg bg-sidebar-soft px-4 py-5 text-sm leading-6 text-sidebar-muted">
      {filter === "bookmarked"
        ? "북마크한 Worked Example이 없습니다."
        : "생성된 Worked Example이 여기에 쌓입니다."}
    </div>
  );
}

function StreamingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        <Loader2 size={16} className="animate-spin" />
        Worked Example 생성 중
      </div>
      <div className="space-y-3">
        <div className="h-7 w-2/3 rounded-md bg-control" />
        <div className="h-4 w-full rounded-md bg-control" />
        <div className="h-4 w-5/6 rounded-md bg-control" />
      </div>
      <div className="space-y-2 rounded-lg bg-code p-4">
        <div className="h-4 w-1/3 rounded bg-white/15" />
        <div className="h-4 w-5/6 rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
      <div className="grid size-12 place-items-center rounded-lg bg-panel text-accent shadow-soft">
        <Sparkles size={21} />
      </div>
      <p className="mt-4 text-sm font-semibold text-ink">
        문제를 입력하면 Worked Example이 생성됩니다.
      </p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        pattern signal, subgoal, invariant, code, reflection 순서로 학습용
        문서를 구성합니다.
      </p>
    </div>
  );
}

function readHistory(): GenerationRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as GenerationRecord[]) : [];
  } catch {
    return [];
  }
}

function persistHistory(history: GenerationRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

async function readErrorMessage(response: Response) {
  const fallback = `Request failed with ${response.status}`;
  const text = await response.text();

  try {
    const data = JSON.parse(text) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return text || fallback;
  }
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function titleFromQuery(query: string) {
  const slug = query.match(/leetcode\.com\/problems\/([^/?#]+)/i)?.[1];

  if (slug) {
    return slug
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return query.length > 48 ? `${query.slice(0, 45)}...` : query;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function languageLabel(value: SolutionLanguage) {
  return value === "python" ? "Python" : "TypeScript";
}

function modeLabel(value: LearnerLevel) {
  return value === "advanced" ? "Advanced" : "Guided";
}

function statusLabel(value: GenerationStatus) {
  if (value === "streaming") {
    return "Generating";
  }

  if (value === "error") {
    return "Needs attention";
  }

  return "Ready";
}
