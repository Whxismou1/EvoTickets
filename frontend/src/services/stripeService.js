import { loadStripe } from "@stripe/stripe-js";

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/stripe";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLICK_KEY);

export const redirectToCheckout = async (sessionId) => {
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId });
};

export const createCheckoutSession = async (ticketsToBuy) => {
  const res = await fetch(`${BASE_URL}/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticketsToBuy),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al crear sesión de pago: ${errorText}`);
  }

  return res.json();
};
