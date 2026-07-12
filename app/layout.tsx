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
      <body className="min-h-screen bg-[#f4f1ec] p-[30px] font-mono text-xs leading-5 text-[#211f1c] antialiased selection:bg-accent selection:text-white dark:bg-[#0b0b0c] dark:text-[#f2eee8] sm:p-10">
        {children}
      </body>
    </html>
  );
}
