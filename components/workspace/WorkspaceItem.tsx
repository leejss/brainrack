import { useState } from "react";
import type { WorkspaceMeta } from "@/components/layout/hooks/useWorkspaces";
import { Button } from "@/components/ui/Button";

type Mode = "idle" | "confirming" | "deleting";

interface WorkspaceItemProps {
  ws: WorkspaceMeta;
  onDelete: (id: string) => Promise<void>;
  onOpen: (id: string) => Promise<void>;
}

export default function WorkspaceItem({
  ws,
  onDelete,
  onOpen,
}: WorkspaceItemProps) {
  const [mode, setMode] = useState<Mode>("idle");

  const handleDelete = async () => {
    setMode("deleting");
    try {
      await onDelete(ws.id);
    } finally {
      setMode("idle");
    }
  };
  const isConfirming = mode === "confirming";
  const isDeleteMode = mode === "deleting";

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 shadow-[4px_4px_0px_var(--color-shadow)] transition-all duration-200 ${
        isConfirming ? "border-brand bg-brand-soft" : "border-border bg-surface"
      }`}
    >
      {isConfirming ? (
        <>
          <div className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="font-bold text-brand-foreground truncate">
              Delete workspace?
            </div>
          </div>
          <div className="flex gap-2 shrink-0 animate-in fade-in slide-in-from-right-2 duration-200">
            <Button
              type="button"
              variant="subtle"
              size="sm"
              onClick={() => setMode("idle")}
              disabled={isDeleteMode}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleteMode}
            >
              {isDeleteMode ? "Deleting..." : "Confirm"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="font-bold text-foreground truncate">{ws.name}</div>
          </div>

          <div className="flex gap-2 shrink-0 animate-in fade-in slide-in-from-right-2 duration-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpen(ws.id)}
              className="hover:border-brand hover:bg-brand-soft hover:text-brand-foreground hover:shadow-[5px_5px_0px_var(--color-brand-muted)]"
            >
              Open
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMode("confirming")}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
