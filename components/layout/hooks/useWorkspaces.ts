"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useHydratedClient from "./useHydratedClient";
import { storage } from "@/lib/storage";

export type WorkspaceMeta = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number;
};

const WORKSPACES_KEY = "workspaces";
const ACTIVE_WORKSPACE_KEY = "workspace:active";

const now = () => Date.now();

const sortWorkspaces = (items: WorkspaceMeta[]) =>
  [...items].sort((a, b) => b.lastOpenedAt - a.lastOpenedAt);

const useWorkspaces = () => {
  const isHydrated = useHydratedClient();
  const [isLoading, setIsLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<WorkspaceMeta[]>([]);
  const workspacesRef = useRef<WorkspaceMeta[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isHydrated) return;

    let isCancelled = false;

    const load = async () => {
      try {
        const saved =
          (await storage.getItem<WorkspaceMeta[]>(WORKSPACES_KEY)) ?? [];
        const active =
          (await storage.getItem<string>(ACTIVE_WORKSPACE_KEY)) ?? null;

        if (isCancelled) return;

        const sorted = sortWorkspaces(saved);
        workspacesRef.current = sorted;
        setWorkspaces(sorted);
        setActiveWorkspaceId(active);
      } catch (error) {
        console.error("Failed to load workspaces from IndexedDB", error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    load();

    return () => {
      isCancelled = true;
    };
  }, [isHydrated]);

  const persistWorkspaces = useCallback(async (next: WorkspaceMeta[]) => {
    await storage.setItem(WORKSPACES_KEY, next);
  }, []);

  const updateWorkspaces = useCallback(
    async (updater: (prev: WorkspaceMeta[]) => WorkspaceMeta[]) => {
      const next = updater(workspacesRef.current);
      workspacesRef.current = next;
      setWorkspaces(next);
      await persistWorkspaces(next);
      return next;
    },
    [persistWorkspaces],
  );

  const setActive = useCallback(async (id: string | null) => {
    setActiveWorkspaceId(id);
    if (id) {
      await storage.setItem(ACTIVE_WORKSPACE_KEY, id);
    } else {
      await storage.removeItem(ACTIVE_WORKSPACE_KEY);
    }
  }, []);

  const createWorkspace = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      const created: WorkspaceMeta = {
        id: uuidv4(),
        name: trimmed,
        createdAt: now(),
        updatedAt: now(),
        lastOpenedAt: now(),
      };

      await updateWorkspaces((prev) => sortWorkspaces([created, ...prev]));
      await setActive(created.id);

      return created;
    },
    [setActive, updateWorkspaces],
  );

  const renameWorkspace = useCallback(
    async (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      await updateWorkspaces((prev) =>
        sortWorkspaces(
          prev.map((ws) =>
            ws.id === id
              ? {
                  ...ws,
                  name: trimmed,
                  updatedAt: now(),
                }
              : ws,
          ),
        ),
      );
    },
    [updateWorkspaces],
  );

  const openWorkspace = useCallback(
    async (id: string) => {
      await updateWorkspaces((prev) =>
        sortWorkspaces(
          prev.map((ws) =>
            ws.id === id
              ? {
                  ...ws,
                  lastOpenedAt: now(),
                  updatedAt: now(),
                }
              : ws,
          ),
        ),
      );
      await setActive(id);
    },
    [setActive, updateWorkspaces],
  );

  const deleteWorkspace = useCallback(
    async (id: string) => {
      const thoughtsKey = `workspace:${id}:thoughts`;

      await storage.removeItem(thoughtsKey);
      await updateWorkspaces((prev) =>
        sortWorkspaces(prev.filter((ws) => ws.id !== id)),
      );

      if (activeWorkspaceId === id) {
        await setActive(null);
      }
    },
    [activeWorkspaceId, setActive, updateWorkspaces],
  );

  const hasWorkspaces = useMemo(
    () => workspaces.length > 0,
    [workspaces.length],
  );

  return {
    isHydrated,
    isLoading,
    hasWorkspaces,
    workspaces,
    activeWorkspaceId,
    createWorkspace,
    renameWorkspace,
    openWorkspace,
    deleteWorkspace,
    setActive,
  } as const;
};

export default useWorkspaces;
