"use client";

import { BookOpen, LayoutDashboard, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
const menuItems = [
  { name: "History", icon: LayoutDashboard, href: "/history" },
  { name: "Bookmarks", icon: BookOpen, href: "/bookmarks" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden border-none outline-none cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col justify-between",
          "bg-sidebar text-sidebar-ink border-r border-line/10",
          "transition-transform duration-300 ease-snappy",
          "md:static md:translate-x-0 md:w-64 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          <div className="flex h-16 items-center justify-between px-4 border-b border-line/5">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 overflow-hidden no-underline"
            >
              <span className="font-bold text-lg tracking-tight whitespace-nowrap bg-linear-to-r from-accent to-accent-strong bg-clip-text text-transparent">
                Brainrack
              </span>
            </Link>

            {/* Close Button for mobile */}
            <button
              type="button"
              onClick={onClose}
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-hover text-sidebar-muted hover:text-sidebar-ink transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 p-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline",
                    "transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-accent text-accent-ink shadow-sm"
                      : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-ink",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform group-hover:scale-105",
                      isActive
                        ? "text-accent-ink"
                        : "text-sidebar-muted group-hover:text-sidebar-ink",
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
