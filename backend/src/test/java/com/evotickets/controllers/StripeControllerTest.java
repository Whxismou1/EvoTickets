package com.evotickets.controllers;

import com.evotickets.services.StripeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StripeControllerTest {

    @Mock
    private StripeService stripeService;

    @InjectMocks
    private StripeController stripeController;

    private final String sessionIdMock = "cs_test_123456";
    private final String publicKeyMock = "pk_test_abcdef";

    @BeforeEach
    void setUp() {
    }

    @Test
    public void createCheckoutSession_ValidTicketId_ReturnsSessionId() {
        Long ticketId = 42L;
        when(stripeService.crearCheckoutSession(ticketId)).thenReturn(sessionIdMock);

        ResponseEntity<String> response = stripeController.createCheckoutSession(ticketId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sessionIdMock, response.getBody());
        verify(stripeService).crearCheckoutSession(ticketId);
    }

    @Test
    public void getPublicKey_ReturnsStripePublicKey() {
        when(stripeService.getStripePublicKey()).thenReturn(publicKeyMock);

        ResponseEntity<String> response = stripeController.getPublicKey();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(publicKeyMock, response.getBody());
        verify(stripeService).getStripePublicKey();
    }
}
