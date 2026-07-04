import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getExplanationById } from "@/lib/explanations/repository";

export default async function ExplanationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const explanation = await getExplanationById(slug);

  if (!explanation) {
    notFound();
  }

  return (
    <article className="mx-auto grid max-w-4xl gap-6 py-8">
      <header className="grid gap-2 border-b border-line pb-5">
        <p className="text-sm font-medium text-muted">
          {explanation.status.toUpperCase()}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {explanation.problemTitle ?? explanation.problemSlug}
        </h1>
        <a
          href={explanation.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          {explanation.sourceUrl}
        </a>
      </header>

      {explanation.status === "failed" ? (
        <section className="rounded-md border border-danger/30 bg-danger-soft p-4 text-danger-ink">
          <h2 className="text-base font-semibold">생성에 실패했습니다.</h2>
          <p className="mt-2 text-sm">{explanation.errorMessage}</p>
        </section>
      ) : null}

      {explanation.markdown ? (
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {explanation.markdown}
          </ReactMarkdown>
        </div>
      ) : null}
    </article>
  );
}
