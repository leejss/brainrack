import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug, parsePost } from "@/lib/posts";

describe("local Markdown posts", () => {
  it("loads the checked-in posts without database access", () => {
    const posts = getAllPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).not.toHaveProperty("content");
    expect(getPostBySlug(posts[0].slug)?.content).toBeTruthy();
  });

  it("parses validated front matter", () => {
    expect(
      parsePost(
        "example",
        [
          "---",
          'title: "Example"',
          'description: "A post"',
          'publishedAt: "2026-07-12"',
          'sourceUrl: "https://example.com/post"',
          "---",
          "",
          "## Body",
        ].join("\n"),
      ),
    ).toMatchObject({
      slug: "example",
      title: "Example",
      publishedAt: "2026-07-12",
      sourceUrl: "https://example.com/post",
      content: "## Body",
    });
  });

  it("rejects incomplete front matter", () => {
    expect(() =>
      parsePost("broken", "---\ntitle: Broken\n---\n\nBody"),
    ).toThrow("description");
  });

  it("rejects path traversal slugs", () => {
    expect(getPostBySlug("../secrets")).toBeNull();
  });
});
