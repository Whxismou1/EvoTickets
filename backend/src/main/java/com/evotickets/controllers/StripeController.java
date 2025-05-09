package com.evotickets.controllers;

import com.evotickets.services.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestParam Long ticketId) {
        try {
            String sessionId = stripeService.crearCheckoutSession(ticketId);
            return ResponseEntity.ok().body(sessionId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/public-key")
    public ResponseEntity<?> getPublicKey() {
        return ResponseEntity.ok().body(stripeService.getStripePublicKey());
    }
}
