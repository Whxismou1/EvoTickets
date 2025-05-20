package com.evotickets.controllers;

import java.io.File;
import java.util.Map;

import com.evotickets.services.UserService;
import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.utils.QRGenerator;
import com.evotickets.utils.ImageUploader;
import com.evotickets.utils.PDFGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private ImageUploader imageUploader;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {

        return ResponseEntity.ok(userService.getUserByID(id));
    }

    @PostMapping("/{id}/upload-profile-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        String imageURL = userService.uploadProfilePicture(id, file);
        return ResponseEntity.ok(Map.of("imageURL", imageURL));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserEntity> updateUser(@PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        UserEntity updatedUser = userService.updateUserProfile(id, userUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/{id}/test-ticket-pdf")
    public ResponseEntity<?> generateTestTicket(@PathVariable Long id) {
        try {
            Long fakeTicketId = 999L;
            String qrContent = "ticket-id:" + fakeTicketId;
            String qrPath = "temp/qr_" + fakeTicketId + ".png";
            String pdfPath = "temp/ticket_" + fakeTicketId + ".pdf";

            // 1. Generar QR como imagen
            QRGenerator.generateQR(qrContent, qrPath);

            // 2. Subir QR a Cloudinary
            File qrFile = new File(qrPath);
            String qrUrl = imageUploader.uploadImage(qrFile);

            // 3. Generar HTML del ticket y convertir a PDF
            PDFGenerator.createTicketPDFWithHtmlTemplate(pdfPath, "Concierto de Prueba", "Usuario ID: " + id, qrUrl);

            return ResponseEntity.ok(Map.of("qrUrl", qrUrl, "pdfPath", pdfPath));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();

    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordPayload) {

        String currentPassword = passwordPayload.get("currentPassword");
        String newPassword = passwordPayload.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan campos en la solicitud"));
        }

        try {
            userService.changePassword(id, currentPassword, newPassword);
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
