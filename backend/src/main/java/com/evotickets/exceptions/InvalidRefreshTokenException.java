package com.evotickets.exceptions;

public class InvalidRefreshTokenException extends CustomException {

    public InvalidRefreshTokenException(String message) {
        super(message);
    }

}
