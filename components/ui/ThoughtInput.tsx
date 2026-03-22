"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full mb-8 relative">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_THOUGHT_LENGTH))}
        placeholder="Type a new thought..."
        maxLength={MAX_THOUGHT_LENGTH}
        className="w-full bg-transparent border-b border-border text-foreground text-lg py-4 focus:outline-none focus:border-brand transition-colors pr-16"
      />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-mono">{text.length}/{MAX_THOUGHT_LENGTH}</span>
        {text.trim().length > 0 && (
          <button type="submit" className="text-brand font-bold p-2 hover:opacity-80">
            <Send size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
