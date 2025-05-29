package com.evotickets.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.evotickets.dtos.TicketRequestDTO;
import com.evotickets.services.StripeService;
@RestController
@RequestMapping("/api/v1/stripe")
public class StripeController {

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody List<TicketRequestDTO> ticketsToBuy) {
        String sessionId = stripeService.crearCheckoutSession(ticketsToBuy);
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", sessionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm-order")
    public ResponseEntity<?> confirmOrder(@RequestParam String sessionId) {
        Map<String, String> result = stripeService.confirmOrder(sessionId);
        return ResponseEntity.ok(result);
    }
    


}
