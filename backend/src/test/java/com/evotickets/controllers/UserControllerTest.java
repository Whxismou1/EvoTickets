package com.evotickets.controllers;

import com.evotickets.dtos.UserUpdateDTO;
import com.evotickets.entities.UserEntity;
import com.evotickets.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserService userService;

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
    public void updateUser_ValidDTO_ReturnsUpdatedUser() {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setFirstName("Nuevo");
        dto.setLastName("Apellido");
        dto.setDateOfBirth(LocalDate.of(1995, 3, 15));
        dto.setNotificationsEnabled(false);

        UserEntity updatedUser = UserEntity.builder()
                .id(1L)
                .firstName("Nuevo")
                .lastName("Apellido")
                .email("test@test.com")
                .dateOfBirth(LocalDate.of(1995, 3, 15))
                .notificationsEnabled(false)
                .build();

        when(userService.updateUserProfile(1L, dto)).thenReturn(updatedUser);

        ResponseEntity<UserEntity> response = userController.updateUser(1L, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Nuevo", response.getBody().getFirstName());
        assertEquals("Apellido", response.getBody().getLastName());
        assertEquals(LocalDate.of(1995, 3, 15), response.getBody().getDateOfBirth());
        assertFalse(response.getBody().isNotificationsEnabled());
        verify(userService).updateUserProfile(1L, dto);
    }

    @Test
    public void updateUser_UserNotFound_ThrowsNoSuchElementException() {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setFirstName("Nombre");

        when(userService.updateUserProfile(99L, dto)).thenThrow(new NoSuchElementException("Usuario no encontrado"));

        NoSuchElementException exception = assertThrows(NoSuchElementException.class, () -> {
            userController.updateUser(99L, dto);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(userService).updateUserProfile(99L, dto);
    }

    @Test
    public void updateUser_NullFields_IgnoredAndStillReturnsUser() {
        UserUpdateDTO dto = new UserUpdateDTO(); // Todos los campos null

        when(userService.updateUserProfile(1L, dto)).thenReturn(testUser);

        ResponseEntity<UserEntity> response = userController.updateUser(1L, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Original", response.getBody().getFirstName());
        assertTrue(response.getBody().isNotificationsEnabled());
        verify(userService).updateUserProfile(1L, dto);
    }

    @Test
    public void updateUser_InvalidDateOfBirth_HandledGracefully() {
        UserUpdateDTO dto = new UserUpdateDTO();
        dto.setDateOfBirth(LocalDate.of(2100, 1, 1)); // Fecha en el futuro hipotética

        when(userService.updateUserProfile(1L, dto)).thenReturn(testUser); // Suponemos que el servicio valida

        ResponseEntity<UserEntity> response = userController.updateUser(1L, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
        verify(userService).updateUserProfile(1L, dto);
    }

    @Test
    public void updateUser_NullDTO_ThrowsNullPointerException() {
        assertThrows(NullPointerException.class, () -> {
            userController.updateUser(1L, null);
        });
    }
}
