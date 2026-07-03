import { Loader2, Sparkles } from "lucide-react";

export function StreamingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        <Loader2 size={16} className="animate-spin" />
        Worked Example 생성 중
      </div>
      <div className="space-y-3">
        <div className="h-7 w-2/3 rounded-md bg-control" />
        <div className="h-4 w-full rounded-md bg-control" />
        <div className="h-4 w-5/6 rounded-md bg-control" />
      </div>
      <div className="space-y-2 rounded-lg bg-code p-4">
        <div className="h-4 w-1/3 rounded bg-white/15" />
        <div className="h-4 w-5/6 rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
      <div className="grid size-12 place-items-center rounded-lg bg-panel text-accent shadow-soft">
        <Sparkles size={21} />
      </div>
      <p className="mt-4 text-sm font-semibold text-ink">
        문제를 입력하면 Worked Example이 생성됩니다.
      </p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        pattern signal, subgoal, invariant, code, reflection 순서로 학습용 문서를 구성합니다.
      </p>
    </div>
  );
}
