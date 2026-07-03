export type ProblemInputKind =
  | "url"
  | "number"
  | "title"
  | "statement"
  | "mixed";

export type NormalizedProblemInput = {
  raw: string;
  kind: ProblemInputKind;
  slug?: string;
  problemNumber?: string;
  title?: string;
};

const LEETCODE_PROBLEM_PATH = /leetcode\.com\/problems\/([^/?#]+)/i;

export function normalizeProblemInput(
  rawInput: string,
): NormalizedProblemInput {
  const raw = rawInput.trim();

  if (!raw) {
    return { raw, kind: "mixed" };
  }

  const slugFromUrl = raw.match(LEETCODE_PROBLEM_PATH)?.[1];

  if (slugFromUrl) {
    return {
      raw,
      kind: "url",
      slug: slugFromUrl,
      title: titleFromProblemSlug(slugFromUrl),
    };
  }

  if (/^\d+$/.test(raw)) {
    return {
      raw,
      kind: "number",
      problemNumber: raw,
    };
  }

  if (raw.length > 220 || raw.includes("\n")) {
    return {
      raw,
      kind: "statement",
      title: firstNonEmptyLine(raw),
    };
  }

  if (/^[a-z0-9\s:.'-]+$/i.test(raw)) {
    return {
      raw,
      kind: "title",
      title: raw,
      slug: slugFromProblemTitle(raw),
    };
  }

  return {
    raw,
    kind: "mixed",
    title: raw,
  };
}

function firstNonEmptyLine(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
}

export function titleFromProblemQuery(query: string) {
  const slug = query.match(LEETCODE_PROBLEM_PATH)?.[1];

  if (slug) {
    return titleFromProblemSlug(slug);
  }

  return query.length > 48 ? `${query.slice(0, 45)}...` : query;
}

export function slugFromProblemTitle(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titleFromProblemSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function slugifyForFilename(value: string) {
  return slugFromProblemTitle(value) || "worked-example";
}
