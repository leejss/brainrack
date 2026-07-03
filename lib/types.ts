export type GenerationStatus = "idle" | "streaming" | "error";
export type LearnerLevel = "novice-intermediate" | "advanced";
export type SolutionLanguage = "typescript" | "python";
export type SidebarFilter = "all" | "bookmarked";

export type GenerationRecord = {
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

export type WorkedExampleGenerationRequest = {
  query: string;
  learnerLevel: LearnerLevel;
  language: SolutionLanguage;
};

export const DEFAULT_LEARNER_LEVEL: LearnerLevel = "novice-intermediate";
export const DEFAULT_SOLUTION_LANGUAGE: SolutionLanguage = "typescript";
export const DEFAULT_AI_PROVIDER = "google";
export const DEFAULT_AI_MODEL = "gemini-3.5-flash";
export const GENERATION_HISTORY_LIMIT = 30;
