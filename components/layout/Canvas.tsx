"use client";

import { useState } from "react";
import { ThoughtInput } from "@/components/ui/ThoughtInput";
import { ThoughtNote } from "@/components/ui/ThoughtNote";
import { Settings, Trash2, ArrowLeft } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useThoughtCanvas } from "./useThoughtCanvas";
import Link from "next/link";

export function Canvas({ workspaceId }: { workspaceId: string }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    thoughts,
    addThought,
    deleteThought,
    updateThought,
    clearAll,
    isHydrated,
  } = useThoughtCanvas(workspaceId);

  if (!isHydrated) return null;

  return (
    <div className="w-full max-w-3xl mx-auto min-h-screen bg-background text-foreground py-12 px-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors">
          <ArrowLeft size={18} />
          <span>Workspaces</span>
        </Link>
        <button type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors p-2"
        >
          <Settings size={20} />
        </button>
      </div>

      <ThoughtInput onAddThought={addThought} />

      <div className="flex flex-col mt-4 gap-2">
        {thoughts.length === 0 ? (
          <div className="text-center text-muted-foreground py-20 font-medium">
            Empty workflow. Dump a thought above.
          </div>
        ) : (
           thoughts.map((thought) => (
            <ThoughtNote
              key={thought.id}
              thought={thought}
              onDelete={deleteThought}
              onUpdate={updateThought}
            />
          ))
        )}
      </div>

      <Modal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Workspace Settings">
        <div className="space-y-4 pt-4">
          <Button variant="outline" onClick={() => { clearAll(); setIsSettingsOpen(false); }} className="w-full flex justify-center gap-2 text-danger border-danger hover:bg-danger/10">
            <Trash2 size={16} />
            Erase All Content
          </Button>
        </div>
      </Modal>
    </div>
  );
}
