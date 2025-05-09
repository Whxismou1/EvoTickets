package com.evotickets.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.stripe.Stripe;

import jakarta.annotation.PostConstruct;

@Configuration
public class StripeConfig {

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        try {
            Stripe.apiKey = stripeApiKey;
        } catch (Exception e) {
            throw new RuntimeException("Error initializing Stripe", e);
        }
    }
}
