"use client";

import type { Thought } from "@/lib/types";
import { Trash2, Pencil } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface ThoughtNoteProps {
  thought: Thought;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, text: string) => void;
}

export function ThoughtNote({
  thought,
  onDelete,
  onUpdate,
}: ThoughtNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(thought.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) setEditedText(thought.text);
  }, [thought.text, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSave = () => {
    if (editedText.trim()) {
      onUpdate?.(thought.id, editedText.trim());
    } else {
      setEditedText(thought.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setEditedText(thought.text);
      setIsEditing(false);
    }
  };

  return (
    <div className="group relative py-4 border-b border-border transition-colors px-1 flex flex-col md:flex-row md:items-start justify-between">
      <div className="flex-1 w-full overflow-hidden pr-4">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedText}
            onChange={handleTextareaChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent resize-none outline-none p-0 m-0 font-sans text-base leading-relaxed text-foreground"
            style={{ height: "auto" }}
          />
        ) : (
          <p className="whitespace-pre-wrap wrap-break-word font-sans text-base leading-relaxed text-foreground">
            {thought.text}
          </p>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-4 pt-2 md:pt-0 shrink-0 self-end md:self-auto">
        <button type="button"
          onClick={() => setIsEditing(true)}
          className="text-muted-foreground hover:text-brand transition-colors"
          title="Edit"
        >
          <Pencil size={15} />
        </button>
        <button type="button"
          onClick={() => onDelete(thought.id)}
          className="text-muted-foreground hover:text-danger transition-colors"
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
