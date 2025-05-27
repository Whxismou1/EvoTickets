const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/artists";

export const getAllArtists = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Error al obtener los artistas");
  }
  return await res.json();
};

export const getArtistById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener el artista");
  }
  return await res.json();
};

export const getEventsByArtist = async (artistId) => {
  const res = await fetch(`${BASE_URL}/by-artist/${artistId}`);
  if (!res.ok) {
    throw new Error("Error al obtener los eventos del artista");
  }
  return await res.json();
}