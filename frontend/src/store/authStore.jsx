import { create } from "zustand";
import { persist } from "zustand/middleware";
import {jwtDecode} from "jwt-decode";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      role: null,
      setToken: (token) => {
        console.log(jwtDecode(token));
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        set({ token, role });
        const expiryTime = decodedToken.exp * 1000; 
        const currentTime = Date.now();
        const timeout = expiryTime - currentTime;

        if (timeout > 0) {
          setTimeout(() => {
            get().logout();
          }, timeout);
        }
      },
      logout: () => set({ token: null, role: null }),
    }),
    {
      name: "auth-storage", // clave para localStorage
      getStorage: () => localStorage,
    }
  )
);
