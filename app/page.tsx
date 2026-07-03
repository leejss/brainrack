import { AppStateProvider } from "@/components/app-state-provider";
import { CommandPanelContainer } from "@/components/command-panel-container";
import { DocumentPanelContainer } from "@/components/document-panel-container";
import { HistorySidebarContainer } from "@/components/history-sidebar-container";
import { MetadataStripContainer } from "@/components/metadata-strip-container";

export default function Home() {
  return (
    <AppStateProvider>
      <main className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <HistorySidebarContainer />
        <section className="min-w-0 flex-1">
          <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-8 sm:px-10 lg:px-12">
            <AppHeader />
            <div className="grid flex-1 gap-6 xl:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)] xl:items-start">
              <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-8">
                <CommandPanelContainer />
                <MetadataStripContainer />
              </div>
              <DocumentPanelContainer />
            </div>
          </div>
        </section>
      </main>
    </AppStateProvider>
  );
}

function AppHeader() {
  return (
    <header className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between transition-all duration-300 ease-snappy">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted">
            알고리즘 학습 워크벤치
          </p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-[1.8rem] text-ink">
          LeetCode 문제를 학습용 풀이 문서로 변환
        </h1>
      </div>
      <p className="max-w-md text-xs leading-5 text-muted sm:text-right font-medium">
        문제 URL, 번호, 제목, 본문 중 하나를 입력하면 패턴, 루프 불변식, 최적
        풀이, 복잡도를 한 장의 Worked Example으로 정리합니다.
      </p>
    </header>
  );
}
