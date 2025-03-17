import { useAuthStore } from "../store/authStore";

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/auth";
export const login = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await res.json();

    useAuthStore.getState().setToken(data.token);

    return data;
  } catch (error) {
    throw new Error(error.error || "Login failed");
  }
};

export const register = async (username, email, password, dateOfBirth) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, dateOfBirth }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Register failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.error || "Register failed");
  }
};

export const verifyAccount = async (verificationToken, email) => {
  try {
    const res = await fetch(`${BASE_URL}/verifyAccount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verificationToken, email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Verification failed");
    }

    const data = await res.text();
    return data;
  } catch (error) {
    throw new Error(error.error || "Verification failed");
  }
};
