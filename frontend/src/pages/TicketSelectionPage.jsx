"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import {
  ChevronLeft,
  Plus,
  Minus,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  createCheckoutSession,
  redirectToCheckout,
} from "../services/stripeService";

export default function TicketSelectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Event data from previous page
  const [eventData, setEventData] = useState(location.state?.eventData || null);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState(null);

  useEffect(() => {
    if (!eventData) {
      navigate(`/events/${id}`);
    }
  }, [eventData, id, navigate]);

  useEffect(() => {
    let total = 0;
    Object.entries(selectedTickets).forEach(([ticketId, quantity]) => {
      const ticket = eventData?.ticketTypes?.find(
        (t) => t.id === Number.parseInt(ticketId)
      );
      if (ticket && quantity > 0) {
        total += ticket.price * quantity;
      }
    });
    setTotalAmount(total);
  }, [selectedTickets, eventData]);

  const handleTicketQuantityChange = (ticketId, change) => {
    setSelectedTickets((prev) => {
      const currentQuantity = prev[ticketId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      const ticket = eventData.ticketTypes.find((t) => t.id === ticketId);
      if (newQuantity > ticket.quantity) {
        return prev;
      }

      return {
        ...prev,
        [ticketId]: newQuantity,
      };
    });
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
  };

  const handleProceedToCheckout = async () => {
    const selectedTicketEntries = Object.entries(selectedTickets).filter(
      ([_, quantity]) => quantity > 0
    );

    if (selectedTicketEntries.length === 0) {
      alert("Por favor selecciona al menos una entrada");
      return;
    }

    console.log("Selected tickets for checkout:", selectedTicketEntries);

    const ticketsToBuy = selectedTicketEntries.map(
      ([ticketTypeId, quantity]) => ({
        ticketTypeId: Number(ticketTypeId),
        quantity,
      })
    );

    console.log("Tickets to buy:", ticketsToBuy);

    try {
      const { sessionId } = await createCheckoutSession(ticketsToBuy);
      console.log("Session ID from backend:", sessionId);
      if (!sessionId) {
        throw new Error("No session ID returned from backend");
      }
      setIsLoading(true);
      await redirectToCheckout(sessionId);
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (!eventData) {
    return (
      <>
        <Navbar isAuthenticated={true} />
        <main className="min-h-screen bg-[#F3F0FA] pt-16 flex items-center justify-center">
          <p className="text-center text-[#5C3D8D]">
            Cargando información del evento...
          </p>
        </main>
        <Footer />
      </>
    );
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
              <div className="p-6 md:p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-[#2E1A47] mb-2">
                  ¡Compra Exitosa!
                </h1>
                <p className="text-[#5C3D8D] mb-6">
                  Tu compra se ha procesado correctamente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/profile/tickets")}
                    className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                    startContent={<Ticket size={18} />}
                  >
                    Ver Mis Entradas
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant="light"
                    className="text-[#5C3D8D] border border-[#5C3D8D] hover:bg-[#5C3D8D]/10"
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
    );
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
              <div className="p-6 md:p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-[#2E1A47] mb-2">
                  Error en el Pago
                </h1>
                <p className="text-[#5C3D8D] mb-6">
                  Ha ocurrido un error al procesar tu pago.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setCheckoutStatus(null)}
                    className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                    startContent={<CreditCard size={18} />}
                  >
                    Intentar de Nuevo
                  </Button>
                  <Button
                    onClick={() => navigate(`/events/${id}`)}
                    variant="light"
                    className="text-[#5C3D8D] border border-[#5C3D8D] hover:bg-[#5C3D8D]/10"
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
    );
  }

  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-16 pb-16">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Back button */}
          <div className="mb-6">
            <Button
              onClick={() => navigate(`/events/${id}`)}
              variant="light"
              className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
              startContent={<ChevronLeft size={16} />}
            >
              Volver al evento
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Ticket Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-2/3"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-[#2E1A47] mb-6 flex items-center">
                    <Ticket className="h-6 w-6 mr-2" />
                    Seleccionar Entradas
                  </h1>

                  {/* Event Info */}
                  <div className="bg-[#F3F0FA] rounded-lg p-4 mb-6">
                    <h2 className="font-semibold text-[#2E1A47] mb-2">
                      {eventData.name}
                    </h2>
                    <div className="text-sm text-[#5C3D8D] space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(eventData.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatTime(eventData.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          {eventData.location?.name ||
                            "Ubicación por confirmar"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Types */}
                  <div className="space-y-4">
                    {eventData.ticketTypes?.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-[#F3F0FA] rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#2E1A47] mb-1">
                              {ticket.name}
                            </h3>
                            <p className="text-[#5C3D8D] text-sm mb-2">
                              {formatCurrency(ticket.price)} por entrada
                            </p>
                            <p className="text-xs text-[#5C3D8D]">
                              {ticket.quantity} entradas disponibles
                            </p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <Button
                              isIconOnly
                              variant="light"
                              className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                              onPress={() =>
                                handleTicketQuantityChange(ticket.id, -1)
                              }
                              isDisabled={
                                !selectedTickets[ticket.id] ||
                                selectedTickets[ticket.id] === 0
                              }
                            >
                              <Minus size={16} />
                            </Button>

                            <span className="w-8 text-center font-medium text-[#2E1A47]">
                              {selectedTickets[ticket.id] || 0}
                            </span>

                            <Button
                              isIconOnly
                              variant="light"
                              className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                              onPress={() =>
                                handleTicketQuantityChange(ticket.id, 1)
                              }
                              isDisabled={
                                selectedTickets[ticket.id] >= ticket.quantity
                              }
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>

                        {selectedTickets[ticket.id] > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#F3F0FA]">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#5C3D8D]">
                                {selectedTickets[ticket.id]} ×{" "}
                                {formatCurrency(ticket.price)}
                              </span>
                              <span className="font-medium text-[#2E1A47]">
                                {formatCurrency(
                                  ticket.price * selectedTickets[ticket.id]
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
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
                  <h2 className="text-lg font-semibold text-[#2E1A47] mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Resumen
                  </h2>

                  {getTotalTickets() === 0 ? (
                    <div className="text-center py-8">
                      <Ticket className="h-12 w-12 text-[#5C3D8D]/30 mx-auto mb-3" />
                      <p className="text-[#5C3D8D] text-sm">
                        Selecciona las entradas que deseas comprar
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {Object.entries(selectedTickets).map(
                          ([ticketId, quantity]) => {
                            if (quantity <= 0) return null;

                            const ticket = eventData.ticketTypes.find(
                              (t) => t.id === Number.parseInt(ticketId)
                            );
                            if (!ticket) return null;

                            return (
                              <div
                                key={ticketId}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-[#5C3D8D]">
                                  {ticket.name} × {quantity}
                                </span>
                                <span className="font-medium text-[#2E1A47]">
                                  {formatCurrency(ticket.price * quantity)}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>

                      <div className="border-t border-[#F3F0FA] pt-4 mb-6">
                        <div className="flex justify-between text-lg font-bold">
                          <span className="text-[#2E1A47]">Total</span>
                          <span className="text-[#2E1A47]">
                            {formatCurrency(totalAmount)}
                          </span>
                        </div>
                        <p className="text-xs text-[#5C3D8D] mt-1">
                          {getTotalTickets()} entrada
                          {getTotalTickets() !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <Button
                        className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white py-3"
                        startContent={<CreditCard size={18} />}
                        onPress={handleProceedToCheckout}
                        isLoading={isLoading}
                        isDisabled={isLoading || getTotalTickets() === 0}
                      >
                        {isLoading ? "Procesando..." : "Proceder al Pago"}
                      </Button>

                      <div className="text-xs text-[#5C3D8D] mt-4 text-center">
                        <p>Pago seguro con Stripe</p>
                        <p>Las entradas se enviarán por email</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
