import type { WorkspaceMeta } from "@/components/layout/hooks/useWorkspaces";

interface WorkspaceItemProps {
  ws: WorkspaceMeta;
  isDeleting: boolean;
  onSetDeleting: (id: string | null) => void;
  onDelete: (id: string) => Promise<void>;
  onOpen: (id: string) => Promise<void>;
}

export default function WorkspaceItem({
  ws,
  isDeleting,
  onSetDeleting,
  onDelete,
  onOpen,
}: WorkspaceItemProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 shadow-[4px_4px_0px_var(--color-shadow)] transition-all duration-200 ${
        isDeleting ? "border-brand bg-brand-soft" : "border-border bg-surface"
      }`}
    >
      {isDeleting ? (
        <div className="w-full flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
          <span className="font-bold text-brand-foreground pl-2">
            Delete workspace?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onSetDeleting(null)}
              className="px-4 py-2 rounded-lg border-2 border-brand-foreground/20 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(ws.id)}
              className="px-4 py-2 rounded-lg border-2 border-brand-foreground bg-surface text-brand shadow-[3px_3px_0px_var(--color-brand-muted)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-brand-muted)] transition-all font-bold"
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="font-bold text-foreground truncate">{ws.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {ws.id}
            </div>
          </div>

          <div className="flex gap-2 shrink-0 animate-in fade-in slide-in-from-right-2 duration-200">
            <button
              onClick={() => onOpen(ws.id)}
              className="px-4 py-2 rounded-lg border-2 border-border bg-surface text-foreground shadow-[3px_3px_0px_var(--color-shadow)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-brand-muted)] hover:border-brand hover:bg-brand-soft hover:text-brand-foreground transition-all"
            >
              Open
            </button>
            <button
              onClick={() => onSetDeleting(ws.id)}
              className="px-4 py-2 rounded-lg border-2 border-border bg-surface text-foreground shadow-[3px_3px_0px_var(--color-shadow)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-shadow)] transition-all"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
