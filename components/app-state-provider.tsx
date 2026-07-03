"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStore } from "zustand";

import {
  createWorkedExampleStore,
  type WorkedExampleStore,
} from "@/store/worked-example-store";

type AppStateStoreApi = ReturnType<typeof createWorkedExampleStore>;

const AppStateContext = createContext<AppStateStoreApi | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createWorkedExampleStore());

  useEffect(() => {
    store.getState().loadHistory(window.localStorage);
  }, [store]);

  return (
    <AppStateContext.Provider value={store}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState<T>(selector: (state: WorkedExampleStore) => T) {
  const store = useContext(AppStateContext);

  if (!store) {
    throw new Error("useAppState must be used inside AppStateProvider.");
  }

  return useStore(store, selector);
}
