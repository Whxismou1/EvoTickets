
const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/contact";

export const sendContactEmail = async ({ name, email, subject, message }) => {
  
  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    throw new Error("Todos los campos son obligatorios");
  }

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

export const sendWorkWithUsEmail = async ({ name, email, phone, message, resume }) => {
  if (!name.trim() || !email.trim() || !message.trim()) {
    throw new Error("Todos los campos son obligatorios");
  }

  const formData = new FormData();

  formData.append("data", new Blob([JSON.stringify({ name, email, phone, message })], { type: 'application/json' }));
  formData.append("resume", resume);
  

  const response = await fetch(`${BASE_URL}/workWithUs`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al enviar la solicitud");
  }

  return await response.text();
};


