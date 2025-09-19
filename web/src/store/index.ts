import { fetchUser } from "@/services/user.service";
import type { User } from "@/types";
import { create } from "zustand";

export type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  checkAuth: () => Promise<void>;
  loading: boolean;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user: user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  loading: true,
  checkAuth: async () => {
    try {
      const user = await fetchUser();
      set({ user, isAuthenticated: true, loading: false });
    } catch (error: any) {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
}));
