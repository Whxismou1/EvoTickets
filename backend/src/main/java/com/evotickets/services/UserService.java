package com.evotickets.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.evotickets.dtos.AdminUserDTO;
import com.evotickets.dtos.TicketResponseDTO;
import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.ArtistEntity;
import com.evotickets.entities.TicketEntity;
import com.evotickets.entities.UserEntity;
import com.evotickets.exceptions.CustomException;
import com.evotickets.exceptions.InvalidCredentialsException;
import com.evotickets.exceptions.UserNotFoundException;
import com.evotickets.repositories.ArtistRepository;
import com.evotickets.repositories.TicketRepository;
import com.evotickets.repositories.UserRepository;
import com.evotickets.utils.ImageUploader;

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
    private TicketRepository ticketRepository;

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
        UserEntity user = userRepo.findById(id).orElseThrow(() -> new UserNotFoundException("Usuario no enconradp"));
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

    // public List<AdminUserDTO> getAllUsers() {
    // return null;
    // }

    public List<AdminUserDTO> getAllUsers() {
        List<UserEntity> users = userRepo.findAll();

        return users.stream()
                .map(user -> AdminUserDTO.builder()
                        .id(user.getId())
                        .fullName(user.getFirstName() + " " + user.getLastName())
                        .email(user.getEmail())
                        .role(user.getUserRole().name())
                        .pfp(user.getProfilePicture())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public void addFavorite(Long userId, Long eventId) {
        UserEntity user = userRepo.findById(userId).orElseThrow();
        user.addFavorite(eventId);
        userRepo.save(user);
    }

    public void removeFavorite(Long userId, Long eventId) {
        UserEntity user = userRepo.findById(userId).orElseThrow();
        user.removeFavorite(eventId);
        userRepo.save(user);
    }

    public void followArtist(Long userId, Long artistId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        ArtistEntity artist = artistRepo.findById(artistId)
                .orElseThrow(() -> new UserNotFoundException("Artista no encontrado"));

        if (!user.getFollowedArtistIds().contains(artistId)) {
            artist.setFollowers(artist.getFollowers() + 1);
            artistRepo.save(artist);
            user.getFollowedArtistIds().add(artistId);
            userRepo.save(user);
        }
    }

    public void unfollowArtist(Long userId, Long artistId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado"));

        ArtistEntity artist = artistRepo.findById(artistId)
                .orElseThrow(() -> new UserNotFoundException("Artista no encontrado"));

        if (user.getFollowedArtistIds().contains(artistId) && artist.getFollowers() > 0) {
            artist.setFollowers(artist.getFollowers() - 1);
            artistRepo.save(artist);
            user.getFollowedArtistIds().remove(artistId);
            userRepo.save(user);
        }
    }

    public List<TicketResponseDTO> getUserTickets(Long userId) {
         List<TicketEntity> tickets = ticketRepository.findByUserId(userId);

         return tickets.stream().map(ticket -> {
            TicketResponseDTO dto = new TicketResponseDTO();
            dto.setTicketId(ticket.getId());
            dto.setSeat(ticket.getSeat());
            dto.setImage(ticket.getTicketType().getEvent().getCoverImage());
            dto.setPrice(ticket.getTicketType().getPrice());
            dto.setEventName(ticket.getTicketType().getEvent().getName());
            dto.setEventDate(ticket.getTicketType().getEvent().getStartDate().toString());
            dto.setEventLocation(ticket.getTicketType().getEvent().getLocation().getName());
            return dto;
        }).collect(Collectors.toList());

    }

}
