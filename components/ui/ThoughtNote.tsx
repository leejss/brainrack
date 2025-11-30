"use client";

import { motion, useAnimation } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface Thought {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

interface ThoughtNoteProps {
  thought: Thought;
  onDelete: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ThoughtNote({ thought, onDelete, containerRef }: ThoughtNoteProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Random entrance animation
  const initialY = typeof window !== 'undefined' ? window.innerHeight : 1000;

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      initial={{ x: thought.x, y: initialY, rotate: 0, scale: 0.5, opacity: 0 }}
      animate={{ 
        x: thought.x, 
        y: thought.y, 
        rotate: thought.rotation, 
        scale: 1, 
        opacity: 1 
      }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ 
        type: "spring", 
        damping: 15, 
        stiffness: 100,
        mass: 0.8
      }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileDrag={{ scale: 1.1, zIndex: 20, cursor: "grabbing" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "absolute p-4 w-48 min-h-[120px] cursor-grab flex flex-col justify-between select-none",
        "text-gray-900 font-medium text-xl leading-snug",
        "bg-white border-2 border-gray-800 rounded-sm"
      )}
      style={{
        boxShadow: "4px 4px 0px rgba(0,0,0,0.8)"
      }}
    >
      <p className="break-words whitespace-pre-wrap">{thought.text}</p>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(thought.id);
        }}
        className="self-end mt-2 p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
      >
        <X size={16} />
      </motion.button>
    </motion.div>
  );
}
