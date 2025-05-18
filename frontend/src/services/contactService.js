
const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/contact";

export const sendContactEmail = async ({ name, email, subject, message }) => {
  
  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    throw new Error("Todos los campos son obligatorios");
  }
  console.log(BASE_URL)
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, subject, message }),
  });

  if (!response.ok) {
    throw new Error('Error al enviar el mensaje de contacto');
  }

  return await response.text(); 
};
