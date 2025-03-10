const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/users";
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
      throw new Error("Login failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
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
      throw new Error("Register failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
