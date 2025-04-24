"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Checkbox } from "@heroui/checkbox"
import { DateInput } from "@heroui/date-input"
import { CalendarDate } from "@internationalized/date"
import { Ticket, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import { register } from "../services/authService"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: new CalendarDate(1995, 11, 6),
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (error) setError("")
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }))
  }

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked
    setFormData((prev) => ({ ...prev, acceptTerms: checked }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    if (!formData.acceptTerms) return

    if (!validateForm()) return

    try {
      setIsLoading(true)
      await register(formData.firstName, formData.lastName, formData.username, formData.email, formData.password, formData.dateOfBirth.toString())
      navigate("/verifyAccount", { state: { email: formData.email } })
    } catch (error) {
      setError(error.message || "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg border border-[#A28CD4]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center mb-6">
              <Ticket className="h-12 w-12 text-[#5C3D8D] mb-2" />
              <h1 className="text-2xl font-bold text-[#2E1A47]">Crear Cuenta</h1>
              <p className="text-[#5C3D8D] text-center mt-2">Únete a EvoTickets para descubrir eventos increíbles</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name fields in a two-column layout */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-[#2E1A47]">
                    Nombre
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-[#2E1A47]">
                    Apellido
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                  />
                </div>
              </div>

              {/* Other fields */}
              {[
                { id: "username", label: "Nombre de Usuario", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "password", label: "Contraseña", type: "password" },
                { id: "confirmPassword", label: "Confirmar Contraseña", type: "password" },
              ].map(({ id, label, type }) => (
                <div key={id} className="space-y-2">
                  <label htmlFor={id} className="text-sm font-medium text-[#2E1A47]">
                    {label}
                  </label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={label}
                    value={formData[id]}
                    onChange={handleChange}
                    required
                    className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-[#2E1A47]">
                  Fecha de nacimiento
                </label>
                <DateInput
                  name="dateOfBirth"
                  className="max-w-full"
                  onChange={handleDateChange}
                  value={formData.dateOfBirth}
                  placeholderValue={new CalendarDate(1995, 11, 6)}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  onChange={handleCheckboxChange}
                  className="text-[#5C3D8D] border-[#A28CD4]"
                />
                <label htmlFor="terms" className="text-sm font-medium text-[#2E1A47]">
                  Acepto los{" "}
                  <Link to="/terms" className="text-[#5C3D8D] hover:text-[#2E1A47] transition-colors">
                    términos y condiciones
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <p className="text-center text-sm text-[#5C3D8D] mt-6">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="font-medium text-[#5C3D8D] hover:text-[#2E1A47] transition-colors">
                Inicia sesión
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}