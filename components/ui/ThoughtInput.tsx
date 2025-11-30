"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_THOUGHT_LENGTH } from "@/lib/constants";

interface ThoughtInputProps {
  onAddThought: (text: string) => void;
}

export function ThoughtInput({ onAddThought }: ThoughtInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const sanitized = text.trim();
    if (!sanitized) return;

    onAddThought(sanitized);
    setText("");
  };

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50"
    >
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_THOUGHT_LENGTH))}
          placeholder="Type your thought..."
          maxLength={MAX_THOUGHT_LENGTH}
          className={cn(
            "w-full bg-white border-2 border-gray-800",
            "text-gray-900 placeholder:text-gray-400 text-lg px-6 py-4 rounded-full",
            "pr-20 pb-8",
            "focus:outline-none focus:shadow-[4px_4px_0px_rgba(0,0,0,1)]",
            "transition-all duration-200",
          )}
        />
        <div className="pointer-events-none absolute left-6 bottom-3 text-xs text-gray-400">
          {text.length}/{MAX_THOUGHT_LENGTH}
        </div>
        <AnimatePresence>
          {text.trim().length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition-colors border border-gray-300"
            >
              <Send size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
