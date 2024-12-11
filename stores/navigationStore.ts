import { create } from 'zustand';

interface NavigationState {
  previousScreen: string | undefined;  // Änderung von null zu undefined
  setPreviousScreen: (screen: string | undefined) => void;  // Erlaubt undefined
}

export const useNavigationStore = create<NavigationState>((set) => ({
  previousScreen: undefined,
  setPreviousScreen: (screen) => set({ previousScreen: screen }),
}));