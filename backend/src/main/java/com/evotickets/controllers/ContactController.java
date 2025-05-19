package com.evotickets.controllers;

import com.evotickets.dtos.ContactDTO;
import com.evotickets.dtos.WorkWithUsDTO;
import com.evotickets.services.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/workWithUs", consumes = {"multipart/form-data"})
    public ResponseEntity<String> handleWorkApplication( @RequestPart("data") WorkWithUsDTO dto,
    @RequestPart("resume") MultipartFile resume) {
                // DTO
        // if (resume.isEmpty()) {
        //     return ResponseEntity.badRequest().body("El currículum es obligatorio.");
        // }

        emailService.sendWorkWithUsEmail(
            dto.getName(),
            dto.getEmail(),
            dto.getPhone(),
            dto.getMessage(),
            resume
        );

        return ResponseEntity.ok("Solicitud enviada correctamente.");
    }
}
