"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ThoughtInput } from "@/components/ui/ThoughtInput";
import { ThoughtNote } from "@/components/ui/ThoughtNote";
import { Settings, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useThoughtCanvas } from "./useThoughtCanvas";

export function Canvas({ workspaceId }: { workspaceId: string }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { thoughts, addThought, deleteThought, moveThought, clearAll, containerRef, isHydrated, isSaving } =
    useThoughtCanvas(workspaceId);

  if (!isHydrated) return null;

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-background">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {isSaving && (
          <div className="px-3 py-2 rounded-full border-2 border-brand bg-surface text-[var(--color-brand-soft)] shadow-[4px_4px_0px_var(--color-brand-muted)]">
            <span className="font-bold">Saving...</span>
          </div>
        )}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full border-2 border-border bg-surface text-foreground shadow-[4px_4px_0px_var(--color-shadow)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-brand-muted)] hover:border-brand hover:text-[var(--color-brand-soft)] transition-all"
          title="Settings"
        >
          <Settings size={24} />
        </button>
      </div>

      <AnimatePresence>
        {thoughts.map((thought) => (
          <ThoughtNote
            key={thought.id}
            thought={thought}
            onDelete={deleteThought}
            onMove={moveThought}
            containerRef={containerRef}
          />
        ))}
      </AnimatePresence>
      <ThoughtInput onAddThought={addThought} />

      <Modal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings">
        <div className="space-y-3">
          <button
            onClick={() => {
              clearAll();
              setIsSettingsOpen(false);
            }}
            className="w-full inline-flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-border bg-surface text-foreground shadow-[4px_4px_0px_var(--color-shadow)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-shadow)] transition-all"
          >
            <Trash2 size={18} />
            <span className="font-bold">Clear All</span>
          </button>
        </div>
      </Modal>
    </div>
  );
}
