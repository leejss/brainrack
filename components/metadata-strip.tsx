"use client";

import { Loader2, Server, Terminal } from "lucide-react";
import type { ReactNode } from "react";

import { languageLabel, learnerModeLabel, statusLabel } from "@/lib/labels";
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
    <div className="grid gap-3 rounded-xl border border-line bg-panel p-4 text-[0.72rem] text-muted shadow-soft sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center transition-all duration-200">
      <div className="min-w-0 flex items-center gap-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-control/50 border border-line/60 text-ink/80">
          <Terminal size={14} className="text-accent" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-ink text-xs tracking-tight">
            {title}
          </p>
          <p className="mt-0.5 truncate text-[0.68rem] font-medium text-muted/90">
            {statusLabel(status)} <span className="text-line mx-1">|</span>{" "}
            {languageLabel(language)} <span className="text-line mx-1">|</span>{" "}
            {learnerModeLabel(learnerLevel)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge icon={<Server size={11} className="opacity-70" />}>
          {provider} · {model}
        </Badge>
        {status === "streaming" ? (
          <Badge tone="accent">
            <Loader2 size={11} className="animate-spin text-accent" />
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
  icon,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-1.5 rounded-md px-2.5 text-[0.68rem] font-bold border transition-colors ${
        tone === "accent"
          ? "bg-accent-soft border-accent/20 text-accent-ink"
          : "bg-control/60 border-line/60 text-muted"
      }`}
    >
      {icon}
      {children}
    </span>
  );
}
