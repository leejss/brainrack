import { createStore } from "zustand/vanilla";

export type AppState = {
  isSidenavOpen: boolean;
};

export type AppActions = {
  setSidenavOpen: (isSidenavOpen: boolean) => void;
  openSidenav: () => void;
  closeSidenav: () => void;
  toggleSidenav: () => void;
};

export type AppStore = AppState & AppActions;

export const defaultAppState: AppState = {
  isSidenavOpen: false,
};

export function createAppStore(initialState: AppState = defaultAppState) {
  return createStore<AppStore>()((set) => ({
    ...initialState,
    setSidenavOpen: (isSidenavOpen) => set({ isSidenavOpen }),
    openSidenav: () => set({ isSidenavOpen: true }),
    closeSidenav: () => set({ isSidenavOpen: false }),
    toggleSidenav: () =>
      set((state) => ({ isSidenavOpen: !state.isSidenavOpen })),
  }));
}
