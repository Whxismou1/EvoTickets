package com.evotickets.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.ArtistEntity;
import com.evotickets.entities.UserEntity;
import com.evotickets.exceptions.CustomException;
import com.evotickets.exceptions.InvalidCredentialsException;
import com.evotickets.exceptions.UserNotFoundException;
import com.evotickets.repositories.UserRepository;
import com.evotickets.utils.ImageUploader;
import com.evotickets.repositories.ArtistEventRepository;
import com.evotickets.repositories.ArtistRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ImageUploader imageUploader;

    @Autowired
    private ArtistRepository artistRepo;

    @Autowired
    private ArtistEventRepository artistEventRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserEntity getUserByID(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));
    }

    public String uploadProfilePicture(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new CustomException("El archivo está vacío");
        }

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        try {
            String imageUrl = imageUploader.uploadImage(file);
            user.setProfilePicture(imageUrl);
            userRepo.save(user);
            return imageUrl;
        } catch (Exception e) {
            throw new CustomException("Error al subir la imagen: " + e.getMessage());
        }
    }

    public UserEntity updateUserProfile(Long userId, UserUpdateDTO dto) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (dto.getFirstName() != null)
            user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null)
            user.setLastName(dto.getLastName());
        if (dto.getDateOfBirth() != null)
            user.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getNotificationsEnabled() != null)
            user.setNotificationsEnabled(dto.getNotificationsEnabled());

        if (dto.getPhone() != null)
            user.setPhone(dto.getPhone());
        if (dto.getLocation() != null)
            user.setLocation(dto.getLocation());

        return userRepo.save(user);
    }

    @Transactional
    public void deleteUserById(Long id) {
        UserEntity user = userRepo.findById(id).orElseThrow(()-> new UserNotFoundException("Usuario no enconradp"));
        userRepo.delete(user);
        
        

    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Ambas contraseñas no coinciden");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }

}
