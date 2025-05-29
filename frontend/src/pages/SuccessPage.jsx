"use client"

import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import { CheckCircle2, Ticket, Home, Mail } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function SuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
  
    if (!sessionId) {
      navigate("/");
      return;
    }
  
    const confirmOrder = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/stripe/confirm-order?sessionId=${sessionId}`, {
          method: "POST",
        });
  
        if (!response.ok) {
          throw new Error("Error confirmando el pedido");
        }
  
        const result = await response.json();
        console.log("Pedido confirmado:", result);
      } catch (error) {
        console.error("Error al confirmar pedido:", error);
      }
    };
  
    confirmOrder();
  }, [searchParams, navigate]);
  

  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-16 pb-16">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-[#2E1A47] mb-4">¡Compra Completada!</h1>
                <p className="text-[#5C3D8D] text-lg">Tu pago se ha procesado correctamente</p>
              </div>

              <div className="bg-[#F3F0FA] rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-[#5C3D8D] mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#2E1A47] mb-2">Entradas enviadas por email</h3>
                    <p className="text-[#5C3D8D] text-sm">
                      Hemos enviado tus entradas a tu dirección de email. Si no las recibes en los próximos minutos,
                      revisa tu carpeta de spam.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#2E1A47] mb-3">Información importante:</h3>
                <ul className="space-y-2 text-sm text-[#5C3D8D]">
                  <li>• Presenta tu entrada digital en el evento</li>
                  <li>• Llega 30 minutos antes del inicio</li>
                  <li>• Trae un documento de identidad válido</li>
                  <li>• Las entradas no son reembolsables</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  onClick={() => navigate("/profile?tab=tickets")}
                  className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white flex-1"
                  startContent={<Ticket size={18} />}
                >
                  Ver Mis Entradas
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="light"
                  className="text-[#5C3D8D] border border-[#5C3D8D] hover:bg-[#5C3D8D]/10 flex-1"
                  startContent={<Home size={18} />}
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
