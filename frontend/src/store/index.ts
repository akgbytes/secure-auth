import type { User } from "@/types";
import { create } from "zustand";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user: user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
