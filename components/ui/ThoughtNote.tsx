"use client";

import { cn } from "@/lib/utils";
import type { Thought } from "@/lib/types";
import { motion } from "framer-motion";
import { Trash2, Pencil, Merge } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface ThoughtNoteProps {
  thought: Thought;
  onDelete: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onCombine?: (sourceId: string, targetId: string) => void;
  onUpdate?: (id: string, text: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isHoveredByOther?: boolean;
  onHoverOver?: (id: string | null) => void;
}

export function ThoughtNote({
  thought,
  onDelete,
  onMove,
  onCombine,
  onUpdate,
  containerRef,
  isHoveredByOther,
  onHoverOver,
}: ThoughtNoteProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(thought.text);
  const [willMerge, setWillMerge] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const otherNotesRef = useRef<{ id: string; rect: DOMRect }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditedText(thought.text);
  }, [thought.text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
      // Auto-resize height
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
    // Auto-resize height on change
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSave = () => {
    if (editedText.trim()) {
      onUpdate?.(thought.id, editedText.trim());
    } else {
      setEditedText(thought.text); // Revert if empty
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

  // Collision detection logic:
  // 1. On drag start, cache the position of all other notes to avoid DOM thrashing.
  // 2. On drag, check for intersection between the dragging note and others.
  // 3. Notify parent of the hovered note ID to trigger visual feedback.
  return (
    <motion.div
      ref={elementRef}
      data-thought-id={thought.id}
      drag={!isEditing}
      dragConstraints={containerRef}
      dragMomentum={true}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      onDragStart={() => {
        if (isEditing) return;
        // Find all other notes and cache their rects
        const others = Array.from(
          document.querySelectorAll("[data-thought-id]"),
        )
          .filter((el) => el.getAttribute("data-thought-id") !== thought.id)
          .map((el) => ({
            id: el.getAttribute("data-thought-id")!,
            rect: el.getBoundingClientRect(),
          }));
        otherNotesRef.current = others;
      }}
      onDrag={() => {
        if (!elementRef.current || !onHoverOver) return;

        const currentRect = elementRef.current.getBoundingClientRect();

        // Find the first note that intersects
        const colliding = otherNotesRef.current.find((other) => {
          return (
            currentRect.left < other.rect.right &&
            currentRect.right > other.rect.left &&
            currentRect.top < other.rect.bottom &&
            currentRect.bottom > other.rect.top
          );
        });

        if (colliding) {
          onHoverOver(colliding.id);
          setWillMerge(true);
        } else {
          onHoverOver(null);
          setWillMerge(false);
        }
      }}
      onDragEnd={(_, info) => {
        setWillMerge(false);
        if (!elementRef.current || !onCombine) {
          onHoverOver?.(null);
          onMove(
            thought.id,
            thought.x + info.offset.x,
            thought.y + info.offset.y,
          );
          return;
        }

        const currentRect = elementRef.current.getBoundingClientRect();

        // Final collision check on drop
        const colliding = otherNotesRef.current.find((other) => {
          return (
            currentRect.left < other.rect.right &&
            currentRect.right > other.rect.left &&
            currentRect.top < other.rect.bottom &&
            currentRect.bottom > other.rect.top
          );
        });

        onHoverOver?.(null);

        if (colliding) {
          onCombine(thought.id, colliding.id);
        } else {
          onMove(
            thought.id,
            thought.x + info.offset.x,
            thought.y + info.offset.y,
          );
        }
      }}
      initial={{
        x: thought.x,
        y: thought.y,
        scale: 0.9,
        opacity: 0,
      }}
      animate={{
        x: thought.x,
        y: thought.y,
        scale: isHoveredByOther ? 1.05 : 1,
        opacity: 1,
      }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 100,
        mass: 0.8,
      }}
      whileHover={{
        scale: 1.02,
        zIndex: 50,
        boxShadow:
          "0px 20px 50px var(--color-brand-muted), 0 0 0 2px var(--color-brand)",
      }}
      whileDrag={{
        scale: 1.05,
        zIndex: 100,
        cursor: "grabbing",
        boxShadow:
          "0px 20px 50px var(--color-brand-muted), 0 0 0 2px var(--color-brand)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "absolute inline-flex p-6 cursor-grab flex-col select-none group",
        isEditing && "cursor-text",
        "text-foreground font-hand text-xl leading-8 tracking-wide",
        "bg-zinc-900/85 backdrop-blur-[2px]",
        "shadow-[0_4px_20px_rgba(0,0,0,0.2)] rounded-[1px]",
        "max-w-[340px] min-w-[200px]",
        "max-h-[400px]", // Max height constraint
        isHoveredByOther && "ring-2 ring-brand z-10",
      )}
    >
      <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedText}
            onChange={handleTextareaChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[100px] h-full bg-transparent resize-none outline-none p-0 m-0 font-inherit text-inherit leading-inherit overflow-hidden"
            style={{ height: "auto" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="wrap-break-word whitespace-pre-wrap w-full h-full drop-shadow-sm">
            {thought.text}
          </p>
        )}
      </div>

      {willMerge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-[2px] rounded-[1px]"
        >
          <div className="bg-brand text-brand-foreground px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 border border-brand-foreground/10">
            <Merge size={16} strokeWidth={3} />
            <span className="uppercase tracking-wider text-xs">Merge</span>
          </div>
        </motion.div>
      )}

      <div className="absolute -top-2 -right-2 flex gap-1 z-20">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered && !isEditing ? 1 : 0,
            scale: isHovered && !isEditing ? 1 : 0.8,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className={cn(
            "p-2",
            "bg-zinc-800 shadow-lg rounded-full",
            "text-zinc-400 hover:text-brand hover:bg-zinc-700",
            "transition-all duration-200",
            "flex items-center justify-center",
          )}
          aria-label="Edit note"
        >
          <Pencil size={14} strokeWidth={2.5} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered && !isEditing ? 1 : 0,
            scale: isHovered && !isEditing ? 1 : 0.8,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(thought.id);
          }}
          className={cn(
            "p-2",
            "bg-zinc-800 shadow-lg rounded-full",
            "text-zinc-400 hover:text-red-400 hover:bg-zinc-700",
            "transition-all duration-200",
            "flex items-center justify-center",
          )}
          aria-label="Delete note"
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}
