"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId, setTicketId] = useState(""); 
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const resClave = await fetch("http://localhost:8080/api/stripe/public-key");
      const publicKey = await resClave.json();
      const stripe = await loadStripe(publicKey);

      const resSesion = await fetch(
        `http://localhost:8080/api/stripe/create-checkout-session?ticketId=${ticketId}`,
        {
          method: "POST",
        }
      );

      const sessionId = await resSesion.json();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error.message);
      }
    } catch (err) {
      console.error("Error al procesar el pago:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-[#2E1A47]">
                Comprar entrada
              </h1>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-[#2E1A47]">
                ID del ticket
              </label>
              <input
                type="number"
                className="w-full border rounded-md px-4 py-2 border-[#A28CD4] focus:ring-[#5C3D8D]"
                placeholder="Ej: 1"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                required
              />

              <Button
                onClick={handleCheckout}
                className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                disabled={isLoading || !ticketId}
              >
                {isLoading ? "Procesando..." : "Pagar con Stripe"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
