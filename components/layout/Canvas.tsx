"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ThoughtInput } from "@/components/ui/ThoughtInput";
import { ThoughtNote } from "@/components/ui/ThoughtNote";
import { Settings, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useThoughtCanvas } from "./useThoughtCanvas";

type ClearAllMode = "idle" | "confirming" | "clearing";

export function Canvas({ workspaceId }: { workspaceId: string }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [clearAllMode, setClearAllMode] = useState<ClearAllMode>("idle");
  const {
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
  } = useThoughtCanvas(workspaceId);

  const [hoveredThoughtId, setHoveredThoughtId] = useState<string | null>(null);

  const isClearAllConfirming = clearAllMode === "confirming";
  const isClearingAll = clearAllMode === "clearing";

  if (!isHydrated) return null;
  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {isSaving && (
          <div className="px-3 py-2 flex items-center bg-transparent text-brand-soft">
            <span className="font-bold">Saving...</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 rounded-full border-2 border-border bg-surface text-foreground shadow-[4px_4px_0px_var(--color-shadow)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--color-brand-muted)] hover:border-brand hover:text-brand-soft transition-all"
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
            onCombine={mergeThoughts}
            onUpdate={updateThought}
            containerRef={containerRef}
            isHoveredByOther={hoveredThoughtId === thought.id}
            onHoverOver={setHoveredThoughtId}
          />
        ))}
      </AnimatePresence>
      <ThoughtInput onAddThought={addThought} />

      <Modal
        open={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setClearAllMode("idle");
        }}
        title="Settings"
      >
        <div className="space-y-3">
          {isClearAllConfirming ? (
            <div className="w-full flex items-center justify-between gap-3 p-3 rounded-lg border-2 border-brand bg-brand-soft shadow-[4px_4px_0px_var(--color-shadow)] animate-in fade-in duration-200">
              <div className="min-w-0">
                <div className="font-bold text-brand-foreground truncate">
                  Clear all thoughts?
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  variant="subtle"
                  size="sm"
                  onClick={() => setClearAllMode("idle")}
                  disabled={isClearingAll}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="accent"
                  size="sm"
                  onClick={async () => {
                    setClearAllMode("clearing");
                    try {
                      clearAll();
                      setIsSettingsOpen(false);
                    } finally {
                      setClearAllMode("idle");
                    }
                  }}
                  disabled={isClearingAll}
                >
                  {isClearingAll ? "Clearing..." : "Confirm"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setClearAllMode("confirming")}
              className="w-full gap-2 p-3"
            >
              <Trash2 size={18} />
              <span className="font-bold">Clear All</span>
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
}
