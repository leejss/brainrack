"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Thought } from "@/components/ui/ThoughtNote";
import { storage } from "@/lib/storage";
import { MAX_THOUGHT_LENGTH } from "@/lib/constants";

const STORAGE_KEY = "thoughts";
const NOTE_PADDING = 50;
const NOTE_WIDTH = 300;
const INPUT_GUARD_HEIGHT = 400;
const MAX_ROTATION_DEGREES = 5;

type ContainerMetrics = {
  width: number;
  height: number;
};

const useHydratedClient = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};

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

    void loadThoughts();

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
    void persistThoughts(thoughts);
  }, [thoughts, persistThoughts]);

  return { thoughts, setThoughts };
};

const createRandomPosition = ({ width, height }: ContainerMetrics) => {
  const horizontalSpace = Math.max(width - NOTE_WIDTH - NOTE_PADDING * 2, 0);
  const verticalSpace = Math.max(height - INPUT_GUARD_HEIGHT - NOTE_PADDING, 0);

  const x = NOTE_PADDING + Math.random() * horizontalSpace;
  const y = NOTE_PADDING + Math.random() * verticalSpace;

  return {
    x,
    y,
    rotation: Math.random() * (MAX_ROTATION_DEGREES * 2) - MAX_ROTATION_DEGREES,
  };
};

export const useThoughtCanvas = () => {
  const { thoughts, setThoughts } = usePersistedThoughts();
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

  const clearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all thoughts?")) {
      setThoughts([]);
    }
  }, [setThoughts]);

  return {
    thoughts,
    addThought,
    deleteThought,
    clearAll,
    containerRef,
    isHydrated,
  };
};
