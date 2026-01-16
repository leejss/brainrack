"use client";

import { useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MAX_THOUGHT_LENGTH } from "@/lib/constants";
import { Thought } from "@/lib/types";
import useHydratedClient from "./hooks/useHydratedClient";
import usePersistedThoughts from "./hooks/usePersistedThoughts";

const NOTE_PADDING = 50;
const MAX_NOTE_WIDTH = 360;
const INPUT_GUARD_HEIGHT = 400;
const MAX_ROTATION_DEGREES = 5;

type ContainerMetrics = {
  width: number;
  height: number;
};

const createRandomPosition = ({ width, height }: ContainerMetrics) => {
  const horizontalSpace = Math.max(
    width - MAX_NOTE_WIDTH - NOTE_PADDING * 2,
    0,
  );
  const verticalSpace = Math.max(height - INPUT_GUARD_HEIGHT - NOTE_PADDING, 0);

  const x = NOTE_PADDING + Math.random() * horizontalSpace;
  const y = NOTE_PADDING + Math.random() * verticalSpace;

  return {
    x,
    y,
    rotation: Math.random() * (MAX_ROTATION_DEGREES * 2) - MAX_ROTATION_DEGREES,
  };
};

export const useThoughtCanvas = (workspaceId: string) => {
  const { thoughts, setThoughts, isSaving, saveNow } =
    usePersistedThoughts(workspaceId);
  const isHydrated = useHydratedClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const addThought = useCallback(
    (text: string) => {
      const sanitizedText = text.trim().slice(0, MAX_THOUGHT_LENGTH);
      if (!containerRef.current || !sanitizedText) return;

      const position = createRandomPosition({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });

      setThoughts((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: sanitizedText,
          ...position,
        },
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

  const moveThought = useCallback(
    (id: string, x: number, y: number) => {
      const next: Thought[] = thoughts.map((item) =>
        item.id === id ? { ...item, x, y } : item,
      );
      setThoughts(next);
      void saveNow(next);
    },
    [saveNow, setThoughts, thoughts],
  );

  const clearAll = useCallback(() => {
    setThoughts([]);
  }, [setThoughts]);

  const mergeThoughts = useCallback(
    (sourceId: string, targetId: string) => {
      setThoughts((prev) => {
        const source = prev.find((t) => t.id === sourceId);
        const target = prev.find((t) => t.id === targetId);
        if (!source || !target) return prev;

        const mergedText = `${target.text}\n\n${source.text}`;
        
        // Remove source, update target with merged text
        const next = prev
          .filter((t) => t.id !== sourceId)
          .map((t) => (t.id === targetId ? { ...t, text: mergedText } : t));
        
        // We'll let the effect handle saving, but we could explicitly save if needed
        // void saveNow(next);
        return next;
      });
    },
    [setThoughts]
  );

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
    moveThought,
    mergeThoughts,
    updateThought,
    clearAll,
    containerRef,
    isHydrated,
    isSaving,
  };
};
