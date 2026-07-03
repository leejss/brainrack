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
  return value === "advanced" ? "고급" : "가이드";
}

export function statusLabel(value: GenerationStatus) {
  if (value === "streaming") {
    return "생성 중";
  }

  if (value === "error") {
    return "확인 필요";
  }

  return "준비됨";
}
