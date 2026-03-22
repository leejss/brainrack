"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Canvas } from "@/components/layout/Canvas";
import useWorkspaces from "@/components/layout/hooks/useWorkspaces";

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const workspaceId = params?.id;

  const {
    isHydrated,
    isLoading,
    workspaces,
    activeWorkspaceId,
    openWorkspace,
  } = useWorkspaces();

  const exists = useMemo(() => {
    if (!workspaceId) return false;
    return workspaces.some((ws) => ws.id === workspaceId);
  }, [workspaceId, workspaces]);

  useEffect(() => {
    if (!isHydrated || isLoading) return;
    if (!workspaceId) return;

    if (!exists) {
      router.replace("/");
      return;
    }

    if (activeWorkspaceId !== workspaceId) {
      openWorkspace(workspaceId);
    }
  }, [
    activeWorkspaceId,
    exists,
    isHydrated,
    isLoading,
    openWorkspace,
    router,
    workspaceId,
  ]);

  if (!isHydrated || isLoading) return null;
  if (!workspaceId || !exists) return null;

  return (
    <main>
      <div className="fixed top-4 left-6 z-50">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-foreground"
        >
          Brainrack
        </button>
      </div>
      <Canvas workspaceId={workspaceId} />
    </main>
  );
}
