"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/components/app-store-provider";
import { Sidebar } from "./sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isSidenavOpen = useAppStore((state) => state.isSidenavOpen);
  const openSidenav = useAppStore((state) => state.openSidenav);
  const closeSidenav = useAppStore((state) => state.closeSidenav);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar isOpen={isSidenavOpen} onClose={closeSidenav} />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Mobile Header */}
        <header className="flex h-16 items-center gap-4 border-b border-line/5 px-4 md:hidden shrink-0">
          <button
            type="button"
            onClick={openSidenav}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-hover text-sidebar-muted hover:text-sidebar-ink transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="no-underline">
            <span className="font-bold text-lg tracking-tight bg-linear-to-r from-accent to-accent-strong bg-clip-text text-transparent">
              Brainrack
            </span>
          </Link>
        </header>

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
