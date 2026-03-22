"use client";

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MAX_THOUGHT_LENGTH } from "@/lib/constants";
import useHydratedClient from "./hooks/useHydratedClient";
import usePersistedThoughts from "./hooks/usePersistedThoughts";

export const useThoughtCanvas = (workspaceId: string) => {
  const { thoughts, setThoughts, isSaving } =
    usePersistedThoughts(workspaceId);
  const isHydrated = useHydratedClient();

  const addThought = useCallback(
    (text: string) => {
      const sanitizedText = text.trim().slice(0, MAX_THOUGHT_LENGTH);
      if (!sanitizedText) return;

      setThoughts((prev) => [
        {
          id: uuidv4(),
          text: sanitizedText,
        },
        ...prev,
      ]);
    },
    [setThoughts],
  );

  const deleteThought = useCallback(
    (id: string) => {
      setThoughts((prev) => prev.filter((item) => item.id !== id));
    },
    [setThoughts],
  );

  const clearAll = useCallback(() => {
    setThoughts([]);
  }, [setThoughts]);

  const updateThought = useCallback(
    (id: string, text: string) => {
      setThoughts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text } : t))
      );
    },
    [setThoughts]
  );

  return {
    thoughts,
    addThought,
    deleteThought,
    updateThought,
    clearAll,
    isHydrated,
    isSaving,
  };
};

