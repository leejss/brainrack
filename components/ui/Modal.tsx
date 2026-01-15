"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-999 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          <motion.div
            key="modal-content"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 20,
              mass: 0.8,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative w-full max-w-md bg-surface rounded-xl shadow-2xl border border-border",
              "p-6 text-foreground",
              className,
            )}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              {title && (
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
