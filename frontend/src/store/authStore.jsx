import { create } from "zustand";
import { persist } from "zustand/middleware";
import {jwtDecode} from "jwt-decode";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      userId: null,
      setToken: (token) => {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role.replace("ROLE_", "");
        const userId = decodedToken.userId;

        set({ token, role, userId });
        const expiryTime = decodedToken.exp * 1000; 
        const currentTime = Date.now();
        const timeout = expiryTime - currentTime;

        if (timeout > 0) {
          setTimeout(() => {
            get().logout();
          }, timeout);
        }
      },
      logout: () => set({ token: null, role: null, userId: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);