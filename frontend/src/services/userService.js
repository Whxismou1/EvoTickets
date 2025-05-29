const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/users";


export const getUserById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "No se pudo obtener el usuario");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error al obtener el usuario");
  }
};


export const updateUserProfile = async (userId, data) => {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error actualizando perfil");
  }

  return await res.json();
};


export const uploadProfilePicture = async (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/${userId}/profile-picture`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al subir la imagen: ${errorText}`);
  }

  const data = await res.json();
  return data;
};

export const changeUserPassword = async (userId, passwordData) => {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const res = await fetch(`${BASE_URL}/${userId}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al cambiar la contraseña");
  }

  return await res.json();
};


export const deleteAccount = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al eliminar la cuenta");
    }

    return res.ok;
  } catch (error) {
    throw new Error(error.message || "Error al eliminar la cuenta");
  }
};


export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/all`, {
    method: "GET",
    credentials: "include",
  });
  

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al obtener los usuarios");
  }

  return await res.json();
}


export const addFavorite = async (userId, eventId) => {
  const res = await fetch(`${BASE_URL}/${userId}/favorites/${eventId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Error al añadir favorito");
  return await res.json();
};

export const removeFavorite = async (userId, eventId) => {
  const res = await fetch(`${BASE_URL}/${userId}/favorites/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Error al eliminar favorito");
  return await res.json();
};


export const followArtist = async (userId, artistId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}/follow/${artistId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al seguir al artista");
    }

    return await res.json();
  } catch (error) {
    throw new Error(error.message || "Error al seguir al artista");
  }
};

export const unfollowArtist = async (userId, artistId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}/unfollow/${artistId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al dejar de seguir al artista");
    }

    return await res.json();
  } catch (error) {
    throw new Error(error.message || "Error al dejar de seguir al artista");
  }
};

export const getUserTickets = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}/my-tickets`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "No se pudieron obtener los tickets del usuario");
    }

    return await res.json();
  } catch (error) {
    throw new Error(error.message || "Error al obtener los tickets del usuario");
  }
};