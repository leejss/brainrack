import {
  DEFAULT_AI_MODEL,
  DEFAULT_AI_PROVIDER,
  DEFAULT_LEARNER_LEVEL,
  DEFAULT_SOLUTION_LANGUAGE,
  GENERATION_HISTORY_LIMIT,
  type GenerationRecord,
} from "@/lib/types";

export const WORKED_EXAMPLE_HISTORY_STORAGE_KEY = "brainrack.workedExamples.v1";

export function parseGenerationHistory(
  serializedHistory: string | null,
): GenerationRecord[] {
  if (!serializedHistory) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(serializedHistory);
    return Array.isArray(parsedValue)
      ? parsedValue
          .filter(isGenerationRecord)
          .slice(0, GENERATION_HISTORY_LIMIT)
      : [];
  } catch {
    return [];
  }
}

export function prependGenerationRecord(
  history: GenerationRecord[],
  record: GenerationRecord,
): GenerationRecord[] {
  return [record, ...history].slice(0, GENERATION_HISTORY_LIMIT);
}

export function toggleGenerationBookmark(
  history: GenerationRecord[],
  recordId: string,
): GenerationRecord[] {
  return history.map((record) =>
    record.id === recordId
      ? { ...record, bookmarked: !record.bookmarked }
      : record,
  );
}

export function createGenerationRecord({
  id,
  query,
  title,
  markdown,
  createdAt,
  model = DEFAULT_AI_MODEL,
  provider = DEFAULT_AI_PROVIDER,
  bookmarked = false,
  learnerLevel = DEFAULT_LEARNER_LEVEL,
  language = DEFAULT_SOLUTION_LANGUAGE,
}: GenerationRecord): GenerationRecord {
  return {
    id,
    query,
    title,
    markdown,
    createdAt,
    model,
    provider,
    bookmarked,
    learnerLevel,
    language,
  };
}

function isGenerationRecord(value: unknown): value is GenerationRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.query) &&
    isNonEmptyString(value.title) &&
    typeof value.markdown === "string" &&
    isValidIsoDate(value.createdAt) &&
    isNonEmptyString(value.model) &&
    isNonEmptyString(value.provider) &&
    typeof value.bookmarked === "boolean" &&
    (value.learnerLevel === "novice-intermediate" ||
      value.learnerLevel === "advanced") &&
    (value.language === "typescript" || value.language === "python")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}
