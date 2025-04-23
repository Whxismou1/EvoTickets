import { create } from "zustand";
import {jwtDecode} from "jwt-decode";

export const useAuthStore = create((set) => ({
  token: null,
  role: null,
  setToken: (token) => {
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    set({ token, role });
  },
  logout: () => set({ token: null, role: null }),
}));
