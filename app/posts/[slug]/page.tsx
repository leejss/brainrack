import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteMark } from "@/components/site-mark";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "long",
});

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "글을 찾을 수 없습니다" };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-208">
      <header className="mb-12">
        <SiteMark />
      </header>
      <Link
        className="mb-8 inline-block font-mono text-[11px] tracking-wider text-black/55 uppercase underline decoration-black/25 decoration-1 underline-offset-4 transition-colors hover:text-accent dark:text-white/55 dark:decoration-white/25"
        href="/"
      >
        ← ALL POSTS
      </Link>
      <article>
        <header className="mb-10 border-b border-l-2 border-black/10 border-l-accent pb-8 pl-5 dark:border-white/10">
          <h1 className="font-sans text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 font-sans text-base leading-7 text-neutral-600 dark:text-neutral-400">
            {post.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
            <span className="flex items-center gap-2">
              <time
                className="text-neutral-800 dark:text-neutral-200"
                dateTime={post.publishedAt}
              >
                {dateFormatter.format(new Date(post.publishedAt))}
              </time>
            </span>
            {post.sourceUrl ? (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-neutral-800 underline decoration-1 underline-offset-2 transition-colors hover:text-accent dark:text-neutral-200"
              >
                SOURCE ↗
              </a>
            ) : null}
          </div>
        </header>
        <MarkdownContent content={post.content} />
      </article>
    </main>
  );
}
