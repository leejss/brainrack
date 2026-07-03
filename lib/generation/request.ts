import {
  DEFAULT_LEARNER_LEVEL,
  DEFAULT_SOLUTION_LANGUAGE,
  type LearnerLevel,
  type SolutionLanguage,
  type WorkedExampleGenerationRequest,
} from "@/lib/types";

type WorkedExampleRequestBody = {
  query?: unknown;
  learnerLevel?: unknown;
  language?: unknown;
};

export class InvalidWorkedExampleRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidWorkedExampleRequestError";
  }
}

export function parseWorkedExampleGenerationRequest(
  body: unknown,
): WorkedExampleGenerationRequest {
  const query = readStringProperty(body, "query").trim();

  if (!query) {
    throw new InvalidWorkedExampleRequestError("Problem input is required.");
  }

  return {
    query,
    learnerLevel: parseLearnerLevel(readProperty(body, "learnerLevel")),
    language: parseSolutionLanguage(readProperty(body, "language")),
  };
}

export function parseLearnerLevel(value: unknown): LearnerLevel {
  return value === "advanced" ? "advanced" : DEFAULT_LEARNER_LEVEL;
}

export function parseSolutionLanguage(value: unknown): SolutionLanguage {
  return value === "python" ? "python" : DEFAULT_SOLUTION_LANGUAGE;
}

function readStringProperty(body: unknown, key: keyof WorkedExampleRequestBody) {
  const value = readProperty(body, key);
  return typeof value === "string" ? value : "";
}

function readProperty(body: unknown, key: keyof WorkedExampleRequestBody) {
  return isRecord(body) ? body[key] : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
