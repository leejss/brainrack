import { createTextStreamResponse, streamText } from "ai";

import { createGenerationModel, getGenerationModelConfig } from "@/lib/ai/provider";
import {
  buildWorkedExamplePrompt,
  WORKED_EXAMPLE_SYSTEM_INSTRUCTIONS,
  type LearnerLevel,
  type SolutionLanguage,
} from "@/lib/ai/worked-example-instructions";
import { normalizeProblemInput } from "@/lib/worked-example/problem-input";

export const maxDuration = 60;

type WorkedExampleRequestBody = {
  query?: unknown;
  learnerLevel?: unknown;
  language?: unknown;
};

export async function POST(request: Request) {
  let body: WorkedExampleRequestBody;

  try {
    body = (await request.json()) as WorkedExampleRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";

  if (!query) {
    return Response.json({ error: "Problem input is required." }, { status: 400 });
  }

  const learnerLevel = parseLearnerLevel(body.learnerLevel);
  const language = parseLanguage(body.language);
  const problem = normalizeProblemInput(query);
  const modelConfig = getGenerationModelConfig();

  try {
    const result = streamText({
      model: createGenerationModel(modelConfig),
      instructions: WORKED_EXAMPLE_SYSTEM_INSTRUCTIONS,
      prompt: buildWorkedExamplePrompt({ problem, learnerLevel, language }),
      temperature: 0.3,
      maxOutputTokens: 4200,
      timeout: 55_000,
      maxRetries: 1,
    });

    return createTextStreamResponse({
      stream: result.textStream,
      headers: {
        "Cache-Control": "no-store",
        "X-AI-Provider": modelConfig.provider,
        "X-AI-Model": modelConfig.modelId,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not start worked example generation.";

    return Response.json({ error: message }, { status: 500 });
  }
}

function parseLearnerLevel(value: unknown): LearnerLevel {
  return value === "advanced" ? "advanced" : "novice-intermediate";
}

function parseLanguage(value: unknown): SolutionLanguage {
  return value === "python" ? "python" : "typescript";
}
