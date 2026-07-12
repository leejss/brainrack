"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-[48em] pt-[2lh]">
      <p className="my-[1lh] uppercase text-black/50 dark:text-white/50">
        Error
      </p>
      <h1 className="my-[1lh] font-semibold uppercase before:font-normal before:text-black/50 before:content-['##_'] dark:before:text-white/50">
        콘텐츠를 불러오지 못했습니다.
      </h1>
      <p className="my-[1lh] text-black/50 dark:text-white/50">
        Markdown 파일 형식과 front matter를 확인한 뒤 다시 시도하세요.
      </p>
      <button
        className="inline-flex min-h-5 cursor-pointer items-center justify-center border border-[#111] bg-[#111] px-[1ch] text-[#f7f7f8] hover:bg-[#f7f7f8] hover:text-[#111] dark:border-[#f7f7f8] dark:bg-[#f7f7f8] dark:text-[#070708] dark:hover:bg-[#070708] dark:hover:text-[#f7f7f8]"
        type="button"
        onClick={reset}
      >
        다시 시도
      </button>
    </main>
  );
}
