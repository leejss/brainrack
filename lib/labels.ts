import type {
  GenerationStatus,
  LearnerLevel,
  SolutionLanguage,
} from "@/lib/types";

export function formatGenerationDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function languageLabel(value: SolutionLanguage) {
  return value === "python" ? "Python" : "TypeScript";
}

export function learnerModeLabel(value: LearnerLevel) {
  return value === "advanced" ? "Advanced" : "Guided";
}

export function statusLabel(value: GenerationStatus) {
  if (value === "streaming") {
    return "Generating";
  }

  if (value === "error") {
    return "Needs attention";
  }

  return "Ready";
}
