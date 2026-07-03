import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Brainrack Dashboard</h1>
      <p className="text-muted">
        Worked Example generator에 오신 것을 환영합니다. 아래 링크를 통해 이전
        기록을 보거나 북마크를 확인하세요.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/history"
          className="block p-6 rounded-xl border border-line/10 hover:border-accent/40 bg-panel shadow-xs hover:shadow-md transition-all group no-underline text-foreground"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
            History
          </h2>
          <p className="text-sm text-muted">
            이전 Worked Example 생성 기록을 조회합니다.
          </p>
        </Link>
        <Link
          href="/bookmarks"
          className="block p-6 rounded-xl border border-line/10 hover:border-accent/40 bg-panel shadow-xs hover:shadow-md transition-all group no-underline text-foreground"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
            Bookmarks
          </h2>
          <p className="text-sm text-muted">
            저장해 둔 북마크들을 확인하고 분석합니다.
          </p>
        </Link>
      </div>
    </div>
  );
}
