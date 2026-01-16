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
      initial={{
        x: thought.x,
        y: thought.y,
        rotate: thought.rotation,
        scale: 0.9,
        opacity: 0,
      }}
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
        "text-foreground font-hand text-xl leading-8 tracking-wide",
        "bg-zinc-900/85 backdrop-blur-[2px]",
        "shadow-[0_4px_20px_rgba(0,0,0,0.2)] rounded-[1px]",
        "max-w-[340px] min-w-[200px]",
      )}
    >
      <p className="wrap-break-word whitespace-pre-wrap w-full h-full drop-shadow-sm">
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
          "absolute -top-2 -right-2 p-2",
          "bg-zinc-800 shadow-lg rounded-full",
          "text-zinc-400 hover:text-red-400 hover:bg-zinc-700",
          "transition-all duration-200",
          "flex items-center justify-center",
        )}
        aria-label="Delete note"
      >
        <Trash2 size={14} strokeWidth={2.5} />
      </motion.button>
    </motion.div>
  );
}
