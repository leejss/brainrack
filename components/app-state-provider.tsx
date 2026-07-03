"use client";

import { createContext, type ReactNode, useContext } from "react";

import { useWorkedExampleController } from "@/hooks/use-worked-example-controller";

type AppState = ReturnType<typeof useWorkedExampleController>;

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const controller = useWorkedExampleController();

  return (
    <AppStateContext.Provider value={controller}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error("useAppState must be used inside AppStateProvider.");
  }

  return state;
}
