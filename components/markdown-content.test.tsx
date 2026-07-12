import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MarkdownContent } from "@/components/markdown-content";

async function renderMarkdown(content: string) {
  return renderToStaticMarkup(await MarkdownContent({ content }));
}

describe("MarkdownContent", () => {
  it("renders semantic Markdown inside a prose container", async () => {
    const html = await renderMarkdown(
      [
        "## Heading",
        "",
        "Paragraph with **strong text**.",
        "",
        "- first",
        "- second",
        "",
        "> quote",
        "",
        "---",
      ].join("\n"),
    );

    expect(html).toContain("prose prose-neutral max-w-none font-sans");
    expect(html).toContain("dark:prose-invert");
    expect(html).toContain("<h2>Heading</h2>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<hr/>");
    expect(html).not.toContain("~~~");
  });

  it("renders GFM tables and Shiki-highlighted fenced code", async () => {
    const html = await renderMarkdown(
      [
        "| step | value |",
        "| --- | --- |",
        "| 1 | 2 |",
        "",
        "```ts",
        "const value = 2;",
        "```",
      ].join("\n"),
    );

    expect(html).toContain("<table>");
    expect(html).toContain("shiki shiki-themes github-light github-dark");
    expect(html).toContain("language-ts");
    expect(html).toContain("--shiki-light:");
    expect(html).toContain("--shiki-dark:");
    expect(html.replace(/<[^>]+>/g, "")).toContain("const value = 2;");
  });

  it("falls back to plain text for unknown code languages", async () => {
    const html = await renderMarkdown(
      "```definitely-not-a-language\nplain text\n```",
    );

    expect(html).toContain('class="shiki shiki-themes');
    expect(html).toContain("language-text");
    expect(html).toContain("plain text");
  });

  it("does not turn raw HTML into DOM nodes", async () => {
    const html = await renderMarkdown(
      '<script>alert("xss")</script>\n<div onclick="alert(1)">unsafe</div>',
    );

    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<div onclick=");
    expect(html).toContain("&lt;div onclick=&quot;alert(1)&quot;&gt;");
  });

  it("removes unsafe link protocols", async () => {
    const html = await renderMarkdown("[unsafe](javascript:alert(1))");

    expect(html).not.toContain("javascript:");
  });
});
