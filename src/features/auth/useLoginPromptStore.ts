import { create } from "zustand";

type LoginPromptState = {
  open: boolean;
  message: string;
  openPrompt: (message?: string) => void;
  close: () => void;
};

const DEFAULT_MESSAGE = "Log in to continue.";

export const useLoginPromptStore = create<LoginPromptState>((set) => ({
  open: false,
  message: DEFAULT_MESSAGE,
  openPrompt: (message) => set({ open: true, message: message ?? DEFAULT_MESSAGE }),
  close: () => set({ open: false }),
}));
