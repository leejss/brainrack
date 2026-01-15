"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useWorkspaces from "@/components/layout/hooks/useWorkspaces";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const {
    isHydrated,
    isLoading,
    workspaces,
    createWorkspace,
    openWorkspace,
    deleteWorkspace,
  } = useWorkspaces();

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  if (!isHydrated || isLoading) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bartle text-[var(--color-brand-soft)]">Brainrack</h1>
          <p className="text-muted-foreground">Choose a workspace.</p>
        </div>

        <form
          className="mb-6 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit) return;

            const created = await createWorkspace(name);
            if (!created) return;

            setName("");
            router.push(`/w/${created.id}`);
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New workspace name"
            className="flex-1 bg-surface border-2 border-border text-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-brand focus:shadow-[4px_4px_0px_var(--color-brand-muted)] transition-all"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-5 py-3 rounded-xl border-2 border-brand bg-[var(--color-brand-soft)] text-brand-foreground hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-brand-muted)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_var(--color-brand-muted)]"
          >
            Create
          </button>
        </form>

        <div className="space-y-3">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-border bg-surface shadow-[4px_4px_0px_var(--color-shadow)]"
            >
              <div className="min-w-0">
                <div className="font-bold text-foreground truncate">
                  {ws.name}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {ws.id}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={async () => {
                    await openWorkspace(ws.id);
                    router.push(`/w/${ws.id}`);
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-border bg-surface text-foreground shadow-[3px_3px_0px_var(--color-shadow)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-brand-muted)] hover:border-brand hover:bg-[var(--color-brand-soft)] hover:text-brand-foreground transition-all"
                >
                  Open
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm("Delete this workspace?")) return;
                    await deleteWorkspace(ws.id);
                  }}
                  className="px-4 py-2 rounded-lg border-2 border-border bg-surface text-foreground shadow-[3px_3px_0px_var(--color-shadow)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-shadow)] transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {workspaces.length === 0 && (
            <div className="p-6 rounded-xl border-2 border-border bg-surface">
              <div className="font-bold text-foreground">No workspaces yet</div>
              <div className="text-muted-foreground">
                Create one to start dumping thoughts.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
