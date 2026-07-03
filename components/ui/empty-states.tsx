import { Loader2, Sparkles } from "lucide-react";

export function StreamingSkeleton() {
  return (
    <div className="space-y-6 py-4 animate-pulse">
      <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-accent">
        <Loader2 size={14} className="animate-spin" />
        Worked Example 생성 중
      </div>

      <div className="space-y-4">
        {/* Title skeleton */}
        <div className="h-7 w-2/3 rounded-lg bg-control/80 border border-line/40" />

        {/* Paragraph lines skeleton */}
        <div className="space-y-2.5">
          <div className="h-4 w-full rounded-md bg-control/60" />
          <div className="h-4 w-11/12 rounded-md bg-control/60" />
          <div className="h-4 w-5/6 rounded-md bg-control/60" />
        </div>
      </div>

      {/* Code Block skeleton */}
      <div className="space-y-3 rounded-xl bg-code p-5 border border-white/5 shadow-inner">
        <div className="h-3.5 w-1/4 rounded bg-white/12" />
        <div className="h-3.5 w-11/12 rounded bg-white/8" />
        <div className="h-3.5 w-4/5 rounded bg-white/8" />
        <div className="h-3.5 w-2/3 rounded bg-white/8" />
      </div>
    </div>
  );
}

export function EmptyState() {
  const previewSections = [
    "Pattern Recognition",
    "Subgoal Plan",
    "Invariant",
    "Implementation",
    "Transfer Hook",
  ];

  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center px-4 py-8 text-center xl:min-h-[32rem]">
      <div className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent border border-accent/20 shadow-soft transition-transform duration-300 hover:rotate-6">
        <Sparkles size={24} className="animate-pulse" />
      </div>
      <h3 className="mt-6 text-sm font-bold tracking-tight text-ink">
        문제를 입력하고 학습 문서를 생성하세요
      </h3>
      <p className="mt-2 max-w-sm text-xs leading-5 text-muted font-medium">
        결과에는 패턴 인식, 접근 과정, 루프 불변식, 코드, 복잡도, 실수 포인트가
        포함됩니다.
      </p>
      <div className="mt-5 flex max-w-md flex-wrap justify-center gap-2">
        {previewSections.map((section) => (
          <span
            key={section}
            className="rounded-full border border-line bg-panel px-3 py-1.5 text-[0.68rem] font-bold text-muted shadow-soft"
          >
            {section}
          </span>
        ))}
      </div>
    </div>
  );
}
