import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const POSTS_DIRECTORY = join(process.cwd(), "content", "posts");
const MARKDOWN_EXTENSION = ".md";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type Post = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  sourceUrl?: string;
  content: string;
};

export type PostSummary = Omit<Post, "content">;

export function getPostSlugs() {
  return readdirSync(POSTS_DIRECTORY, { withFileTypes: true })
    .filter(
      (entry) => entry.isFile() && entry.name.endsWith(MARKDOWN_EXTENSION),
    )
    .map((entry) => entry.name.slice(0, -MARKDOWN_EXTENSION.length))
    .filter((slug) => SLUG_PATTERN.test(slug))
    .sort();
}

export function getPostBySlug(slug: string): Post | null {
  if (!SLUG_PATTERN.test(slug)) {
    return null;
  }

  const filePath = join(POSTS_DIRECTORY, `${slug}.md`);

  if (!existsSync(filePath)) {
    return null;
  }

  const raw = readFileSync(filePath, "utf8");
  return parsePost(slug, raw);
}

export function getAllPosts(): PostSummary[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .map(({ content: _content, ...summary }) => summary)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export function parsePost(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  const title = requireString(data.title, "title", slug);
  const description = requireString(data.description, "description", slug);
  const publishedAt = requireString(data.publishedAt, "publishedAt", slug);

  const parsedDate = new Date(`${publishedAt}T00:00:00.000Z`);

  if (
    !DATE_PATTERN.test(publishedAt) ||
    Number.isNaN(parsedDate.valueOf()) ||
    parsedDate.toISOString().slice(0, 10) !== publishedAt
  ) {
    throw new Error(
      `Invalid publishedAt in ${slug}.md: expected a YYYY-MM-DD date.`,
    );
  }

  const sourceUrl = optionalUrl(data.sourceUrl, slug);
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error(`Invalid content in ${slug}.md: Markdown body is empty.`);
  }

  return {
    slug,
    title,
    description,
    publishedAt,
    ...(sourceUrl ? { sourceUrl } : {}),
    content: trimmedContent,
  };
}

function requireString(value: unknown, field: string, slug: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid ${field} in ${slug}.md: expected a string.`);
  }

  return value.trim();
}

function optionalUrl(value: unknown, slug: string) {
  if (value === undefined) {
    return undefined;
  }

  const sourceUrl = requireString(value, "sourceUrl", slug);
  let parsed: URL;

  try {
    parsed = new URL(sourceUrl);
  } catch {
    throw new Error(`Invalid sourceUrl in ${slug}.md: expected a URL.`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(
      `Invalid sourceUrl in ${slug}.md: expected an HTTP or HTTPS URL.`,
    );
  }

  return parsed.toString();
}
