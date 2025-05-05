package com.evotickets.exceptions;

public class FirebaseInitializationException extends CustomException {
    public FirebaseInitializationException(String message) {
        super(message);
    }

    public FirebaseInitializationException(String message, Throwable cause) {
        super(message);
        initCause(cause);
    }

}
