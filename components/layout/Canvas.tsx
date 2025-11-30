"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ThoughtInput } from "@/components/ui/ThoughtInput";
import { ThoughtNote, Thought } from "@/components/ui/ThoughtNote";
import { v4 as uuidv4 } from "uuid";

const NOTE_COLORS = [
  "bg-[#ffeb3b]", // Yellow
  "bg-[#ff8a80]", // Red/Pink
  "bg-[#80d8ff]", // Light Blue
  "bg-[#ccff90]", // Light Green
  "bg-[#ea80fc]", // Purple
  "bg-[#ffd180]", // Orange
];

export function Canvas() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("brainrack-thoughts");
    if (saved) {
      try {
        setThoughts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse thoughts", e);
      }
    }
  }, []);

  // Save to local storage whenever thoughts change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("brainrack-thoughts", JSON.stringify(thoughts));
    }
  }, [thoughts, isMounted]);

  const addThought = (text: string) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // Random position within the central area (avoiding edges slightly)
    // We want them to spawn somewhat centrally but scattered
    const padding = 100;
    const x = Math.random() * (containerWidth - 300) + 50; // 300 is approx note width + margin
    const y = Math.random() * (containerHeight - 400) + 50; // Avoid bottom input area

    const newThought: Thought = {
      id: uuidv4(),
      text,
      x,
      y,
      rotation: Math.random() * 10 - 5, // -5 to 5 degrees
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    };

    setThoughts((prev) => [...prev, newThought]);
  };

  const deleteThought = (id: string) => {
    setThoughts((prev) => prev.filter((t) => t.id !== id));
  };

  if (!isMounted) return null;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-[#1a1a1a]"
    >
      {/* Background Grid or Texture (Optional, keeping it clean for now) */}
      
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
