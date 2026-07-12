import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Brainrack",
    template: "%s · Brainrack",
  },
  description: "파일로 관리하는 로컬 Markdown 블로그.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#f7f7f8] p-[30px] font-mono text-xs leading-5 text-[#111] selection:bg-[#111] selection:text-[#f7f7f8] dark:bg-[#070708] dark:text-[#f7f7f8] dark:selection:bg-[#f7f7f8] dark:selection:text-[#070708] sm:p-10">
        {children}
      </body>
    </html>
  );
}
