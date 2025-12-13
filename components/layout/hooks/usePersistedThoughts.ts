"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Thought } from "@/lib/types";
import { storage } from "@/lib/storage";

const buildThoughtsKey = (workspaceId: string) =>
  `workspace:${workspaceId}:thoughts`;
const SAVE_DEBOUNCE_MS = 500;

const usePersistedThoughts = (workspaceId: string) => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const hasSyncedRef = useRef(false);
  const debounceTimerRef = useRef<number | null>(null);
  const saveRequestIdRef = useRef(0);

  useEffect(() => {
    let isCancelled = false;
    hasSyncedRef.current = false;
    setThoughts([]);
    setIsSaving(false);

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const loadThoughts = async () => {
      try {
        const saved = await storage.getItem<Thought[]>(
          buildThoughtsKey(workspaceId),
        );
        if (!isCancelled) setThoughts(saved ?? []);
      } catch (error) {
        console.error("Failed to load thoughts from IndexedDB", error);
      } finally {
        if (!isCancelled) hasSyncedRef.current = true;
      }
    };

    loadThoughts();

    return () => {
      isCancelled = true;

      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      setIsSaving(false);
    };
  }, [workspaceId]);

  const persistThoughts = useCallback(
    async (data: Thought[]) => {
      if (!workspaceId) return;

      const requestId = ++saveRequestIdRef.current;
      setIsSaving(true);

      try {
        await storage.setItem(buildThoughtsKey(workspaceId), data);
      } catch (error) {
        console.error("Failed to save thoughts to IndexedDB", error);
      } finally {
        if (requestId === saveRequestIdRef.current) {
          setIsSaving(false);
        }
      }
    },
    [workspaceId],
  );

  useEffect(() => {
    if (!hasSyncedRef.current) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    setIsSaving(true);
    debounceTimerRef.current = window.setTimeout(() => {
      persistThoughts(thoughts);
    }, SAVE_DEBOUNCE_MS);
  }, [thoughts, persistThoughts]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const saveNow = useCallback(
    async (data?: Thought[]) => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      await persistThoughts(data ?? thoughts);
    },
    [persistThoughts, thoughts],
  );

  return { thoughts, setThoughts, isSaving, saveNow } as const;
};

export default usePersistedThoughts;
