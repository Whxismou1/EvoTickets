package com.evotickets.services;

import com.evotickets.entities.TicketEntity;
import com.evotickets.repositories.TicketRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class StripeService {

    private final TicketRepository ticketRepository;

    @Value("${stripe.public-key}")
    private String stripePublicKey;

    public StripeService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public String crearCheckoutSession(Long ticketId) throws Exception {
        TicketEntity ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        long priceInCents = ticket.getPrice().multiply(BigDecimal.valueOf(100)).longValue();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("")
                .setCancelUrl("")
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount(priceInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Entrada para " + ticket.getEvent().getName())
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);
        return session.getId();
    }

    public String getStripePublicKey() {
        return stripePublicKey;
    }
}
