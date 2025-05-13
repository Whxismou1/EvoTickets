"use client";

import { useState } from "react";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      showAlert({
        type: "error",
        message: "Por favor, completa todos los campos obligatorios",
      });
      return;
    }

    // Simulación de envío
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showAlert({
        type: "success",
        message:
          "Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.",
      });

      // Resetear formulario
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
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
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#2E1A47] mb-4">Contacto</h1>
            <p className="text-[#5C3D8D] max-w-2xl mx-auto">
              ¿Tienes alguna pregunta o comentario? Estamos aquí para ayudarte.
              Completa el formulario a continuación y nos pondremos en contacto
              contigo lo antes posible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Información de contacto */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 h-med">
                <h2 className="text-xl font-semibold text-[#2E1A47] mb-6">
                  Información de contacto
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#F3F0FA] p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-[#5C3D8D]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2E1A47]">Teléfono</h3>
                      <p className="text-[#5C3D8D]">+34 900 123 456</p>
                      <p className="text-sm text-[#5C3D8D]/70">
                        Lun-Vie: 9:00 - 18:00
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#F3F0FA] p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-[#5C3D8D]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2E1A47]">Email</h3>
                      <p className="text-[#5C3D8D]">s.evotickets@gmail.com</p>
                      <p className="text-sm text-[#5C3D8D]/70">
                        Respondemos en 24-48h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#F3F0FA] p-3 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-[#5C3D8D]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2E1A47]">Dirección</h3>
                      <p className="text-[#5C3D8D]">Calle Gran Vía, 28</p>
                      <p className="text-[#5C3D8D]">28013 Madrid, España</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#2E1A47] mb-6">
                  Envíanos un mensaje
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#2E1A47] mb-1"
                      >
                        Nombre completo <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-[#A28CD4] focus:ring-[#5C3D8D]"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#2E1A47] mb-1"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-[#A28CD4] focus:ring-[#5C3D8D]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-[#2E1A47] mb-1"
                    >
                      Asunto
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border-[#A28CD4] focus:ring-[#5C3D8D]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#2E1A47] mb-1"
                    >
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-[#A28CD4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]"
                      required
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="privacy"
                      type="checkbox"
                      className="h-4 w-4 text-[#5C3D8D] border-[#A28CD4] rounded focus:ring-[#5C3D8D]"
                      required
                    />
                    <label
                      htmlFor="privacy"
                      className="ml-2 block text-sm text-[#5C3D8D]"
                    >
                      He leído y acepto la{" "}
                      <span
                        onClick={() => navigate("/privacy")}
                        className="cursor-pointer text-[#5C3D8D] underline hover:text-[#2E1A47]"
                      >
                        política de privacidad
                      </span>
                    </label>
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Enviar mensaje
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
