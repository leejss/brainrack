import {
  buildWorkedExamplePrompt,
  WORKED_EXAMPLE_SYSTEM_INSTRUCTIONS,
} from "@/lib/ai/instructions";
import { normalizeProblemInput } from "@/lib/problem/input";
import type { WorkedExampleGenerationRequest } from "@/lib/types";

export type WorkedExampleGenerationPlan = {
  instructions: string;
  prompt: string;
  temperature: number;
  maxOutputTokens: number;
  timeoutMs: number;
  maxRetries: number;
};

export function createWorkedExampleGenerationPlan(
  request: WorkedExampleGenerationRequest,
): WorkedExampleGenerationPlan {
  const problem = normalizeProblemInput(request.query);

  return {
    instructions: WORKED_EXAMPLE_SYSTEM_INSTRUCTIONS,
    prompt: buildWorkedExamplePrompt({
      problem,
      learnerLevel: request.learnerLevel,
      language: request.language,
    }),
    temperature: 0.3,
    maxOutputTokens: 4200,
    timeoutMs: 55_000,
    maxRetries: 1,
  };
}
