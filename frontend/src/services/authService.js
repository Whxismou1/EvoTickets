import { useAuthStore } from "../store/authStore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../config/firebaseConfig";

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/auth";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const sanitizeInput = (input) => input.trim();

const throwIfInvalid = (condition, message) => {
  if (!condition) throw new Error(message);
};

export const login = async (email, password) => {
  email = sanitizeInput(email);
  throwIfInvalid(email && password, "Email y contraseña son obligatorios");
  throwIfInvalid(isValidEmail(email), "Email no válido");

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login fallido");
    }

    const data = await res.json();
    useAuthStore.getState().setToken(data.token);
    return data;
  } catch (error) {
    throw new Error(error.message || "Login fallido");
  }
};

export const register = async (firstName, lastName, username, email, password, dateOfBirth) => {
  username = sanitizeInput(username);
  email = sanitizeInput(email);

  throwIfInvalid(firstName && lastName && username && email && password && dateOfBirth, "Todos los campos son obligatorios");
  throwIfInvalid(isValidEmail(email), "Email no válido");
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_=])[A-Za-z\d@$!%*?&#+\-_=]{8,}$/.test(password);

  if (!isStrongPassword(password)) {
    throw new Error(
      "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos especiales"
    );
  }

  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({firstName, lastName, username, email, password, dateOfBirth }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Registro fallido");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Registro fallido");
  }
};

export const verifyAccount = async (verificationToken, email) => {
  try {
    const res = await fetch(`${BASE_URL}/verifyAccount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationToken, email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Verificación fallida");
    }

    return await res.text();
  } catch (error) {
    throw new Error(error.message || "Verificación fallida");
  }
};

export const resendVerificationCode = async (email) => {
  email = sanitizeInput(email);
  throwIfInvalid(isValidEmail(email), "Email no válido");

  try {
    const res = await fetch(`${BASE_URL}/resendVerificationToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Reenvío fallido");
    }

    return await res.text();
  } catch (error) {
    throw new Error(error.message || "Reenvío fallido");
  }
};

export const forgotPassword = async (email) => {
  email = sanitizeInput(email);
  throwIfInvalid(isValidEmail(email), "Email no válido");

  try {
    const res = await fetch(`${BASE_URL}/forgotPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Envío fallido");
    }

    return await res.text();
  } catch (error) {
    throw new Error(error.message || "Envío fallido");
  }
};

export const validateResetToken = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/validateResetToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Token erroneo");
    }

    return await res.text();
  } catch (error) {
    throw new Error(error.message || "Token erroneo");
  }
};

export const resetPassword  = async (token, password) => {
  try {
    const res = await fetch(`${BASE_URL}/resetPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error  || "Reset fallido");
    }

    return await res.text();
  } catch (error) {
    throw new Error(error.message ||  "Reset fallido");
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    let dateOfBirth = null;

    if (accessToken) {
      const profileRes = await fetch(
        "https://people.googleapis.com/v1/people/me?personFields=birthdays",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const birthdayObj = profileData.birthdays?.[0]?.date;
        if (birthdayObj) {
          const { year, month, day } = birthdayObj;
          if (year && month && day) {
            dateOfBirth = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          }
        }
      } else {
        console.warn("No se pudo obtener fecha de nacimiento desde People API");
      }
    }


    const res = await fetch(`${BASE_URL}/loginWithGoogle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken, dateOfBirth }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login con Google fallido");
    }

    const data = await res.json();
    useAuthStore.getState().setToken(data.token);
    return data;
  } catch (error) {
    throw new Error(error.message || "Login con Google fallido");
  }
};