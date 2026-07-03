import type { SidebarFilter } from "@/lib/types";

export function SidebarEmptyState({ filter }: { filter: SidebarFilter }) {
  return (
    <div className="mx-2 rounded-lg bg-sidebar-soft px-4 py-5 text-sm leading-6 text-sidebar-muted">
      {filter === "bookmarked"
        ? "북마크한 Worked Example이 없습니다."
        : "생성된 Worked Example이 여기에 쌓입니다."}
    </div>
  );
}
