import { create } from "zustand";

interface AuthState {
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  login: (
    user: { id: string; name: string; email: string },
    token: string
  ) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
