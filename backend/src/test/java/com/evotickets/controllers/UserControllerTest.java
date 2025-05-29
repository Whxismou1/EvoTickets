package com.evotickets.controllers;

import com.evotickets.dtos.AdminUserDTO;
import com.evotickets.dtos.ChangePasswordDTO;
import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.services.UserService;
import com.evotickets.utils.ImageUploader;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;
    private ImageUploader imageUploader;

    @InjectMocks
    private UserController userController;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        testUser = UserEntity.builder()
                .id(1L)
                .firstName("Original")
                .lastName("User")
                .email("test@test.com")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .notificationsEnabled(true)
                .build();
    }

    @Test
    public void getUserById_ExistingId_ReturnsUser() {
        when(userService.getUserByID(1L)).thenReturn(testUser);

        ResponseEntity<?> response = userController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
    }

    @Test
    public void uploadProfilePicture_ValidFile_ReturnsUrl() {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", new byte[] { 1, 2, 3 });
        String fakeUrl = "http://mock.url/profile.jpg";

        when(userService.uploadProfilePicture(1L, file)).thenReturn(fakeUrl);

        ResponseEntity<?> response = userController.uploadProfilePicture(1L, file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Map.of("imageURL", fakeUrl), response.getBody());
    }

    @Test
    public void updateUser_ValidDTO_ReturnsUpdatedUser() {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setFirstName("Nuevo");

        UserEntity updatedUser = UserEntity.builder()
                .id(1L)
                .firstName("Nuevo")
                .lastName("User")
                .email("test@test.com")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .notificationsEnabled(true)
                .build();

        when(userService.updateUserProfile(1L, dto)).thenReturn(updatedUser);

        ResponseEntity<UserEntity> response = userController.updateUser(1L, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Nuevo", response.getBody().getFirstName());
    }

    @Test
    public void deleteUser_ValidId_DeletesUser() {
        doNothing().when(userService).deleteUserById(1L);

        ResponseEntity<?> response = userController.deleteUser(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userService).deleteUserById(1L);
    }

    @Test
    public void changePassword_ValidDTO_ChangesPassword() {
        ChangePasswordDTO dto = new ChangePasswordDTO();
        dto.setCurrentPassword("oldPass");
        dto.setNewPassword("newPass");

        doNothing().when(userService).changePassword(1L, "oldPass", "newPass");

        ResponseEntity<?> response = userController.changePassword(1L, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService).changePassword(1L, "oldPass", "newPass");
    }

    @Test
    public void addFavorite_ValidIds_AddsFavorite() {
        doNothing().when(userService).addFavorite(1L, 10L);

        ResponseEntity<?> response = userController.addFavorite(1L, 10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Map.of("message", "Added to favorites"), response.getBody());
    }

    @Test
    public void removeFavorite_ValidIds_RemovesFavorite() {
        doNothing().when(userService).removeFavorite(1L, 10L);

        ResponseEntity<?> response = userController.removeFavorite(1L, 10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Map.of("message", "Removed from favorites"), response.getBody());
    }

    @Test
    public void followArtist_ValidIds_FollowsArtist() {
        doNothing().when(userService).followArtist(1L, 20L);

        ResponseEntity<?> response = userController.followArtist(1L, 20L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Map.of("message", "Artista seguido"), response.getBody());
    }

    @Test
    public void unfollowArtist_ValidIds_UnfollowsArtist() {
        doNothing().when(userService).unfollowArtist(1L, 20L);

        ResponseEntity<?> response = userController.unfollowArtist(1L, 20L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Map.of("message", "Artista dejado de seguir"), response.getBody());
    }

    @Test
    public void getAllUsers_ReturnsUserList() {
        AdminUserDTO dto = AdminUserDTO.builder()
                .id(1L)
                .fullName("Original")
                .email("test@test.com")
                .build();

        List<AdminUserDTO> users = List.of(dto);
        when(userService.getAllUsers()).thenReturn(users);

        ResponseEntity<?> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(users, response.getBody());
    }

   

}
