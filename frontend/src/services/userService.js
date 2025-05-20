const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/users";


export const getUserById = async (id) => {
    console.log(BASE_URL)
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
    console.error("Error:", await res.text()); 
    throw new Error("Error actualizando perfil");
  }

  return await res.json();
};


export const uploadProfilePicture = async (userId, file) => {
  const formData = new FormData();
  formData.append("profilePicture", file); 

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

