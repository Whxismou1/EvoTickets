package com.evotickets.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.evotickets.dtos.ChangePasswordDTO;
import com.evotickets.dtos.TicketResponseDTO;
import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {

        return ResponseEntity.ok(userService.getUserByID(id));
    }

    @PutMapping("/{id}/profile-picture")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();

    }

    @GetMapping("/{id}/my-tickets")
    public List<TicketResponseDTO> getUserTickets(@PathVariable Long id) {
        return userService.getUserTickets(id);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody @Valid ChangePasswordDTO dto) {

        userService.changePassword(id, dto.getCurrentPassword(), dto.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada"));
    }

    @PostMapping("/{userId}/favorites/{eventId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long userId, @PathVariable Long eventId) {
        userService.addFavorite(userId, eventId);
        return ResponseEntity.ok(Map.of("message", "Added to favorites"));
    }

    @DeleteMapping("/{userId}/favorites/{eventId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long userId, @PathVariable Long eventId) {
        userService.removeFavorite(userId, eventId);
        return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
    }

    @PostMapping("/{userId}/follow/{artistId}")
    public ResponseEntity<?> followArtist(@PathVariable Long userId, @PathVariable Long artistId) {
        userService.followArtist(userId, artistId);
        return ResponseEntity.ok(Map.of("message", "Artista seguido"));
    }

    @DeleteMapping("/{userId}/unfollow/{artistId}")
    public ResponseEntity<?> unfollowArtist(@PathVariable Long userId, @PathVariable Long artistId) {
        userService.unfollowArtist(userId, artistId);
        return ResponseEntity.ok(Map.of("message", "Artista dejado de seguir"));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

}
