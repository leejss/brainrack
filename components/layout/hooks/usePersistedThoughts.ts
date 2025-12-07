"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Thought } from "@/components/ui/ThoughtNote";
import { storage } from "@/lib/storage";

const STORAGE_KEY = "thoughts";

const mergeThoughts = (saved: Thought[] | null, current: Thought[]) => {
  if (!saved?.length) return current;

  const savedIds = new Set(saved.map((item) => item.id));
  const unsaved = current.filter((item) => !savedIds.has(item.id));

  return [...saved, ...unsaved];
};

const usePersistedThoughts = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    const loadThoughts = async () => {
      try {
        const saved = await storage.getItem<Thought[]>(STORAGE_KEY);
        if (!isCancelled) {
          setThoughts((prev) => mergeThoughts(saved, prev));
        }
      } catch (error) {
        console.error("Failed to load thoughts from IndexedDB", error);
      } finally {
        hasSyncedRef.current = true;
      }
    };

    loadThoughts();

    return () => {
      isCancelled = true;
    };
  }, []);

  const persistThoughts = useCallback(async (data: Thought[]) => {
    try {
      await storage.setItem(STORAGE_KEY, data);
    } catch (error) {
      console.error("Failed to save thoughts to IndexedDB", error);
    }
  }, []);

  useEffect(() => {
    if (!hasSyncedRef.current) return;
    persistThoughts(thoughts);
  }, [thoughts, persistThoughts]);

  return { thoughts, setThoughts } as const;
};

export default usePersistedThoughts;
