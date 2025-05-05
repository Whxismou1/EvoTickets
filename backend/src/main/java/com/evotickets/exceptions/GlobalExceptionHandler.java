package com.evotickets.exceptions;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<Object> handleCustomException(CustomException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", e.getMessage(),
                        "timestamp", LocalDateTime.now()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "error", "Ocurrió un error inesperado" + e.getMessage(),
                        "timestamp", LocalDateTime.now()));
    }
}
