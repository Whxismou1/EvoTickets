package com.evotickets.controllers;

import com.evotickets.dtos.ContactDTO;
import com.evotickets.services.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<String> sendContactEmail(@Valid @RequestBody ContactDTO contactDTO) {
        emailService.sendContactEmail(
            contactDTO.getName(),
            contactDTO.getEmail(),
            contactDTO.getSubject(),
            contactDTO.getMessage()
        );
        return ResponseEntity.ok("Mensaje enviado correctamente.");
    }
}
