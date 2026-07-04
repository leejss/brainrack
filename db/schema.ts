import { sql } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const explanationStatusValues = [
  "generating",
  "completed",
  "failed",
] as const;

export const solutionLanguageValues = ["typescript", "python"] as const;

export const learnerLevelValues = ["novice-intermediate", "advanced"] as const;

export const explanations = sqliteTable(
  "explanations",
  {
    id: text("id").primaryKey(),
    sourceUrl: text("source_url").notNull(),
    problemSlug: text("problem_slug").notNull(),
    problemTitle: text("problem_title"),
    status: text("status", { enum: explanationStatusValues })
      .notNull()
      .default("generating"),
    markdown: text("markdown"),
    errorMessage: text("error_message"),
    language: text("language", { enum: solutionLanguageValues })
      .notNull()
      .default("typescript"),
    learnerLevel: text("learner_level", { enum: learnerLevelValues })
      .notNull()
      .default("novice-intermediate"),
    model: text("model").notNull(),
    promptVersion: text("prompt_version").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    completedAt: text("completed_at"),
  },
  (table) => [
    index("explanations_problem_slug_idx").on(table.problemSlug),
    index("explanations_status_idx").on(table.status),
    index("explanations_created_at_idx").on(table.createdAt),
  ],
);

export type Explanation = typeof explanations.$inferSelect;
export type NewExplanation = typeof explanations.$inferInsert;
export type ExplanationStatus = (typeof explanationStatusValues)[number];
