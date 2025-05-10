package com.evotickets.controllers;

import java.util.Map;

import com.evotickets.services.UserService;
import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.UserEntity;

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
    public ResponseEntity<UserEntity> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        UserEntity updatedUser = userService.updateUserProfile(id, userUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }
}


