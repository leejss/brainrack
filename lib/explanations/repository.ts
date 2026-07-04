import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import {
  type Explanation,
  type ExplanationStatus,
  explanations,
} from "@/db/schema";
import {
  DEFAULT_AI_MODEL,
  DEFAULT_LEARNER_LEVEL,
  DEFAULT_SOLUTION_LANGUAGE,
  type LearnerLevel,
  type SolutionLanguage,
} from "@/lib/types";

export type CreateExplanationInput = {
  id?: string;
  sourceUrl: string;
  problemSlug: string;
  problemTitle?: string | null;
  language?: SolutionLanguage;
  learnerLevel?: LearnerLevel;
  model?: string;
  promptVersion?: string;
};

export type CompleteExplanationInput = {
  problemTitle?: string | null;
  markdown: string;
};

export async function createExplanation(
  input: CreateExplanationInput,
): Promise<Explanation> {
  const now = new Date().toISOString();
  const [record] = await db
    .insert(explanations)
    .values({
      id: input.id ?? crypto.randomUUID(),
      sourceUrl: input.sourceUrl,
      problemSlug: input.problemSlug,
      problemTitle: input.problemTitle ?? null,
      status: "generating",
      markdown: null,
      errorMessage: null,
      language: input.language ?? DEFAULT_SOLUTION_LANGUAGE,
      learnerLevel: input.learnerLevel ?? DEFAULT_LEARNER_LEVEL,
      model: input.model ?? DEFAULT_AI_MODEL,
      promptVersion: input.promptVersion ?? "v1",
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    })
    .returning();

  return record;
}

export async function getExplanationById(
  id: string,
): Promise<Explanation | null> {
  const [record] = await db
    .select()
    .from(explanations)
    .where(eq(explanations.id, id))
    .limit(1);

  return record ?? null;
}

export async function listRecentExplanations(
  limit = 30,
): Promise<Explanation[]> {
  return db
    .select()
    .from(explanations)
    .orderBy(desc(explanations.createdAt))
    .limit(limit);
}

export async function markExplanationCompleted(
  id: string,
  input: CompleteExplanationInput,
): Promise<Explanation | null> {
  const now = new Date().toISOString();
  const [record] = await db
    .update(explanations)
    .set({
      status: "completed",
      problemTitle: input.problemTitle ?? undefined,
      markdown: input.markdown,
      errorMessage: null,
      updatedAt: now,
      completedAt: now,
    })
    .where(eq(explanations.id, id))
    .returning();

  return record ?? null;
}

export async function markExplanationFailed(
  id: string,
  errorMessage: string,
): Promise<Explanation | null> {
  const now = new Date().toISOString();
  const [record] = await db
    .update(explanations)
    .set({
      status: "failed",
      errorMessage,
      updatedAt: now,
    })
    .where(eq(explanations.id, id))
    .returning();

  return record ?? null;
}

export async function setExplanationStatus(
  id: string,
  status: ExplanationStatus,
): Promise<Explanation | null> {
  const [record] = await db
    .update(explanations)
    .set({
      status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(explanations.id, id))
    .returning();

  return record ?? null;
}
