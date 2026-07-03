import { createTextStreamResponse, streamText } from "ai";

import {
  createGenerationModel,
  getGenerationModelConfig,
} from "@/lib/ai/provider";
import { createWorkedExampleGenerationPlan } from "@/lib/generation/plan";
import type { WorkedExampleGenerationRequest } from "@/lib/types";

export function createWorkedExampleStreamResponse(
  generationRequest: WorkedExampleGenerationRequest,
) {
  const generationPlan = createWorkedExampleGenerationPlan(generationRequest);
  const modelConfig = getGenerationModelConfig();
  const result = streamText({
    model: createGenerationModel(modelConfig),
    instructions: generationPlan.instructions,
    prompt: generationPlan.prompt,
    temperature: generationPlan.temperature,
    maxOutputTokens: generationPlan.maxOutputTokens,
    timeout: generationPlan.timeoutMs,
    maxRetries: generationPlan.maxRetries,
  });

  return createTextStreamResponse({
    stream: result.textStream,
    headers: {
      "Cache-Control": "no-store",
      "X-AI-Provider": modelConfig.provider,
      "X-AI-Model": modelConfig.modelId,
    },
  });
}
