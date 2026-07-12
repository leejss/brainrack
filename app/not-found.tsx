import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="max-w-[48em] pt-[2lh]">
      <p className="my-[1lh] uppercase text-black/50 dark:text-white/50">404</p>
      <h1 className="my-[1lh] font-semibold uppercase before:font-normal before:text-black/50 before:content-['##_'] dark:before:text-white/50">
        글을 찾을 수 없습니다.
      </h1>
      <p className="my-[1lh] text-black/50 dark:text-white/50">
        주소가 바뀌었거나 존재하지 않는 글입니다.
      </p>
      <Link
        className="inline-flex min-h-5 items-center justify-center border border-[#111] bg-[#111] px-[1ch] text-[#f7f7f8] no-underline hover:bg-[#f7f7f8] hover:text-[#111] dark:border-[#f7f7f8] dark:bg-[#f7f7f8] dark:text-[#070708] dark:hover:bg-[#070708] dark:hover:text-[#f7f7f8]"
        href="/"
      >
        목록으로 돌아가기
      </Link>
    </main>
  );
}
