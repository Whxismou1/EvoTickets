package com.evotickets.controllers;

import com.evotickets.services.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/stripe")
public class StripeController {

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<String> createCheckoutSession(@RequestParam Long ticketId) {
        String sessionId = stripeService.crearCheckoutSession(ticketId);
        return ResponseEntity.ok(sessionId);
    }

    @GetMapping("/public-key")
    public ResponseEntity<String> getPublicKey() {
        return ResponseEntity.ok(stripeService.getStripePublicKey());
    }
}
