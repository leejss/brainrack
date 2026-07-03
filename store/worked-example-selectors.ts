import { titleForKnownExampleQuery } from "@/lib/problem/examples";
import { titleFromProblemQuery } from "@/lib/problem/input";
import {
  DEFAULT_AI_MODEL,
  DEFAULT_AI_PROVIDER,
  type GenerationRecord,
  type SidebarFilter,
} from "@/lib/types";

export function findActiveRecord(
  history: GenerationRecord[],
  activeId: string | null,
) {
  return history.find((record) => record.id === activeId) ?? null;
}

export function filterGenerationHistory(
  history: GenerationRecord[],
  filter: SidebarFilter,
) {
  return filter === "bookmarked"
    ? history.filter((record) => record.bookmarked)
    : history;
}

export function visibleError(
  error: string | null,
  historyError: string | null,
) {
  return error ?? historyError;
}

export function outputTitle(
  activeRecord: GenerationRecord | null,
  query: string,
) {
  const trimmedQuery = query.trim();

  return (
    activeRecord?.title ??
    (trimmedQuery
      ? (titleForKnownExampleQuery(trimmedQuery) ??
        titleFromProblemQuery(trimmedQuery))
      : "New Worked Example")
  );
}

export function outputModel(activeRecord: GenerationRecord | null) {
  return activeRecord?.model ?? DEFAULT_AI_MODEL;
}

export function outputProvider(activeRecord: GenerationRecord | null) {
  return activeRecord?.provider ?? DEFAULT_AI_PROVIDER;
}
