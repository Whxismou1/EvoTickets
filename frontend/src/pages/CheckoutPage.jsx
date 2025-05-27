"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import {
  ChevronLeft,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Ticket,
  Home,
  User,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTranslation } from "react-i18next"
import useAlert  from "../hooks/useAlert"

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const showAlert = useAlert()

  // Get data from location state or fetch if needed
  const [eventData, setEventData] = useState(location.state?.eventData || null)
  const [selectedTickets, setSelectedTickets] = useState(location.state?.selectedTickets || {})
  const [totalAmount, setTotalAmount] = useState(location.state?.totalAmount || 0)
  const [selectedSeats, setSelectedSeats] = useState(location.state?.selectedSeats || [])

  // Checkout state
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutStatus, setCheckoutStatus] = useState(null) // null, 'success', 'error'
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    // If we don't have event data from location state, redirect back to event page
    if (!eventData || !location.state) {
      showAlert("Información de compra no disponible", "error")
      navigate(`/events/${id}`)
    }
  }, [eventData, id, navigate, location.state, showAlert])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "El nombre es obligatorio"
    }

    if (!formData.email.trim()) {
      errors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email no válido"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showAlert("Por favor, completa todos los campos correctamente", "error")
      return
    }

    setIsLoading(true)

    // Simulate API call to payment processor
    setTimeout(() => {
      // 90% success rate for demo purposes
      const isSuccess = Math.random() < 0.9

      setIsLoading(false)
      setCheckoutStatus(isSuccess ? "success" : "error")

      if (isSuccess) {
        showAlert("¡Compra realizada con éxito!", "success")
      } else {
        showAlert("Error al procesar el pago. Por favor, inténtalo de nuevo.", "error")
      }
    }, 2000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  // Generate a random order number
  const orderNumber = `EVO-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`

  if (!eventData) {
    return (
      <>
        <Navbar isAuthenticated={true} />
        <main className="min-h-screen bg-[#F3F0FA] pt-16 flex items-center justify-center">
          <p className="text-center text-[#5C3D8D]">Cargando información de compra...</p>
        </main>
        <Footer />
      </>
    )
  }

  // Success view
  if (checkoutStatus === "success") {
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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#2E1A47] mb-2">¡Compra Completada!</h1>
                  <p className="text-[#5C3D8D]">Tu pedido ha sido procesado correctamente.</p>
                </div>

                <div className="bg-[#F3F0FA] rounded-lg p-4 mb-6">
                  <h2 className="font-semibold text-[#2E1A47] mb-2">Detalles del pedido</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#5C3D8D]">Número de pedido</span>
                      <span className="font-medium text-[#2E1A47]">{orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C3D8D]">Fecha de compra</span>
                      <span className="font-medium text-[#2E1A47]">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C3D8D]">Total</span>
                      <span className="font-medium text-[#2E1A47]">{formatCurrency(totalAmount * 1.05)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5C3D8D]">Método de pago</span>
                      <span className="font-medium text-[#2E1A47]">
                        {paymentMethod === "card" ? "Tarjeta de crédito" : "PayPal"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="font-semibold text-[#2E1A47] mb-3">Información del evento</h2>
                  <div className="border border-[#F3F0FA] rounded-lg p-4">
                    <h3 className="font-medium text-[#2E1A47] mb-2">{eventData.title}</h3>
                    <div className="space-y-2 text-sm text-[#5C3D8D]">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                        <span>{formatDate(eventData.date)}</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 mt-0.5" />
                        <span>{formatTime(eventData.date)}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                        <span>
                          {typeof eventData.location === "object" ? eventData.location.name : eventData.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="font-semibold text-[#2E1A47] mb-3">Tus entradas</h2>
                  <div className="space-y-3">
                    {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                      if (quantity <= 0) return null

                      const ticket = eventData.ticketTypes.find((t) => t.id === ticketId)
                      if (!ticket) return null

                      return (
                        <div key={ticketId} className="border border-[#F3F0FA] rounded-lg p-4">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-[#2E1A47]">{ticket.name}</span>
                            <span className="text-[#5C3D8D]">x {quantity}</span>
                          </div>
                          {selectedSeats && selectedSeats.length > 0 && (
                            <div className="text-sm text-[#5C3D8D]">
                              Asientos: {selectedSeats.map((seat) => seat.id).join(", ")}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-[#F3F0FA] rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-[#5C3D8D] mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-[#2E1A47] mb-1">Entradas enviadas por email</h3>
                      <p className="text-sm text-[#5C3D8D]">
                        Hemos enviado tus entradas a {formData.email}. Si no las recibes en los próximos minutos, revisa
                        tu carpeta de spam.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    as={Link}
                    to="/profile/tickets"
                    className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white flex-1"
                    startContent={<Ticket size={18} />}
                  >
                    Ver Mis Entradas
                  </Button>
                  <Button
                    as={Link}
                    to="/"
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

  // Error view
  if (checkoutStatus === "error") {
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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#2E1A47] mb-2">Error en el Pago</h1>
                  <p className="text-[#5C3D8D]">
                    Ha ocurrido un error al procesar tu pago. Por favor, inténtalo de nuevo.
                  </p>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-[#2E1A47] mb-1">Posibles causas del error</h3>
                      <ul className="text-sm text-[#5C3D8D] list-disc list-inside space-y-1">
                        <li>Fondos insuficientes en la tarjeta</li>
                        <li>Datos de la tarjeta incorrectos</li>
                        <li>La tarjeta ha sido rechazada por el banco</li>
                        <li>Problemas de conexión con el procesador de pagos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white flex-1"
                    startContent={<CreditCard size={18} />}
                    onPress={() => setCheckoutStatus(null)}
                  >
                    Intentar de Nuevo
                  </Button>
                  <Button
                    as={Link}
                    to={`/events/${id}`}
                    variant="light"
                    className="text-[#5C3D8D] border border-[#5C3D8D] hover:bg-[#5C3D8D]/10 flex-1"
                    startContent={<ChevronLeft size={18} />}
                  >
                    Volver al Evento
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

  // Normal checkout view
  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-16 pb-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-6">
            <Button
              as={Link}
              to={`/events/${id}`}
              variant="light"
              className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
              startContent={<ChevronLeft size={16} />}
            >
              Volver al evento
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-2/3"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-[#2E1A47] mb-6">Finalizar Compra</h1>

                  <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-[#2E1A47] mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Información Personal
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-[#5C3D8D] mb-1">
                            Nombre completo
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${
                              formErrors.name ? "border-red-300" : "border-[#F3F0FA]"
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50`}
                            placeholder="Introduce tu nombre completo"
                          />
                          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-[#5C3D8D] mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${
                              formErrors.email ? "border-red-300" : "border-[#F3F0FA]"
                            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50`}
                            placeholder="Introduce tu email"
                          />
                          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Payment Method - Stripe Integration */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-[#2E1A47] mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Método de Pago
                      </h2>

                      <div className="border border-[#F3F0FA] rounded-lg p-6 bg-[#F3F0FA]/30">
                        <div className="text-center mb-4">
                          <p className="text-[#5C3D8D] mb-2">Pago seguro con Stripe</p>
                          <div className="flex justify-center space-x-2">
                            <div className="h-6 w-10 bg-[#5C3D8D]/10 rounded"></div>
                            <div className="h-6 w-10 bg-[#5C3D8D]/10 rounded"></div>
                            <div className="h-6 w-10 bg-[#5C3D8D]/10 rounded"></div>
                            <div className="h-6 w-10 bg-[#5C3D8D]/10 rounded"></div>
                          </div>
                        </div>

                        {/* Aquí se integrará el formulario de Stripe */}
                        <div className="bg-white border border-[#F3F0FA] rounded-lg p-4 h-20 flex items-center justify-center">
                          <p className="text-[#5C3D8D] text-sm">El formulario de pago seguro se cargará aquí</p>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-6">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mt-1 h-4 w-4 text-[#5C3D8D] border-[#F3F0FA] rounded focus:ring-[#5C3D8D]"
                          required
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-[#5C3D8D]">
                          Acepto los{" "}
                          <Link to="/terms" className="text-[#5C3D8D] underline">
                            Términos y Condiciones
                          </Link>{" "}
                          y la{" "}
                          <Link to="/privacy" className="text-[#5C3D8D] underline">
                            Política de Privacidad
                          </Link>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white py-3"
                      startContent={<CreditCard size={18} />}
                      isLoading={isLoading}
                      isDisabled={isLoading}
                    >
                      {isLoading ? "Procesando..." : `Proceder al pago de ${formatCurrency(totalAmount * 1.05)}`}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/3"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-[#2E1A47] mb-4">Resumen del pedido</h2>

                  <div className="mb-4">
                    <div className="bg-[#F3F0FA] rounded-lg p-3 mb-4">
                      <h3 className="font-medium text-[#2E1A47] mb-1">{eventData.title}</h3>
                      <div className="text-sm text-[#5C3D8D] space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          <span>{formatDate(eventData.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>{formatTime(eventData.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                        if (quantity <= 0) return null

                        const ticket = eventData.ticketTypes.find((t) => t.id === ticketId)
                        if (!ticket) return null

                        return (
                          <div key={ticketId} className="flex justify-between text-sm">
                            <span className="text-[#5C3D8D]">
                              {ticket.name} x {quantity}
                            </span>
                            <span className="font-medium text-[#2E1A47]">
                              {formatCurrency(ticket.price * quantity)}
                            </span>
                          </div>
                        )
                      })}

                      {selectedSeats && selectedSeats.length > 0 && (
                        <div className="text-sm text-[#5C3D8D] pt-1">
                          <span className="font-medium">Asientos:</span>{" "}
                          {selectedSeats.map((seat) => seat.id).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-[#F3F0FA] pt-4 mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-[#5C3D8D]">Subtotal</span>
                      <span className="font-medium text-[#2E1A47]">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-[#5C3D8D]">Gastos de gestión</span>
                      <span className="font-medium text-[#2E1A47]">{formatCurrency(totalAmount * 0.05)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-2">
                      <span className="text-[#2E1A47]">Total</span>
                      <span className="text-[#2E1A47]">{formatCurrency(totalAmount * 1.05)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#5C3D8D]">
                    <p className="mb-2">
                      Al completar la compra, aceptas nuestros términos y condiciones y nuestra política de privacidad.
                    </p>
                    <p>
                      Las entradas no son reembolsables. Para más información, consulta nuestra política de cancelación.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
