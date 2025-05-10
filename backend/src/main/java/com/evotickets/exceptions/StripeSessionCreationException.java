package com.evotickets.exceptions;

public class StripeSessionCreationException extends CustomException {
    public StripeSessionCreationException(String message) {
        super(message);
    }
}
