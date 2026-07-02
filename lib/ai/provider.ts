import { createGoogle } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

export type AiProviderName = "google" | "gateway";

export type GenerationModelConfig = {
  provider: AiProviderName;
  modelId: string;
};

export function getGenerationModelConfig(): GenerationModelConfig {
  return {
    provider: parseProvider(process.env.AI_PROVIDER),
    modelId: process.env.AI_MODEL ?? "gemini-3.5-flash",
  };
}

export function createGenerationModel(config = getGenerationModelConfig()): LanguageModel {
  if (config.provider === "google") {
    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Missing GOOGLE_GENERATIVE_AI_API_KEY. Set it to stream AI worked examples.",
      );
    }

    return createGoogle({ apiKey })(config.modelId);
  }

  return config.modelId;
}

function parseProvider(value: string | undefined): AiProviderName {
  if (value === "gateway") {
    return "gateway";
  }

  return "google";
}
