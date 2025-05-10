package com.evotickets.exceptions;

public class StripeInitializationException extends CustomException {
    public StripeInitializationException(String message) {
        super(message);
    }
}
