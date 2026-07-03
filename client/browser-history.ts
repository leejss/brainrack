"use client";

import {
  parseGenerationHistory,
  WORKED_EXAMPLE_HISTORY_STORAGE_KEY,
} from "@/lib/generation/history";
import type { GenerationRecord } from "@/lib/types";

export function loadGenerationHistory(storage: Storage): GenerationRecord[] {
  return parseGenerationHistory(storage.getItem(WORKED_EXAMPLE_HISTORY_STORAGE_KEY));
}

export function persistGenerationHistory(
  storage: Storage,
  history: GenerationRecord[],
): { ok: true } | { ok: false; error: Error } {
  try {
    storage.setItem(WORKED_EXAMPLE_HISTORY_STORAGE_KEY, JSON.stringify(history));
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("Could not persist history."),
    };
  }
}
