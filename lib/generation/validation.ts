export type WorkedExampleValidationResult =
  | { valid: true }
  | { valid: false; missingSections: string[]; missingCodeBlock: boolean };

export const REQUIRED_WORKED_EXAMPLE_SECTIONS = [
  "# Worked Example",
  "## Problem Restatement",
  "## Constraint Reading",
  "## Pattern Recognition",
  "## Brute Force",
  "## Bottleneck",
  "## Core Insight",
  "## Subgoal Plan",
  "## Trace",
  "## Invariant",
  "## Implementation",
  "## Complexity",
  "## Edge Cases",
  "## Self-Explanation Prompts",
  "## Transfer Hook",
] as const;

export function validateWorkedExampleMarkdown(
  markdown: string,
): WorkedExampleValidationResult {
  const missingSections = REQUIRED_WORKED_EXAMPLE_SECTIONS.filter(
    (section) => !markdown.includes(section),
  );
  const missingCodeBlock = !/```(?:typescript|ts|python|py)\s+[\s\S]*?```/.test(
    markdown,
  );

  if (missingSections.length === 0 && !missingCodeBlock) {
    return { valid: true };
  }

  return { valid: false, missingSections, missingCodeBlock };
}

export function describeWorkedExampleValidationFailure(
  result: Exclude<WorkedExampleValidationResult, { valid: true }>,
): string {
  const missingParts = [
    ...result.missingSections,
    ...(result.missingCodeBlock ? ["implementation code block"] : []),
  ];

  return `Generated output is missing required Worked Example structure: ${missingParts.join(
    ", ",
  )}.`;
}
