import { useAuthStore } from "../store/authStore";

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/events";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getAllEvents = async () => {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const getFewEvents = async (limit) => {
  const res = await fetch(`${BASE_URL}/limit`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",    },
    body: JSON.stringify(limit ),
  });
  if (!res.ok) throw new Error("Error fetching events");
  return await res.json();
};


export const getEventById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const getEventsByLocation = async (locationId) => {
  const res = await fetch(`${BASE_URL}/location?id=${locationId}`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const createEvent = async (eventData) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const modifyEvent = async (id, eventUpdate) => {
  const res = await fetch(`${BASE_URL}?id=${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(eventUpdate),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${BASE_URL}?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.text();
};

export const getEventsOrganizedByUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
