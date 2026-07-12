import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
});

function PostList() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return <p className="m-0 text-black/50 dark:text-white/50">- NO POSTS</p>;
  }

  return (
    <ul className="m-0 list-none p-0">
      {posts.map((post) => (
        <li
          className="mb-[1lh] [contain-intrinsic-size:40px] [content-visibility:auto] wrap-anywhere"
          key={post.slug}
        >
          <div>
            <span aria-hidden="true">- [</span>
            <Link
              className="underline decoration-1 underline-offset-2 hover:no-underline"
              href={`/posts/${post.slug}`}
            >
              {post.title}
            </Link>
            <span aria-hidden="true">]</span>
          </div>
          <div className="ml-[2ch] text-black/50 dark:text-white/50">
            <time dateTime={post.publishedAt}>
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
            <span aria-hidden="true"> · </span>
            <span>{post.description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <main className="max-w-[48em]">
      <header>
        <h1 className="mb-[2lh] text-xs font-normal uppercase leading-5">
          BRAINRACK
        </h1>
      </header>

      <section>
        <PostList />
      </section>
    </main>
  );
}
