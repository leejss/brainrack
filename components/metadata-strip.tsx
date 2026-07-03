"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import {
  languageLabel,
  learnerModeLabel,
  statusLabel,
} from "@/lib/labels";
import type {
  GenerationStatus,
  LearnerLevel,
  SolutionLanguage,
} from "@/lib/types";

type MetadataStripProps = {
  title: string;
  model: string;
  provider: string;
  language: SolutionLanguage;
  learnerLevel: LearnerLevel;
  status: GenerationStatus;
};

export function MetadataStrip({
  title,
  model,
  provider,
  language,
  learnerLevel,
  status,
}: MetadataStripProps) {
  return (
    <div className="grid gap-2 rounded-lg bg-panel p-3 text-xs text-muted shadow-soft sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{title}</p>
        <p className="mt-1 truncate">
          {statusLabel(status)} · {languageLabel(language)} · {learnerModeLabel(learnerLevel)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>{provider}</Badge>
        <Badge>{model}</Badge>
        {status === "streaming" ? (
          <Badge tone="accent">
            <Loader2 size={12} className="animate-spin" />
            Streaming
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
}) {
  return (
    <span
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 font-medium ${
        tone === "accent" ? "bg-accent-soft text-accent-ink" : "bg-control text-muted"
      }`}
    >
      {children}
    </span>
  );
}
