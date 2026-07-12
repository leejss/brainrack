import Link from "next/link";
import { SiteMark } from "@/components/site-mark";
import { getAllPosts } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
});

function PostList() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return <p className="text-black/50 dark:text-white/50">- NO POSTS</p>;
  }

  return (
    <ul className="list-none p-0">
      {posts.map((post) => (
        <li
          className="group py-4 [contain-intrinsic-size:64px] [content-visibility:auto] wrap-anywhere"
          key={post.slug}
        >
          <Link className="block" href={`/posts/${post.slug}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-base font-semibold tracking-tight decoration-black/25 decoration-1 underline-offset-4 transition-colors group-hover:text-accent dark:decoration-white/25">
                {post.title}
              </span>
              <div className="mt-1 flex flex-col gap-x-3 text-[11px] text-black/50 sm:flex-row sm:items-baseline dark:text-white/50">
                <time dateTime={post.publishedAt}>
                  {dateFormatter.format(new Date(post.publishedAt))}
                </time>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <main className="max-w-208">
      <header className="mb-12">
        <SiteMark />
      </header>

      <section>
        <PostList />
      </section>
    </main>
  );
}
