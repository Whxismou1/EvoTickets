package com.evotickets.services;

import com.evotickets.entities.EventEntity;
import com.evotickets.entities.TicketEntity;
import com.evotickets.exceptions.CustomException;
import com.evotickets.exceptions.StripeSessionCreationException;
import com.evotickets.repositories.TicketRepository;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StripeServiceTests {

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private StripeService stripeService;

    @BeforeEach
    public void setUp() {
        // Asignamos manualmente el valor de la clave pública para pruebas
        stripeService = new StripeService(ticketRepository);
        stripeService.getClass()
                .getDeclaredFields(); // Dummy call to avoid unused warning
        // Usamos Reflection para setear la propiedad inyectada @Value
        try {
            java.lang.reflect.Field field = StripeService.class.getDeclaredField("stripePublicKey");
            field.setAccessible(true);
            field.set(stripeService, "pk_test_mocked");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void getStripePublicKey_ReturnsInjectedValue() {
        String key = stripeService.getStripePublicKey();
        assertThat(key).isEqualTo("pk_test_mocked");
    }

    @Test
    public void crearCheckoutSession_ValidTicket_ReturnsSessionId() throws StripeException {
        TicketEntity ticket = new TicketEntity();
        ticket.setId(1L);
        ticket.setPrice(new BigDecimal("25.00"));
        EventEntity event = new EventEntity();
        event.setName("Concierto");
        ticket.setEvent(event);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        // Simulamos la creación de sesión de Stripe
        try (MockedStatic<Session> mockedStripeSession = mockStatic(Session.class)) {
            Session fakeSession = mock(Session.class);
            when(fakeSession.getId()).thenReturn("sess_12345");
            mockedStripeSession.when(() -> Session.create(any(SessionCreateParams.class)))
                    .thenReturn(fakeSession);

            String sessionId = stripeService.crearCheckoutSession(1L);

            assertThat(sessionId).isEqualTo("sess_12345");
        }
    }

    @Test
    public void crearCheckoutSession_TicketNotFound_ThrowsCustomException() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> stripeService.crearCheckoutSession(99L))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("Ticket no encontrado");
    }

    @Test
    public void crearCheckoutSession_StripeThrowsException_ThrowsStripeSessionCreationException() {
        TicketEntity ticket = new TicketEntity();
        ticket.setId(2L);
        ticket.setPrice(new BigDecimal("30.00"));
        EventEntity event = new EventEntity();
        event.setName("Festival");
        ticket.setEvent(event);

        when(ticketRepository.findById(2L)).thenReturn(Optional.of(ticket));

        try (MockedStatic<Session> mockedStripe = mockStatic(Session.class)) {
            mockedStripe.when(() -> Session.create(any(SessionCreateParams.class)))
                    .thenThrow(new StripeSessionCreationException("Stripe fail"));

            assertThatThrownBy(() -> stripeService.crearCheckoutSession(2L))
                    .isInstanceOf(StripeSessionCreationException.class);
        }
    }
}
