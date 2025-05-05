package com.evotickets.services;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.evotickets.entities.UserEntity;
import com.evotickets.exceptions.CustomException;
import com.evotickets.repositories.UserRepository;
import com.evotickets.utils.ImageUploader;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ImageUploader imageUploader;

    public UserEntity getUserByID(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public String uploadProfilePicture(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new CustomException("El archivo está vacío");
        }

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));

        try {
            String imageUrl = imageUploader.uploadImage(file);
            user.setProfilePicture(imageUrl);
            userRepo.save(user);
            return imageUrl;
        } catch (Exception e) {
            throw new CustomException("Error al subir la imagen: " + e.getMessage());
        }
    }

}
