"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sendContactEmail } from "../services/contactService"; // Reutilizamos servicio

export default function RegisterManagerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role || !formData.message) {
      showAlert({ type: "error", message: "Por favor completa los campos obligatorios." });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactEmail(formData);
      showAlert({ type: "success", message: "Tu solicitud ha sido enviada." });

      setFormData({
        name: "",
        email: "",
        role: "",
        company: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      showAlert({ type: "error", message: "Hubo un error al enviar el formulario." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Nav />
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />

      <div className="min-h-screen bg-[#F9F7FD] pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-[#2E1A47] mb-6">
              Registro de Gestores / Artistas
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#2E1A47]">Nombre completo *</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <label className="text-sm font-medium text-[#2E1A47]">Correo electrónico *</label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div>
                <label className="text-sm font-medium text-[#2E1A47]">Perfil *</label>
                <select name="role" value={formData.role} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="">Selecciona una opción</option>
                  <option value="gestor">Gestor de eventos</option>
                  <option value="artista">Artista</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#2E1A47]">Nombre del evento o empresa (opcional)</label>
                <Input name="company" value={formData.company} onChange={handleChange} />
              </div>

              <div>
                <label className="text-sm font-medium text-[#2E1A47]">Mensaje *</label>
                <textarea name="message" rows="5" value={formData.message} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>

              <div className="flex items-center">
                <input id="privacy" type="checkbox" required />
                <label htmlFor="privacy" className="ml-2 text-sm text-[#5C3D8D]">
                  Acepto la{" "}
                  <span onClick={() => navigate("/PrivacyPolicyPage")} className="underline cursor-pointer hover:text-[#2E1A47]">
                    política de privacidad
                  </span>
                </label>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">Enviando...</span>
                ) : (
                  <span className="flex items-center"><Send className="h-4 w-4 mr-2" />Enviar solicitud</span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
