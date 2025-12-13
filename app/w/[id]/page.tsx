"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
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
      void openWorkspace(workspaceId);
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
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-20 z-50 px-4 py-2 rounded-full border-2 border-gray-800 bg-white text-gray-800 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
      >
        Workspaces
      </button>
      <Canvas workspaceId={workspaceId} />
    </main>
  );
}
