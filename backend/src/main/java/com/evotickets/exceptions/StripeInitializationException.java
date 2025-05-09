package com.evotickets.exceptions;

public class StripeInitializationException extends RuntimeException {
    public StripeInitializationException(String message, Throwable cause) {
        super(message, cause);
    }
}
