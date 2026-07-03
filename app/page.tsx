import { AppStateProvider } from "@/components/app-state-provider";
import { CommandPanelContainer } from "@/components/command-panel-container";
import { DocumentPanelContainer } from "@/components/document-panel-container";
import { HistorySidebarContainer } from "@/components/history-sidebar-container";
import { MetadataStripContainer } from "@/components/metadata-strip-container";

export default function Home() {
  return (
    <AppStateProvider>
      <main className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <HistorySidebarContainer />
        <section className="min-w-0">
          <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
            <AppHeader />
            <CommandPanelContainer />
            <MetadataStripContainer />
            <DocumentPanelContainer />
          </div>
        </section>
      </main>
    </AppStateProvider>
  );
}

function AppHeader() {
  return (
    <header className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          AI Tutor
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-balance sm:text-[1.7rem]">
          LeetCode → Worked Example
        </h1>
      </div>
      <p className="max-w-md text-sm leading-6 text-muted">
        problem을 입력하면 pattern, invariant, code, reflection까지 하나의
        Markdown document로 생성합니다.
      </p>
    </header>
  );
}
