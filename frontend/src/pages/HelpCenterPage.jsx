"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@heroui/button";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
const faqCategories = [
  {
    id: "general",
    title: "Preguntas generales",
    faqs: [
      {
        question: "¿Cómo puedo comprar entradas?",
        answer: "Puedes comprar entradas seleccionando el evento que te interesa, eligiendo la cantidad de entradas y completando el proceso de pago con tu método de pago preferido."
      },
      {
        question: "¿Cómo puedo contactar con atención al cliente?",
        answer: "Puedes contactar con nuestro equipo de atención al cliente a través del formulario de contacto en nuestra página web, por correo electrónico a soporte@evotickets.com o por teléfono al +34 900 123 456."
      },
      {
        question: "¿Cuáles son los métodos de pago aceptados?",
        answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal y transferencia bancaria para ciertos eventos."
      }
    ]
  },
  {
    id: "tickets",
    title: "Entradas y eventos",
    faqs: [
      {
        question: "¿Cómo recibo mis entradas?",
        answer: "Recibirás tus entradas por correo electrónico inmediatamente después de completar tu compra. También puedes acceder a ellas en cualquier momento desde tu cuenta en la sección 'Mis entradas'."
      },
      {
        question: "¿Puedo transferir mis entradas a otra persona?",
        answer: "Sí, puedes transferir tus entradas a otra persona desde la sección 'Mis entradas' en tu cuenta. Solo necesitas el correo electrónico de la persona a la que quieres transferir la entrada."
      },
      {
        question: "¿Qué hago si no puedo asistir al evento?",
        answer: "Si no puedes asistir al evento, puedes transferir tu entrada a otra persona o solicitar un reembolso según la política de cancelación del evento específico."
      }
    ]
  },
  {
    id: "account",
    title: "Cuenta y perfil",
    faqs: [
      {
        question: "¿Cómo puedo cambiar mi contraseña?",
        answer: "Puedes cambiar tu contraseña accediendo a la sección 'Perfil' en tu cuenta y seleccionando 'Cambiar contraseña'."
      },
      {
        question: "¿Cómo puedo actualizar mi información de contacto?",
        answer: "Puedes actualizar tu información de contacto en la sección 'Perfil' de tu cuenta."
      },
      {
        question: "He olvidado mi contraseña, ¿qué puedo hacer?",
        answer: "Si has olvidado tu contraseña, puedes restablecerla haciendo clic en 'Olvidé mi contraseña' en la página de inicio de sesión y siguiendo las instrucciones que recibirás por correo electrónico."
      }
    ]
  }
];



export default function HelpCenterPage() {
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert();
  const [expandedCategories, setExpandedCategories] = useState({
    general: true,
    tickets: false,
    account: false
  });
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };


  const handleContactSupport = () => {
    showAlert({ 
      type: 'success', 
      message: "Te redirigiremos a nuestro formulario de contacto" 
    });
    navigate("/support");
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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#2E1A47] mb-4">Centro de Ayuda</h1>
            <p className="text-[#5C3D8D] max-w-2xl mx-auto">
              Encuentra respuestas a tus preguntas sobre EvoTickets, compra de entradas, eventos y más.
            </p>
          </div>

          {/* Buscador */}
          {/* <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Buscar en el centro de ayuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-[#A28CD4] focus:ring-[#5C3D8D]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C3D8D] h-5 w-5" />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
              >
                Buscar
              </Button>
            </form>
          </div> */}

          {/* Preguntas populares
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#2E1A47] mb-4">Preguntas populares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularQuestions.map((question, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-[#A28CD4]/20 rounded-lg hover:bg-[#F3F0FA] cursor-pointer transition-colors"
                  onClick={() => showAlert({ type: 'info', message: question })}
                >
                  <div className="flex items-center">
                    <HelpCircle className="h-5 w-5 text-[#5C3D8D] mr-2" />
                    <span className="text-[#2E1A47]">{question}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* FAQs por categoría */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#2E1A47] mb-6">Preguntas frecuentes</h2>
            
            {faqCategories.map((category) => (
              <div key={category.id} className="mb-4 border border-[#A28CD4]/20 rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left bg-[#F3F0FA]"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="font-medium text-[#2E1A47]">{category.title}</span>
                  {expandedCategories[category.id] ? (
                    <ChevronUp className="h-5 w-5 text-[#5C3D8D]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#5C3D8D]" />
                  )}
                </button>
                
                {expandedCategories[category.id] && (
                  <div className="p-4">
                    {category.faqs.map((faq, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <button
                          className="w-full flex items-center justify-between p-3 text-left border border-[#A28CD4]/20 rounded-lg hover:bg-[#F9F7FD]"
                          onClick={() => toggleQuestion(`${category.id}-${index}`)}
                        >
                          <span className="font-medium text-[#2E1A47]">{faq.question}</span>
                          {expandedQuestions[`${category.id}-${index}`] ? (
                            <ChevronUp className="h-4 w-4 text-[#5C3D8D]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#5C3D8D]" />
                          )}
                        </button>
                        
                        {expandedQuestions[`${category.id}-${index}`] && (
                          <div className="mt-2 p-3 bg-[#F9F7FD] rounded-lg text-[#5C3D8D]">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold text-[#2E1A47] mb-2">¿No encuentras lo que buscas?</h2>
            <p className="text-[#5C3D8D] mb-4">
              Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta que tengas.
            </p>
            <Button 
              onClick={handleContactSupport}
              className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
            >
              Contactar con soporte
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
