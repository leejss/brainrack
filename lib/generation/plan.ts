import {
  buildWorkedExamplePrompt,
  WORKED_EXAMPLE_SYSTEM_INSTRUCTIONS,
} from "@/lib/ai/instructions";
import { normalizeProblemInput } from "@/lib/problem/input";
import type { LearnerLevel, SolutionLanguage } from "@/lib/types";

export type WorkedExamplePromptPlan = {
  instructions: string;
  prompt: string;
};

export type WorkedExamplePromptRequest = {
  query: string;
  learnerLevel: LearnerLevel;
  language: SolutionLanguage;
};

export function createWorkedExamplePromptPlan(
  request: WorkedExamplePromptRequest,
): WorkedExamplePromptPlan {
  const problem = normalizeProblemInput(request.query);

  return {
    instructions: WORKED_EXAMPLE_SYSTEM_INSTRUCTIONS,
    prompt: buildWorkedExamplePrompt({
      problem,
      learnerLevel: request.learnerLevel,
      language: request.language,
    }),
  };
}
