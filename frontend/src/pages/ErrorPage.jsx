"use client"

import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import { XCircle, AlertTriangle, CreditCard, Home } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ErrorPage() {
  const navigate = useNavigate()

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
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-[#2E1A47] mb-4">Error en el Pago</h1>
                <p className="text-[#5C3D8D] text-lg">Ha ocurrido un error al procesar tu pago</p>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#2E1A47] mb-3">Posibles causas del error:</h3>
                    <ul className="space-y-2 text-sm text-[#5C3D8D]">
                      <li>• Fondos insuficientes en la tarjeta</li>
                      <li>• Datos de la tarjeta incorrectos</li>
                      <li>• La tarjeta ha sido rechazada por el banco</li>
                      <li>• Problemas de conexión temporales</li>
                      <li>• Las entradas se han agotado durante el proceso</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#F3F0FA] rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-[#2E1A47] mb-3">¿Qué puedes hacer?</h3>
                <ul className="space-y-2 text-sm text-[#5C3D8D]">
                  <li>• Verifica los datos de tu tarjeta</li>
                  <li>• Asegúrate de tener fondos suficientes</li>
                  <li>• Intenta con otra tarjeta de crédito/débito</li>
                  <li>• Contacta con tu banco si el problema persiste</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate(-1)}
                  className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white flex-1"
                  startContent={<CreditCard size={18} />}
                >
                  Intentar de Nuevo
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
