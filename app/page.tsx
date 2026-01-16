"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useWorkspaces from "@/components/layout/hooks/useWorkspaces";
import WorkspaceItem from "@/components/workspace/WorkspaceItem";
import InteractiveBackground from "@/components/background/InteractiveBackground";

export default function Home() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <InteractiveBackground className="fixed inset-0 z-0" />

      <div className="w-full max-w-xl relative z-10">
        <div className="mb-6">
          <h1 className="text-4xl font-bartle text-brand-soft">Brainrack</h1>
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
            className="px-5 py-3 rounded-xl border-2 border-brand bg-brand-soft text-brand-foreground font-bold hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-brand-muted)] transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_var(--color-brand-muted)]"
          >
            Create
          </button>
        </form>

        <div className="space-y-3">
          {workspaces.map((ws) => (
            <WorkspaceItem
              key={ws.id}
              ws={ws}
              isDeleting={deletingId === ws.id}
              onSetDeleting={setDeletingId}
              onDelete={async (id) => {
                await deleteWorkspace(id);
                setDeletingId(null);
              }}
              onOpen={async (id) => {
                await openWorkspace(id);
                router.push(`/w/${id}`);
              }}
            />
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
