"use client";

import { AnimatePresence } from "framer-motion";
import { ThoughtInput } from "@/components/ui/ThoughtInput";
import { ThoughtNote } from "@/components/ui/ThoughtNote";
import { Trash2 } from "lucide-react";
import { useThoughtCanvas } from "./useThoughtCanvas";

export function Canvas() {
  const {
    thoughts,
    addThought,
    deleteThought,
    clearAll,
    containerRef,
    isHydrated,
  } = useThoughtCanvas();

  if (!isHydrated) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#1a1a1a]"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={clearAll}
          className="p-3 rounded-full border-2 border-gray-800 bg-white text-gray-800 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
          title="Clear All"
        >
          <Trash2 size={24} />
        </button>
      </div>

      <AnimatePresence>
        {thoughts.map((thought) => (
          <ThoughtNote
            key={thought.id}
            thought={thought}
            onDelete={deleteThought}
            containerRef={containerRef}
          />
        ))}
      </AnimatePresence>
      <ThoughtInput onAddThought={addThought} />
    </div>
  );
}
