"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as ai from "@/lib/ai";
import {
  createExplanation,
  markExplanationCompleted,
  markExplanationFailed,
} from "@/lib/explanations/repository";
import { titleFromProblemSlug } from "@/lib/problem/input";

export async function createExplanationAction(_: unknown, formData: FormData) {
  const url = formData.get("url") as string;
  const content = formData.get("content") as string;
  const parsed = parseLeetcodeUrl(url);

  if (!parsed.ok) {
    return { message: "올바른 LeetCode 문제 링크를 입력하세요." };
  }

  if (!content) {
    return { message: "문제 본문을 plain text로 붙여넣어 주세요." };
  }

  const explanation = await createExplanation({
    sourceUrl: parsed.url,
    problemSlug: parsed.slug,
    problemTitle: parsed.title,
  });

  try {
    const markdown = await ai.generateExplanation({
      slug: parsed.slug,
      title: parsed.title,
      url: parsed.url,
      content,
    });

    await markExplanationCompleted(explanation.id, {
      problemTitle: parsed.title,
      markdown,
    });
  } catch (error) {
    await markExplanationFailed(explanation.id, getErrorMessage(error));
  }

  revalidatePath(`/e/${explanation.id}`);
  redirect(`/e/${explanation.id}`);
}

type ParsedLeetcodeUrlResult =
  | {
      ok: true;
      url: string;
      slug: string;
      title: string;
    }
  | {
      ok: false;
    };

function parseLeetcodeUrl(value: string): ParsedLeetcodeUrlResult {
  try {
    const url = new URL(value.trim());
    const isLeetcode =
      url.hostname === "leetcode.com" || url.hostname === "www.leetcode.com";

    if (!isLeetcode) {
      return { ok: false };
    }

    const slug = url.pathname.match(/^\/problems\/([^/?#]+)/)?.[1];

    if (!slug) {
      return { ok: false };
    }

    return {
      ok: true,
      url: `https://leetcode.com/problems/${slug}/description/`,
      slug,
      title: titleFromProblemSlug(slug),
    };
  } catch {
    return { ok: false };
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
