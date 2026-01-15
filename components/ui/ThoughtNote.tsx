"use client";

import { cn } from "@/lib/utils";
import type { Thought } from "@/lib/types";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface ThoughtNoteProps {
  thought: Thought;
  onDelete: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ThoughtNote({
  thought,
  onDelete,
  onMove,
  containerRef,
}: ThoughtNoteProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Random entrance animation
  const initialY = typeof window !== "undefined" ? window.innerHeight : 1000;

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={true}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      onDragEnd={(_, info) => {
        onMove(
          thought.id,
          thought.x + info.offset.x,
          thought.y + info.offset.y,
        );
      }}
      initial={{ x: thought.x, y: initialY, rotate: 0, scale: 0.5, opacity: 0 }}
      animate={{
        x: thought.x,
        y: thought.y,
        rotate: thought.rotation,
        scale: 1,
        opacity: 1,
      }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 100,
        mass: 0.8,
      }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileDrag={{ scale: 1.1, zIndex: 20, cursor: "grabbing" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "absolute inline-flex px-4 py-2 cursor-grab flex-col select-none group",
        "text-slate-100/90 font-hand text-2xl leading-relaxed texture-crumpled",
        "border border-white/5 shadow-lg rounded-sm",
        "max-w-[360px]",
      )}
      style={{
        boxShadow: "2px 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <p className="wrap-break-word whitespace-pre-wrap w-full h-full">
        {thought.text}
      </p>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(thought.id);
        }}
        className={cn(
          "absolute -top-3 -right-3 p-2.5",
          "bg-surface-raised shadow-md rounded-full",
          "text-muted-foreground hover:text-[var(--color-danger)] hover:bg-[color:color-mix(in_srgb,var(--color-danger)_15%,transparent)]",
          "transition-all duration-200 border border-border",
          "flex items-center justify-center",
        )}
        aria-label="Delete note"
      >
        <Trash2 size={16} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}
