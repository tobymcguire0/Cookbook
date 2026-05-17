import { create } from "zustand";

type AuthStatusState = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
};

export const useAuthStatusStore = create<AuthStatusState>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));
