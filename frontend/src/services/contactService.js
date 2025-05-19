
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const sendContactEmail = async ({ name, email, subject, message }) => {
  
  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    throw new Error("Todos los campos son obligatorios");
  }

  const response = await fetch(`${BASE_URL} + "/api/v1/contact"`, {
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

export const sendWorkWithUsEmail = async ({ name, email, phone, message, resume}) => {

  console.log({ name, email, phone, message, resume})
  if (!name.trim() || !email.trim() || !message.trim()) {
    throw new Error("Todos los campos son obligatorios");
  }

  return fetch(`${BASE_URL} + "/api/v1/workWithUs"`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, phone, message, resume }),
  })

}

