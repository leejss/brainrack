import rehypeShiki from "@shikijs/rehype";
import type { ComponentPropsWithoutRef } from "react";
import {
  type Components,
  type ExtraProps,
  MarkdownAsync,
} from "react-markdown";
import remarkGfm from "remark-gfm";

const rehypePlugins: NonNullable<
  Parameters<typeof MarkdownAsync>[0]["rehypePlugins"]
> = [
  [
    rehypeShiki,
    {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      langs: ["text"],
      lazy: true,
      defaultLanguage: "text",
      fallbackLanguage: "text",
      addLanguageClass: true,
    },
  ],
];

type MarkdownLinkProps = ComponentPropsWithoutRef<"a"> & ExtraProps;

function MarkdownLink({
  href = "",
  children,
  node: _node,
  ...props
}: MarkdownLinkProps) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  return (
    <a
      {...props}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer noopener" : undefined}
    >
      {children}
    </a>
  );
}

const markdownComponents = {
  a: MarkdownLink,
} satisfies Components;

export async function MarkdownContent({ content }: { content: string }) {
  const markdown = await MarkdownAsync({
    children: content,
    remarkPlugins: [remarkGfm],
    rehypePlugins,
    components: markdownComponents,
  });

  return (
    <div className="prose prose-neutral max-w-none font-sans [overflow-wrap:anywhere] dark:prose-invert prose-a:underline-offset-2 prose-a:hover:no-underline prose-table:block prose-table:max-w-full prose-table:overflow-x-auto">
      {markdown}
    </div>
  );
}
