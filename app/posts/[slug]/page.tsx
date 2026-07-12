import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
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
    <main className="max-w-[48em]">
      <Link className="mb-[1lh] block uppercase no-underline" href="/">
        BRAINRACK <span aria-hidden="true">█</span>
      </Link>
      <Link
        className="mb-[2lh] inline-block underline decoration-1 underline-offset-2 hover:no-underline"
        href="/"
      >
        ← INDEX
      </Link>
      <article>
        <header className="mb-[2lh]">
          <h1 className="mb-[1lh] font-semibold uppercase before:font-normal before:text-black/50 before:content-['##_'] dark:before:text-white/50">
            {post.title}
          </h1>
          <p className="mb-[1lh] text-black/50 dark:text-white/50">
            {post.description}
          </p>
          <div className="flex flex-col items-start gap-x-[2ch] text-black/50 dark:text-white/50 sm:flex-row sm:flex-wrap">
            <time dateTime={post.publishedAt}>
              DATE: {dateFormatter.format(new Date(post.publishedAt))}
            </time>
            {post.sourceUrl ? (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="underline decoration-1 underline-offset-2 hover:no-underline"
              >
                SOURCE: [LINK]
              </a>
            ) : null}
          </div>
        </header>
        <MarkdownContent content={post.content} />
      </article>
    </main>
  );
}
